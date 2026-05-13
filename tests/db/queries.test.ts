/**
 * Query-layer tests. Each test file gets its own temp DB file so they can
 * run in parallel without stepping on each other. We set TURSO_LOCAL_PATH
 * before importing anything that touches lib/db, and leave TURSO_DATABASE_URL
 * unset so no remote sync is attempted.
 */
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const tmpDir = mkdtempSync(join(tmpdir(), "dojo-db-"));
process.env.TURSO_LOCAL_PATH = join(tmpDir, "test.db");
delete process.env.TURSO_DATABASE_URL;
delete process.env.TURSO_AUTH_TOKEN;

// Import after env is set.
const { getDb } = await import("@/lib/db");
const users = await import("@/lib/db/queries/users");
const designations = await import("@/lib/db/queries/clinician-designations");
const invitations = await import("@/lib/db/queries/client-invitations");
const characters = await import("@/lib/db/queries/characters");
const curricula = await import("@/lib/db/queries/curricula");
const items = await import("@/lib/db/queries/curriculum-items");
const enrollments = await import("@/lib/db/queries/curriculum-enrollments");
const sessions = await import("@/lib/db/queries/sessions");

beforeAll(async () => {
  await getDb(); // triggers migrations
});

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("users", () => {
  test("create, find by id, find by email", async () => {
    const u = await users.createUser({
      email: "alice@example.com",
      name: "Alice",
      passwordHash: "hash",
      role: "client",
    });
    expect(u.id).toBeTruthy();
    expect(u.role).toBe("client");
    expect(u.createdAt).toBeInstanceOf(Date);

    const byId = await users.findUserById(u.id);
    expect(byId?.email).toBe("alice@example.com");

    const byEmail = await users.findUserByEmail("alice@example.com");
    expect(byEmail?.id).toBe(u.id);

    const missing = await users.findUserByEmail("nope@example.com");
    expect(missing).toBeNull();
  });

  test("setUserClinician + findClientOfClinician + listClientsByClinician", async () => {
    const clinician = await users.createUser({
      email: "doc@example.com",
      passwordHash: "h",
      role: "clinician",
    });
    const client = await users.createUser({
      email: "patient@example.com",
      name: "P",
      passwordHash: "h",
      role: "client",
    });

    await users.setUserClinician(client.id, clinician.id);

    const found = await users.findClientOfClinician(client.id, clinician.id);
    expect(found?.id).toBe(client.id);

    const list = await users.listClientsByClinician(clinician.id);
    expect(list.map((c) => c.id)).toContain(client.id);
  });
});

describe("clinician designations", () => {
  test("create, find by email, list, delete", async () => {
    const admin = await users.createUser({
      email: "admin@example.com",
      passwordHash: "h",
      role: "admin",
    });
    const d = await designations.createClinicianDesignation({
      email: "future-clinician@example.com",
      createdBy: admin.id,
    });
    expect(d.email).toBe("future-clinician@example.com");

    const byEmail = await designations.findClinicianDesignationByEmail(
      "future-clinician@example.com",
    );
    expect(byEmail?.id).toBe(d.id);

    const list = await designations.listClinicianDesignations();
    expect(list.length).toBeGreaterThan(0);

    await designations.deleteClinicianDesignation(d.id);
    const gone = await designations.findClinicianDesignationByEmail(
      "future-clinician@example.com",
    );
    expect(gone).toBeNull();
  });
});

describe("client invitations", () => {
  test("create, list, mark registered, mark confirmed", async () => {
    const clinician = await users.createUser({
      email: "doc2@example.com",
      passwordHash: "h",
      role: "clinician",
    });
    const inv = await invitations.createClientInvitation({
      clinicianId: clinician.id,
      email: "new-client@example.com",
    });
    expect(inv.status).toBe("pending");

    const dup = await invitations.findClientInvitationByClinicianAndEmail(
      clinician.id,
      "new-client@example.com",
    );
    expect(dup?.id).toBe(inv.id);

    const list = await invitations.listClientInvitationsByClinician(clinician.id);
    expect(list.find((i) => i.id === inv.id)).toBeTruthy();

    // Now the client registers.
    const client = await users.createUser({
      email: "new-client@example.com",
      passwordHash: "h",
      role: "client",
    });
    const pending = await invitations.listPendingClientInvitationsByEmail(
      "new-client@example.com",
    );
    expect(pending.length).toBe(1);

    await invitations.markClientInvitationRegistered(inv.id, client.id);
    const reg = await invitations.findClientInvitationById(inv.id);
    expect(reg?.status).toBe("registered");
    expect(reg?.clientId).toBe(client.id);

    await invitations.markClientInvitationConfirmed(inv.id);
    const conf = await invitations.findClientInvitationById(inv.id);
    expect(conf?.status).toBe("confirmed");
  });
});

describe("characters", () => {
  test("create, list, update, delete", async () => {
    const clinician = await users.createUser({
      email: "doc3@example.com",
      passwordHash: "h",
      role: "clinician",
    });
    const c = await characters.createCharacter({
      clinicianId: clinician.id,
      input: {
        name: "Satomi",
        isTherapist: false,
        introversion: 5,
        communicationSkill: 1,
        openness: 5,
        conscientiousness: 2,
        age: 44,
        gender: "female",
        nationality: "Japanese",
        reactivity: 3,
        specialNotes: "",
      },
    });
    expect(c.name).toBe("Satomi");
    expect(c.isTherapist).toBe(false); // 0/1 → boolean round-trip

    const list = await characters.listCharactersByClinician(clinician.id);
    expect(list.find((x) => x.id === c.id)).toBeTruthy();

    const found = await characters.findCharacterByIdAndClinician(c.id, clinician.id);
    expect(found?.name).toBe("Satomi");

    // Update.
    const updated = await characters.updateCharacter({
      id: c.id,
      clinicianId: clinician.id,
      input: { ...c, name: "Satomi (updated)", isTherapist: true },
    });
    expect(updated?.name).toBe("Satomi (updated)");
    expect(updated?.isTherapist).toBe(true);

    // Update for wrong clinician → null.
    const wrongClinician = await users.createUser({
      email: "doc-other@example.com",
      passwordHash: "h",
      role: "clinician",
    });
    const failed = await characters.updateCharacter({
      id: c.id,
      clinicianId: wrongClinician.id,
      input: { ...c, name: "hack" },
    });
    expect(failed).toBeNull();

    await characters.deleteCharacter(c.id, clinician.id);
    const gone = await characters.findCharacterByIdAndClinician(c.id, clinician.id);
    expect(gone).toBeNull();
  });
});

describe("curricula + items + enrollments", () => {
  test("end-to-end", async () => {
    const clinician = await users.createUser({
      email: "doc4@example.com",
      passwordHash: "h",
      role: "clinician",
    });
    const client = await users.createUser({
      email: "student@example.com",
      passwordHash: "h",
      role: "client",
    });
    const cur = await curricula.createCurriculum({
      clinicianId: clinician.id,
      input: { title: "Beginner", description: "Intro track" },
    });
    expect(cur.title).toBe("Beginner");

    const character = await characters.createCharacter({
      clinicianId: clinician.id,
      input: {
        name: "Marcus",
        isTherapist: false,
        introversion: 3,
        communicationSkill: 7,
        openness: 6,
        conscientiousness: 9,
        age: 38,
        gender: "male",
        nationality: "American",
        reactivity: 8,
        specialNotes: "",
      },
    });
    const item = await items.createCurriculumItem({
      curriculumId: cur.id,
      input: { characterId: character.id, scenario: "Bad day", sortOrder: 0 },
    });
    expect(item.characterId).toBe(character.id);

    const listed = await items.listCurriculumItemsWithCharacter(cur.id);
    expect(listed.length).toBe(1);
    expect(listed[0]?.characterName).toBe("Marcus");

    const enrollment = await enrollments.createEnrollment({
      clientId: client.id,
      curriculumId: cur.id,
    });
    expect(enrollment.clientId).toBe(client.id);

    const byClient = await enrollments.listEnrollmentsByClient(client.id);
    expect(byClient[0]?.curriculumTitle).toBe("Beginner");

    const dup = await enrollments.findEnrollment(client.id, cur.id);
    expect(dup?.id).toBe(enrollment.id);

    // Update + delete curriculum.
    const upd = await curricula.updateCurriculum({
      id: cur.id,
      clinicianId: clinician.id,
      input: { title: "Beginner v2", description: "" },
    });
    expect(upd?.title).toBe("Beginner v2");

    await items.deleteCurriculumItem(item.id);
    const empty = await items.listCurriculumItemsWithCharacter(cur.id);
    expect(empty.length).toBe(0);
  });
});

describe("sessions", () => {
  test("create + find by id + set grade", async () => {
    const user = await users.createUser({
      email: "trainee@example.com",
      passwordHash: "h",
      role: "client",
    });
    const s = await sessions.createSession({
      userId: user.id,
      characterId: null,
      scenario: "My dog died.",
      messages: [{ speaker: "user", text: "hi" }],
      turnCount: 1,
      voiceTurnCount: 0,
      model: "claude-opus-4-6",
      costUsdMillicents: 1234,
    });
    expect(s.userId).toBe(user.id);
    expect(s.gradeJson).toBeNull();
    expect(s.costUsdMillicents).toBe(1234);
    expect(JSON.parse(s.messagesJson)).toEqual([{ speaker: "user", text: "hi" }]);

    const found = await sessions.findSessionByIdAndUser(s.id, user.id);
    expect(found?.id).toBe(s.id);

    // Wrong user → null.
    const otherUser = await users.createUser({
      email: "other@example.com",
      passwordHash: "h",
      role: "client",
    });
    const wrong = await sessions.findSessionByIdAndUser(s.id, otherUser.id);
    expect(wrong).toBeNull();

    await sessions.setSessionGrade(s.id, JSON.stringify({ letter_grade: "A" }));
    const graded = await sessions.findSessionByIdAndUser(s.id, user.id);
    expect(graded?.gradeJson).toContain("A");
  });
});

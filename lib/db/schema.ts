import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ── Users ──────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "clinician", "client"] })
    .notNull()
    .default("client"),
  clinicianId: text("clinician_id").references((): ReturnType<typeof text> => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Clinician Designations (admin-managed) ─────────────────────────
export const clinicianDesignations = sqliteTable("clinician_designations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Characters (clinician-designed) ────────────────────────────────
export const characters = sqliteTable("characters", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clinicianId: text("clinician_id")
    .notNull()
    .references(() => users.id),
  // Maps to BAML CharacterCharacteristics
  name: text("name").notNull(),
  isTherapist: integer("is_therapist", { mode: "boolean" })
    .notNull()
    .default(false),
  introversion: integer("introversion").notNull(), // 1-10
  communicationSkill: integer("communication_skill").notNull(), // 1-10
  openness: integer("openness").notNull(), // 1-10
  conscientiousness: integer("conscientiousness").notNull(), // 1-10
  age: integer("age").notNull(),
  gender: text("gender", { enum: ["male", "female", "nonbinary"] }).notNull(),
  nationality: text("nationality").notNull(),
  reactivity: integer("reactivity").notNull(), // 1-10
  specialNotes: text("special_notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Curricula ──────────────────────────────────────────────────────
export const curricula = sqliteTable("curricula", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clinicianId: text("clinician_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Curriculum Items (character + scenario, ordered) ───────────────
export const curriculumItems = sqliteTable("curriculum_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  curriculumId: text("curriculum_id")
    .notNull()
    .references(() => curricula.id, { onDelete: "cascade" }),
  characterId: text("character_id")
    .notNull()
    .references(() => characters.id),
  scenario: text("scenario").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

// ── Curriculum Enrollments ─────────────────────────────────────────
export const curriculumEnrollments = sqliteTable("curriculum_enrollments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  curriculumId: text("curriculum_id")
    .notNull()
    .references(() => curricula.id),
  clientId: text("client_id")
    .notNull()
    .references(() => users.id),
  enrolledAt: integer("enrolled_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Client Invitations ─────────────────────────────────────────────
export const clientInvitations = sqliteTable("client_invitations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clinicianId: text("clinician_id")
    .notNull()
    .references(() => users.id),
  email: text("email").notNull(),
  status: text("status", { enum: ["pending", "registered", "confirmed"] })
    .notNull()
    .default("pending"),
  clientId: text("client_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Sessions (conversation history) ────────────────────────────────
export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  characterId: text("character_id").references(() => characters.id),
  scenario: text("scenario").notNull(),
  messagesJson: text("messages_json").notNull(), // JSON blob
  gradeJson: text("grade_json"), // JSON blob
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

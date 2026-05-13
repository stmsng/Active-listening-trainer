// Convert raw DB rows (snake_case, Unix-seconds timestamps, 0/1 booleans)
// into typed domain shapes. Centralized so queries don't repeat the
// translation. Each mapper is the inverse of the column list in the
// CREATE TABLE statement in lib/db/migrations.ts.

import type {
  User,
  ClinicianDesignation,
  Character,
  Curriculum,
  CurriculumItem,
  CurriculumEnrollment,
  ClientInvitation,
  Session,
  UserRole,
  Gender,
  InvitationStatus,
} from "./types";

type Row = Record<string, unknown>;

function asDate(v: unknown): Date {
  return new Date(Number(v) * 1000);
}

function asDateOrNull(v: unknown): Date | null {
  return v === null || v === undefined ? null : asDate(v);
}

function asBool(v: unknown): boolean {
  return v === 1 || v === true;
}

export function rowToUser(r: Row): User {
  return {
    id: r.id as string,
    email: r.email as string,
    name: (r.name as string | null) ?? null,
    passwordHash: r.password_hash as string,
    role: r.role as UserRole,
    clinicianId: (r.clinician_id as string | null) ?? null,
    createdAt: asDate(r.created_at),
    updatedAt: asDate(r.updated_at),
  };
}

export function rowToClinicianDesignation(r: Row): ClinicianDesignation {
  return {
    id: r.id as string,
    email: r.email as string,
    createdBy: r.created_by as string,
    createdAt: asDate(r.created_at),
  };
}

export function rowToCharacter(r: Row): Character {
  return {
    id: r.id as string,
    clinicianId: r.clinician_id as string,
    name: r.name as string,
    isTherapist: asBool(r.is_therapist),
    introversion: r.introversion as number,
    communicationSkill: r.communication_skill as number,
    openness: r.openness as number,
    conscientiousness: r.conscientiousness as number,
    age: r.age as number,
    gender: r.gender as Gender,
    nationality: r.nationality as string,
    reactivity: r.reactivity as number,
    specialNotes: r.special_notes as string,
    createdAt: asDate(r.created_at),
    updatedAt: asDate(r.updated_at),
  };
}

export function rowToCurriculum(r: Row): Curriculum {
  return {
    id: r.id as string,
    clinicianId: r.clinician_id as string,
    title: r.title as string,
    description: r.description as string,
    createdAt: asDate(r.created_at),
    updatedAt: asDate(r.updated_at),
  };
}

export function rowToCurriculumItem(r: Row): CurriculumItem {
  return {
    id: r.id as string,
    curriculumId: r.curriculum_id as string,
    characterId: r.character_id as string,
    scenario: r.scenario as string,
    sortOrder: r.sort_order as number,
  };
}

export function rowToCurriculumEnrollment(r: Row): CurriculumEnrollment {
  return {
    id: r.id as string,
    curriculumId: r.curriculum_id as string,
    clientId: r.client_id as string,
    enrolledAt: asDate(r.enrolled_at),
  };
}

export function rowToClientInvitation(r: Row): ClientInvitation {
  return {
    id: r.id as string,
    clinicianId: r.clinician_id as string,
    email: r.email as string,
    status: r.status as InvitationStatus,
    clientId: (r.client_id as string | null) ?? null,
    createdAt: asDate(r.created_at),
    updatedAt: asDate(r.updated_at),
  };
}

export function rowToSession(r: Row): Session {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    characterId: (r.character_id as string | null) ?? null,
    scenario: r.scenario as string,
    messagesJson: r.messages_json as string,
    gradeJson: (r.grade_json as string | null) ?? null,
    createdAt: asDate(r.created_at),
    endedAt: asDateOrNull(r.ended_at),
    turnCount: (r.turn_count as number) ?? 0,
    voiceTurnCount: (r.voice_turn_count as number) ?? 0,
    model: (r.model as string | null) ?? null,
    costUsdMillicents: (r.cost_usd_millicents as number) ?? 0,
  };
}

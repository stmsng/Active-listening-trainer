// Row types matching the SQL schema in lib/db/migrations.ts.
// Snake_case column names → camelCase TS fields (mapping happens in
// query helpers, not here). Timestamps are Unix seconds in the DB and
// Date in TS.

export type UserRole = "admin" | "clinician" | "client";
export type Gender = "male" | "female" | "nonbinary";
export type InvitationStatus = "pending" | "registered" | "confirmed";

export interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  role: UserRole;
  clinicianId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicianDesignation {
  id: string;
  email: string;
  createdBy: string;
  createdAt: Date;
}

export interface Character {
  id: string;
  clinicianId: string;
  name: string;
  isTherapist: boolean;
  introversion: number;
  communicationSkill: number;
  openness: number;
  conscientiousness: number;
  age: number;
  gender: Gender;
  nationality: string;
  reactivity: number;
  specialNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Curriculum {
  id: string;
  clinicianId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurriculumItem {
  id: string;
  curriculumId: string;
  characterId: string;
  scenario: string;
  sortOrder: number;
}

export interface CurriculumEnrollment {
  id: string;
  curriculumId: string;
  clientId: string;
  enrolledAt: Date;
}

export interface ClientInvitation {
  id: string;
  clinicianId: string;
  email: string;
  status: InvitationStatus;
  clientId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  characterId: string | null;
  scenario: string;
  messagesJson: string;
  gradeJson: string | null;
  createdAt: Date;
  endedAt: Date | null;
  turnCount: number;
  voiceTurnCount: number;
  model: string | null;
  costUsdMillicents: number;
}

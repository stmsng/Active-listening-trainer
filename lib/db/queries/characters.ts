import {
  selectAll,
  selectOne,
  execReturning,
  execReturningMaybe,
  execute,
  newId,
  nowSeconds,
} from "../utils";
import { rowToCharacter } from "../row-mappers";
import type { Character, Gender } from "../types";

export interface CharacterInput {
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
}

export async function listCharactersByClinician(
  clinicianId: string,
): Promise<Character[]> {
  const rows = await selectAll(
    `SELECT * FROM characters WHERE clinician_id = ? ORDER BY created_at`,
    clinicianId,
  );
  return rows.map(rowToCharacter);
}

export async function findCharacterByIdAndClinician(
  id: string,
  clinicianId: string,
): Promise<Character | null> {
  const r = await selectOne(
    "SELECT * FROM characters WHERE id = ? AND clinician_id = ?",
    id,
    clinicianId,
  );
  return r ? rowToCharacter(r) : null;
}

export async function createCharacter(opts: {
  clinicianId: string;
  input: CharacterInput;
}): Promise<Character> {
  const { clinicianId, input } = opts;
  const now = nowSeconds();
  const r = await execReturning(
    `INSERT INTO characters (
       id, clinician_id, name, is_therapist, introversion, communication_skill,
       openness, conscientiousness, age, gender, nationality, reactivity,
       special_notes, created_at, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING *`,
    newId(),
    clinicianId,
    input.name,
    input.isTherapist ? 1 : 0,
    input.introversion,
    input.communicationSkill,
    input.openness,
    input.conscientiousness,
    input.age,
    input.gender,
    input.nationality,
    input.reactivity,
    input.specialNotes,
    now,
    now,
  );
  return rowToCharacter(r);
}

export async function updateCharacter(opts: {
  id: string;
  clinicianId: string;
  input: CharacterInput;
}): Promise<Character | null> {
  const { id, clinicianId, input } = opts;
  const r = await execReturningMaybe(
    `UPDATE characters SET
       name = ?, is_therapist = ?, introversion = ?, communication_skill = ?,
       openness = ?, conscientiousness = ?, age = ?, gender = ?,
       nationality = ?, reactivity = ?, special_notes = ?, updated_at = ?
     WHERE id = ? AND clinician_id = ?
     RETURNING *`,
    input.name,
    input.isTherapist ? 1 : 0,
    input.introversion,
    input.communicationSkill,
    input.openness,
    input.conscientiousness,
    input.age,
    input.gender,
    input.nationality,
    input.reactivity,
    input.specialNotes,
    nowSeconds(),
    id,
    clinicianId,
  );
  return r ? rowToCharacter(r) : null;
}

export async function deleteCharacter(
  id: string,
  clinicianId: string,
): Promise<void> {
  await execute(
    "DELETE FROM characters WHERE id = ? AND clinician_id = ?",
    id,
    clinicianId,
  );
}

import {
  selectAll,
  selectOne,
  execReturning,
  execReturningMaybe,
  execute,
  newId,
  nowSeconds,
} from "../utils";
import { rowToCurriculum } from "../row-mappers";
import type { Curriculum } from "../types";

export interface CurriculumInput {
  title: string;
  description: string;
}

export async function listCurriculaByClinician(
  clinicianId: string,
): Promise<Curriculum[]> {
  const rows = await selectAll(
    "SELECT * FROM curricula WHERE clinician_id = ? ORDER BY created_at",
    clinicianId,
  );
  return rows.map(rowToCurriculum);
}

export async function findCurriculumByIdAndClinician(
  id: string,
  clinicianId: string,
): Promise<Curriculum | null> {
  const r = await selectOne(
    "SELECT * FROM curricula WHERE id = ? AND clinician_id = ?",
    id,
    clinicianId,
  );
  return r ? rowToCurriculum(r) : null;
}

export async function createCurriculum(opts: {
  clinicianId: string;
  input: CurriculumInput;
}): Promise<Curriculum> {
  const now = nowSeconds();
  const r = await execReturning(
    `INSERT INTO curricula (id, clinician_id, title, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     RETURNING *`,
    newId(),
    opts.clinicianId,
    opts.input.title,
    opts.input.description,
    now,
    now,
  );
  return rowToCurriculum(r);
}

export async function updateCurriculum(opts: {
  id: string;
  clinicianId: string;
  input: CurriculumInput;
}): Promise<Curriculum | null> {
  const r = await execReturningMaybe(
    `UPDATE curricula SET title = ?, description = ?, updated_at = ?
     WHERE id = ? AND clinician_id = ?
     RETURNING *`,
    opts.input.title,
    opts.input.description,
    nowSeconds(),
    opts.id,
    opts.clinicianId,
  );
  return r ? rowToCurriculum(r) : null;
}

export async function deleteCurriculum(
  id: string,
  clinicianId: string,
): Promise<void> {
  await execute(
    "DELETE FROM curricula WHERE id = ? AND clinician_id = ?",
    id,
    clinicianId,
  );
}

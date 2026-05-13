import {
  selectAll,
  selectOne,
  execReturning,
  newId,
  nowSeconds,
} from "../utils";
import { rowToCurriculumEnrollment } from "../row-mappers";
import type { CurriculumEnrollment } from "../types";

export interface CurriculumEnrollmentWithTitle {
  id: string;
  curriculumId: string;
  curriculumTitle: string | null;
  enrolledAt: Date;
}

export async function listEnrollmentsByClient(
  clientId: string,
): Promise<CurriculumEnrollmentWithTitle[]> {
  const rows = await selectAll<{
    id: string;
    curriculum_id: string;
    title: string | null;
    enrolled_at: number;
  }>(
    `SELECT ce.id, ce.curriculum_id, c.title, ce.enrolled_at
     FROM curriculum_enrollments ce
     LEFT JOIN curricula c ON ce.curriculum_id = c.id
     WHERE ce.client_id = ?`,
    clientId,
  );
  return rows.map((r) => ({
    id: r.id,
    curriculumId: r.curriculum_id,
    curriculumTitle: r.title,
    enrolledAt: new Date(r.enrolled_at * 1000),
  }));
}

export async function findEnrollment(
  clientId: string,
  curriculumId: string,
): Promise<CurriculumEnrollment | null> {
  const r = await selectOne(
    `SELECT * FROM curriculum_enrollments
     WHERE client_id = ? AND curriculum_id = ?`,
    clientId,
    curriculumId,
  );
  return r ? rowToCurriculumEnrollment(r) : null;
}

export async function createEnrollment(opts: {
  clientId: string;
  curriculumId: string;
}): Promise<CurriculumEnrollment> {
  const r = await execReturning(
    `INSERT INTO curriculum_enrollments (id, curriculum_id, client_id, enrolled_at)
     VALUES (?, ?, ?, ?)
     RETURNING *`,
    newId(),
    opts.curriculumId,
    opts.clientId,
    nowSeconds(),
  );
  return rowToCurriculumEnrollment(r);
}

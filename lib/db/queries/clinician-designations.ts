import {
  selectAll,
  selectOne,
  execReturning,
  execute,
  newId,
  nowSeconds,
} from "../utils";
import { rowToClinicianDesignation } from "../row-mappers";
import type { ClinicianDesignation } from "../types";

export async function listClinicianDesignations(): Promise<
  ClinicianDesignation[]
> {
  const rows = await selectAll(
    "SELECT * FROM clinician_designations ORDER BY created_at",
  );
  return rows.map(rowToClinicianDesignation);
}

export async function findClinicianDesignationByEmail(
  email: string,
): Promise<ClinicianDesignation | null> {
  const r = await selectOne(
    "SELECT * FROM clinician_designations WHERE email = ?",
    email,
  );
  return r ? rowToClinicianDesignation(r) : null;
}

export async function createClinicianDesignation(opts: {
  email: string;
  createdBy: string;
}): Promise<ClinicianDesignation> {
  const r = await execReturning(
    `INSERT INTO clinician_designations (id, email, created_by, created_at)
     VALUES (?, ?, ?, ?)
     RETURNING *`,
    newId(),
    opts.email,
    opts.createdBy,
    nowSeconds(),
  );
  return rowToClinicianDesignation(r);
}

export async function deleteClinicianDesignation(id: string): Promise<void> {
  await execute("DELETE FROM clinician_designations WHERE id = ?", id);
}

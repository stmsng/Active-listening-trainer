import {
  selectAll,
  selectOne,
  execReturning,
  execute,
  newId,
  nowSeconds,
} from "../utils";
import { rowToUser } from "../row-mappers";
import type { User, UserRole } from "../types";

export async function findUserById(id: string): Promise<User | null> {
  const r = await selectOne("SELECT * FROM users WHERE id = ?", id);
  return r ? rowToUser(r) : null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const r = await selectOne("SELECT * FROM users WHERE email = ?", email);
  return r ? rowToUser(r) : null;
}

export async function createUser(opts: {
  email: string;
  name?: string | null;
  passwordHash: string;
  role: UserRole;
}): Promise<User> {
  const now = nowSeconds();
  const r = await execReturning(
    `INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     RETURNING *`,
    newId(),
    opts.email,
    opts.name ?? null,
    opts.passwordHash,
    opts.role,
    now,
    now,
  );
  return rowToUser(r);
}

export async function setUserClinician(
  userId: string,
  clinicianId: string,
): Promise<void> {
  await execute(
    "UPDATE users SET clinician_id = ?, updated_at = ? WHERE id = ?",
    clinicianId,
    nowSeconds(),
    userId,
  );
}

export async function listClientsByClinician(
  clinicianId: string,
): Promise<Array<Pick<User, "id" | "name" | "email">>> {
  const rows = await selectAll<{ id: string; name: string | null; email: string }>(
    "SELECT id, name, email FROM users WHERE clinician_id = ?",
    clinicianId,
  );
  return rows.map((r) => ({ id: r.id, name: r.name, email: r.email }));
}

export async function findClientOfClinician(
  clientId: string,
  clinicianId: string,
): Promise<User | null> {
  const r = await selectOne(
    "SELECT * FROM users WHERE id = ? AND clinician_id = ?",
    clientId,
    clinicianId,
  );
  return r ? rowToUser(r) : null;
}

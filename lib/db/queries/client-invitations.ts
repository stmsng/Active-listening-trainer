import {
  selectAll,
  selectOne,
  execReturning,
  execute,
  newId,
  nowSeconds,
} from "../utils";
import { rowToClientInvitation } from "../row-mappers";
import type { ClientInvitation } from "../types";

export async function listClientInvitationsByClinician(
  clinicianId: string,
): Promise<ClientInvitation[]> {
  const rows = await selectAll(
    `SELECT * FROM client_invitations
     WHERE clinician_id = ?
     ORDER BY created_at`,
    clinicianId,
  );
  return rows.map(rowToClientInvitation);
}

export async function findClientInvitationByClinicianAndEmail(
  clinicianId: string,
  email: string,
): Promise<ClientInvitation | null> {
  const r = await selectOne(
    `SELECT * FROM client_invitations
     WHERE clinician_id = ? AND email = ?`,
    clinicianId,
    email,
  );
  return r ? rowToClientInvitation(r) : null;
}

export async function findClientInvitationById(
  id: string,
): Promise<ClientInvitation | null> {
  const r = await selectOne("SELECT * FROM client_invitations WHERE id = ?", id);
  return r ? rowToClientInvitation(r) : null;
}

export async function findClientInvitationByIdAndClinician(
  id: string,
  clinicianId: string,
): Promise<ClientInvitation | null> {
  const r = await selectOne(
    `SELECT * FROM client_invitations
     WHERE id = ? AND clinician_id = ?`,
    id,
    clinicianId,
  );
  return r ? rowToClientInvitation(r) : null;
}

export async function listPendingClientInvitationsByEmail(
  email: string,
): Promise<ClientInvitation[]> {
  const rows = await selectAll(
    `SELECT * FROM client_invitations
     WHERE email = ? AND status = 'pending'`,
    email,
  );
  return rows.map(rowToClientInvitation);
}

export async function createClientInvitation(opts: {
  clinicianId: string;
  email: string;
}): Promise<ClientInvitation> {
  const now = nowSeconds();
  const r = await execReturning(
    `INSERT INTO client_invitations
       (id, clinician_id, email, status, client_id, created_at, updated_at)
     VALUES (?, ?, ?, 'pending', NULL, ?, ?)
     RETURNING *`,
    newId(),
    opts.clinicianId,
    opts.email,
    now,
    now,
  );
  return rowToClientInvitation(r);
}

export async function markClientInvitationRegistered(
  id: string,
  clientId: string,
): Promise<void> {
  await execute(
    `UPDATE client_invitations
     SET status = 'registered', client_id = ?, updated_at = ?
     WHERE id = ?`,
    clientId,
    nowSeconds(),
    id,
  );
}

export async function markClientInvitationConfirmed(
  id: string,
): Promise<void> {
  await execute(
    `UPDATE client_invitations
     SET status = 'confirmed', updated_at = ?
     WHERE id = ?`,
    nowSeconds(),
    id,
  );
}

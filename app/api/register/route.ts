import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { createUser, findUserByEmail } from "@/lib/db/queries/users";
import { findClinicianDesignationByEmail } from "@/lib/db/queries/clinician-designations";
import {
  findClientInvitationById,
  listPendingClientInvitationsByEmail,
  markClientInvitationRegistered,
} from "@/lib/db/queries/client-invitations";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, name, password } = parsed.data;
  const invitationId = body.invitation as string | undefined;

  if (await findUserByEmail(email)) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const designation = await findClinicianDesignationByEmail(email);
  const role = designation ? "clinician" : "client";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await createUser({ email, name, passwordHash, role });

  const pendingInvites = await listPendingClientInvitationsByEmail(email);
  for (const invite of pendingInvites) {
    await markClientInvitationRegistered(invite.id, user.id);
  }

  if (invitationId) {
    const invite = await findClientInvitationById(invitationId);
    if (invite && invite.email === email && invite.status === "pending") {
      await markClientInvitationRegistered(invitationId, user.id);
    }
  }

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}

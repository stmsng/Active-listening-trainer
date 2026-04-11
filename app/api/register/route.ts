import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, clinicianDesignations, clientInvitations } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validations/auth";

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

  // Check if email already registered
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  // Check if this email has a clinician designation
  const [designation] = await db
    .select()
    .from(clinicianDesignations)
    .where(eq(clinicianDesignations.email, email))
    .limit(1);

  const role = designation ? "clinician" : "client";
  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({ email, name, passwordHash, role })
    .returning();

  // Link any pending client invitations for this email
  const pendingInvites = await db
    .select()
    .from(clientInvitations)
    .where(eq(clientInvitations.email, email));

  for (const invite of pendingInvites) {
    await db
      .update(clientInvitations)
      .set({ status: "registered", clientId: user.id, updatedAt: new Date() })
      .where(eq(clientInvitations.id, invite.id));
  }

  // If a specific invitation ID was provided, also handle it
  if (invitationId) {
    const [invite] = await db
      .select()
      .from(clientInvitations)
      .where(eq(clientInvitations.id, invitationId))
      .limit(1);

    if (invite && invite.email === email && invite.status === "pending") {
      await db
        .update(clientInvitations)
        .set({ status: "registered", clientId: user.id, updatedAt: new Date() })
        .where(eq(clientInvitations.id, invitationId));
    }
  }

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}

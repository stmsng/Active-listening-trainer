import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientInvitations, users } from "@/lib/db/schema";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Find the invitation (id here is the invitation id)
  const [invitation] = await db
    .select()
    .from(clientInvitations)
    .where(
      and(
        eq(clientInvitations.id, id),
        eq(clientInvitations.clinicianId, session.user.id)
      )
    )
    .limit(1);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  if (invitation.status !== "registered") {
    return NextResponse.json(
      { error: "Client must register before confirmation" },
      { status: 400 }
    );
  }

  if (!invitation.clientId) {
    return NextResponse.json(
      { error: "No user linked to this invitation" },
      { status: 400 }
    );
  }

  // Update invitation status
  await db
    .update(clientInvitations)
    .set({ status: "confirmed", updatedAt: new Date() })
    .where(eq(clientInvitations.id, id));

  // Link client to clinician
  await db
    .update(users)
    .set({ clinicianId: session.user.id, updatedAt: new Date() })
    .where(eq(users.id, invitation.clientId));

  return NextResponse.json({ ok: true });
}

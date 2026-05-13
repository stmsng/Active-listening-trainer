import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { setUserClinician } from "@/lib/db/queries/users";
import {
  findClientInvitationByIdAndClinician,
  markClientInvitationConfirmed,
} from "@/lib/db/queries/client-invitations";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const invitation = await findClientInvitationByIdAndClinician(
    id,
    session.user.id
  );
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

  await markClientInvitationConfirmed(id);
  await setUserClinician(invitation.clientId, session.user.id);
  return NextResponse.json({ ok: true });
}

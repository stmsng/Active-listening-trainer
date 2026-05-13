import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listClientsByClinician } from "@/lib/db/queries/users";
import { listClientInvitationsByClinician } from "@/lib/db/queries/client-invitations";
import { listEnrollmentsByClient } from "@/lib/db/queries/curriculum-enrollments";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const invitations = await listClientInvitationsByClinician(session.user.id);
  const confirmedClients = await listClientsByClinician(session.user.id);

  const clients = await Promise.all(
    confirmedClients.map(async (client) => ({
      ...client,
      enrollments: await listEnrollmentsByClient(client.id),
    }))
  );

  return NextResponse.json({ invitations, clients });
}

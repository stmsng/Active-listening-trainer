import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientInvitations, users, curriculumEnrollments, curricula } from "@/lib/db/schema";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get all invitations for this clinician
  const invitations = await db
    .select({
      id: clientInvitations.id,
      email: clientInvitations.email,
      status: clientInvitations.status,
      clientId: clientInvitations.clientId,
      createdAt: clientInvitations.createdAt,
    })
    .from(clientInvitations)
    .where(eq(clientInvitations.clinicianId, session.user.id))
    .orderBy(clientInvitations.createdAt);

  // Get confirmed clients with their enrollments
  const confirmedClients = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.clinicianId, session.user.id));

  // Get enrollments for each confirmed client
  const clientsWithEnrollments = await Promise.all(
    confirmedClients.map(async (client) => {
      const enrollments = await db
        .select({
          id: curriculumEnrollments.id,
          curriculumId: curriculumEnrollments.curriculumId,
          curriculumTitle: curricula.title,
          enrolledAt: curriculumEnrollments.enrolledAt,
        })
        .from(curriculumEnrollments)
        .leftJoin(curricula, eq(curriculumEnrollments.curriculumId, curricula.id))
        .where(eq(curriculumEnrollments.clientId, client.id));

      return { ...client, enrollments };
    })
  );

  return NextResponse.json({ invitations, clients: clientsWithEnrollments });
}

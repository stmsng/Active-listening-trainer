import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, curricula, curriculumEnrollments } from "@/lib/db/schema";
import { z } from "zod";

const enrollSchema = z.object({
  curriculumId: z.string().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: clientId } = await params;
  const body = await req.json();
  const parsed = enrollSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Curriculum ID required" }, { status: 400 });
  }

  // Verify client belongs to this clinician
  const [client] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, clientId), eq(users.clinicianId, session.user.id)))
    .limit(1);

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Verify curriculum belongs to this clinician
  const [curriculum] = await db
    .select()
    .from(curricula)
    .where(
      and(
        eq(curricula.id, parsed.data.curriculumId),
        eq(curricula.clinicianId, session.user.id)
      )
    )
    .limit(1);

  if (!curriculum) {
    return NextResponse.json({ error: "Curriculum not found" }, { status: 404 });
  }

  // Check for existing enrollment
  const [existing] = await db
    .select()
    .from(curriculumEnrollments)
    .where(
      and(
        eq(curriculumEnrollments.clientId, clientId),
        eq(curriculumEnrollments.curriculumId, parsed.data.curriculumId)
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "Client is already enrolled" },
      { status: 409 }
    );
  }

  const [enrollment] = await db
    .insert(curriculumEnrollments)
    .values({ clientId, curriculumId: parsed.data.curriculumId })
    .returning();

  return NextResponse.json(enrollment, { status: 201 });
}

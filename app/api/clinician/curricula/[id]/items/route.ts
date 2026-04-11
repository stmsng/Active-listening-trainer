import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { curricula, curriculumItems } from "@/lib/db/schema";
import { curriculumItemSchema } from "@/lib/validations/curriculum";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Verify curriculum ownership
  const [curriculum] = await db
    .select()
    .from(curricula)
    .where(and(eq(curricula.id, id), eq(curricula.clinicianId, session.user.id)))
    .limit(1);

  if (!curriculum) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = curriculumItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const [row] = await db
    .insert(curriculumItems)
    .values({ ...parsed.data, curriculumId: id })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

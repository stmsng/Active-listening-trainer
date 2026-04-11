import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { curricula, curriculumItems, characters } from "@/lib/db/schema";
import { curriculumSchema } from "@/lib/validations/curriculum";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const [curriculum] = await db
    .select()
    .from(curricula)
    .where(and(eq(curricula.id, id), eq(curricula.clinicianId, session.user.id)))
    .limit(1);

  if (!curriculum) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const items = await db
    .select({
      id: curriculumItems.id,
      characterId: curriculumItems.characterId,
      characterName: characters.name,
      scenario: curriculumItems.scenario,
      sortOrder: curriculumItems.sortOrder,
    })
    .from(curriculumItems)
    .leftJoin(characters, eq(curriculumItems.characterId, characters.id))
    .where(eq(curriculumItems.curriculumId, id))
    .orderBy(curriculumItems.sortOrder);

  return NextResponse.json({ ...curriculum, items });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = curriculumSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const [row] = await db
    .update(curricula)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(curricula.id, id), eq(curricula.clinicianId, session.user.id)))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await db
    .delete(curricula)
    .where(and(eq(curricula.id, id), eq(curricula.clinicianId, session.user.id)));

  return NextResponse.json({ ok: true });
}

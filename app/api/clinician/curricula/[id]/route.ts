import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { curriculumSchema } from "@/lib/validations/curriculum";
import {
  deleteCurriculum,
  findCurriculumByIdAndClinician,
  updateCurriculum,
} from "@/lib/db/queries/curricula";
import { listCurriculumItemsWithCharacter } from "@/lib/db/queries/curriculum-items";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const curriculum = await findCurriculumByIdAndClinician(id, session.user.id);
  if (!curriculum) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const items = await listCurriculumItemsWithCharacter(id);
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
  const parsed = curriculumSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const row = await updateCurriculum({
    id,
    clinicianId: session.user.id,
    input: parsed.data,
  });
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
  await deleteCurriculum(id, session.user.id);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { curriculumItemSchema } from "@/lib/validations/curriculum";
import { findCurriculumByIdAndClinician } from "@/lib/db/queries/curricula";
import { createCurriculumItem } from "@/lib/db/queries/curriculum-items";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (!(await findCurriculumByIdAndClinician(id, session.user.id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = curriculumItemSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const row = await createCurriculumItem({
    curriculumId: id,
    input: parsed.data,
  });
  return NextResponse.json(row, { status: 201 });
}

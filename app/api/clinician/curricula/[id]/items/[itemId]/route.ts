import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findCurriculumByIdAndClinician } from "@/lib/db/queries/curricula";
import { deleteCurriculumItem } from "@/lib/db/queries/curriculum-items";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, itemId } = await params;
  if (!(await findCurriculumByIdAndClinician(id, session.user.id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteCurriculumItem(itemId);
  return NextResponse.json({ ok: true });
}

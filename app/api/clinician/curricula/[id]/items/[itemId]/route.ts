import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { curricula, curriculumItems } from "@/lib/db/schema";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, itemId } = await params;

  // Verify curriculum ownership
  const [curriculum] = await db
    .select()
    .from(curricula)
    .where(and(eq(curricula.id, id), eq(curricula.clinicianId, session.user.id)))
    .limit(1);

  if (!curriculum) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(curriculumItems).where(eq(curriculumItems.id, itemId));

  return NextResponse.json({ ok: true });
}

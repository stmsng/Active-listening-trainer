import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteClinicianDesignation } from "@/lib/db/queries/clinician-designations";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await deleteClinicianDesignation(id);
  return NextResponse.json({ ok: true });
}

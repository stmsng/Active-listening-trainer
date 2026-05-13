import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { findClientOfClinician } from "@/lib/db/queries/users";
import { findCurriculumByIdAndClinician } from "@/lib/db/queries/curricula";
import {
  createEnrollment,
  findEnrollment,
} from "@/lib/db/queries/curriculum-enrollments";

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
  const parsed = enrollSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Curriculum ID required" }, { status: 400 });
  }

  if (!(await findClientOfClinician(clientId, session.user.id))) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (
    !(await findCurriculumByIdAndClinician(
      parsed.data.curriculumId,
      session.user.id
    ))
  ) {
    return NextResponse.json({ error: "Curriculum not found" }, { status: 404 });
  }

  if (await findEnrollment(clientId, parsed.data.curriculumId)) {
    return NextResponse.json(
      { error: "Client is already enrolled" },
      { status: 409 }
    );
  }

  const enrollment = await createEnrollment({
    clientId,
    curriculumId: parsed.data.curriculumId,
  });
  return NextResponse.json(enrollment, { status: 201 });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { curriculumSchema } from "@/lib/validations/curriculum";
import {
  createCurriculum,
  listCurriculaByClinician,
} from "@/lib/db/queries/curricula";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(await listCurriculaByClinician(session.user.id));
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = curriculumSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const row = await createCurriculum({
    clinicianId: session.user.id,
    input: parsed.data,
  });
  return NextResponse.json(row, { status: 201 });
}

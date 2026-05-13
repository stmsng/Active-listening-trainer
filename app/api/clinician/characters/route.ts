import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { characterSchema } from "@/lib/validations/character";
import {
  createCharacter,
  listCharactersByClinician,
} from "@/lib/db/queries/characters";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(await listCharactersByClinician(session.user.id));
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = characterSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const row = await createCharacter({
    clinicianId: session.user.id,
    input: parsed.data,
  });
  return NextResponse.json(row, { status: 201 });
}

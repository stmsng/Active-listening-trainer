import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { characters } from "@/lib/db/schema";
import { characterSchema } from "@/lib/validations/character";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(characters)
    .where(eq(characters.clinicianId, session.user.id))
    .orderBy(characters.createdAt);

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = characterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const [row] = await db
    .insert(characters)
    .values({ ...parsed.data, clinicianId: session.user.id })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

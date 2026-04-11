import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clinicianDesignations } from "@/lib/db/schema";
import { z } from "zod";

const addSchema = z.object({
  email: z.string().email(),
});

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await db.select().from(clinicianDesignations).orderBy(clinicianDesignations.createdAt);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;

  // Check for duplicate
  const [existing] = await db
    .select()
    .from(clinicianDesignations)
    .where(eq(clinicianDesignations.email, email))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "This email is already designated" },
      { status: 409 }
    );
  }

  const [row] = await db
    .insert(clinicianDesignations)
    .values({ email, createdBy: session.user.id })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

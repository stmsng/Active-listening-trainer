import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createClinicianDesignation,
  findClinicianDesignationByEmail,
  listClinicianDesignations,
} from "@/lib/db/queries/clinician-designations";

const addSchema = z.object({
  email: z.string().email(),
});

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(await listClinicianDesignations());
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = addSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;
  if (await findClinicianDesignationByEmail(email)) {
    return NextResponse.json(
      { error: "This email is already designated" },
      { status: 409 }
    );
  }

  const row = await createClinicianDesignation({
    email,
    createdBy: session.user.id,
  });
  return NextResponse.json(row, { status: 201 });
}

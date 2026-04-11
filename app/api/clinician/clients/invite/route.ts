import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientInvitations } from "@/lib/db/schema";
import { getEmailProvider } from "@/lib/email";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;

  // Check for existing invitation from this clinician
  const [existing] = await db
    .select()
    .from(clientInvitations)
    .where(
      and(
        eq(clientInvitations.clinicianId, session.user.id),
        eq(clientInvitations.email, email)
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "This email has already been invited" },
      { status: 409 }
    );
  }

  const [invitation] = await db
    .insert(clientInvitations)
    .values({ clinicianId: session.user.id, email })
    .returning();

  // Send invitation email
  const emailProvider = getEmailProvider();
  const registerUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/register?invitation=${invitation.id}`;

  await emailProvider.send({
    to: email,
    subject: "You've been invited to Active Listening Dojo",
    textBody: `You've been invited to practice active listening skills.\n\nRegister here: ${registerUrl}`,
    htmlBody: `<p>You've been invited to practice active listening skills.</p><p><a href="${registerUrl}">Register here</a></p>`,
  });

  return NextResponse.json(invitation, { status: 201 });
}

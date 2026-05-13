import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getEmailProvider } from "@/lib/email";
import {
  createClientInvitation,
  findClientInvitationByClinicianAndEmail,
} from "@/lib/db/queries/client-invitations";

const inviteSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "clinician") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = inviteSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;
  if (
    await findClientInvitationByClinicianAndEmail(session.user.id, email)
  ) {
    return NextResponse.json(
      { error: "This email has already been invited" },
      { status: 409 }
    );
  }

  const invitation = await createClientInvitation({
    clinicianId: session.user.id,
    email,
  });

  const registerUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/register?invitation=${invitation.id}`;
  await getEmailProvider().send({
    to: email,
    subject: "You've been invited to Active Listening Dojo",
    textBody: `You've been invited to practice active listening skills.\n\nRegister here: ${registerUrl}`,
    htmlBody: `<p>You've been invited to practice active listening skills.</p><p><a href="${registerUrl}">Register here</a></p>`,
  });

  return NextResponse.json(invitation, { status: 201 });
}

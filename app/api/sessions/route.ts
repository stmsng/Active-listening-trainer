import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSession } from "@/lib/db/queries/sessions";
import { createSessionSchema } from "@/lib/validations/session";

// POST /api/sessions
// Persists a completed training session for the logged-in user. Anonymous
// users get 401 — the /train page falls back to localStorage in that case.
// Full quota gating arrives with Phase 2 (Gap 2.1 in docs/MVP_GAPS.md).
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createSessionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { scenario, characterId, messages, turnCount, voiceTurnCount, model, costUsdMillicents, aiName } = parsed.data;

  const row = await createSession({
    userId: session.user.id,
    characterId: characterId ?? null,
    // We keep aiName + scenario together so /report can render the header
    // without a character row to join against (Phase 1 uses a static
    // catalog rather than DB-backed consumer characters).
    scenario: JSON.stringify({ scenario, aiName }),
    messages,
    turnCount,
    voiceTurnCount,
    model,
    costUsdMillicents,
    endedAt: new Date(),
  });

  return NextResponse.json({ id: row.id }, { status: 201 });
}

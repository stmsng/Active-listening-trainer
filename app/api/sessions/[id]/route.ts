import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findSessionByIdAndUser } from "@/lib/db/queries/sessions";

// GET /api/sessions/[id]
// Returns the session if it belongs to the requester. /report calls this
// to render the conversation + cached grade.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const row = await findSessionByIdAndUser(id, session.user.id);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // scenario column holds JSON {scenario, aiName} when written by POST
  // /api/sessions; fall back gracefully for any rows seeded otherwise.
  let scenario = row.scenario;
  let aiName: string | null = null;
  try {
    const parsed = JSON.parse(row.scenario);
    if (parsed && typeof parsed.scenario === "string") {
      scenario = parsed.scenario;
      aiName = parsed.aiName ?? null;
    }
  } catch {
    /* legacy plain-string scenario */
  }

  return NextResponse.json({
    id: row.id,
    scenario,
    aiName,
    characterId: row.characterId,
    messages: JSON.parse(row.messagesJson),
    grade: row.gradeJson ? JSON.parse(row.gradeJson) : null,
    createdAt: row.createdAt.toISOString(),
    endedAt: row.endedAt?.toISOString() ?? null,
    turnCount: row.turnCount,
    voiceTurnCount: row.voiceTurnCount,
  });
}

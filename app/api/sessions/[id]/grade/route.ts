import { NextResponse } from "next/server";
import { b } from "@/baml_client";
import { auth } from "@/lib/auth";
import {
  findSessionByIdAndUser,
  setSessionGrade,
} from "@/lib/db/queries/sessions";

// POST /api/sessions/[id]/grade
// Computes the grade once and caches it on the session row. Subsequent
// calls return the cached grade without re-billing GPT-4 (MVP_GAPS Gap 1.2).
export async function POST(
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

  if (row.gradeJson) {
    return NextResponse.json(JSON.parse(row.gradeJson));
  }

  let scenarioText = row.scenario;
  try {
    const parsed = JSON.parse(row.scenario);
    if (parsed && typeof parsed.scenario === "string") {
      scenarioText = parsed.scenario;
    }
  } catch {
    /* legacy plain-string scenario */
  }

  const messages = JSON.parse(row.messagesJson) as Array<{
    text: string;
    speaker: "user" | "ai";
    timestamp: string;
  }>;

  const history = messages.map((m) => ({
    text: m.text,
    speaker: m.speaker,
    timestamp: new Date(m.timestamp).toISOString(),
    character_state: null,
    user_prosody: null,
  }));

  const grade = await b.GradeActiveListening(scenarioText, history);
  await setSessionGrade(id, JSON.stringify(grade));

  return NextResponse.json(grade);
}

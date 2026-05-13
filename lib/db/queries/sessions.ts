import {
  selectOne,
  execReturning,
  execute,
  newId,
  nowSeconds,
} from "../utils";
import { rowToSession } from "../row-mappers";
import type { Session } from "../types";

export interface CreateSessionInput {
  userId: string;
  characterId: string | null;
  scenario: string;
  messages: unknown;        // serialized via JSON.stringify
  turnCount: number;
  voiceTurnCount: number;
  model?: string | null;
  costUsdMillicents?: number;
  endedAt?: Date | null;
}

export async function createSession(
  input: CreateSessionInput,
): Promise<Session> {
  const r = await execReturning(
    `INSERT INTO sessions (
       id, user_id, character_id, scenario, messages_json, grade_json,
       created_at, ended_at, turn_count, voice_turn_count, model, cost_usd_millicents
     ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?)
     RETURNING *`,
    newId(),
    input.userId,
    input.characterId,
    input.scenario,
    JSON.stringify(input.messages),
    nowSeconds(),
    input.endedAt ? Math.floor(input.endedAt.getTime() / 1000) : nowSeconds(),
    input.turnCount,
    input.voiceTurnCount,
    input.model ?? null,
    input.costUsdMillicents ?? 0,
  );
  return rowToSession(r);
}

export async function findSessionByIdAndUser(
  id: string,
  userId: string,
): Promise<Session | null> {
  const r = await selectOne(
    "SELECT * FROM sessions WHERE id = ? AND user_id = ?",
    id,
    userId,
  );
  return r ? rowToSession(r) : null;
}

export async function setSessionGrade(
  id: string,
  gradeJson: string,
): Promise<void> {
  await execute(
    "UPDATE sessions SET grade_json = ? WHERE id = ?",
    gradeJson,
    id,
  );
}

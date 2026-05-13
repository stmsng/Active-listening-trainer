import { z } from "zod";

export const sessionMessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  speaker: z.enum(["user", "ai"]),
  // ISO string — Dates aren't serializable across the wire.
  timestamp: z.string(),
});

export const createSessionSchema = z.object({
  scenario: z.string().min(1),
  aiName: z.string().min(1),
  characterId: z.string().nullable().optional(),
  messages: z.array(sessionMessageSchema).min(1),
  turnCount: z.number().int().nonnegative(),
  voiceTurnCount: z.number().int().nonnegative().default(0),
  model: z.string().optional(),
  costUsdMillicents: z.number().int().nonnegative().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SessionMessage = z.infer<typeof sessionMessageSchema>;

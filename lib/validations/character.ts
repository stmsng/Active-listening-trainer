import { z } from "zod";

const scale1to10 = z.number().int().min(1).max(10);

export const characterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isTherapist: z.boolean().default(false),
  introversion: scale1to10,
  communicationSkill: scale1to10,
  openness: scale1to10,
  conscientiousness: scale1to10,
  age: z.number().int().min(1).max(120),
  gender: z.enum(["male", "female", "nonbinary"]),
  nationality: z.string().min(1, "Nationality is required"),
  reactivity: scale1to10,
  specialNotes: z.string().default(""),
});

export type CharacterInput = z.infer<typeof characterSchema>;

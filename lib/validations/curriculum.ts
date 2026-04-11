import { z } from "zod";

export const curriculumSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
});

export const curriculumItemSchema = z.object({
  characterId: z.string().min(1, "Character is required"),
  scenario: z.string().min(1, "Scenario is required"),
  sortOrder: z.number().int().min(0),
});

export type CurriculumInput = z.infer<typeof curriculumSchema>;
export type CurriculumItemInput = z.infer<typeof curriculumItemSchema>;

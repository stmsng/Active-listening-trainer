import { selectAll, execReturning, execute, newId } from "../utils";
import { rowToCurriculumItem } from "../row-mappers";
import type { CurriculumItem } from "../types";

export interface CurriculumItemInput {
  characterId: string;
  scenario: string;
  sortOrder: number;
}

export interface CurriculumItemWithCharacterName extends CurriculumItem {
  characterName: string | null;
}

export async function listCurriculumItemsWithCharacter(
  curriculumId: string,
): Promise<CurriculumItemWithCharacterName[]> {
  const rows = await selectAll<{
    id: string;
    curriculum_id: string;
    character_id: string;
    scenario: string;
    sort_order: number;
    character_name: string | null;
  }>(
    `SELECT ci.*, c.name AS character_name
     FROM curriculum_items ci
     LEFT JOIN characters c ON ci.character_id = c.id
     WHERE ci.curriculum_id = ?
     ORDER BY ci.sort_order`,
    curriculumId,
  );
  return rows.map((r) => ({
    ...rowToCurriculumItem(r),
    characterName: r.character_name,
  }));
}

export async function createCurriculumItem(opts: {
  curriculumId: string;
  input: CurriculumItemInput;
}): Promise<CurriculumItem> {
  const r = await execReturning(
    `INSERT INTO curriculum_items (id, curriculum_id, character_id, scenario, sort_order)
     VALUES (?, ?, ?, ?, ?)
     RETURNING *`,
    newId(),
    opts.curriculumId,
    opts.input.characterId,
    opts.input.scenario,
    opts.input.sortOrder,
  );
  return rowToCurriculumItem(r);
}

export async function deleteCurriculumItem(itemId: string): Promise<void> {
  await execute("DELETE FROM curriculum_items WHERE id = ?", itemId);
}

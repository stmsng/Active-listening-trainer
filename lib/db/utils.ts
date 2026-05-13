import { getDb } from "./index";

// Thin helpers over @tursodatabase/sync. The SDK returns rows as plain
// objects keyed by snake_case column names; mapping to TS shapes happens
// in lib/db/row-mappers.ts. All helpers accept a positional ? parameter
// list to avoid SQL injection — never interpolate user input into `sql`.

export async function selectAll<TRow = Record<string, unknown>>(
  sql: string,
  ...params: unknown[]
): Promise<TRow[]> {
  const db = await getDb();
  const stmt = await db.prepare(sql);
  return (await stmt.all(...params)) as TRow[];
}

export async function selectOne<TRow = Record<string, unknown>>(
  sql: string,
  ...params: unknown[]
): Promise<TRow | null> {
  const db = await getDb();
  const stmt = await db.prepare(sql);
  const row = await stmt.get(...params);
  return (row as TRow | undefined) ?? null;
}

// For INSERT/UPDATE ... RETURNING * — returns the affected row.
export async function execReturning<TRow = Record<string, unknown>>(
  sql: string,
  ...params: unknown[]
): Promise<TRow> {
  const db = await getDb();
  const stmt = await db.prepare(sql);
  const row = await stmt.get(...params);
  if (!row) throw new Error("execReturning: statement returned no row");
  return row as TRow;
}

// For UPDATE ... RETURNING * where zero rows is a normal "not found".
export async function execReturningMaybe<TRow = Record<string, unknown>>(
  sql: string,
  ...params: unknown[]
): Promise<TRow | null> {
  const db = await getDb();
  const stmt = await db.prepare(sql);
  const row = await stmt.get(...params);
  return (row as TRow | undefined) ?? null;
}

// For DELETE / UPDATE without RETURNING.
export async function execute(
  sql: string,
  ...params: unknown[]
): Promise<void> {
  const db = await getDb();
  const stmt = await db.prepare(sql);
  await stmt.run(...params);
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

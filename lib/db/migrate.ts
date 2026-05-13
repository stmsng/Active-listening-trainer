import type { Database } from "@tursodatabase/sync";
import { MIGRATIONS } from "./migrations";

// Apply any unapplied migrations in order. Idempotent. Each migration's
// SQL is run as a single exec() — semicolon-separated statements are fine.
// Tracked in the _migrations table.
export async function migrate(db: Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);

  const appliedStmt = await db.prepare(
    "SELECT name FROM _migrations ORDER BY name",
  );
  const applied: Array<{ name: string }> = await appliedStmt.all();
  const appliedSet = new Set(applied.map((r) => r.name));

  for (const m of MIGRATIONS) {
    if (appliedSet.has(m.name)) continue;
    await db.exec(m.sql);
    const insert = await db.prepare(
      "INSERT INTO _migrations (name) VALUES (?)",
    );
    await insert.run(m.name);
  }
}

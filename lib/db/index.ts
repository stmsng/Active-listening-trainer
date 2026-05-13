import { connect, retryFetch, type Database } from "@tursodatabase/sync";
import { migrate } from "./migrate";

// Singleton DB connection across hot reloads. In dev, Next.js reloads
// the module repeatedly; we stash the connection on globalThis so the
// embedded SQLite file isn't opened twice.
declare global {
  // eslint-disable-next-line no-var
  var __turso_db__: Promise<Database> | undefined;
  // eslint-disable-next-line no-var
  var __turso_push_timer__: NodeJS.Timeout | undefined;
}

const PUSH_INTERVAL_MS = 5_000;

async function open(): Promise<Database> {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const path = process.env.TURSO_LOCAL_PATH ?? "local.db";

  const db = await connect({
    path,
    url: url || undefined,
    authToken: authToken || undefined,
    clientName: "active-listening-dojo",
    fetch: retryFetch(),
  });

  await db.connect();
  await migrate(db);

  // Pull any remote changes that happened while we were down.
  if (url) {
    try {
      await db.pull();
    } catch (err) {
      console.error("[db] initial pull failed:", err);
    }

    // Periodic push of local writes to remote. We don't pull on a
    // schedule — for a single-machine deploy there's no other writer.
    if (!globalThis.__turso_push_timer__) {
      globalThis.__turso_push_timer__ = setInterval(() => {
        db.push().catch((err) => console.error("[db] push failed:", err));
      }, PUSH_INTERVAL_MS);
    }
  }

  return db;
}

export function getDb(): Promise<Database> {
  if (!globalThis.__turso_db__) {
    globalThis.__turso_db__ = open();
  }
  return globalThis.__turso_db__;
}

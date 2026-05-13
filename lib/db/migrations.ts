// SQL migrations applied in order on startup. Each migration runs once,
// tracked in the _migrations table. Schema changes go here, not in TS.

export interface Migration {
  name: string;
  sql: string;
}

export const MIGRATIONS: Migration[] = [
  {
    name: "001_initial",
    sql: `
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'client'
          CHECK (role IN ('admin', 'clinician', 'client')),
        clinician_id TEXT REFERENCES users(id),
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX idx_users_clinician ON users(clinician_id);

      CREATE TABLE clinician_designations (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_by TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );

      CREATE TABLE characters (
        id TEXT PRIMARY KEY,
        clinician_id TEXT NOT NULL REFERENCES users(id),
        name TEXT NOT NULL,
        is_therapist INTEGER NOT NULL DEFAULT 0,
        introversion INTEGER NOT NULL,
        communication_skill INTEGER NOT NULL,
        openness INTEGER NOT NULL,
        conscientiousness INTEGER NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL
          CHECK (gender IN ('male', 'female', 'nonbinary')),
        nationality TEXT NOT NULL,
        reactivity INTEGER NOT NULL,
        special_notes TEXT NOT NULL DEFAULT '',
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX idx_characters_clinician ON characters(clinician_id);

      CREATE TABLE curricula (
        id TEXT PRIMARY KEY,
        clinician_id TEXT NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX idx_curricula_clinician ON curricula(clinician_id);

      CREATE TABLE curriculum_items (
        id TEXT PRIMARY KEY,
        curriculum_id TEXT NOT NULL
          REFERENCES curricula(id) ON DELETE CASCADE,
        character_id TEXT NOT NULL REFERENCES characters(id),
        scenario TEXT NOT NULL,
        sort_order INTEGER NOT NULL
      );
      CREATE INDEX idx_curriculum_items_curriculum
        ON curriculum_items(curriculum_id);

      CREATE TABLE curriculum_enrollments (
        id TEXT PRIMARY KEY,
        curriculum_id TEXT NOT NULL REFERENCES curricula(id),
        client_id TEXT NOT NULL REFERENCES users(id),
        enrolled_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX idx_curriculum_enrollments_curriculum
        ON curriculum_enrollments(curriculum_id);
      CREATE INDEX idx_curriculum_enrollments_client
        ON curriculum_enrollments(client_id);

      CREATE TABLE client_invitations (
        id TEXT PRIMARY KEY,
        clinician_id TEXT NOT NULL REFERENCES users(id),
        email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'registered', 'confirmed')),
        client_id TEXT REFERENCES users(id),
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX idx_client_invitations_clinician
        ON client_invitations(clinician_id);
      CREATE INDEX idx_client_invitations_email
        ON client_invitations(email);

      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        character_id TEXT REFERENCES characters(id),
        scenario TEXT NOT NULL,
        messages_json TEXT NOT NULL,
        grade_json TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX idx_sessions_user ON sessions(user_id);
    `,
  },
  {
    name: "002_session_metrics",
    sql: `
      ALTER TABLE sessions ADD COLUMN ended_at INTEGER;
      ALTER TABLE sessions ADD COLUMN turn_count INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE sessions ADD COLUMN voice_turn_count INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE sessions ADD COLUMN model TEXT;
      ALTER TABLE sessions ADD COLUMN cost_usd_millicents INTEGER NOT NULL DEFAULT 0;
    `,
  },
];

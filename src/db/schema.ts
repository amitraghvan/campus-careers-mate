/**
 * ╔══════════════════════════════════════════════════╗
 * ║        Database Schema                           ║
 * ║  SQL DDL statements for all tables               ║
 * ╚══════════════════════════════════════════════════╝
 */

export const DB_SCHEMA_VERSION = 1;

export const CREATE_TABLES_SQL = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    college       TEXT,
    avatar_url    TEXT,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Auth sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Opportunities table
  CREATE TABLE IF NOT EXISTS opportunities (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    company    TEXT NOT NULL,
    role       TEXT NOT NULL,
    status     TEXT NOT NULL CHECK (status IN ('wishlist','applied','interview','selected','rejected')),
    deadline   TEXT NOT NULL,
    package    TEXT,
    notes      TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Checklist items table (one-to-many with opportunities)
  CREATE TABLE IF NOT EXISTS checklist_items (
    id              TEXT PRIMARY KEY,
    opportunity_id  TEXT NOT NULL,
    text            TEXT NOT NULL,
    done            INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
  );

  -- Schema version tracking
  CREATE TABLE IF NOT EXISTS schema_meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- Indexes for performance
  CREATE INDEX IF NOT EXISTS idx_opportunities_user   ON opportunities(user_id);
  CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
  CREATE INDEX IF NOT EXISTS idx_checklist_opp        ON checklist_items(opportunity_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_user        ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_users_email          ON users(email);
`;

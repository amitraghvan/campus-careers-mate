/**
 * ╔══════════════════════════════════════════════════╗
 * ║        Database Engine                           ║
 * ║  sql.js (SQLite WASM) singleton with             ║
 * ║  localStorage persistence                       ║
 * ╚══════════════════════════════════════════════════╝
 *
 * The entire SQLite database lives in memory and is
 * serialised to localStorage on every write, giving
 * us real SQL queries with zero backend requirement.
 */

import initSqlJs, { type Database } from "sql.js";
import { CREATE_TABLES_SQL, DB_SCHEMA_VERSION } from "./schema";

// ── Constants ────────────────────────────────────
const DB_STORAGE_KEY = "placement-tracker-sqldb";
const SQL_WASM_CDN =
  "https://sql.js.org/dist/sql-wasm.wasm";

// ── Singleton state ──────────────────────────────
let db: Database | null = null;
let initPromise: Promise<Database> | null = null;

/**
 * Persist the in-memory DB to localStorage.
 * Called automatically after every mutation.
 */
function persistToStorage(): void {
  if (!db) return;
  try {
    const data = db.export();
    const base64 = btoa(
      Array.from(new Uint8Array(data))
        .map((b: number) => String.fromCharCode(b))
        .join("")
    );
    localStorage.setItem(DB_STORAGE_KEY, base64);
  } catch (err) {
    console.error("[DB] Failed to persist database:", err);
  }
}

/**
 * Load a previously-persisted DB from localStorage.
 * Returns the Uint8Array or null if nothing is stored.
 */
function loadFromStorage(): Uint8Array | null {
  try {
    const base64 = localStorage.getItem(DB_STORAGE_KEY);
    if (!base64) return null;
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

/**
 * Initialise (or re-use) the database singleton.
 *
 * 1. Load sql.js WASM binary.
 * 2. Restore from localStorage if available, else create fresh.
 * 3. Run migrations (CREATE IF NOT EXISTS — safe to re-run).
 * 4. Persist the initialised database.
 */
export async function getDatabase(): Promise<Database> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: () => SQL_WASM_CDN,
    });

    const stored = loadFromStorage();
    db = stored ? new SQL.Database(stored) : new SQL.Database();

    // Enable WAL-like behaviour & FK enforcement
    db.run("PRAGMA journal_mode = MEMORY;");
    db.run("PRAGMA foreign_keys = ON;");

    // Run schema migrations
    db.run(CREATE_TABLES_SQL);

    // Track schema version
    db.run(
      `INSERT OR REPLACE INTO schema_meta (key, value) VALUES ('version', ?);`,
      [String(DB_SCHEMA_VERSION)]
    );

    persistToStorage();
    return db;
  })();

  return initPromise;
}

// ── Query helpers ────────────────────────────────

/** Run a read query and return rows as typed objects */
export function query<T = Record<string, unknown>>(
  database: Database,
  sql: string,
  params: unknown[] = []
): T[] {
  const stmt = database.prepare(sql);
  stmt.bind(params as (string | number | null | Uint8Array)[]);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
}

/** Run a write query (INSERT / UPDATE / DELETE) and persist */
export function execute(
  database: Database,
  sql: string,
  params: unknown[] = []
): void {
  database.run(sql, params as (string | number | null | Uint8Array)[]);
  persistToStorage();
}

/** Run multiple write statements in a transaction */
export function transaction(
  database: Database,
  operations: Array<{ sql: string; params?: unknown[] }>
): void {
  database.run("BEGIN TRANSACTION;");
  try {
    for (const op of operations) {
      database.run(op.sql, (op.params ?? []) as (string | number | null | Uint8Array)[]);
    }
    database.run("COMMIT;");
  } catch (err) {
    database.run("ROLLBACK;");
    throw err;
  }
  persistToStorage();
}

/** Completely reset the database (for dev / testing) */
export function resetDatabase(): void {
  localStorage.removeItem(DB_STORAGE_KEY);
  if (db) {
    db.close();
    db = null;
    initPromise = null;
  }
}

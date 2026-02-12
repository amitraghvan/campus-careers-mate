/**
 * Safe migration runner: Applies the safe-peer-migration.sql to the database.
 * Uses IF NOT EXISTS so it's idempotent and safe to run multiple times.
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.warn('[safe-migrate] DATABASE_URL not set, skipping safe migration.');
        process.exit(0);
    }

    const sqlPath = path.join(__dirname, '..', 'prisma', 'safe-peer-migration.sql');
    if (!fs.existsSync(sqlPath)) {
        console.warn('[safe-migrate] safe-peer-migration.sql not found, skipping.');
        process.exit(0);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

    try {
        await pool.query(sql);
        console.log('[safe-migrate] ✅ Safe migration completed successfully.');
    } catch (err) {
        console.warn('[safe-migrate] ⚠️ Safe migration had issues (may be OK if tables already exist):', err.message);
    } finally {
        await pool.end();
    }
}

run();

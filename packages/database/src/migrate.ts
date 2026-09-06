/**
 * @docaas/database - Raw SQL Migration Runner
 * Phase 5: Production Readiness
 *
 * Applies SQL migration files in numeric order using Prisma raw execution.
 * Tracks applied migrations in __aura_sql_migrations table.
 * Provides transactional atomicity and SHA-256 checksum tracking.
 */

import { PrismaClient } from '@prisma/client';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import crypto from 'node:crypto';

const prisma = new PrismaClient();
const MIGRATIONS_DIR = join(__dirname, 'migrations');

async function migrate(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is required for migration.'
    );
  }

  try {
    await prisma.$connect();
    console.log('🔌 Connected to PostgreSQL database via Prisma client.');

    // Ensure migration tracking table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS __aura_sql_migrations (
        id           SERIAL PRIMARY KEY,
        filename     TEXT NOT NULL UNIQUE,
        applied_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        checksum     TEXT NOT NULL
      );
    `);

    // Read all .sql files sorted numerically
    const allFiles = await readdir(MIGRATIONS_DIR);
    const sqlFiles = allFiles
      .filter((f) => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (sqlFiles.length === 0) {
      console.log('ℹ️  No SQL migration files found.');
      return;
    }

    let applied = 0;
    let skipped = 0;

    for (const filename of sqlFiles) {
      // Check if already applied
      const rows: Array<{ id: number }> = await prisma.$queryRawUnsafe(
        'SELECT id FROM __aura_sql_migrations WHERE filename = $1',
        filename
      );

      if (rows && rows.length > 0) {
        console.log(`  ⏭  Skipped (already applied): ${filename}`);
        skipped++;
        continue;
      }

      const sqlPath = join(MIGRATIONS_DIR, filename);
      const sql = await readFile(sqlPath, 'utf-8');
      const checksum = crypto.createHash('sha256').update(sql).digest('hex');

      console.log(`  ▶  Applying: ${filename} ...`);

      // Execute in atomic transaction
      await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(sql);
        await tx.$executeRawUnsafe(
          'INSERT INTO __aura_sql_migrations (filename, checksum) VALUES ($1, $2)',
          filename,
          checksum
        );
      });

      console.log(`  ✅ Applied: ${filename}`);
      applied++;
    }

    console.log(
      `\n✨ Migration complete. Applied: ${applied}, Skipped: ${skipped}/${sqlFiles.length} total files.`
    );
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed.');
  }
}

// Run migrations
migrate().catch((err) => {
  console.error('Migration runner failed:', err);
  process.exit(1);
});

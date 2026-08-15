import { db } from './index';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  console.log('⏳ Running database migration on Supabase PostgreSQL...');
  
  const migrationPath = path.join(process.cwd(), 'drizzle', '0000_plain_william_stryker.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  // Split by statement-breakpoint and execute statements
  const statements = migrationSql.split('--> statement-breakpoint');

  for (const statement of statements) {
    if (statement.trim()) {
      await db.execute(sql.raw(statement.trim()));
    }
  }

  console.log('✅ Database migration completed successfully! All tables created.');
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

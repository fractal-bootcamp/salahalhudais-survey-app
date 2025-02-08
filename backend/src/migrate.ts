import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { 
  max: 1,
  ssl: {
    rejectUnauthorized: false
  }
});
const db = drizzle(sql);

async function main() {
  // Enable pgcrypto extension first
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await migrate(db, { migrationsFolder: 'drizzle' });
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
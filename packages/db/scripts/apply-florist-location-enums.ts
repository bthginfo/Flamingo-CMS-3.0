import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sql = neon(databaseUrl);

await sql("ALTER TYPE \"public\".\"industry\" ADD VALUE IF NOT EXISTS 'florist'");
await sql("ALTER TYPE \"public\".\"industry\" ADD VALUE IF NOT EXISTS 'location'");
await sql("ALTER TYPE \"public\".\"deployment_mode\" ADD VALUE IF NOT EXISTS 'lead_shared'");

console.log('OK: production enums updated');

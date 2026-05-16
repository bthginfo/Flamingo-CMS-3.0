import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  await sql`ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS auto_response jsonb DEFAULT null`;
  await sql`ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS form_fields jsonb DEFAULT null`;
  console.log('✅ Columns added');
}

main().catch(console.error);

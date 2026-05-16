import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function main() {
  await sql("ALTER TYPE industry ADD VALUE IF NOT EXISTS 'photography'");
  console.log('OK: photography added to enum');
}
main().catch(e => { console.error(e); process.exit(1); });

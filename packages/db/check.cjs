const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function main() {
  const rows = await sql`SELECT id, slug, name, industry, is_demo, status FROM tenants WHERE industry = 'tradesman' OR name ILIKE '%vinothek%' ORDER BY created_at`;
  console.log(JSON.stringify(rows, null, 2));
}
main();

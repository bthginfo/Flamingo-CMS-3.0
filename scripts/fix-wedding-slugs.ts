import { requireDatabaseUrl } from './_database-url';
import { neon } from '@neondatabase/serverless';
const sql = neon(requireDatabaseUrl());

async function main() {
  const tid = '39a03f3a-3eaf-4cf8-acec-2f74534f0392';
  await sql(`UPDATE pages SET slug = 'startseite' WHERE tenant_id = $1 AND slug = '/'`, [tid]);
  await sql(`UPDATE pages SET slug = LTRIM(slug, '/') WHERE tenant_id = $1 AND slug LIKE '/%'`, [tid]);
  const r = await sql(`SELECT slug FROM pages WHERE tenant_id = $1`, [tid]);
  console.log(r.map(x => x.slug));
}
main();

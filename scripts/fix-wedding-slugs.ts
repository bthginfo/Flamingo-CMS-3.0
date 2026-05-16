import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const tid = '39a03f3a-3eaf-4cf8-acec-2f74534f0392';
  await sql(`UPDATE pages SET slug = 'startseite' WHERE tenant_id = $1 AND slug = '/'`, [tid]);
  await sql(`UPDATE pages SET slug = LTRIM(slug, '/') WHERE tenant_id = $1 AND slug LIKE '/%'`, [tid]);
  const r = await sql(`SELECT slug FROM pages WHERE tenant_id = $1`, [tid]);
  console.log(r.map(x => x.slug));
}
main();

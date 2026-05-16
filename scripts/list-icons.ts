import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const r = await sql(`SELECT data::text as d FROM page_sections WHERE data::text LIKE '%icon%'`);
  const icons = new Set<string>();
  for (const row of r) {
    const matches = (row.d as string).matchAll(/"icon"\s*:\s*"([^"]+)"/g);
    for (const m of matches) icons.add(m[1]);
  }
  console.log([...icons].sort().join('\n'));
}
main();

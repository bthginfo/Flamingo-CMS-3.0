import { requireDatabaseUrl } from './_database-url';
import { neon } from '@neondatabase/serverless';
const sql = neon(requireDatabaseUrl());

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

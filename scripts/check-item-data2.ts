import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  // Check projects, rooms, and services items
  const rows = await sql(`
    SELECT t.industry, c.key as ck, ci.slug, ci.title, ci.data
    FROM collection_items ci
    JOIN collections c ON c.id = ci.collection_id
    JOIN tenants t ON t.id = ci.tenant_id
    WHERE t.is_demo = true AND c.key IN ('projects','rooms','services')
    ORDER BY t.industry, c.key, ci.slug
  `);
  rows.forEach(r => {
    const d = r.data as Record<string, unknown>;
    const sects = d.sections as unknown[] | undefined;
    console.log(`${r.industry}/${r.ck}/${r.slug}: keys=${Object.keys(d).join(',')}, sections=${sects?.length ?? 0}`);
  });
}
main();

import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  // List all collections with their items for demo tenants
  const rows = await sql(`
    SELECT t.industry, c.key, c.label, ci.slug, ci.title, 
           jsonb_object_keys(ci.data) as has_data,
           (SELECT count(*) FROM jsonb_object_keys(ci.data)) as data_keys
    FROM collection_items ci
    JOIN collections c ON c.id = ci.collection_id
    JOIN tenants t ON t.id = ci.tenant_id
    WHERE t.is_demo = true
    ORDER BY t.industry, c.key, ci.slug
  `);

  // Group by industry/collection
  const grouped: Record<string, { slug: string; title: string }[]> = {};
  for (const r of rows) {
    const key = `${r.industry}/${r.key}`;
    if (!grouped[key]) grouped[key] = [];
    const existing = grouped[key].find(x => x.slug === r.slug);
    if (!existing) grouped[key].push({ slug: r.slug, title: r.title });
  }

  for (const [key, items] of Object.entries(grouped)) {
    console.log(`\n${key} (${items.length} items):`);
    items.forEach(i => console.log(`  - ${i.slug}: ${i.title}`));
  }
}
main();

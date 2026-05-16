import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const rows = await sql(`
    SELECT t.industry, c.key as collection_key, ci.slug, ci.title, ci.data
    FROM collection_items ci
    JOIN collections c ON c.id = ci.collection_id
    JOIN tenants t ON t.id = ci.tenant_id
    WHERE t.is_demo = true
    ORDER BY t.industry, c.key
    LIMIT 5
  `);
  rows.forEach(r => {
    console.log(`\n${r.industry}/${r.collection_key}/${r.slug}:`);
    console.log('  keys:', Object.keys(r.data));
    console.log('  data:', JSON.stringify(r.data).substring(0, 200));
  });
}
main();

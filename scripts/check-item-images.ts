import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  // Find items with /images/demo paths (doesn't exist on Vercel)
  const rows = await sql(`
    SELECT t.industry, c.key as ck, ci.slug, ci.data::text as d
    FROM collection_items ci
    JOIN collections c ON c.id = ci.collection_id
    JOIN tenants t ON t.id = ci.tenant_id
    WHERE t.is_demo = true AND ci.data::text LIKE '%/images/demo/%'
  `);
  console.log(`${rows.length} items with /images/demo/ paths`);
  
  // Also check for items with empty/no image
  const rows2 = await sql(`
    SELECT t.industry, c.key as ck, ci.slug, ci.data->>'image' as img
    FROM collection_items ci
    JOIN collections c ON c.id = ci.collection_id
    JOIN tenants t ON t.id = ci.tenant_id
    WHERE t.is_demo = true
    AND (ci.data->>'image' IS NULL OR ci.data->>'image' = '' OR ci.data->>'image' LIKE '/images/%')
  `);
  console.log(`\n${rows2.length} items with missing/local images:`);
  rows2.forEach(r => console.log(`  ${r.industry}/${r.ck}/${r.slug}: "${r.img || '<empty>'}"`));
}
main();

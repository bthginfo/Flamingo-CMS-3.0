import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  // Get 2 example items with their full section content
  const rows = await sql(`
    SELECT t.industry, c.key as ck, ci.slug, ci.data
    FROM collection_items ci
    JOIN collections c ON c.id = ci.collection_id
    JOIN tenants t ON t.id = ci.tenant_id
    WHERE t.is_demo = true AND ci.slug = 'badsanierung-altstadt-koeln'
    LIMIT 1
  `);
  console.log(JSON.stringify(rows[0].data, null, 2));
}
main();

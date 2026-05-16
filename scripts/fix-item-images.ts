import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

const IMAGE_REPLACEMENTS: Record<string, string> = {
  '/images/demo/bad-altstadt.webp': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
  '/images/demo/gaeste-wc-lindenthal.webp': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
  '/images/demo/heizung-rodenkirchen.webp': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80',
  '/images/demo/notdienst-ehrenfeld.webp': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&q=80',
};

async function main() {
  // Fix broken local images in tradesman/projects
  const rows = await sql(`
    SELECT ci.id, ci.data::text as d
    FROM collection_items ci
    JOIN tenants t ON t.id = ci.tenant_id
    WHERE t.is_demo = true AND ci.data::text LIKE '%/images/demo/%'
  `);

  for (const row of rows) {
    let updated = row.d as string;
    for (const [local, remote] of Object.entries(IMAGE_REPLACEMENTS)) {
      updated = updated.replaceAll(local, remote);
    }
    if (updated !== row.d) {
      await sql(`UPDATE collection_items SET data = $1::jsonb WHERE id = $2`, [updated, row.id]);
      console.log(`✅ Fixed image in item ${row.id}`);
    }
  }
  console.log('Done!');
}
main();

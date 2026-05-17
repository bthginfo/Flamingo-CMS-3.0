import { neon } from '@neondatabase/serverless';
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const sql = neon(DATABASE_URL);
async function main() {
  const rows = await sql`SELECT p.slug, p.title, COUNT(ps.id)::int as sections FROM pages p LEFT JOIN page_sections ps ON ps.page_id = p.id WHERE p.tenant_id = (SELECT id FROM tenants WHERE slug = 'demo-wedding') GROUP BY p.id ORDER BY p.sort_order`;
  rows.forEach(r => console.log(`${r.slug} | ${r.title} | ${r.sections} sections`));
  
  // Check snapshot content for location page
  const snaps = await sql`SELECT snapshot FROM published_snapshots WHERE tenant_id = (SELECT id FROM tenants WHERE slug = 'demo-wedding') AND is_active = true LIMIT 1`;
  if (snaps.length > 0) {
    const snap = typeof snaps[0].snapshot === 'string' ? JSON.parse(snaps[0].snapshot) : snaps[0].snapshot;
    const locPage = snap.pages?.find((p: any) => p.slug === 'location');
    if (locPage) {
      console.log(`\nLocation page sections: ${locPage.sections?.length}`);
      locPage.sections?.forEach((s: any) => console.log(`  ${s.type}: ${Object.keys(s.data || {}).join(', ')}`));
    } else {
      console.log('\nNo location page in snapshot!');
    }
  }
}
main();

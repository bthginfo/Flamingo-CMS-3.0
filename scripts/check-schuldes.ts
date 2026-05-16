import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const tenants = await sql`SELECT id, name, slug FROM tenants WHERE slug ILIKE '%schuldes%'`;
  console.log('Tenant:', JSON.stringify(tenants));
  const tid = tenants[0].id;

  const pages = await sql`SELECT id, title, slug, type, status, visible, sort_order FROM pages WHERE tenant_id = ${tid} ORDER BY sort_order`;
  console.log('\nPages:', JSON.stringify(pages, null, 2));

  for (const p of pages) {
    const sections = await sql`SELECT id, type, variant, title_internal, visible, anchor_id, sort_order, data FROM page_sections WHERE page_id = ${p.id} ORDER BY sort_order`;
    console.log(`\n--- ${p.slug} (${p.title}) sections:`);
    for (const s of sections) {
      console.log(`  [${s.sort_order}] ${s.type} (${s.id}) anchor=${s.anchor_id}`);
    }
  }
}

main().catch(console.error);

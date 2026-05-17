import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const T = 'ff2102e2-f07e-4d44-9046-12c55d78a60d';

async function main() {
  const pages = await sql`SELECT id, slug, title, visible FROM pages WHERE tenant_id = ${T}`;
  console.log('Pages:', JSON.stringify(pages, null, 2));

  for (const p of pages) {
    const secs = await sql`SELECT id, type, variant, sort_order, visible FROM page_sections WHERE page_id = ${p.id} ORDER BY sort_order`;
    console.log(`Sections for "${p.slug}" (${p.title}):`, JSON.stringify(secs));
  }

  const settings = await sql`SELECT brand, design FROM global_settings WHERE tenant_id = ${T}`;
  console.log('Settings:', settings.length > 0 ? 'exists' : 'MISSING');

  const tenant = await sql`SELECT id, name, industry, style FROM tenants WHERE id = ${T}`;
  console.log('Tenant:', JSON.stringify(tenant[0]));
}

main().catch(e => console.error(e));

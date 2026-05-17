import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const tid = 'ff2102e2-f07e-4d44-9046-12c55d78a60d';
  
  // Check tenant data
  const [tenant] = await sql`SELECT id, name, industry, active_style, status FROM tenants WHERE id = ${tid}`;
  console.log('Tenant:', JSON.stringify(tenant, null, 2));
  
  // Check global_settings
  const settings = await sql`SELECT brand, contact, social_links, design, opening_hours, form_fields FROM global_settings WHERE tenant_id = ${tid}`;
  console.log('\nSettings count:', settings.length);
  if (settings.length) {
    console.log('Brand:', JSON.stringify(settings[0].brand, null, 2));
    console.log('Design:', JSON.stringify(settings[0].design, null, 2));
  }
  
  // Check navigation 
  const nav = await sql`SELECT items, cta FROM navigation WHERE tenant_id = ${tid}`;
  console.log('\nNav count:', nav.length);
  
  // Check footer
  const footer = await sql`SELECT columns, legal_links, cta FROM footer WHERE tenant_id = ${tid}`;
  console.log('Footer count:', footer.length);
  
  // Check page_sections for startseite
  const [startseite] = await sql`SELECT id FROM pages WHERE tenant_id = ${tid} AND slug = 'startseite'`;
  if (startseite) {
    const sections = await sql`SELECT id, type, data, variant, visible, container, spacing_top, spacing_bottom, anchor_id, sort_order FROM page_sections WHERE page_id = ${startseite.id} ORDER BY sort_order`;
    console.log('\nStartseite sections in DB:', sections.length);
    for (const s of sections) {
      console.log(`  ${s.type}: visible=${s.visible}, container=${s.container}, spacing_top=${s.spacing_top}, spacing_bottom=${s.spacing_bottom}`);
    }
  }
  
  // Check SEO tables
  const seo = await sql`SELECT * FROM seo_settings WHERE tenant_id = ${tid}`;
  console.log('\nSEO settings:', seo.length);
  
  const pageSeo = await sql`SELECT * FROM page_seo WHERE tenant_id = ${tid}`;
  console.log('Page SEO:', pageSeo.length);
}

main().catch(console.error);

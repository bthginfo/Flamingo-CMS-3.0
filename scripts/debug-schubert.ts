import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const sql = neon(DATABASE_URL);

async function main() {
  const tid = 'ff2102e2-f07e-4d44-9046-12c55d78a60d';
  
  // Get active snapshot
  const [snap] = await sql`SELECT id, snapshot FROM published_snapshots WHERE tenant_id = ${tid} AND is_active = true`;
  if (!snap) { console.log('No active snapshot'); return; }
  
  const s = snap.snapshot as any;
  console.log('Tenant data:', JSON.stringify(s.tenant, null, 2));
  console.log('\nPages count:', s.pages?.length);
  for (const p of (s.pages || [])) {
    console.log(`  Page: "${p.slug}" (${p.title}) - ${p.sections?.length || 0} sections, visible: ${p.visible}`);
    for (const sec of (p.sections || [])) {
      console.log(`    Section: ${sec.type} (visible: ${sec.visible})`);
    }
  }
  console.log('\nCollections:', JSON.stringify(s.collections?.map((c: any) => ({ key: c.key, items: c.items?.length })), null, 2));

  // Check global settings
  const settings = await sql`SELECT brand, contact, design FROM global_settings WHERE tenant_id = ${tid}`;
  console.log('\nGlobal settings:', settings.length ? 'exists' : 'MISSING');

  // Check nav
  const nav = await sql`SELECT items, cta FROM navigation WHERE tenant_id = ${tid}`;
  console.log('Navigation:', nav.length ? 'exists' : 'MISSING');

  // Check footer  
  const footer = await sql`SELECT columns FROM footer WHERE tenant_id = ${tid}`;
  console.log('Footer:', footer.length ? 'exists' : 'MISSING');
}

main().catch(console.error);

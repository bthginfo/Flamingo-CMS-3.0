import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const sql = neon(DATABASE_URL);

async function main() {
  // Find tenant
  const tenants = await sql`SELECT id, name, slug FROM tenants WHERE name ILIKE '%schubert%'`;
  console.log('Tenants:', JSON.stringify(tenants, null, 2));
  if (!tenants.length) { console.log('No tenant found'); return; }

  const tid = tenants[0].id;

  // Check pages
  const pages = await sql`SELECT id, slug, title FROM pages WHERE tenant_id = ${tid}`;
  console.log('Pages:', JSON.stringify(pages, null, 2));

  // Fix slugs - strip leading slashes
  for (const p of pages) {
    if (p.slug && p.slug.startsWith('/')) {
      const fixed = p.slug.replace(/^\/+/, '');
      console.log(`Fixing slug: "${p.slug}" -> "${fixed}" (${p.title})`);
      await sql`UPDATE pages SET slug = ${fixed} WHERE id = ${p.id}`;
    }
  }

  // Check snapshots
  const snaps = await sql`SELECT id, is_active, created_at FROM published_snapshots WHERE tenant_id = ${tid} ORDER BY created_at DESC LIMIT 3`;
  console.log('Snapshots:', JSON.stringify(snaps, null, 2));

  // Fix snapshot page slugs too
  for (const snap of snaps) {
    const [full] = await sql`SELECT snapshot FROM published_snapshots WHERE id = ${snap.id}`;
    if (full?.snapshot?.pages) {
      let changed = false;
      for (const p of full.snapshot.pages) {
        if (p.slug && p.slug.startsWith('/')) {
          p.slug = p.slug.replace(/^\/+/, '');
          changed = true;
        }
      }
      if (changed) {
        console.log(`Fixing snapshot ${snap.id} slugs`);
        await sql`UPDATE published_snapshots SET snapshot = ${JSON.stringify(full.snapshot)}::jsonb WHERE id = ${snap.id}`;
      }
    }
  }

  console.log('Done!');
}

main().catch(console.error);

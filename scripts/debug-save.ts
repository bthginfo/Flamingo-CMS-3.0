import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  // Find the hero section on "leistungen" page
  const pages = await sql`SELECT id, title, slug FROM pages WHERE slug = 'leistungen'`;
  console.log('Pages:', JSON.stringify(pages));
  
  if (pages.length === 0) {
    console.log('No leistungen page found');
    return;
  }

  const pageId = pages[0].id;
  const sections = await sql`SELECT id, type, substring(data::text, 1, 150) as d, updated_at FROM page_sections WHERE page_id = ${pageId} ORDER BY sort_order`;
  console.log('\nSections on leistungen:');
  for (const s of sections) {
    console.log(`  ${s.type} (${s.id}) updated: ${s.updated_at}`);
    console.log(`    data: ${s.d}...`);
  }

  // Find hero section
  const hero = sections.find((s: any) => s.type === 'hero');
  if (!hero) {
    console.log('No hero section');
    return;
  }

  // Read full data
  const full = await sql`SELECT data FROM page_sections WHERE id = ${hero.id}`;
  const data = full[0].data as Record<string, unknown>;
  console.log('\nHero headline:', (data as any).headline);

  // Try updating it
  const testHeadline = 'TEST-UPDATE-' + Date.now();
  const newData = { ...data, headline: testHeadline };
  
  const result = await sql`UPDATE page_sections SET data = ${JSON.stringify(newData)}::jsonb, updated_at = NOW() WHERE id = ${hero.id} AND tenant_id = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2' RETURNING id`;
  console.log('\nUpdate result:', result);

  // Read back immediately
  const verify = await sql`SELECT data->>'headline' as headline, updated_at FROM page_sections WHERE id = ${hero.id}`;
  console.log('After update - headline:', verify[0].headline);
  console.log('After update - updated_at:', verify[0].updated_at);

  // Restore original
  await sql`UPDATE page_sections SET data = ${JSON.stringify(data)}::jsonb WHERE id = ${hero.id}`;
  console.log('\nRestored original headline:', (data as any).headline);
}

main().catch(console.error);

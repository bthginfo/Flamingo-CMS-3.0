import { requireDatabaseUrl } from './_database-url';
import { neon } from '@neondatabase/serverless';

const sql = neon(requireDatabaseUrl());

async function main() {
  const rows = await sql(`
    SELECT t.industry, t.name, ps.type, ps.data::text as data_text
    FROM page_sections ps
    JOIN tenants t ON t.id = ps.tenant_id
    WHERE t.is_demo = true
  `);

  const allImages: { industry: string; section: string; url: string }[] = [];

  for (const row of rows) {
    const matches = row.data_text.match(/https:\/\/images\.unsplash\.com[^"]+/g);
    if (matches) {
      for (const url of matches) {
        allImages.push({ industry: row.industry, section: row.type, url });
      }
    }
  }

  console.log(`Total image URLs found: ${allImages.length}\n`);

  // Check each image
  for (const img of allImages) {
    try {
      const res = await fetch(img.url, { method: 'HEAD', redirect: 'follow' });
      if (!res.ok) {
        console.log(`❌ ${res.status} | ${img.industry} / ${img.section}`);
        console.log(`   ${img.url.substring(0, 120)}`);
      }
    } catch (e: unknown) {
      console.log(`❌ FAIL | ${img.industry} / ${img.section}`);
      console.log(`   ${img.url.substring(0, 120)}`);
    }
  }
  console.log('\nDone checking images.');
}

main();

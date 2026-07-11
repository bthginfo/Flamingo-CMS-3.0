import { requireDatabaseUrl } from './_database-url';
import { neon } from '@neondatabase/serverless';

const sql = neon(requireDatabaseUrl());

/**
 * The previous fix replaced broken images with generic alternatives.
 * This script fixes content mismatches where the same generic image
 * was used across different industries:
 * 
 * - Tourism sections should show mountains/nature, not luxury hotels
 * - Medical team should show medical professionals, not salon workers
 */

async function main() {
  // Fix tourism sections: replace hotel exterior with mountain landscape
  // photo-1566073771259-6a8506099945 = luxury hotel with pool → not right for Ötztal mountain tourism
  const tourismRows = await sql(`
    SELECT ps.id, ps.data::text as data_text
    FROM page_sections ps
    JOIN tenants t ON t.id = ps.tenant_id
    WHERE t.is_demo = true AND t.industry = 'tourism'
    AND ps.data::text LIKE '%1566073771259%'
  `);
  
  for (const row of tourismRows) {
    // Replace with alpine mountain lake photo
    const updated = row.data_text.replaceAll('photo-1566073771259-6a8506099945', 'photo-1506905925346-21bda4d32df4');
    await sql(`UPDATE page_sections SET data = $1::jsonb WHERE id = $2`, [updated, row.id]);
    console.log(`  ✅ Tourism: fixed ${row.id} → mountain landscape`);
  }

  // Fix medical team: replace salon/beauty image with medical professional
  // photo-1560066984-138dadb4c035 = salon workspace → not right for medical team
  const medicalRows = await sql(`
    SELECT ps.id, ps.data::text as data_text
    FROM page_sections ps
    JOIN tenants t ON t.id = ps.tenant_id
    WHERE t.is_demo = true AND t.industry = 'medical'
    AND ps.data::text LIKE '%1560066984%'
  `);
  
  for (const row of medicalRows) {
    // Replace with medical professional/doctor image
    const updated = row.data_text.replaceAll('photo-1560066984-138dadb4c035', 'photo-1559839734-2b71ea197ec2');
    await sql(`UPDATE page_sections SET data = $1::jsonb WHERE id = $2`, [updated, row.id]);
    console.log(`  ✅ Medical: fixed ${row.id} → medical professional`);
  }

  console.log('\nDone! Content-appropriate images applied.');
}

main();

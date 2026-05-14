import { neon } from '@neondatabase/serverless';

const DB_URL = 'postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DB_URL);

async function main() {
  console.log('=== Step 1: Read hero of leistungen page ===');
  const hero = await sql`
    SELECT ps.id, ps.data->>'headline' as headline, ps.updated_at, ps.tenant_id
    FROM page_sections ps
    JOIN pages p ON ps.page_id = p.id
    WHERE p.slug = 'leistungen' AND ps.type = 'hero'
  `;
  console.log('Current hero:', JSON.stringify(hero[0], null, 2));

  const sectionId = hero[0].id;
  const tenantId = hero[0].tenant_id;
  const originalHeadline = hero[0].headline;

  console.log('\n=== Step 2: Update headline to TEST value ===');
  const fullData = await sql`SELECT data FROM page_sections WHERE id = ${sectionId}`;
  const data = fullData[0].data as Record<string, unknown>;
  const testValue = 'TEST-HEADLINE-' + Date.now();
  const newData = { ...data, headline: testValue };

  // Simulate what Drizzle does: UPDATE ... SET data = $1 WHERE id = $2 AND tenant_id = $3
  const updateResult = await sql`
    UPDATE page_sections 
    SET data = ${JSON.stringify(newData)}::jsonb, updated_at = NOW() 
    WHERE id = ${sectionId} AND tenant_id = ${tenantId}
    RETURNING id
  `;
  console.log('Update returned:', updateResult.length, 'rows');

  console.log('\n=== Step 3: Immediate re-read (same connection) ===');
  const reread1 = await sql`SELECT data->>'headline' as headline, updated_at FROM page_sections WHERE id = ${sectionId}`;
  console.log('Re-read headline:', reread1[0].headline);
  console.log('Re-read updated_at:', reread1[0].updated_at);

  console.log('\n=== Step 4: Read via NEW neon connection ===');
  const sql2 = neon(DB_URL);
  const reread2 = await sql2`SELECT data->>'headline' as headline, updated_at FROM page_sections WHERE id = ${sectionId}`;
  console.log('New connection headline:', reread2[0].headline);

  console.log('\n=== Step 5: Check published snapshot ===');
  const snap = await sql`
    SELECT id, version, created_at, 
           substring(snapshot::text, 1, 200) as snap_preview
    FROM published_snapshots 
    WHERE tenant_id = ${tenantId} AND is_active = true
  `;
  if (snap.length > 0) {
    console.log('Active snapshot version:', snap[0].version, 'created:', snap[0].created_at);
    
    // Check if the snapshot has the OLD or NEW headline
    const snapFull = await sql`SELECT snapshot FROM published_snapshots WHERE id = ${snap[0].id}`;
    const snapshot = snapFull[0].snapshot as any;
    const leistungenPage = snapshot.pages?.find((p: any) => p.slug === 'leistungen');
    if (leistungenPage) {
      const heroSection = leistungenPage.sections?.find((s: any) => s.type === 'hero');
      console.log('Snapshot hero headline:', heroSection?.data?.headline);
      console.log('Snapshot created AFTER our update?', new Date(snap[0].created_at) > new Date(hero[0].updated_at));
    }
  } else {
    console.log('NO active snapshot found!');
  }

  console.log('\n=== Step 6: Restore original headline ===');
  await sql`UPDATE page_sections SET data = ${JSON.stringify(data)}::jsonb WHERE id = ${sectionId}`;
  console.log('Restored to:', originalHeadline);

  console.log('\n=== CONCLUSION ===');
  console.log('If Step 3 and 4 show the TEST value, DB writes work fine.');
  console.log('If Snapshot headline is OLD, it means the publish reads stale data.');
  console.log('The renderer reads from the SNAPSHOT, not from page_sections directly!');
}

main().catch(console.error);

import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');

// Replacement map: broken photo ID → working replacement
const REPLACEMENTS: Record<string, string> = {
  // photo-1540555700478-4be289fbec6d was a luxury hotel/mountain image → replace with similar
  'photo-1540555700478-4be289fbec6d': 'photo-1566073771259-6a8506099945', // luxury hotel exterior
  // photo-1595959183082-7b570b7e1e2b was a salon/beauty portrait → replace
  'photo-1595959183082-7b570b7e1e2b': 'photo-1560066984-138dadb4c035', // salon/beauty workspace
  // photo-1431540015159-0f9641f13f06 was event space → replace
  'photo-1431540015159-0f9641f13f06': 'photo-1519167758481-83f550bb49b3', // elegant event space/ballroom
};

async function main() {
  // Find all affected sections
  const rows = await sql(`
    SELECT ps.id, ps.data::text as data_text
    FROM page_sections ps
    JOIN tenants t ON t.id = ps.tenant_id
    WHERE t.is_demo = true
    AND (ps.data::text LIKE '%1540555700478%' OR ps.data::text LIKE '%1595959183082%' OR ps.data::text LIKE '%1431540015159%')
  `);

  console.log(`Found ${rows.length} sections with broken images`);

  for (const row of rows) {
    let updated = row.data_text;
    for (const [oldId, newId] of Object.entries(REPLACEMENTS)) {
      updated = updated.replaceAll(oldId, newId);
    }
    if (updated !== row.data_text) {
      await sql(`UPDATE page_sections SET data = $1::jsonb WHERE id = $2`, [updated, row.id]);
      console.log(`  ✅ Fixed section ${row.id}`);
    }
  }
  console.log('Done!');
}

main();

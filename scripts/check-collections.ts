import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
(async () => {
  const r = await sql`SELECT ci.slug, ci.title, ci.data 
    FROM collection_items ci 
    JOIN collections c ON ci.collection_id = c.id 
    WHERE c.tenant_id = 'ff2102e2-f07e-4d44-9046-12c55d78a60d' 
    ORDER BY ci.priority LIMIT 2`;
  r.forEach(i => console.log('---', i.slug, '\nDATA:', JSON.stringify(i.data, null, 2)));
  process.exit(0);
})();

import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
(async () => {
  const rows = await sql`SELECT ps.type, ps.data, ps.variant, p.slug, t.name as tenant
    FROM page_sections ps
    JOIN pages p ON ps.page_id = p.id
    JOIN tenants t ON p.tenant_id = t.id
    WHERE ps.type = 'servicesGrid'
    LIMIT 5`;
  rows.forEach(r => console.log('---', r.tenant, '|', r.slug, '| variant:', r.variant, '\nDATA:', JSON.stringify(r.data, null, 2)));
  process.exit(0);
})();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const rows = await sql`SELECT t.slug, t.industry, ps.type, ps.data FROM tenants t JOIN pages p ON p.tenant_id = t.id JOIN page_sections ps ON ps.page_id = p.id WHERE t.industry = 'realestate' AND (p.slug = 'home' OR p.slug = '' OR p.slug = 'startseite') ORDER BY ps.sort_order LIMIT 3`;
  for (const r of rows) {
    const data = r.data as any;
    console.log(r.slug, r.industry, '->', r.type, '| bgImage:', !!data?.bgImage, '| bgMode:', data?.bgMode);
  }
}
main();

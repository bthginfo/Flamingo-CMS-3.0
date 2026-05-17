import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  // Find showcase tenant
  const [t] = await sql`SELECT id FROM tenants WHERE slug = 'demo-showcase'`;
  if (!t) { console.log('No showcase tenant'); return; }
  
  // Clear nav items
  await sql`UPDATE navigation SET items = '[]'::jsonb, cta = '{}'::jsonb WHERE tenant_id = ${t.id}`;
  console.log('Cleared showcase nav items');
  
  // Clear footer columns
  await sql`UPDATE footer SET columns = '[]'::jsonb WHERE tenant_id = ${t.id}`;
  console.log('Cleared showcase footer columns');
  
  console.log('Done');
}

main().catch(console.error);

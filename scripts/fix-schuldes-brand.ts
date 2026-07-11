import { requireDatabaseUrl } from './_database-url';
import { neon } from '@neondatabase/serverless';
const sql = neon(requireDatabaseUrl());
const tid = '51e6afea-86f7-4363-b341-95620d462a43';

async function main() {
  const r = await sql`SELECT brand FROM global_settings WHERE tenant_id = ${tid}`;
  const brand = r[0]?.brand as Record<string, unknown>;
  brand.tagline = 'Ihr Experte für Wasserschadenbeseitigung in Ingolstadt – seit über 30 Jahren.';
  await sql`UPDATE global_settings SET brand = ${JSON.stringify(brand)}::jsonb WHERE tenant_id = ${tid}`;
  console.log('✅ Brand tagline updated');
}
main().catch(console.error);

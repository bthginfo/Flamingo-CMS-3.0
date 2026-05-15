/**
 * Mark the existing mueller-soehne tenant as isDemo=true
 * Usage: npx tsx scripts/mark-handwerk-demo.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  const [updated] = await db
    .update(schema.tenants)
    .set({ isDemo: true })
    .where(eq(schema.tenants.slug, 'mueller-soehne'))
    .returning({ id: schema.tenants.id, name: schema.tenants.name });

  if (updated) {
    console.log(`✅ Marked "${updated.name}" (${updated.id}) as isDemo=true`);
  } else {
    console.error('❌ Tenant "mueller-soehne" not found');
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { tenantDomains, tenants } from '../packages/db/src/schema/index';
import { like, eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  // Find schuldes tenant
  const [tenant] = await db.select().from(tenants).where(like(tenants.slug, '%schuldes%'));
  if (!tenant) { console.log('No schuldes tenant found'); return; }
  console.log('Tenant:', tenant.id, tenant.slug);

  // Show current domains
  const domains = await db.select().from(tenantDomains).where(eq(tenantDomains.tenantId, tenant.id));
  console.log('Current domains:', domains.map(d => d.domain));

  // Delete the flamingomedia.online subdomain
  for (const d of domains) {
    if (d.domain.includes('flamingomedia.online')) {
      await db.delete(tenantDomains).where(eq(tenantDomains.id, d.id));
      console.log('Deleted:', d.domain);
    }
  }

  // Ensure vercel.app domain exists
  const vercelDomain = `flamingo-${tenant.slug}.vercel.app`;
  const hasVercel = domains.some(d => d.domain === vercelDomain);
  if (!hasVercel) {
    await db.insert(tenantDomains).values({
      tenantId: tenant.id,
      domain: vercelDomain,
      type: 'preview',
      verified: true,
    });
    console.log('Added:', vercelDomain);
  }

  // Show final
  const final = await db.select().from(tenantDomains).where(eq(tenantDomains.tenantId, tenant.id));
  console.log('Final domains:', final.map(d => d.domain));
}

main().then(() => process.exit(0));

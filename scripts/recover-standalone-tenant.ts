import { createHash } from 'node:crypto';
import { hashPassword } from '@flamingo/auth';
import {
  adminSecrets,
  createDb,
  tenantApiTokens,
  tenantDomains,
  tenants,
  type Industry,
} from '@flamingo/db';
import { and, eq } from 'drizzle-orm';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function main() {
  const databaseUrl = required('DATABASE_URL');
  const tenantId = required('RECOVERY_TENANT_ID');
  const slug = required('RECOVERY_SLUG');
  const name = required('RECOVERY_NAME');
  const password = required('RECOVERY_ADMIN_PASSWORD');
  const pat = required('RECOVERY_PAT');
  const projectId = process.env.RECOVERY_VERCEL_PROJECT_ID?.trim() || null;
  const industry = (process.env.RECOVERY_INDUSTRY?.trim() || 'medical') as Industry;
  const domains = (process.env.RECOVERY_DOMAINS || '')
    .split(',')
    .map(domain => domain.trim().toLowerCase())
    .filter(Boolean);

  if (!pat.startsWith('flm_pat_')) throw new Error('RECOVERY_PAT must start with flm_pat_');

  const db = createDb(databaseUrl);
  const now = new Date();
  const passwordHash = await hashPassword(password);
  const tokenHash = createHash('sha256').update(pat).digest('hex');

  await db.insert(tenants).values({
    id: tenantId,
    name,
    slug,
    industry,
    activeStyle: 'classic',
    status: 'active',
    deploymentMode: 'standalone',
    vercelProjectId: projectId,
    i18nEnabled: true,
    i18nMaxLanguages: 3,
    i18nDefaultLocale: 'de',
    i18nLocales: 'de,en,es',
    updatedAt: now,
  }).onConflictDoUpdate({
    target: tenants.slug,
    set: {
      name,
      industry,
      status: 'active',
      deploymentMode: 'standalone',
      vercelProjectId: projectId,
      i18nEnabled: true,
      i18nMaxLanguages: 3,
      i18nDefaultLocale: 'de',
      i18nLocales: 'de,en,es',
      updatedAt: now,
    },
  });

  await db.insert(adminSecrets).values({ tenantId, passwordHash }).onConflictDoUpdate({
    target: adminSecrets.tenantId,
    set: { passwordHash, passwordUpdatedAt: now, updatedAt: now },
  });

  for (const [index, domain] of domains.entries()) {
    await db.insert(tenantDomains).values({
      tenantId,
      domain,
      type: index === 0 ? 'primary' : 'alias',
      verified: true,
    }).onConflictDoUpdate({
      target: tenantDomains.domain,
      set: { tenantId, type: index === 0 ? 'primary' : 'alias', verified: true, updatedAt: now },
    });
  }

  await db.delete(tenantApiTokens).where(and(
    eq(tenantApiTokens.tenantId, tenantId),
    eq(tenantApiTokens.label, 'Standalone recovery content token'),
  ));
  await db.insert(tenantApiTokens).values({
    tenantId,
    tokenHash,
    label: 'Standalone recovery content token',
  });

  console.log(`Recovered standalone tenant shell: ${slug}`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { hashPassword } from '../../packages/auth/src/index';
import { createDb, migrateDatabase, grantRuntimeDatabasePrivileges, tenants, adminSecrets, tenantDomains, tenantApiTokens } from '../../packages/db/src/index';

const requireDb = createRequire(new URL('../../packages/db/package.json', import.meta.url));
const { eq } = requireDb('drizzle-orm');

const tenantId = 'a1853e0f-ff90-45ee-8fb2-8bada3812f67';
const hostname = 'flamingo-hagn-partner.vercel.app';

function required(key: string) {
  const value = process.env[key]?.trim();
  assert.ok(value, `${key} is required`);
  return value;
}

async function main() {
  const ownerUri = required('DATABASE_URL');
  const uri = new URL(ownerUri);
  // This command cannot open the shared Flamingo database or another tenant.
  assert.equal(uri.hostname, 'ep-patient-moon-b9x888e5.c-7.eu-central-1.aws.neon.tech');
  assert.equal(uri.username, 'flamingo_owner');
  assert.equal(uri.pathname, '/flamingo');
  const password = required('HAGN_ADMIN_PASSWORD');
  const pat = required('HAGN_PAT');
  const runtimeRole = required('HAGN_RUNTIME_ROLE');
  assert.match(runtimeRole, /^flamingo_app_[a-f0-9]{8,16}$/);
  assert.match(pat, /^flm_pat_[a-f0-9]{64}$/);

  await migrateDatabase(ownerUri);
  await grantRuntimeDatabasePrivileges(ownerUri, runtimeRole);
  const db = createDb(ownerUri);
  const existing = await db.select({ id: tenants.id, slug: tenants.slug }).from(tenants);
  assert.ok(existing.every(row => row.id === tenantId && row.slug === 'hagn-partner'), 'Unexpected tenant in isolated database');
  const shell = {
    id: tenantId,
    name: 'Hagn, Deckert, Stemmer & Partner PartG mbB',
    slug: 'hagn-partner',
    industry: 'consulting' as const,
    activeStyle: 'classic',
    status: 'active' as const,
    deploymentMode: 'standalone' as const,
    vercelProjectId: process.env.HAGN_VERCEL_PROJECT_ID || null,
    isDemo: false,
    isLead: false,
    i18nEnabled: false,
    i18nMaxLanguages: 1,
    i18nDefaultLocale: 'de',
    i18nLocales: 'de',
  };
  await db.insert(tenants).values(shell).onConflictDoUpdate({ target: tenants.id, set: { vercelProjectId: shell.vercelProjectId, updatedAt: new Date() } });
  // A retry keeps the existing administrator password and API token intact.
  await db.insert(adminSecrets).values({ tenantId, passwordHash: await hashPassword(password) }).onConflictDoNothing({ target: adminSecrets.tenantId });
  await db.insert(tenantDomains).values({ tenantId, domain: hostname, type: 'primary', verified: true }).onConflictDoNothing({ target: tenantDomains.domain });
  const oldToken = await db.select({ id: tenantApiTokens.id }).from(tenantApiTokens).where(eq(tenantApiTokens.tenantId, tenantId)).limit(1);
  if (!oldToken.length) await db.insert(tenantApiTokens).values({ tenantId, tokenHash: createHash('sha256').update(pat).digest('hex'), label: 'Hagn standalone content API' });
  console.log(JSON.stringify({ bootstrapped: true, tenantId, slug: shell.slug, ownDatabaseOnly: true, runtimeRole, languages: ['de'] }));
}

main().catch(() => { console.error('Hagn bootstrap failed; connection and SQL details omitted.'); process.exitCode = 1; });

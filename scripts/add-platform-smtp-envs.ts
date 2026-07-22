/**
 * Backfills safe renderer runtime environment variables to all standalone tenant Vercel projects.
 *
 * Usage: npx tsx scripts/add-platform-smtp-envs.ts
 *
 * Requires:
 *   VERCEL_TOKEN - Vercel API token
 *   DATABASE_URL - shared CRM DB connection string
 *
 * Optional source vars:
 *   PLATFORM_SMTP_* or SMTP_* - platform fallback mail transport
 *   REVALIDATE_SECRET, CRON_SECRET, DEMO_IG_FALLBACK_SLUG
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { tenants } from '@flamingo/db';
import { isNotNull } from 'drizzle-orm';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const DATABASE_URL = process.env.DATABASE_URL;
const TARGETS = ['production', 'preview'];

if (!VERCEL_TOKEN) { console.error('Missing VERCEL_TOKEN'); process.exit(1); }
if (!DATABASE_URL) { console.error('Missing DATABASE_URL'); process.exit(1); }

type EnvVar = {
  key: string;
  value: string;
  type: 'encrypted' | 'plain';
};

function tenantProjectUrl(slug: string) {
  return `https://flamingo-${slug}.vercel.app`;
}

function optionalEnv(key: string, value: string | undefined, type: EnvVar['type'] = 'encrypted'): EnvVar[] {
  if (!value || value.startsWith('__PLACEHOLDER')) return [];
  return [{ key, value, type }];
}

function buildPlatformSmtpEnvVars(): EnvVar[] {
  const host = process.env.PLATFORM_SMTP_HOST || process.env.SMTP_HOST;
  const port = process.env.PLATFORM_SMTP_PORT || process.env.SMTP_PORT || '587';
  const user = process.env.PLATFORM_SMTP_USER || process.env.SMTP_USER;
  const pass = process.env.PLATFORM_SMTP_PASS || process.env.SMTP_PASS;
  const from = process.env.PLATFORM_SMTP_FROM || process.env.SMTP_FROM || user;
  if (!host || !user || !pass || !from) return [];
  return [
    { key: 'PLATFORM_SMTP_HOST', value: host, type: 'encrypted' },
    { key: 'PLATFORM_SMTP_PORT', value: port, type: 'encrypted' },
    { key: 'PLATFORM_SMTP_USER', value: user, type: 'encrypted' },
    { key: 'PLATFORM_SMTP_PASS', value: pass, type: 'encrypted' },
    { key: 'PLATFORM_SMTP_FROM', value: from, type: 'encrypted' },
  ];
}

function buildGlobalRuntimeEnvVars(): EnvVar[] {
  return [
    ...optionalEnv('REVALIDATE_SECRET', process.env.REVALIDATE_SECRET),
    ...optionalEnv('CRON_SECRET', process.env.CRON_SECRET),
    ...optionalEnv('DEMO_IG_FALLBACK_SLUG', process.env.DEMO_IG_FALLBACK_SLUG, 'plain'),
    ...buildPlatformSmtpEnvVars(),
  ];
}

function teamParam() {
  return process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : '';
}

async function vercelFetch(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`https://api.vercel.com${path}${teamParam()}`, {
    method,
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const responseBody = await res.text();
    throw new Error(`${method} ${path}: ${res.status} ${responseBody}`);
  }
  return res.json();
}

async function upsertEnvVar(projectId: string, existingByKey: Map<string, { id: string }>, env: EnvVar) {
  const existing = existingByKey.get(env.key);
  const payload = {
    value: env.value,
    type: env.type,
    target: TARGETS,
  };
  if (existing) {
    await vercelFetch(`/v9/projects/${projectId}/env/${existing.id}`, 'PATCH', payload);
    return 'updated';
  }
  await vercelFetch(`/v10/projects/${projectId}/env`, 'POST', [{
    key: env.key,
    ...payload,
  }]);
  return 'added';
}

async function main() {
  const sql = neon(DATABASE_URL!);
  const db = drizzle(sql);
  const globalRuntimeEnvVars = buildGlobalRuntimeEnvVars();
  const smtpConfigured = globalRuntimeEnvVars.some(env => env.key === 'PLATFORM_SMTP_PASS');

  const allTenants = await db.select({ id: tenants.id, slug: tenants.slug, vercelProjectId: tenants.vercelProjectId })
    .from(tenants)
    .where(isNotNull(tenants.vercelProjectId));

  console.log(`Found ${allTenants.length} tenants with Vercel projects\n`);
  if (!smtpConfigured) {
    console.log('Platform SMTP source envs are incomplete. SMTP backfill will be skipped.');
  }

  for (const tenant of allTenants) {
    console.log(`→ ${tenant.slug} (${tenant.vercelProjectId})`);
    const envsData = await vercelFetch(`/v9/projects/${tenant.vercelProjectId}/env`) as { envs?: Array<{ id: string; key: string }> };
    const existingByKey = new Map((envsData.envs || []).map(env => [env.key, { id: env.id }]));
    const tenantEnvVars: EnvVar[] = [
      { key: 'SITE_URL', value: tenantProjectUrl(tenant.slug), type: 'plain' },
      ...globalRuntimeEnvVars,
    ];

    for (const env of tenantEnvVars) {
      try {
        const result = await upsertEnvVar(tenant.vercelProjectId!, existingByKey, env);
        console.log(`  ${env.key}: ${result}`);
      } catch (error) {
        console.error(`  ${env.key}: ERROR - ${(error as Error).message}`);
      }
    }
    console.log();
  }

  console.log('Done! Redeploy tenant projects to pick up changed env vars.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

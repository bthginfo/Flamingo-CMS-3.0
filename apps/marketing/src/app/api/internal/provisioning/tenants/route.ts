import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { createDb, migrateDatabase, publishedSnapshots, tenants } from '@flamingo/db';
import { BCRYPT_MAX_PASSWORD_BYTES, isPasswordWithinBcryptLimit } from '@flamingo/auth';
import { getDb } from '@/lib/db';
import { findNeonTenantProject, findNeonTenantProjectByConnectionUri } from '@/lib/neon';
import { provisionTenant, type ProvisionInput } from '@/lib/provisioning';
import { getRequiredStandaloneDatabase, getTenantDatabaseRecord, markTenantDatabaseActive, registerTenantDatabase, removeTenantDatabaseRecord } from '@/lib/tenant-data-db';
import { verifyStandaloneTargetReady, verifyTenantDataCopy } from '@/lib/tenant-data-migration';
import { setStandaloneDatabaseConnection } from '@/lib/vercel';
import { acquireTenantOperation, completeTenantOperation, createTenantOperationFingerprint, failTenantOperation, heartbeatTenantOperation } from '@/lib/tenant-operation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function tokenFromRequest(request: NextRequest) {
  const auth = request.headers.get('authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return request.headers.get('x-provision-token')?.trim() || '';
}

function isAuthorized(request: NextRequest) {
  const expected = process.env.VERCEL_PROVISION_TOKEN?.trim();
  const actual = tokenFromRequest(request);
  if (!expected || !actual) return false;
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

function normalizeProvisionInput(value: unknown): ProvisionInput {
  const input = value as Partial<ProvisionInput> | null;
  if (!input || typeof input !== 'object') throw new Error('Ungültiger Request.');
  const required: Array<keyof ProvisionInput> = ['name', 'slug', 'industry', 'password', 'companyName'];
  for (const key of required) {
    if (typeof input[key] !== 'string' || !input[key]?.trim()) throw new Error(`${key} fehlt.`);
  }
  if (!/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(input.slug!)) throw new Error('slug ist ungültig.');
  const password = input.password!.trim();
  if (password.length < 12) throw new Error('password ist zu kurz.');
  if (!isPasswordWithinBcryptLimit(password)) throw new Error(`password ist zu lang. Maximal ${BCRYPT_MAX_PASSWORD_BYTES} UTF-8-Bytes sind erlaubt.`);
  return {
    name: input.name!.trim(),
    slug: input.slug!.trim().toLowerCase(),
    industry: input.industry as ProvisionInput['industry'],
    domain: input.domain?.trim() || undefined,
    password,
    companyName: input.companyName!.trim(),
    tagline: input.tagline?.trim() || undefined,
    primaryColor: input.primaryColor?.trim() || undefined,
    secondaryColor: input.secondaryColor?.trim() || undefined,
    accentColor: input.accentColor?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    email: input.email?.trim() || undefined,
    address: input.address?.trim() || undefined,
    deploymentMode: input.deploymentMode || 'standalone',
  };
}

function databaseRoleName(databaseUrl: string, fallback: string) {
  try {
    const role = decodeURIComponent(new URL(databaseUrl).username || '').trim();
    if (/^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/.test(role)) return role;
  } catch {
    // handled by caller's URL validation
  }
  return fallback;
}

function externalNeonConnection(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);
    const hostname = url.hostname.toLowerCase();
    if (!hostname.endsWith('.neon.tech')) return null;
    const endpointId = (hostname.split('.')[0] || '').replace(/-pooler$/, '');
    if (!endpointId.startsWith('ep-')) return null;
    const databaseName = decodeURIComponent(url.pathname.replace(/^\/+/, '').trim()) || 'neondb';
    const roleName = databaseRoleName(databaseUrl, 'external_runtime');
    return {
      projectId: `external:${endpointId}`,
      region: hostname.replace(/^[^.]+\./, '') || null,
      databaseName,
      roleName,
      pooledConnectionUri: databaseUrl,
      directConnectionUri: databaseUrl,
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return json(401, { success: false, error: 'Unauthorized' });
  try {
    const input = normalizeProvisionInput(await request.json());
    const result = await provisionTenant(input);
    return json(200, { success: true, ...result });
  } catch (error) {
    return json(500, { success: false, error: error instanceof Error ? error.message : 'Provisioning failed' });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) return json(401, { success: false, error: 'Unauthorized' });
  try {
    const body = await request.json() as { tenants?: Array<{ slug?: string; databaseUrl?: string }>; slug?: string; databaseUrl?: string };
    const repairs = Array.isArray(body.tenants) ? body.tenants : [{ slug: body.slug, databaseUrl: body.databaseUrl }];
    const db = getDb();
    const results: Array<Record<string, unknown>> = [];

    for (const repair of repairs) {
      const slug = repair.slug?.trim().toLowerCase();
      const databaseUrl = repair.databaseUrl?.trim();
      if (!slug || !databaseUrl?.startsWith('postgres')) {
        results.push({ slug: slug || null, success: false, error: 'slug oder databaseUrl ungültig.' });
        continue;
      }

      const [tenant] = await db.select({
        id: tenants.id,
        slug: tenants.slug,
        deploymentMode: tenants.deploymentMode,
        status: tenants.status,
        vercelProjectId: tenants.vercelProjectId,
      }).from(tenants).where(eq(tenants.slug, slug)).limit(1);
      if (!tenant || tenant.deploymentMode !== 'standalone') {
        results.push({ slug, success: false, error: 'Standalone-Tenant nicht gefunden.' });
        continue;
      }

      // During a quota recovery or database rotation, the slug can still match
      // the retired Neon project. The supplied runtime URL is the authoritative
      // cutover target and therefore must be resolved first.
      const neonProject = await findNeonTenantProjectByConnectionUri(databaseUrl)
        || await findNeonTenantProject(slug)
        || externalNeonConnection(databaseUrl);
      if (!neonProject) {
        results.push({ slug, success: false, error: 'Neon-Projekt nicht gefunden.' });
        continue;
      }

      const operationKey = `repair-standalone-registry:${tenant.id}`;
      const claim = await acquireTenantOperation({
        operationKey,
        kind: 'repair_standalone_registry',
        tenantId: tenant.id,
        slug,
        inputFingerprint: createTenantOperationFingerprint({ tenantId: tenant.id, databaseUrl }),
      });
      if (claim.state === 'completed') {
        results.push({ slug, success: true, ...claim.result });
        continue;
      }
      if (claim.state === 'in_progress') {
        results.push({ slug, success: false, error: `Registry-Reparatur läuft bereits (${claim.phase}).` });
        continue;
      }

      let oldStandalone: Awaited<ReturnType<typeof getRequiredStandaloneDatabase>> | null = null;
      let deploymentSwitched = false;
      let registrySwitched = false;
      try {
        const oldRecord = await getTenantDatabaseRecord(tenant.id);
        if (oldRecord) oldStandalone = await getRequiredStandaloneDatabase(tenant.id);
        if (oldStandalone && oldRecord?.status === 'active' && (
          oldRecord.projectId === neonProject.projectId
          || oldStandalone.pooledConnectionUri === databaseUrl
        )) {
          await verifyStandaloneTargetReady(oldStandalone.db, tenant.id);
          const result = { projectId: oldRecord.projectId, external: oldRecord.projectId.startsWith('external:'), recoveredAfterInterruptedResponse: true };
          await completeTenantOperation({ operationKey, ownerToken: claim.ownerToken, result });
          results.push({ slug, success: true, ...result });
          continue;
        }
        const sourceDb = oldStandalone?.db || db;
        const targetDb = createDb(databaseUrl);
        const [retainedSourceSnapshot] = oldStandalone ? [] : await db.select({ id: publishedSnapshots.id })
          .from(publishedSnapshots).where(eq(publishedSnapshots.tenantId, tenant.id)).limit(1);
        const canCompareSource = Boolean(oldStandalone || retainedSourceSnapshot);
        await db.update(tenants).set({ status: 'provisioning', updatedAt: new Date() }).where(eq(tenants.id, tenant.id));
        if (oldStandalone) {
          await oldStandalone.db.update(tenants).set({ status: 'provisioning', updatedAt: new Date() }).where(eq(tenants.id, tenant.id));
        }
        await heartbeatTenantOperation({ operationKey, ownerToken: claim.ownerToken, phase: 'writes_quiesced', tenantId: tenant.id });
        await migrateDatabase(neonProject.directConnectionUri);
        if (canCompareSource) await verifyTenantDataCopy(sourceDb, targetDb, tenant.id);
        else await verifyStandaloneTargetReady(targetDb, tenant.id);
        await targetDb.update(tenants).set({ status: 'active', deploymentMode: 'standalone', vercelProjectId: tenant.vercelProjectId, updatedAt: new Date() })
          .where(eq(tenants.id, tenant.id));

        if (tenant.vercelProjectId) {
          await setStandaloneDatabaseConnection(tenant.vercelProjectId, slug, tenant.id, databaseUrl);
          deploymentSwitched = true;
        }
        await heartbeatTenantOperation({ operationKey, ownerToken: claim.ownerToken, phase: 'deployment_ready', tenantId: tenant.id });
        if (canCompareSource) await verifyTenantDataCopy(sourceDb, targetDb, tenant.id);
        else await verifyStandaloneTargetReady(targetDb, tenant.id);
        await registerTenantDatabase({
          tenantId: tenant.id,
          projectId: neonProject.projectId,
          region: neonProject.region,
          databaseName: neonProject.databaseName,
          roleName: databaseRoleName(databaseUrl, neonProject.roleName),
          pooledConnectionUri: databaseUrl,
          directConnectionUri: neonProject.directConnectionUri,
        });
        registrySwitched = true;
        await markTenantDatabaseActive(tenant.id);
        await db.update(tenants).set({ status: 'active', updatedAt: new Date() }).where(eq(tenants.id, tenant.id));
        // The retired database remains provisioning so stale immutable
        // deployments cannot write after the verified cutover.
        const result = { projectId: neonProject.projectId, external: neonProject.projectId.startsWith('external:') };
        await completeTenantOperation({ operationKey, ownerToken: claim.ownerToken, result });
        results.push({ slug, success: true, ...result });
      } catch (error) {
        if (deploymentSwitched && tenant.vercelProjectId && oldStandalone) {
          await setStandaloneDatabaseConnection(tenant.vercelProjectId, slug, tenant.id, oldStandalone.pooledConnectionUri).catch(() => undefined);
        }
        if (registrySwitched) {
          if (oldStandalone) {
            await registerTenantDatabase({
              tenantId: tenant.id,
              projectId: oldStandalone.record.projectId,
              region: oldStandalone.record.region,
              databaseName: oldStandalone.record.databaseName,
              roleName: oldStandalone.record.roleName,
              pooledConnectionUri: oldStandalone.pooledConnectionUri,
              directConnectionUri: oldStandalone.directConnectionUri,
            }).then(() => markTenantDatabaseActive(tenant.id, oldStandalone!.record.schemaVersion)).catch(() => undefined);
          } else {
            await removeTenantDatabaseRecord(tenant.id).catch(() => undefined);
          }
        }
        await db.update(tenants).set({ status: oldStandalone ? 'active' : tenant.status, updatedAt: new Date() }).where(eq(tenants.id, tenant.id)).catch(() => undefined);
        if (oldStandalone) await oldStandalone.db.update(tenants).set({ status: 'active', updatedAt: new Date() }).where(eq(tenants.id, tenant.id)).catch(() => undefined);
        await failTenantOperation({ operationKey, ownerToken: claim.ownerToken, error }).catch(() => undefined);
        results.push({ slug, success: false, error: error instanceof Error ? error.message : 'Registry repair failed' });
      }
    }

    return json(200, { success: results.every(result => result.success), results });
  } catch (error) {
    return json(500, { success: false, error: error instanceof Error ? error.message : 'Registry repair failed' });
  }
}

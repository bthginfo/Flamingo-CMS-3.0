import { createHash } from 'node:crypto';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { createDb } from '@flamingo/db';
import * as schema from '../packages/db/src/schema';
import { getDb } from '../apps/marketing/src/lib/db';
import { getRequiredStandaloneDatabase } from '../apps/marketing/src/lib/tenant-data-db';
import {
  patchSnapshot,
  isTargetPageSlug,
  mergeRepairIntoDraftSection,
  repairPage,
  type PageRepair,
  type RepairPage,
  type RepairSection,
} from './lib/freie-waehler-content-repair';
import { invalidateFwRendererCache } from './lib/renderer-cache-invalidation';

const TENANT_SLUG = 'freie-waehler-ingolstadt';
const CONTROL_PROJECT = process.env.VERCEL_ENV_PROJECT || 'flamingo-cms-3-0';
const APPLY = process.argv.includes('--apply');

async function loadProjectEnvironment(projectId: string): Promise<Record<string, string>> {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token) return {};
  const response = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/env?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => null) as {
    envs?: Array<{ key: string; value?: string; target?: string[] }>;
  } | null;
  if (!response.ok || !payload?.envs) throw new Error(`Vercel environment unavailable (${response.status}).`);
  const result: Record<string, string> = {};
  for (const env of payload.envs) {
    if (env.value && (!result[env.key] || env.target?.includes('production'))) result[env.key] = env.value;
  }
  return result;
}

async function resolveTenantDb(
  tenantId: string,
  loadTenantEnvironment: () => Promise<Record<string, string>>,
) {
  if (process.env.CRM_CONFIG_ENCRYPTION_KEY?.trim() || process.env.CONFIG_ENCRYPTION_KEY?.trim()) {
    try {
      return (await getRequiredStandaloneDatabase(tenantId)).db;
    } catch {
      // Fail over to the tenant project's environment without logging secrets.
    }
  }
  const explicit = process.env.FREIE_WAEHLER_DATABASE_URL || process.env.TENANT_DATABASE_URL;
  const projectEnvironment = !explicit ? await loadTenantEnvironment() : {};
  const databaseUrl = explicit || projectEnvironment.DATABASE_URL || projectEnvironment.TENANT_DATABASE_URL;
  if (!databaseUrl?.startsWith('postgres')) throw new Error('Standalone database connection unavailable.');
  return createDb(databaseUrl);
}

function asRepairSection(row: typeof schema.pageSections.$inferSelect): RepairSection {
  return {
    id: row.id,
    type: row.type,
    definitionKey: row.definitionKey,
    schemaVersion: row.schemaVersion,
    variant: row.variant,
    visible: row.visible,
    locked: row.locked,
    sortOrder: row.sortOrder,
    container: row.container,
    spacingTop: row.spacingTop,
    spacingBottom: row.spacingBottom,
    anchorId: row.anchorId,
    data: row.data,
    styleOverrides: row.styleOverrides,
  };
}

function asSnapshotSection(value: unknown): RepairSection {
  if (!value || typeof value !== 'object') throw new Error('Invalid section in active snapshot.');
  const section = value as Record<string, unknown>;
  if (typeof section.id !== 'string' || typeof section.type !== 'string') {
    throw new Error('Active snapshot section has no stable identity.');
  }
  return {
    id: section.id,
    type: section.type,
    definitionKey: typeof section.definitionKey === 'string' ? section.definitionKey : null,
    schemaVersion: typeof section.schemaVersion === 'number' ? section.schemaVersion : null,
    variant: typeof section.variant === 'string' ? section.variant : null,
    visible: section.visible !== false,
    locked: section.locked === true,
    sortOrder: typeof section.sortOrder === 'number' ? section.sortOrder : 0,
    container: typeof section.container === 'string' ? section.container : 'default',
    spacingTop: typeof section.spacingTop === 'string' ? section.spacingTop : 'm',
    spacingBottom: typeof section.spacingBottom === 'string' ? section.spacingBottom : 'm',
    anchorId: typeof section.anchorId === 'string' ? section.anchorId : null,
    data: section.data && typeof section.data === 'object'
      ? section.data as Record<string, unknown>
      : {},
    styleOverrides: section.styleOverrides && typeof section.styleOverrides === 'object'
      ? section.styleOverrides as Record<string, unknown>
      : null,
  };
}

function activeTargetPages(snapshot: Record<string, unknown>): RepairPage[] {
  if (!Array.isArray(snapshot.pages)) throw new Error('Active snapshot has no pages array.');
  return snapshot.pages.flatMap((value) => {
    if (!value || typeof value !== 'object') return [];
    const page = value as Record<string, unknown>;
    if (
      typeof page.id !== 'string'
      || typeof page.slug !== 'string'
      || !isTargetPageSlug(page.slug)
    ) return [];
    return [{
      id: page.id,
      title: typeof page.title === 'string' ? page.title : page.slug,
      slug: page.slug,
      visible: page.visible !== false,
      sections: Array.isArray(page.sections) ? page.sections.map(asSnapshotSection) : [],
    }];
  });
}

function samePublicSection(a: RepairSection, b: RepairSection) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function activeSectionFor(repair: PageRepair, sectionId: string, sourcePages: RepairPage[]) {
  const page = sourcePages.find((candidate) => candidate.id === repair.page.id);
  const section = page?.sections.find((candidate) => candidate.id === sectionId);
  if (!section) throw new Error(`Active source section ${sectionId} is missing.`);
  return section;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    const controlEnvironment = await loadProjectEnvironment(CONTROL_PROJECT);
    if (controlEnvironment.DATABASE_URL) process.env.DATABASE_URL = controlEnvironment.DATABASE_URL;
  }
  if (!process.env.DATABASE_URL?.startsWith('postgres')) {
    throw new Error('DATABASE_URL or VERCEL_TOKEN is required for the control database.');
  }
  const controlDb = getDb();
  const [tenant] = await controlDb.select({
    id: schema.tenants.id,
    vercelProjectId: schema.tenants.vercelProjectId,
  }).from(schema.tenants).where(eq(schema.tenants.slug, TENANT_SLUG)).limit(1);
  if (!tenant) throw new Error('Target tenant not found.');
  let tenantEnvironmentPromise: Promise<Record<string, string>> | undefined;
  const loadTenantEnvironment = () => {
    if (!tenant.vercelProjectId) return Promise.resolve({});
    tenantEnvironmentPromise ||= loadProjectEnvironment(tenant.vercelProjectId);
    return tenantEnvironmentPromise;
  };
  const db = await resolveTenantDb(tenant.id, loadTenantEnvironment);
  const invalidateCache = async () => {
    const directSecret = process.env.REVALIDATE_SECRET?.trim();
    const projectEnvironment = directSecret ? {} : await loadTenantEnvironment();
    return invalidateFwRendererCache({
      tenantId: tenant.id,
      secret: directSecret || projectEnvironment.REVALIDATE_SECRET,
      configuredUrl: process.env.RENDERER_REVALIDATE_URL,
    });
  };

  const [activeRows, latestRows] = await Promise.all([
    db.select().from(schema.publishedSnapshots).where(and(
      eq(schema.publishedSnapshots.tenantId, tenant.id),
      eq(schema.publishedSnapshots.isActive, true),
    )).limit(1),
    db.select({ version: schema.publishedSnapshots.version })
      .from(schema.publishedSnapshots)
      .where(eq(schema.publishedSnapshots.tenantId, tenant.id))
      .orderBy(desc(schema.publishedSnapshots.version))
      .limit(1),
  ]);
  const active = activeRows[0];
  if (!active) throw new Error('No active snapshot found; refusing targeted repair.');
  const pages = activeTargetPages(active.snapshot);
  if (!pages.length) throw new Error('No target pages found in the active snapshot.');
  const repairs = pages.map(repairPage).filter((repair) => repair.changed);
  const upserts = repairs.flatMap((repair) => repair.upserts);
  const deleteIds = repairs.flatMap((repair) => repair.deleteIds);
  const changedIds = [...new Set([...upserts.map((section) => section.id), ...deleteIds])];
  const sectionRows = changedIds.length
    ? await db.select().from(schema.pageSections).where(and(
      eq(schema.pageSections.tenantId, tenant.id),
      inArray(schema.pageSections.id, changedIds),
    ))
    : [];
  if (sectionRows.length !== changedIds.length) {
    throw new Error('A repaired active section is missing from the draft table; refusing repair.');
  }
  const draftById = new Map(sectionRows.map((row) => [row.id, asRepairSection(row)]));
  const draftUpdates = repairs.flatMap((repair) => repair.upserts.map((repaired) => {
    const activeSection = activeSectionFor(repair, repaired.id, pages);
    const draft = draftById.get(repaired.id);
    if (!draft) throw new Error(`Draft section ${repaired.id} is missing.`);
    if (sectionRows.find((row) => row.id === repaired.id)?.pageId !== repair.page.id) {
      throw new Error(`Draft section ${repaired.id} belongs to another page.`);
    }
    return {
      id: repaired.id,
      patch: mergeRepairIntoDraftSection(activeSection, repaired, draft),
    };
  }));
  for (const repair of repairs) {
    for (const sectionId of repair.deleteIds) {
      const activeSection = activeSectionFor(repair, sectionId, pages);
      const draft = draftById.get(sectionId);
      if (!draft || !samePublicSection(activeSection, draft)) {
        throw new Error(`Draft section ${sectionId} diverged from the active snapshot; refusing deletion.`);
      }
    }
  }
  const report = {
    mode: APPLY ? 'apply' : 'audit',
    tenant: TENANT_SLUG,
    affectedPages: repairs.map((repair) => repair.page.slug),
    pageCount: repairs.length,
    sectionRowsChanged: draftUpdates.length,
    sectionRowsDeleted: deleteIds.length,
    snapshotPagesReplaced: repairs.length,
    beforeAfter: repairs.map((repair) => ({
      slug: repair.page.slug,
      before: repair.beforeTypes,
      after: repair.afterTypes,
    })),
  };
  if (!APPLY) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  if (!repairs.length) {
    const cache = await invalidateCache();
    console.log(JSON.stringify({ ...report, cache, status: 'no-content-delta-cache-revalidated' }, null, 2));
    return;
  }

  const generatedAt = new Date().toISOString();
  const nextSnapshot = patchSnapshot(
    active.snapshot,
    repairs,
    generatedAt,
  );
  const checksum = createHash('sha256').update(JSON.stringify(nextSnapshot)).digest('hex');
  await db.transaction(async (tx) => {
    for (const update of draftUpdates) {
      await tx.update(schema.pageSections).set({
        ...update.patch,
        updatedAt: new Date(),
      }).where(and(
        eq(schema.pageSections.tenantId, tenant.id),
        eq(schema.pageSections.id, update.id),
      ));
    }
    if (deleteIds.length) {
      await tx.delete(schema.pageSections).where(and(
        eq(schema.pageSections.tenantId, tenant.id),
        inArray(schema.pageSections.id, deleteIds),
      ));
    }
    await tx.update(schema.publishedSnapshots).set({ isActive: false }).where(and(
      eq(schema.publishedSnapshots.tenantId, tenant.id),
      eq(schema.publishedSnapshots.id, active.id),
    ));
    await tx.insert(schema.publishedSnapshots).values({
      tenantId: tenant.id,
      version: (latestRows[0]?.version ?? active.version) + 1,
      snapshot: nextSnapshot,
      checksum,
      createdBy: 'script:patch-freie-waehler-content',
      isActive: true,
    });
  });
  let cache;
  try {
    cache = await invalidateCache();
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown cache invalidation error.';
    throw new Error(
      `Snapshot version ${(latestRows[0]?.version ?? active.version) + 1} was applied, but cache invalidation failed: ${detail}`,
    );
  }
  console.log(JSON.stringify({
    ...report,
    snapshotVersion: (latestRows[0]?.version ?? active.version) + 1,
    cache,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    error: error instanceof Error ? error.message : 'Unknown targeted repair error.',
  }));
  process.exitCode = 1;
});

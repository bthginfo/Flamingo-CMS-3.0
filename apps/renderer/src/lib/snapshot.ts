import { getDb } from './db';
import { tenants, tenantDomains, pages, pageSections, collections, collectionItems, publishedSnapshots } from '@flamingo/db';
import { eq, and, asc, desc, notInArray } from 'drizzle-orm';
import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';

const lastKnownSnapshots = new Map<string, Snapshot>();
const PUBLIC_SNAPSHOT_REVALIDATE_SECONDS = 60 * 60;

export type SnapshotPage = {
  id: string;
  title: string;
  slug: string;
  visible: boolean;
  sections: SnapshotSection[];
};

export type SnapshotSection = {
  id: string;
  type: string;
  definitionKey?: string | null;
  schemaVersion?: number | null;
  variant: string | null;
  visible: boolean;
  locked?: boolean;
  sortOrder?: number;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId: string | null;
  data: Record<string, unknown>;
  styleOverrides?: Record<string, unknown> | null;
};

export type SnapshotCollectionItem = {
  id: string;
  slug: string;
  title: string;
  data: Record<string, unknown>;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type SnapshotCollection = {
  id: string;
  key: string;
  label: string;
  schema: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  items: SnapshotCollectionItem[];
};

export type Snapshot = {
  pages: SnapshotPage[];
  collections?: SnapshotCollection[];
  generatedAt: string;
};

/** Resolve tenant from hostname, or from the first path segment for shared lead/demo URLs. */
export async function resolveTenant(candidateSlug?: string): Promise<string | null> {
  // Standalone mode: fixed tenant via env var (dedicated Vercel project)
  const fixedTenantId = process.env.FIXED_TENANT_ID;
  if (fixedTenantId) return fixedTenantId;

  try {
    const db = getDb();
    const headersList = await headers();
    const host = headersList.get('host') ?? 'localhost';
    const isLocalHost = host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]');

    // Try domain lookup
    const [domain] = await db.select({ tenantId: tenantDomains.tenantId }).from(tenantDomains).where(eq(tenantDomains.domain, host)).limit(1);
    if (domain) return domain.tenantId;

    if (candidateSlug) {
      const [tenantBySlug] = await db.select({ id: tenants.id }).from(tenants).where(and(eq(tenants.slug, candidateSlug), eq(tenants.status, 'active'))).limit(1);
      if (tenantBySlug) return tenantBySlug.id;
      if (!isLocalHost) return null;
    }

    if (!isLocalHost) return null;

    // Fallback: first active tenant (local dev mode only)
    const [tenant] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.status, 'active')).limit(1);
    return tenant?.id ?? null;
  } catch (err) {
    console.error('[resolveTenant] DB error:', err);
    return null;
  }
}

/**
 * Public-facing snapshot read.
 *
 * Draft/Publish (B): if the tenant has an active row in published_snapshots,
 * the public renderer reads from there — isolating end-users from in-flight
 * admin edits. If no active snapshot exists yet (legacy tenants or fresh
 * tenants who never clicked "Veröffentlichen"), we fall back to the draft
 * read so existing sites keep working transparently.
 *
 * The complete lookup is cached. Publish and rollback invalidate the tenant
 * tag, while the TTL provides a bounded fallback for other mutations.
 */
export async function getActiveSnapshot(tenantId: string): Promise<Snapshot | null> {
  const cached = unstable_cache(
    async () => {
      const meta = await getActiveSnapshotMeta(tenantId);
      if (meta) return meta.snapshot;
      return getDraftSnapshot(tenantId);
    },
    ['public-snapshot', tenantId],
    { revalidate: PUBLIC_SNAPSHOT_REVALIDATE_SECONDS, tags: [`tenant-${tenantId}`] },
  );
  try {
    const snapshot = await cached();
    if (snapshot) lastKnownSnapshots.set(tenantId, snapshot);
    return snapshot;
  } catch (err) {
    console.warn('[getActiveSnapshot] cached public snapshot unavailable:', err);
    return lastKnownSnapshots.get(tenantId) || null;
  }
}

async function getActiveSnapshotMeta(tenantId: string): Promise<{ version: number; snapshot: Snapshot } | null> {
  try {
    const db = getDb();
    const [row] = await db
      .select({ version: publishedSnapshots.version, snapshot: publishedSnapshots.snapshot })
      .from(publishedSnapshots)
      .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)))
      .orderBy(desc(publishedSnapshots.version))
      .limit(1);
    if (!row) return null;
    return { version: row.version, snapshot: row.snapshot as unknown as Snapshot };
  } catch (err) {
    console.warn('[getActiveSnapshotMeta] DB error:', err);
    throw err;
  }
}

/** Build a live snapshot from pages/page_sections/collections tables. */
export async function getDraftSnapshot(tenantId: string): Promise<Snapshot | null> {
  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, tenantId)).orderBy(asc(pages.sortOrder));
  if (allPages.length === 0) return null;

  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, tenantId)).orderBy(asc(pageSections.sortOrder));
  const allCollections = await db.select().from(collections).where(eq(collections.tenantId, tenantId));
  const allItems = await db.select().from(collectionItems).where(and(eq(collectionItems.tenantId, tenantId), eq(collectionItems.published, true))).orderBy(asc(collectionItems.priority));

  const snapshotPages: SnapshotPage[] = allPages.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    visible: p.visible,
    sections: allSections
      .filter(s => s.pageId === p.id)
      .map(s => ({
        id: s.id,
        type: s.type,
        definitionKey: s.definitionKey,
        schemaVersion: s.schemaVersion,
        variant: s.variant,
        visible: s.visible,
        locked: s.locked,
        sortOrder: s.sortOrder,
        container: s.container,
        spacingTop: s.spacingTop,
        spacingBottom: s.spacingBottom,
        anchorId: s.anchorId,
        data: s.data,
        styleOverrides: s.styleOverrides,
      })),
  }));

  const snapshotCollections: SnapshotCollection[] = allCollections.map(c => ({
    id: c.id,
    key: c.key,
    label: c.label,
    schema: c.schema as Record<string, unknown> | null,
    settings: c.settings as Record<string, unknown> | null ?? null,
    items: allItems
      .filter(i => i.collectionId === c.id)
      .map(i => ({
        id: i.id,
        slug: i.slug,
        title: i.title,
        data: i.data as Record<string, unknown>,
        priority: i.priority,
        createdAt: (i.createdAt as Date)?.toISOString?.() ?? '',
        updatedAt: (i.updatedAt as Date)?.toISOString?.() ?? '',
      })),
  }));

  return { pages: snapshotPages, collections: snapshotCollections, generatedAt: new Date().toISOString() };
}

export type DemoTenantResolution =
  | { status: 'found'; tenantId: string }
  | { status: 'not-found' }
  | { status: 'error'; stage: 'industry' | 'slug'; error: unknown };

function logDemoTenantResolutionError(
  lookup: 'industry-and-slug' | 'slug',
  result: Extract<DemoTenantResolution, { status: 'error' }>,
): void {
  console.warn(JSON.stringify({
    event: 'demo_tenant_resolution_failed',
    lookup,
    stage: result.stage,
    errorType: result.error instanceof Error ? result.error.name : 'UnknownError',
  }));
}

/** Public demo sites must never persist visitor PII or real transactions. */
export async function isDemoTenant(tenantId: string): Promise<boolean> {
  const [tenant] = await getDb()
    .select({ isDemo: tenants.isDemo })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);
  return tenant?.isDemo === true;
}

/** Resolve a demo tenant without collapsing a DB failure into "not found". */
export async function resolveDemoTenantResult(
  industry: string,
  urlKey?: string,
): Promise<DemoTenantResolution> {
  let db: ReturnType<typeof getDb>;
  try {
    db = getDb();
  } catch (error) {
    return { status: 'error', stage: 'industry', error };
  }
  // Step 1: the public demo key is the stable identity. This allows multiple
  // demos to share one industry without the oldest tenant shadowing newer ones.
  const slugKey = urlKey || industry;
  try {
    const [bySlug] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(and(
        eq(tenants.slug, `demo-${slugKey}`),
        eq(tenants.isDemo, true),
        eq(tenants.status, 'active'),
      ))
      .limit(1);
    if (bySlug) return { status: 'found', tenantId: bySlug.id };
  } catch (err) {
    return { status: 'error', stage: 'slug', error: err };
  }

  // Step 2: legacy industry fallback. Industry is a rendering/default hint,
  // never the primary public identity. Unknown future demo keys simply 404.
  if (!tenants.industry.enumValues.includes(industry as typeof tenants.industry.enumValues[number])) {
    return { status: 'not-found' };
  }
  try {
    const [tenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(and(
        eq(tenants.industry, industry as typeof tenants.industry.enumValues[number]),
        eq(tenants.isDemo, true),
        eq(tenants.status, 'active'),
        notInArray(tenants.slug, ['demo-showcase', 'demo-shop']),
      ))
      .orderBy(asc(tenants.createdAt))
      .limit(1);
    return tenant ? { status: 'found', tenantId: tenant.id } : { status: 'not-found' };
  } catch (err) {
    return { status: 'error', stage: 'industry', error: err };
  }
}

/** Resolve demo tenant by industry (isDemo=true). Excludes special slug-mapped tenants. */
export async function resolveDemoTenant(industry: string, urlKey?: string): Promise<string | null> {
  const result = await resolveDemoTenantResult(industry, urlKey);
  if (result.status === 'error') {
    logDemoTenantResolutionError('industry-and-slug', result);
    return null;
  }
  return result.status === 'found' ? result.tenantId : null;
}

export async function resolveDemoTenantBySlugResult(slug: string): Promise<DemoTenantResolution> {
  try {
    const db = getDb();
    const [tenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(and(eq(tenants.slug, slug), eq(tenants.isDemo, true), eq(tenants.status, 'active')))
      .limit(1);
    return tenant ? { status: 'found', tenantId: tenant.id } : { status: 'not-found' };
  } catch (error) {
    return { status: 'error', stage: 'slug', error };
  }
}

export async function resolveDemoTenantBySlug(slug: string): Promise<string | null> {
  const result = await resolveDemoTenantBySlugResult(slug);
  if (result.status === 'error') {
    logDemoTenantResolutionError('slug', result);
    // Preserve the original resolver contract: slug lookup failures throw.
    throw result.error;
  }
  return result.status === 'found' ? result.tenantId : null;
}

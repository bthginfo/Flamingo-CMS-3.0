import { getDb } from './db';
import { publishedSnapshots, tenants, tenantDomains, pages, pageSections } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';
import { headers } from 'next/headers';

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
  variant: string | null;
  visible: boolean;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId: string | null;
  data: Record<string, unknown>;
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

/** Resolve tenant from the request hostname. Falls back to first tenant for dev. */
export async function resolveTenant(): Promise<string | null> {
  const db = getDb();
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost';

  // Try domain lookup
  const [domain] = await db.select({ tenantId: tenantDomains.tenantId }).from(tenantDomains).where(eq(tenantDomains.domain, host)).limit(1);
  if (domain) return domain.tenantId;

  // Fallback: first active tenant (dev mode)
  const [tenant] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.status, 'active')).limit(1);
  return tenant?.id ?? null;
}

/** Get the active published snapshot for the current tenant. */
export async function getActiveSnapshot(tenantId: string): Promise<Snapshot | null> {
  const db = getDb();
  const [snap] = await db.select()
    .from(publishedSnapshots)
    .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)))
    .limit(1);
  if (!snap) return null;
  return snap.snapshot as unknown as Snapshot;
}

/** Build a live draft snapshot from page_sections (unpublished state). */
export async function getDraftSnapshot(tenantId: string): Promise<Snapshot | null> {
  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, tenantId)).orderBy(asc(pages.sortOrder));
  if (allPages.length === 0) return null;

  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, tenantId)).orderBy(asc(pageSections.sortOrder));

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
        variant: s.variant,
        visible: s.visible,
        container: s.container,
        spacingTop: s.spacingTop,
        spacingBottom: s.spacingBottom,
        anchorId: s.anchorId,
        data: s.data,
      })),
  }));

  return { pages: snapshotPages, collections: [], generatedAt: new Date().toISOString() };
}

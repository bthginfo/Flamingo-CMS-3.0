import { getDb } from './db';
import { tenants, tenantDomains, pages, pageSections, collections, collectionItems } from '@flamingo/db';
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

/** Get live data for the tenant directly from pages/page_sections tables. */
export async function getActiveSnapshot(tenantId: string): Promise<Snapshot | null> {
  return getDraftSnapshot(tenantId);
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
        variant: s.variant,
        visible: s.visible,
        container: s.container,
        spacingTop: s.spacingTop,
        spacingBottom: s.spacingBottom,
        anchorId: s.anchorId,
        data: s.data,
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

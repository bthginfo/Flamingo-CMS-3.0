import { getDb } from './db';
import { publishedSnapshots, tenants, tenantDomains } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
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

export type Snapshot = {
  pages: SnapshotPage[];
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

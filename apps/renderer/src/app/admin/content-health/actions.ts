'use server';

import { NextRequest } from 'next/server';
import { collectionItems, collections, pages } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { GET as runStoredContentAudit } from '@/app/api/v1/content/validate/route';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { groupContentHealthIssues, normalizeStoredContentAudit } from '@/lib/content-health';

function count(summary: Record<string, unknown> | undefined, key: string): number {
  const value = summary?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export async function getContentHealthReport() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const response = await runStoredContentAudit(new NextRequest('http://internal/api/v1/content/validate'));
  if (!response.ok) {
    return { success: false as const, error: 'Die Inhaltsprüfung konnte nicht ausgeführt werden.' };
  }
  const audit = normalizeStoredContentAudit(await response.json());
  const issues = audit.issues;

  const db = getDb();
  const [pageRows, itemRows] = await Promise.all([
    db.select({ id: pages.id, slug: pages.slug, title: pages.title }).from(pages).where(eq(pages.tenantId, session.tenantId)),
    db.select({
      id: collectionItems.id,
      slug: collectionItems.slug,
      title: collectionItems.title,
      collectionKey: collections.key,
    }).from(collectionItems)
      .innerJoin(collections, eq(collectionItems.collectionId, collections.id))
      .where(eq(collectionItems.tenantId, session.tenantId)),
  ]);
  const summary = audit.summary;
  const totals = {
    contentErrors: count(summary, 'contentErrors'),
    contentWarnings: count(summary, 'contentWarnings'),
    colorErrors: count(summary, 'colorErrors'),
    colorWarnings: count(summary, 'colorWarnings'),
    pages: count(summary, 'pages'),
    collections: count(summary, 'collections'),
    collectionItems: count(summary, 'collectionItems'),
    freshnessWarnings: audit.freshnessWarnings,
  };
  return {
    success: true as const,
    readyToPublish: audit.readyToPublish,
    totals,
    blockingCount: totals.contentErrors + totals.colorErrors + totals.colorWarnings,
    advisoryCount: totals.contentWarnings,
    groups: groupContentHealthIssues(issues, { pages: pageRows, collectionItems: itemRows }),
    checkedAt: new Date().toISOString(),
  };
}

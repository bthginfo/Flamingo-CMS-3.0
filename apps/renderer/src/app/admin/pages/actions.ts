'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { validateSectionData } from '@/lib/validate-section';
import { pages, pageSections, tenants } from '@flamingo/db';
import { eq, and, asc, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function getPagesAction() {
  const session = await requireSession();
  const db = getDb();
  return db.select().from(pages).where(eq(pages.tenantId, session.tenantId)).orderBy(asc(pages.sortOrder), desc(pages.updatedAt));
}

export async function ensureDefaultPages() {
  const session = await requireSession();
  const db = getDb();
  const existing = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.tenantId, session.tenantId));
  const slugs = new Set(existing.map(p => p.slug));
  const defaults = [
    { slug: 'impressum', title: 'Impressum' },
    { slug: 'datenschutz', title: 'Datenschutz' },
  ];
  for (const d of defaults) {
    if (!slugs.has(d.slug)) {
      await db.insert(pages).values({ tenantId: session.tenantId, title: d.title, slug: d.slug, type: 'free', status: 'draft', visible: true, sortOrder: 99 });
    }
  }
}

export async function createPageAction(formData: FormData) {
  const session = await requireSession();
  const db = getDb();
  const title = (formData.get('title') as string)?.trim();
  if (!title) return;
  const slug = title.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  const [page] = await db.insert(pages).values({
    tenantId: session.tenantId,
    title,
    slug: slug || 'neue-seite',
    type: 'free',
    status: 'draft',
  }).returning();
  revalidatePath('/admin/pages');
  redirect(`/admin/pages/${page.id}`);
}

export async function deletePageAction(pageId: string) {
  const session = await requireSession();
  const db = getDb();
  await db.delete(pages).where(and(eq(pages.id, pageId), eq(pages.tenantId, session.tenantId)));
  revalidatePath('/admin/pages');
}

export async function updatePageAction(pageId: string, data: { title?: string; slug?: string; visible?: boolean; status?: 'draft' | 'published' | 'archived' }) {
  const session = await requireSession();
  const db = getDb();
  await db.update(pages).set({ ...data, updatedAt: new Date() }).where(and(eq(pages.id, pageId), eq(pages.tenantId, session.tenantId)));
  revalidatePath('/admin/pages');
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function getPageWithSectionsAction(pageId: string) {
  const session = await requireSession();
  const db = getDb();
  const [pageResult, sectionsResult, tenantResult] = await Promise.all([
    db.select().from(pages).where(and(eq(pages.id, pageId), eq(pages.tenantId, session.tenantId))),
    db.select().from(pageSections).where(and(eq(pageSections.pageId, pageId), eq(pageSections.tenantId, session.tenantId))).orderBy(asc(pageSections.sortOrder)),
    db.select({ industry: tenants.industry, activeStyle: tenants.activeStyle }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1),
  ]);
  const page = pageResult[0];
  if (!page) return null;
  return { page, sections: sectionsResult, industry: tenantResult[0]?.industry ?? 'tradesman', styleVariant: tenantResult[0]?.activeStyle ?? 'classic' };
}

export async function addSectionAction(pageId: string, type: string) {
  const session = await requireSession();
  const db = getDb();
  // Get max sort order
  const existing = await db.select({ sortOrder: pageSections.sortOrder }).from(pageSections).where(and(eq(pageSections.pageId, pageId), eq(pageSections.tenantId, session.tenantId))).orderBy(desc(pageSections.sortOrder)).limit(1);
  const nextOrder = (existing[0]?.sortOrder ?? -1) + 1;
  const [section] = await db.insert(pageSections).values({
    tenantId: session.tenantId,
    pageId,
    type,
    data: {},
    sortOrder: nextOrder,
  }).returning();
  revalidatePath(`/admin/pages/${pageId}`);
  return section;
}

export async function updateSectionAction(sectionId: string, data: Record<string, unknown>, pageId: string) {
  const session = await requireSession();
  const db = getDb();
  // Validate & sanitize section data
  let cleanData: Record<string, unknown>;
  try {
    cleanData = validateSectionData(data);
  } catch (e) {
    return { error: 'Ungültige Section-Daten' };
  }
  const result = await db.update(pageSections).set({ data: cleanData, updatedAt: new Date() }).where(and(eq(pageSections.id, sectionId), eq(pageSections.tenantId, session.tenantId))).returning({ id: pageSections.id });
  if (result.length === 0) {
    return { error: 'Section nicht gefunden oder keine Berechtigung' };
  }
  return { success: true };
}

export async function updateSectionMetaAction(sectionId: string, meta: { visible?: boolean; titleInternal?: string; variant?: string; container?: string; spacingTop?: string; spacingBottom?: string; anchorId?: string; styleOverrides?: Record<string, unknown> | null }, pageId?: string) {
  const session = await requireSession();
  const db = getDb();
  const result = await db.update(pageSections).set({ ...meta, updatedAt: new Date() }).where(and(eq(pageSections.id, sectionId), eq(pageSections.tenantId, session.tenantId))).returning({ id: pageSections.id });
  if (result.length === 0) {
    return { error: 'Section nicht gefunden oder keine Berechtigung' };
  }
  return { success: true };
}

export async function deleteSectionAction(sectionId: string, pageId: string) {
  const session = await requireSession();
  const db = getDb();
  await db.delete(pageSections).where(and(eq(pageSections.id, sectionId), eq(pageSections.tenantId, session.tenantId)));
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function reorderSectionsAction(pageId: string, sectionIds: string[]) {
  const session = await requireSession();
  const db = getDb();
  await Promise.all(
    sectionIds.map((id, i) =>
      db.update(pageSections).set({ sortOrder: i }).where(and(eq(pageSections.id, id), eq(pageSections.tenantId, session.tenantId)))
    )
  );
  revalidatePath(`/admin/pages/${pageId}`);
}

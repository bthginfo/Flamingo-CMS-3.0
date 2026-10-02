import { pageMetadataUpdates } from '@/lib/api-page-input';
import type { BatchItem } from 'drizzle-orm/batch';
import { readApiJsonObject } from '@/lib/api-request-body';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq, and, sql } from 'drizzle-orm';
import crypto from 'crypto';
import { withApiHandler, normalizeSlug, validateSections, normalizeSectionData, normalizeStyleOverridesForSection, autoFixStyleOverridesForSectionReadability } from '@/lib/api-utils';
import { resolveSectionWriteIdentities } from '@/lib/section-write-identity';

export const POST = withApiHandler(async (req, auth) => {
  const body = await readApiJsonObject(req);
  const { slug, sections } = body;
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) return NextResponse.json({ success: false, code: 'TITLE_REQUIRED', error: 'title is required and must be a non-empty string' }, { status: 400 });

  const db = getDb();
  const metadata = pageMetadataUpdates({ ...body, slug: slug ?? title.toLowerCase().replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '') });
  const normalizedSlug = metadata.slug as string;
  if (!normalizedSlug && slug == null) return NextResponse.json({ success: false, code: 'SLUG_INVALID', error: 'Provide an explicit slug when title has no URL-safe characters.' }, { status: 400 });
  const hasSections = Object.prototype.hasOwnProperty.call(body, 'sections');
  if (hasSections) {
    const sectionErr = validateSections(sections, auth.tenant.industry, {
      hasShop: auth.addons.includes('shop'),
      hasBooking: auth.addons.includes('booking'),
    });
    if (sectionErr) {
      return NextResponse.json({
        success: false,
        code: 'INVALID_SECTIONS',
        error: sectionErr,
        hint: 'Use only section types and fields documented by GET /api/v1/instructions.',
      }, { status: 400 });
    }
  }
  const identityResolution = hasSections
    ? resolveSectionWriteIdentities(sections, auth.tenant.industry)
    : { ok: true as const, identities: [] };
  if (!identityResolution.ok) {
    return NextResponse.json({
      success: false,
      code: 'INVALID_SECTION_IDENTITY',
      error: identityResolution.error,
      hint: 'Omit definitionKey/schemaVersion to let the server derive them, or copy the exact values from GET /api/v1/instructions.',
    }, { status: 400 });
  }

  // A duplicate slug otherwise surfaces as an opaque 500 from the unique index.
  // Return a clear 409 so an AI agent knows to update the existing page (PUT
  // /pages/:id) or choose a different slug instead of blindly retrying.
  const [clash] = await db.select({ id: pages.id, type: pages.type }).from(pages)
    .where(and(eq(pages.tenantId, auth.tenantId), eq(pages.slug, normalizedSlug))).limit(1);
  if (clash && body.upsert !== true) {
    return NextResponse.json({
      success: false,
      code: 'PAGE_SLUG_EXISTS',
      error: `A page with slug "${normalizedSlug}" already exists. Update it with PUT /api/v1/content/pages/${clash.id}, or choose a different slug.`,
      existingPageId: clash.id,
      hint: 'Resend the same POST request with upsert: true to replace this page idempotently.',
    }, { status: 409 });
  }
  if (clash && hasSections) {
    const [locked] = await db.select({ id: pageSections.id }).from(pageSections).where(and(eq(pageSections.pageId, clash.id), eq(pageSections.tenantId, auth.tenantId), eq(pageSections.locked, true))).limit(1);
    if (locked) return NextResponse.json({ code: 'LOCKED_SECTIONS_PROTECTED', error: 'Use PATCH to edit system sections without replacing them.' }, { status: 409 });
  }

  const pageId = clash?.id || crypto.randomUUID();

  // Validate + normalize sections BEFORE inserting the page row. The neon-http
  // driver has no interactive transactions, so a validation 400 AFTER the insert
  // would orphan the page row and a naive retry would then collide on the unique
  // slug with a 500 — a long-standing pain point for AI agents writing content.
  let sectionValues: Record<string, unknown>[] = [];
  if (hasSections && sections.length > 0) {
    sectionValues = sections.map((s: any, i: number) => {
      const normalizedStyleOverrides = normalizeStyleOverridesForSection(
        s.type,
        s.styleOverrides,
        auth.tenant.industry,
        identityResolution.identities[i].definitionKey,
      );
      const { styleOverrides } = autoFixStyleOverridesForSectionReadability(
        s.type,
        normalizedStyleOverrides,
        auth.tenant.industry,
        identityResolution.identities[i].definitionKey,
      );
      return {
        id: clash ? crypto.randomUUID() : (s.id || crypto.randomUUID()),
        tenantId: auth.tenantId,
        pageId,
        type: s.type,
        definitionKey: identityResolution.identities[i].definitionKey,
        schemaVersion: identityResolution.identities[i].schemaVersion,
        data: normalizeSectionData(s.type, s.data || {}),
        variant: s.variant || null,
        visible: s.visible !== false,
        container: s.container || 'default',
        spacingTop: s.spacingTop || 'm',
        spacingBottom: s.spacingBottom || 'm',
        anchorId: s.anchorId || null,
        styleOverrides,
        sortOrder: i,
      };
    });
  }

  const writes: [BatchItem<'pg'>, ...BatchItem<'pg'>[]] = clash
    ? [db.execute(sql`SELECT id FROM pages WHERE id = ${pageId} AND tenant_id = ${auth.tenantId} FOR UPDATE`)]
    : [db.insert(pages).values({ id: pageId, tenantId: auth.tenantId, slug: normalizedSlug, title, status: 'published', ...(body.visible !== undefined ? { visible: body.visible } : {}) })];
  if (clash) {
    writes.push(db.update(pages).set({ ...metadata, title, slug: normalizedSlug }).where(and(eq(pages.id, pageId), eq(pages.tenantId, auth.tenantId))));
    if (hasSections) writes.push(db.delete(pageSections).where(and(eq(pageSections.pageId, pageId), eq(pageSections.tenantId, auth.tenantId))));
  }
  if (sectionValues.length > 0) writes.push(db.insert(pageSections).values(sectionValues as never));
  await db.batch(writes);
  if (clash) return NextResponse.json({ success: true, operation: 'updated', id: pageId, slug: normalizedSlug });

  return NextResponse.json({ success: true, operation: 'created', id: pageId, slug: normalizedSlug }, { status: 201 });
});

export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));
  return NextResponse.json({ pages: allPages.map(p => ({ id: p.id, slug: p.slug, title: p.title })) });
});

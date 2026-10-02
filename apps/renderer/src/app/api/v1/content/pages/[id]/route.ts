import { pageMetadataUpdates, mergeSectionStylePatch, validateSectionPatchKeys } from '@/lib/api-page-input';
import type { BatchItem } from 'drizzle-orm/batch';
import { readApiJsonObject } from '@/lib/api-request-body';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq, and, asc, inArray, sql } from 'drizzle-orm';
import crypto from 'crypto';
import { withApiHandlerParams, normalizeSlug, validateSections, validateSectionIdentity, normalizeSectionData, normalizeStyleOverridesForSection, autoFixStyleOverridesForSectionReadability, validateStyleOverridesForApi } from '@/lib/api-utils';
import { resolveSectionWriteIdentities, resolveSectionWriteIdentity } from '@/lib/section-write-identity';

export const GET = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  const [page] = await db.select().from(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  const sections = await db.select().from(pageSections).where(and(eq(pageSections.pageId, id), eq(pageSections.tenantId, auth.tenantId))).orderBy(asc(pageSections.sortOrder));
  return NextResponse.json({
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: page.status,
    visible: page.visible,
    sections: sections.map(s => ({ id: s.id, type: s.type, definitionKey: s.definitionKey, schemaVersion: s.schemaVersion, data: s.data, variant: s.variant, visible: s.visible, sortOrder: s.sortOrder, container: s.container, spacingTop: s.spacingTop, spacingBottom: s.spacingBottom, anchorId: s.anchorId, locked: s.locked, titleInternal: s.titleInternal, styleOverrides: s.styleOverrides })),
  });
});

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await readApiJsonObject(req);
  const db = getDb();

  const [existingPage] = await db.select({ id: pages.id, type: pages.type, slug: pages.slug }).from(pages)
    .where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)))
    .limit(1);
  if (!existingPage) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

  // Preflight the whole request before any metadata or section mutation.
  const updates = pageMetadataUpdates(body);
  if (existingPage.type === 'system' && updates.slug !== undefined && updates.slug !== existingPage.slug) {
    return NextResponse.json({ code: 'SYSTEM_PAGE_PROTECTED', error: 'System page routes cannot be changed.' }, { status: 409 });
  }
  const writes: [BatchItem<'pg'>, ...BatchItem<'pg'>[]] = [
    db.execute(sql`SELECT id FROM pages WHERE id = ${id} AND tenant_id = ${auth.tenantId} FOR UPDATE`),
  ];
  if (body.sections !== undefined) {
    const [locked] = await db.select({ id: pageSections.id }).from(pageSections).where(and(eq(pageSections.pageId, id), eq(pageSections.tenantId, auth.tenantId), eq(pageSections.locked, true))).limit(1);
    if (locked) return NextResponse.json({ code: 'LOCKED_SECTIONS_PROTECTED', error: 'This page contains system sections. Use PATCH patchSections to edit their content without replacing them.' }, { status: 409 });
    const sectionErr = validateSections(body.sections, auth.tenant.industry, {
      hasShop: auth.addons.includes('shop'),
      hasBooking: auth.addons.includes('booking'),
    });
    if (sectionErr) return NextResponse.json({ success: false, code: 'INVALID_SECTIONS', error: sectionErr }, { status: 400 });
    const identityResolution = resolveSectionWriteIdentities(body.sections, auth.tenant.industry);
    if (!identityResolution.ok) return NextResponse.json({ success: false, code: 'INVALID_SECTION_IDENTITY', error: identityResolution.error }, { status: 400 });

    writes.push(db.delete(pageSections).where(and(eq(pageSections.pageId, id), eq(pageSections.tenantId, auth.tenantId))));
    if (body.sections.length > 0) {
      const replacements = body.sections.map((s: any, i: number) => {
        const sectionId = crypto.randomUUID();
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
          id: sectionId,
          tenantId: auth.tenantId,
          pageId: id,
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
      writes.push(db.insert(pageSections).values(replacements));
    }
  }
  if (Object.keys(updates).length > 0) writes.push(db.update(pages).set(updates).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId))));
  // Neon HTTP batches are one transaction. A failed insert/update restores the
  // previous sections and metadata, and the page lock serializes replacements.
  await db.batch(writes);

  return NextResponse.json({ success: true });
});

const PATCH_ALLOWED_KEYS = new Set(['title', 'slug', 'visible', 'patchSections']);

export const PATCH = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await readApiJsonObject(req);
  // Reject unknown keys instead of silently ignoring them — callers sending
  // e.g. `sections` (the PUT shape) would otherwise get a 200 no-op.
  const unknownKeys = Object.keys(body).filter((key) => !PATCH_ALLOWED_KEYS.has(key));
  if (unknownKeys.length) {
    return NextResponse.json({
      error: `Unknown PATCH field(s): ${unknownKeys.join(', ')}. Allowed: ${[...PATCH_ALLOWED_KEYS].join(', ')}. To replace all sections use PUT with { sections }.`,
    }, { status: 400 });
  }
  const db = getDb();

  const [page] = await db.select().from(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

  // Validate the complete patch before the first write. The HTTP Neon driver
  // has no interactive transaction, so preflight prevents identity/style
  // errors from leaving a partially updated page behind.
  const updates = pageMetadataUpdates(body);
  if (page.type === 'system' && updates.slug !== undefined && updates.slug !== page.slug) {
    return NextResponse.json({ code: 'SYSTEM_PAGE_PROTECTED', error: 'System page routes cannot be changed.' }, { status: 409 });
  }

  if (body.patchSections !== undefined && !Array.isArray(body.patchSections)) {
    return NextResponse.json({ success: false, code: 'PATCH_SECTIONS_INVALID', error: 'patchSections must be an array' }, { status: 400 });
  }

  const patches = (body.patchSections || []) as Array<Record<string, unknown>>;
  const patchIds: string[] = [];
  for (let index = 0; index < patches.length; index++) {
    const patch = patches[index];
    if (!patch || typeof patch !== 'object' || typeof patch.id !== 'string' || !patch.id) {
      return NextResponse.json({ success: false, code: 'PATCH_SECTION_ID_REQUIRED', error: `patchSections[${index}].id is required` }, { status: 400 });
    }
    validateSectionPatchKeys(patch, index);
    patchIds.push(patch.id);
  }
  if (new Set(patchIds).size !== patchIds.length) {
    return NextResponse.json({ success: false, code: 'PATCH_SECTION_DUPLICATE_ID', error: 'patchSections contains duplicate ids' }, { status: 400 });
  }

  const existingSections = patchIds.length > 0
    ? await db.select().from(pageSections).where(and(
      eq(pageSections.pageId, id),
      eq(pageSections.tenantId, auth.tenantId),
      inArray(pageSections.id, patchIds),
    ))
    : [];
  const existingById = new Map(existingSections.map(section => [section.id, section]));
  const missingIds = patchIds.filter(sectionId => !existingById.has(sectionId));
  if (missingIds.length > 0) {
    return NextResponse.json({
      success: false,
      code: 'PATCH_SECTION_NOT_FOUND',
      error: 'One or more sections do not belong to this page.',
      missingIds,
    }, { status: 404 });
  }

  const preparedSectionUpdates: Array<{ id: string; values: Record<string, unknown> }> = [];
  for (let index = 0; index < patches.length; index++) {
      const patch = patches[index];
      const patchId = patch.id as string;
      const existing = existingById.get(patchId)!;
      if (existing.locked && ((patch.definitionKey !== undefined && patch.definitionKey !== existing.definitionKey)
        || (patch.schemaVersion !== undefined && patch.schemaVersion !== existing.schemaVersion))) {
        return NextResponse.json({ code: 'LOCKED_SECTION_PROTECTED', error: 'System section identities cannot be changed.' }, { status: 409 });
      }
      const identityErr = validateSectionIdentity({
        type: existing.type,
        definitionKey: patch.definitionKey,
        schemaVersion: patch.schemaVersion,
      }, `patchSections[${index}]`);
      if (identityErr) return NextResponse.json({ success: false, code: 'SECTION_IDENTITY_INVALID', error: identityErr }, { status: 400 });
      const identityResolution = resolveSectionWriteIdentity({
        type: existing.type,
        industry: auth.tenant.industry,
        definitionKey: patch.definitionKey !== undefined ? patch.definitionKey : existing.definitionKey,
        schemaVersion: patch.schemaVersion !== undefined ? patch.schemaVersion : existing.schemaVersion,
      });
      if (!identityResolution.ok) {
        return NextResponse.json({ success: false, code: 'SECTION_IDENTITY_INVALID', error: identityResolution.error }, { status: 400 });
      }
      if (patch.data !== undefined && (!patch.data || typeof patch.data !== 'object' || Array.isArray(patch.data))) {
        return NextResponse.json({ success: false, code: 'SECTION_DATA_INVALID', error: `patchSections[${index}].data must be an object` }, { status: 400 });
      }
      if (patch.visible !== undefined && typeof patch.visible !== 'boolean') {
        return NextResponse.json({ success: false, code: 'SECTION_VISIBLE_INVALID', error: `patchSections[${index}].visible must be a boolean` }, { status: 400 });
      }
      const styleError = patch.styleOverrides === undefined
        ? null
        : validateStyleOverridesForApi(
          patch.styleOverrides,
          `patchSections[${index}].styleOverrides`,
          existing.type,
          auth.tenant.industry,
          identityResolution.identity.definitionKey,
        );
      if (styleError) return NextResponse.json({ success: false, code: 'SECTION_STYLE_INVALID', error: styleError }, { status: 400 });

      const sectionUpdates: Record<string, unknown> = {};
      if (patch.data !== undefined) {
        sectionUpdates.data = normalizeSectionData(existing.type, {
          ...(existing.data as Record<string, unknown>),
          ...(patch.data as Record<string, unknown>),
        });
        const dataError = validateSections([{ type: existing.type, definitionKey: identityResolution.identity.definitionKey, data: sectionUpdates.data }], auth.tenant.industry, { hasShop: auth.addons.includes('shop'), hasBooking: auth.addons.includes('booking') });
        if (dataError) return NextResponse.json({ code: 'SECTION_DATA_INVALID', error: dataError }, { status: 400 });
      }
      if (patch.visible !== undefined) sectionUpdates.visible = patch.visible;
      if (patch.variant !== undefined) sectionUpdates.variant = patch.variant;
      sectionUpdates.definitionKey = identityResolution.identity.definitionKey;
      sectionUpdates.schemaVersion = identityResolution.identity.schemaVersion;
      if (patch.styleOverrides !== undefined) {
        const normalizedStyleOverrides = normalizeStyleOverridesForSection(existing.type, mergeSectionStylePatch(existing.styleOverrides as Record<string, unknown> | null, patch.styleOverrides), auth.tenant.industry, identityResolution.identity.definitionKey);
        sectionUpdates.styleOverrides = autoFixStyleOverridesForSectionReadability(
          existing.type,
          normalizedStyleOverrides,
          auth.tenant.industry,
          identityResolution.identity.definitionKey,
        ).styleOverrides;
      }
      if (Object.keys(sectionUpdates).length === 0) {
        return NextResponse.json({ success: false, code: 'PATCH_SECTION_NO_CHANGES', error: `patchSections[${index}] contains no mutable fields` }, { status: 400 });
      }
      preparedSectionUpdates.push({ id: patchId, values: sectionUpdates });
  }

  if (Object.keys(updates).length === 0 && preparedSectionUpdates.length === 0) {
    return NextResponse.json({ success: false, code: 'PATCH_NO_CHANGES', error: 'PATCH contains no changes' }, { status: 400 });
  }

  const writes: [BatchItem<'pg'>, ...BatchItem<'pg'>[]] = [
    db.execute(sql`SELECT id FROM pages WHERE id = ${id} AND tenant_id = ${auth.tenantId} FOR UPDATE`),
  ];
  if (Object.keys(updates).length > 0) writes.push(db.update(pages).set(updates).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId))));
  for (const prepared of preparedSectionUpdates) {
    writes.push(db.update(pageSections).set(prepared.values).where(and(
      eq(pageSections.id, prepared.id), eq(pageSections.pageId, id), eq(pageSections.tenantId, auth.tenantId),
    )));
  }
  await db.batch(writes);

  return NextResponse.json({ success: true, updatedSections: preparedSectionUpdates.length });
});

export const DELETE = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  const [page] = await db.select({ type: pages.type }).from(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId))).limit(1);
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  if (page.type === 'system') return NextResponse.json({ code: 'SYSTEM_PAGE_PROTECTED', error: 'System pages cannot be deleted through the content API.' }, { status: 409 });
  await db.delete(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  return NextResponse.json({ success: true });
});

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq, and, asc, inArray } from 'drizzle-orm';
import crypto from 'crypto';
import { withApiHandlerParams, normalizeSlug, validateSections, validateSectionIdentity, normalizeSectionData, normalizeStyleOverridesForSection, validateStyleOverridesForApi } from '@/lib/api-utils';
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
    sections: sections.map(s => ({ id: s.id, type: s.type, definitionKey: s.definitionKey, schemaVersion: s.schemaVersion, data: s.data, variant: s.variant, visible: s.visible, sortOrder: s.sortOrder, styleOverrides: s.styleOverrides })),
  });
});

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
  const db = getDb();

  const [existingPage] = await db.select({ id: pages.id }).from(pages)
    .where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)))
    .limit(1);
  if (!existingPage) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

  const updates: Record<string, unknown> = {};
  if (body.title) updates.title = body.title;
  if (body.slug != null) updates.slug = normalizeSlug(body.slug);

  if (Object.keys(updates).length > 0) {
    await db.update(pages).set(updates).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  }

  if (Array.isArray(body.sections)) {
    const sectionErr = validateSections(body.sections, auth.tenant.industry, {
      hasShop: auth.addons.includes('shop'),
      hasBooking: auth.addons.includes('booking'),
    });
    if (sectionErr) return NextResponse.json({ error: sectionErr }, { status: 400 });
    const identityResolution = resolveSectionWriteIdentities(body.sections, auth.tenant.industry);
    if (!identityResolution.ok) {
      return NextResponse.json({
        success: false,
        code: 'INVALID_SECTION_IDENTITY',
        error: identityResolution.error,
        hint: 'Omit definitionKey/schemaVersion to let the server derive them, or copy exact values from GET /api/v1/instructions.',
      }, { status: 400 });
    }

    const oldSections = await db.select({ id: pageSections.id }).from(pageSections)
      .where(and(eq(pageSections.pageId, id), eq(pageSections.tenantId, auth.tenantId)));
    const newSectionIds: string[] = [];
    if (body.sections.length > 0) {
      const replacements = body.sections.map((s: any, i: number) => {
        const sectionId = crypto.randomUUID();
        newSectionIds.push(sectionId);
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
          styleOverrides: normalizeStyleOverridesForSection(s.type, s.styleOverrides, auth.tenant.industry),
          sortOrder: i,
        };
      });
      // Insert the complete replacement set first. A validation/DB failure now
      // leaves the previous page intact instead of deleting all its sections.
      await db.insert(pageSections).values(replacements);
    }

    if (oldSections.length > 0) {
      try {
        await db.delete(pageSections).where(inArray(pageSections.id, oldSections.map(section => section.id)));
      } catch (error) {
        if (newSectionIds.length > 0) {
          await db.delete(pageSections).where(inArray(pageSections.id, newSectionIds)).catch(() => {});
        }
        throw error;
      }
    }
  }

  return NextResponse.json({ success: true });
});

const PATCH_ALLOWED_KEYS = new Set(['title', 'slug', 'visible', 'patchSections']);

export const PATCH = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
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
  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ success: false, code: 'TITLE_INVALID', error: 'title must be a non-empty string' }, { status: 400 });
    }
    updates.title = body.title.trim();
  }
  if (body.slug !== undefined) {
    if (typeof body.slug !== 'string' || !normalizeSlug(body.slug)) {
      return NextResponse.json({ success: false, code: 'SLUG_INVALID', error: 'slug must contain at least one URL-safe character' }, { status: 400 });
    }
    updates.slug = normalizeSlug(body.slug);
  }
  if (body.visible !== undefined) {
    if (typeof body.visible !== 'boolean') {
      return NextResponse.json({ success: false, code: 'VISIBLE_INVALID', error: 'visible must be a boolean' }, { status: 400 });
    }
    updates.visible = body.visible;
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
        : validateStyleOverridesForApi(patch.styleOverrides, `patchSections[${index}].styleOverrides`, existing.type, auth.tenant.industry);
      if (styleError) return NextResponse.json({ success: false, code: 'SECTION_STYLE_INVALID', error: styleError }, { status: 400 });

      const sectionUpdates: Record<string, unknown> = {};
      if (patch.data !== undefined) {
        sectionUpdates.data = normalizeSectionData(existing.type, {
          ...(existing.data as Record<string, unknown>),
          ...(patch.data as Record<string, unknown>),
        });
      }
      if (patch.visible !== undefined) sectionUpdates.visible = patch.visible;
      if (patch.variant !== undefined) sectionUpdates.variant = patch.variant;
      sectionUpdates.definitionKey = identityResolution.identity.definitionKey;
      sectionUpdates.schemaVersion = identityResolution.identity.schemaVersion;
      if (patch.styleOverrides !== undefined) {
        sectionUpdates.styleOverrides = normalizeStyleOverridesForSection(existing.type, {
          ...((existing.styleOverrides as Record<string, string> | null) || {}),
          ...(patch.styleOverrides || {}),
        }, auth.tenant.industry);
      }
      if (Object.keys(sectionUpdates).length === 0) {
        return NextResponse.json({ success: false, code: 'PATCH_SECTION_NO_CHANGES', error: `patchSections[${index}] contains no mutable fields` }, { status: 400 });
      }
      preparedSectionUpdates.push({ id: patchId, values: sectionUpdates });
  }

  if (Object.keys(updates).length === 0 && preparedSectionUpdates.length === 0) {
    return NextResponse.json({ success: false, code: 'PATCH_NO_CHANGES', error: 'PATCH contains no changes' }, { status: 400 });
  }

  if (Object.keys(updates).length > 0) {
    await db.update(pages).set(updates).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  }
  for (const prepared of preparedSectionUpdates) {
    await db.update(pageSections).set(prepared.values).where(and(
      eq(pageSections.id, prepared.id),
      eq(pageSections.pageId, id),
      eq(pageSections.tenantId, auth.tenantId),
    ));
  }

  return NextResponse.json({ success: true, updatedSections: preparedSectionUpdates.length });
});

export const DELETE = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  await db.delete(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  return NextResponse.json({ success: true });
});

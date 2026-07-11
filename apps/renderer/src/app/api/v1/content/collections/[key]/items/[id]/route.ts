import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { collectionItems } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { normalizeSectionData, normalizeStyleOverridesForSection, validateSections, withApiHandlerParams } from '@/lib/api-utils';
import { resolveSectionWriteIdentities } from '@/lib/section-write-identity';
import crypto from 'crypto';

export const GET = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  const [item] = await db.select().from(collectionItems)
    .where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json({
    id: item.id,
    title: item.title,
    slug: item.slug,
    published: item.published,
    priority: item.priority,
    data: item.data,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });
});

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
  const db = getDb();

  // Ensure all sections have IDs for DnD support
  if (body.data && Array.isArray(body.data.sections)) {
    const sectionErr = validateSections(body.data.sections, auth.tenant.industry, {
      hasShop: auth.addons.includes('shop'),
      hasBooking: auth.addons.includes('booking'),
    });
    if (sectionErr) return NextResponse.json({ error: sectionErr }, { status: 400 });
    const identityResolution = resolveSectionWriteIdentities(body.data.sections, auth.tenant.industry);
    if (!identityResolution.ok) return NextResponse.json({ error: identityResolution.error }, { status: 400 });
    body.data.sections = body.data.sections.map((s: Record<string, unknown>, index: number) => ({
      ...s,
      id: s.id || crypto.randomUUID(),
      definitionKey: identityResolution.identities[index].definitionKey,
      schemaVersion: identityResolution.identities[index].schemaVersion,
      data: normalizeSectionData(String(s.type || ''), (s.data as Record<string, unknown>) || {}),
      styleOverrides: normalizeStyleOverridesForSection(String(s.type || ''), s.styleOverrides, auth.tenant.industry),
    }));
  }

  // Only allow safe fields to be updated
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title != null) updates.title = body.title;
  if (body.slug != null) updates.slug = body.slug;
  if (body.data != null) updates.data = body.data;
  if (body.published != null) updates.published = body.published;
  if (body.priority != null) updates.priority = body.priority;

  await db.update(collectionItems).set(updates)
    .where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));

  return NextResponse.json({ ok: true });
});

export const PATCH = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
  const db = getDb();

  const [existing] = await db.select().from(collectionItems)
    .where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));
  if (!existing) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title != null) updates.title = body.title;
  if (body.slug != null) updates.slug = body.slug;
  if (body.published != null) updates.published = body.published;
  if (body.priority != null) updates.priority = body.priority;

  // Merge data fields instead of full replace
  if (body.data != null) {
    const mergedData = { ...(existing.data as Record<string, unknown>), ...body.data };
    if (Array.isArray(mergedData.sections)) {
      const sectionErr = validateSections(mergedData.sections, auth.tenant.industry, {
        hasShop: auth.addons.includes('shop'),
        hasBooking: auth.addons.includes('booking'),
      });
      if (sectionErr) return NextResponse.json({ error: sectionErr }, { status: 400 });
      const identityResolution = resolveSectionWriteIdentities(mergedData.sections as Array<{ type: string; definitionKey?: unknown; schemaVersion?: unknown }>, auth.tenant.industry);
      if (!identityResolution.ok) return NextResponse.json({ error: identityResolution.error }, { status: 400 });
      mergedData.sections = (mergedData.sections as Record<string, unknown>[]).map((s, index) => ({
        ...s,
        id: s.id || crypto.randomUUID(),
        definitionKey: identityResolution.identities[index].definitionKey,
        schemaVersion: identityResolution.identities[index].schemaVersion,
        data: normalizeSectionData(String(s.type || ''), (s.data as Record<string, unknown>) || {}),
        styleOverrides: normalizeStyleOverridesForSection(String(s.type || ''), s.styleOverrides, auth.tenant.industry),
      }));
    }
    updates.data = mergedData;
  }

  await db.update(collectionItems).set(updates)
    .where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));

  return NextResponse.json({ ok: true });
});

export const DELETE = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  await db.delete(collectionItems).where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));
  return NextResponse.json({ ok: true });
});

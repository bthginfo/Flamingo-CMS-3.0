import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { collections, collectionItems, pages, pageSections } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';
import crypto from 'crypto';
import {
  autoFixStyleOverridesForSectionReadability,
  normalizeSectionData,
  normalizeSlug,
  normalizeStyleOverridesForSection,
  validateSections,
} from '@/lib/api-utils';
import { resolveSectionWriteIdentities } from '@/lib/section-write-identity';
import {
  defaultCollectionOverviewPage,
  ensureCollectionOverviewPage,
  type CollectionOverviewPageInput,
  type CollectionOverviewSection,
  type CollectionOverviewStore,
} from '@/lib/collection-overview';

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const cols = await db.select().from(collections).where(eq(collections.tenantId, auth.tenantId)).orderBy(asc(collections.key));
  
  const items = await db.select({
    id: collectionItems.id, collectionId: collectionItems.collectionId,
    title: collectionItems.title, slug: collectionItems.slug, published: collectionItems.published,
  }).from(collectionItems).where(eq(collectionItems.tenantId, auth.tenantId));

  return NextResponse.json(cols.map(c => ({
    id: c.id,
    key: c.key,
    label: c.label,
    items: items.filter(i => i.collectionId === c.id),
  })));
}

export async function POST(req: NextRequest) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { key, label, schema: colSchema, settings, overviewPage } = body;
    if (!key || !label) return NextResponse.json({ error: 'key and label required' }, { status: 400 });

    if (!/^[a-z0-9-]+$/.test(key)) {
      return NextResponse.json({ error: 'key must be lowercase alphanumeric with hyphens only' }, { status: 400 });
    }

    const db = getDb();

    const [existing] = await db.select({ id: collections.id, label: collections.label }).from(collections)
      .where(and(eq(collections.tenantId, auth.tenantId), eq(collections.key, key)));

    const effectiveLabel = existing?.label || String(label).trim();
    const fallbackPage = defaultCollectionOverviewPage(key, effectiveLabel);
    const customPage = overviewPage && typeof overviewPage === 'object' && !Array.isArray(overviewPage)
      ? overviewPage as Record<string, unknown>
      : null;
    const page: CollectionOverviewPageInput = {
      slug: normalizeSlug(typeof customPage?.slug === 'string' ? customPage.slug : fallbackPage.slug),
      title: typeof customPage?.title === 'string' && customPage.title.trim()
        ? customPage.title.trim()
        : fallbackPage.title,
      sections: Array.isArray(customPage?.sections)
        ? customPage.sections as CollectionOverviewSection[]
        : fallbackPage.sections,
    };
    if (!page.slug) {
      return NextResponse.json({
        success: false,
        code: 'OVERVIEW_SLUG_INVALID',
        error: 'overviewPage.slug must contain at least one URL-safe character',
      }, { status: 400 });
    }

    if (body.createOverviewPage !== false) {
      const sectionError = validateSections(page.sections, auth.tenant.industry, {
        hasShop: auth.addons.includes('shop'),
        hasBooking: auth.addons.includes('booking'),
      });
      if (sectionError) {
        return NextResponse.json({
          success: false,
          code: 'INVALID_OVERVIEW_SECTIONS',
          error: sectionError,
          hint: 'Use only section types and fields documented by GET /api/v1/instructions.',
        }, { status: 400 });
      }

      const identities = resolveSectionWriteIdentities(page.sections, auth.tenant.industry);
      if (!identities.ok) {
        return NextResponse.json({
          success: false,
          code: 'INVALID_OVERVIEW_SECTION_IDENTITY',
          error: identities.error,
        }, { status: 400 });
      }

      page.sections = page.sections.map((section, index) => {
        const identity = identities.identities[index];
        const normalizedStyleOverrides = normalizeStyleOverridesForSection(
          section.type,
          section.styleOverrides,
          auth.tenant.industry,
          identity.definitionKey,
        );
        const { styleOverrides } = autoFixStyleOverridesForSectionReadability(
          section.type,
          normalizedStyleOverrides,
          auth.tenant.industry,
          identity.definitionKey,
        );
        return {
          ...section,
          definitionKey: identity.definitionKey,
          schemaVersion: identity.schemaVersion,
          data: normalizeSectionData(section.type, section.data || {}),
          styleOverrides: styleOverrides ?? undefined,
        };
      });
    }

    const requestedId = existing?.id || crypto.randomUUID();
    if (!existing) {
      await db.insert(collections).values({
        id: requestedId,
        tenantId: auth.tenantId,
        key,
        label: effectiveLabel,
        schema: colSchema || {},
        settings: settings || {},
      }).onConflictDoNothing();
    }
    const [persistedCollection] = await db.select({
      id: collections.id,
      label: collections.label,
    }).from(collections).where(and(
      eq(collections.tenantId, auth.tenantId),
      eq(collections.key, key),
    )).limit(1);
    if (!persistedCollection) {
      throw new Error(`Collection "${key}" could not be created or read.`);
    }
    const id = persistedCollection.id;

    const overviewStore: CollectionOverviewStore = {
      async findPageBySlug(tenantId, slug) {
        const [row] = await db.select({ id: pages.id, slug: pages.slug }).from(pages)
          .where(and(eq(pages.tenantId, tenantId), eq(pages.slug, slug))).limit(1);
        return row ?? null;
      },
      async insertPage(input) {
        const inserted = await db.insert(pages).values({
          id: input.id,
          tenantId: input.tenantId,
          slug: input.slug,
          title: input.title,
          type: 'collection_overview',
          status: 'published',
          visible: true,
        }).onConflictDoNothing().returning({ id: pages.id });
        return inserted.length > 0;
      },
      async insertSections(tenantId, pageId, sections) {
        if (sections.length === 0) return;
        await db.insert(pageSections).values(sections.map((section, index) => ({
          id: section.id || crypto.randomUUID(),
          tenantId,
          pageId,
          type: section.type,
          definitionKey: section.definitionKey || null,
          schemaVersion: section.schemaVersion || null,
          data: section.data || {},
          variant: section.variant || null,
          visible: section.visible !== false,
          container: section.container || 'default',
          spacingTop: section.spacingTop || 'm',
          spacingBottom: section.spacingBottom || 'm',
          anchorId: section.anchorId || null,
          styleOverrides: section.styleOverrides || null,
          sortOrder: index,
        })) as never);
      },
      async deletePage(tenantId, pageId) {
        await db.delete(pages).where(and(eq(pages.tenantId, tenantId), eq(pages.id, pageId)));
      },
    };
    const overview = await ensureCollectionOverviewPage({
      store: overviewStore,
      tenantId: auth.tenantId,
      page,
      createOverviewPage: body.createOverviewPage !== false,
    });

    return NextResponse.json({
      id,
      key,
      label: persistedCollection.label,
      operation: existing || id !== requestedId ? 'existing' : 'created',
      overviewPage: overview,
    }, { status: existing ? 200 : 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /collections error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { createHash, randomUUID } from 'node:crypto';
import { and, asc, desc, eq } from 'drizzle-orm';
import { createDb, type Database } from '@flamingo/db';
import * as schema from '../packages/db/src/schema';
import { getDb } from '../apps/marketing/src/lib/db';
import { getRequiredStandaloneDatabase } from '../apps/marketing/src/lib/tenant-data-db';

type OverviewTarget = {
  tenantSlug: string;
  collectionKey: string;
  pageSlug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  sections: Array<{
    type: string;
    container?: string;
    spacingTop?: string;
    spacingBottom?: string;
    data: Record<string, unknown>;
    styleOverrides?: Record<string, unknown>;
  }>;
  copyReplacements?: Array<[from: string, to: string]>;
};

const CONTROL_PROJECT = process.env.VERCEL_ENV_PROJECT || 'flamingo-cms-3-0';

const targets: OverviewTarget[] = [
  {
    tenantSlug: 'schuktuew',
    collectionKey: 'projekte',
    pageSlug: 'projekte',
    title: 'Projekte',
    metaTitle: 'Projekte · Alexander Schuktuew',
    metaDescription: 'Fotoprojekte aus Portrait, Business Branding, Sport, Commercial und dokumentarischer Arbeit – mit Galerien und Projektkontext.',
    copyReplacements: [
      ['Arbeiten als Kapitel, nicht als Bilderstapel.', 'Menschen, Marken und Bewegung.'],
      ['Portrait, Business, Sport, Commercial und Buchprojekte werden als klare Kapitel geführt.', 'Ich fotografiere Portraits, Business- und Kampagnenmotive, Sport, Commercials und dokumentarische Buchprojekte.'],
      ['Video-Referenzen für Social, Sport und Kampagne.', 'Bewegtbild für Social, Sport und Kampagne.'],
      ['Kurze vertikale Arbeiten als direkte Referenz: Produktion aus einer Hand, Sportmoment und bewegte Bildstrecke im nativen Reel-Format.', 'Ich produziere vertikale Filme für Markenauftritte, Sportkommunikation und Social Media – von der Idee bis zum fertigen Schnitt.'],
    ],
    sections: [
      {
        type: 'collectionHero',
        container: 'wide',
        spacingTop: 'xl',
        spacingBottom: 'l',
        data: {
          category: 'Projekte',
          headline: 'Arbeiten mit eigener Geschichte.',
          subline: 'Portrait, Kampagne, Sport und dokumentarische Projekte – mit Kontext, Auswahl und vollständiger Galerie.',
        },
        styleOverrides: {
          sectionBg: '#050505',
          headingColor: '#fff7ec',
          bodyColor: '#e8dfd4',
          mutedColor: '#b8aea2',
          accentColor: '#ef233c',
        },
      },
      {
        type: 'collectionList',
        container: 'default',
        spacingTop: 'l',
        spacingBottom: 'xl',
        data: {
          headline: 'Alle Projekte',
          subline: 'Serien, Kampagnen und freie Arbeiten mit eigener Detailseite und Galerie.',
          collectionKey: 'projekte',
          collectionBasePath: '/c/projekte',
          showImage: true,
          showDate: false,
          showExcerpt: true,
          showSortControls: true,
          sortBy: 'priority',
          columns: 3,
        },
        styleOverrides: {
          sectionBg: '#050505',
          cardBg: '#111111',
          headingColor: '#fff7ec',
          bodyColor: '#e8dfd4',
          mutedColor: '#b8aea2',
          cardHeadingColor: '#fff7ec',
          cardBodyColor: '#e8dfd4',
          cardMutedColor: '#b8aea2',
          accentColor: '#ef233c',
          btnBg: '#fff7ec',
          btnText: '#050505',
          borderColor: 'rgba(255,247,236,.16)',
        },
      },
    ],
  },
  {
    tenantSlug: 'freie-waehler-ingolstadt',
    collectionKey: 'news',
    pageSlug: 'news',
    title: 'News',
    metaTitle: 'News | Freie Wähler Ingolstadt',
    metaDescription: 'Meldungen, Anträge und Pressemitteilungen der Freien Wähler Ingolstadt mit Suche und Archiv.',
    sections: [
      {
        type: 'collectionHero',
        container: 'wide',
        spacingTop: 'xl',
        spacingBottom: 'l',
        data: {
          category: 'News & Archiv',
          headline: 'Was Ingolstadt aktuell bewegt.',
          subline: 'Meldungen, Anträge und Pressemitteilungen der Freien Wähler Ingolstadt – durchsuchbar und nach Datum geordnet.',
        },
      },
      {
        type: 'collectionList',
        container: 'default',
        spacingTop: 'l',
        spacingBottom: 'xl',
        data: {
          headline: 'Alle Meldungen',
          subline: 'Aktuelle Beiträge und das vollständige Archiv an einem Ort.',
          collectionKey: 'news',
          collectionBasePath: '/c/news',
          showImage: false,
          showDate: true,
          showExcerpt: true,
          showSortControls: true,
          showSearch: true,
          searchPlaceholder: 'Meldungen durchsuchen',
          paginate: true,
          itemsPerPage: 12,
          sortBy: 'date-desc',
          columns: 3,
        },
      },
    ],
  },
];

async function loadProjectEnvironment(projectId: string): Promise<Record<string, string>> {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token) return {};
  const response = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/env?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => null) as {
    envs?: Array<{ key: string; value?: string; target?: string[] }>;
  } | null;
  if (!response.ok || !payload?.envs) {
    throw new Error(`Vercel environment for ${projectId} could not be loaded (${response.status}).`);
  }
  return Object.fromEntries(payload.envs.flatMap((entry) => {
    const targets = Array.isArray(entry.target) ? entry.target : [];
    if (targets.length > 0 && !targets.includes('production')) return [];
    return typeof entry.value === 'string' && entry.value ? [[entry.key, entry.value]] : [];
  }));
}

async function buildSnapshot(db: Database, tenantId: string) {
  const [allPages, allSections, allCollections, allItems] = await Promise.all([
    db.select().from(schema.pages).where(eq(schema.pages.tenantId, tenantId)).orderBy(asc(schema.pages.sortOrder)),
    db.select().from(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId)).orderBy(asc(schema.pageSections.sortOrder)),
    db.select().from(schema.collections).where(eq(schema.collections.tenantId, tenantId)),
    db.select().from(schema.collectionItems).where(and(
      eq(schema.collectionItems.tenantId, tenantId),
      eq(schema.collectionItems.published, true),
    )).orderBy(asc(schema.collectionItems.priority)),
  ]);
  return {
    pages: allPages.map(page => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      visible: page.visible,
      sections: allSections.filter(section => section.pageId === page.id).map(section => ({
        id: section.id,
        type: section.type,
        definitionKey: section.definitionKey,
        schemaVersion: section.schemaVersion,
        variant: section.variant,
        visible: section.visible,
        locked: section.locked,
        sortOrder: section.sortOrder,
        container: section.container,
        spacingTop: section.spacingTop,
        spacingBottom: section.spacingBottom,
        anchorId: section.anchorId,
        data: section.data,
        styleOverrides: section.styleOverrides,
      })),
    })),
    collections: allCollections.map(collection => ({
      id: collection.id,
      key: collection.key,
      label: collection.label,
      schema: collection.schema,
      settings: collection.settings,
      items: allItems.filter(item => item.collectionId === collection.id).map(item => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        data: item.data,
        priority: item.priority,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    })),
    generatedAt: new Date().toISOString(),
  };
}

async function publishTargetedSnapshot(db: Database, tenantId: string, pageSlug: string) {
  const [active] = await db.select({
    snapshot: schema.publishedSnapshots.snapshot,
  }).from(schema.publishedSnapshots).where(and(
    eq(schema.publishedSnapshots.tenantId, tenantId),
    eq(schema.publishedSnapshots.isActive, true),
  )).limit(1);
  const [page] = await db.select().from(schema.pages).where(and(
    eq(schema.pages.tenantId, tenantId),
    eq(schema.pages.slug, pageSlug),
  )).limit(1);
  if (!page) throw new Error(`Page ${pageSlug} missing while publishing targeted snapshot.`);

  const pageSections = await db.select().from(schema.pageSections).where(and(
    eq(schema.pageSections.tenantId, tenantId),
    eq(schema.pageSections.pageId, page.id),
  )).orderBy(asc(schema.pageSections.sortOrder));
  const pageSnapshot = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    visible: page.visible,
    sections: pageSections.map(section => ({
      id: section.id,
      type: section.type,
      definitionKey: section.definitionKey,
      schemaVersion: section.schemaVersion,
      variant: section.variant,
      visible: section.visible,
      locked: section.locked,
      sortOrder: section.sortOrder,
      container: section.container,
      spacingTop: section.spacingTop,
      spacingBottom: section.spacingBottom,
      anchorId: section.anchorId,
      data: section.data,
      styleOverrides: section.styleOverrides,
    })),
  };

  const activeSnapshot = active?.snapshot && typeof active.snapshot === 'object'
    ? active.snapshot as Record<string, unknown>
    : null;
  const activePages = activeSnapshot && Array.isArray(activeSnapshot.pages)
    ? activeSnapshot.pages as Array<Record<string, unknown>>
    : [];
  if (activePages.some(item => item.slug === pageSlug)) return false;

  const snapshot = activeSnapshot
    ? { ...activeSnapshot, pages: [...activePages, pageSnapshot], generatedAt: new Date().toISOString() }
    : await buildSnapshot(db, tenantId);
  const checksum = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  const [latest] = await db.select({ version: schema.publishedSnapshots.version })
    .from(schema.publishedSnapshots)
    .where(eq(schema.publishedSnapshots.tenantId, tenantId))
    .orderBy(desc(schema.publishedSnapshots.version))
    .limit(1);
  await db.update(schema.publishedSnapshots).set({ isActive: false }).where(and(
    eq(schema.publishedSnapshots.tenantId, tenantId),
    eq(schema.publishedSnapshots.isActive, true),
  ));
  await db.insert(schema.publishedSnapshots).values({
    tenantId,
    version: (latest?.version ?? 0) + 1,
    snapshot,
    checksum,
    createdBy: 'script:ensure-collection-overview-pages',
    isActive: true,
  });
  return true;
}

function replaceCopy(value: unknown, replacements: Array<[string, string]>) {
  let serialized = JSON.stringify(value);
  for (const [from, to] of replacements) serialized = serialized.replaceAll(from, to);
  return JSON.parse(serialized) as unknown;
}

async function patchTargetedCopy(db: Database, tenantId: string, replacements: Array<[string, string]>) {
  if (!replacements.length) return;
  const sections = await db.select({
    id: schema.pageSections.id,
    data: schema.pageSections.data,
  }).from(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  for (const section of sections) {
    const patched = replaceCopy(section.data, replacements);
    if (JSON.stringify(patched) === JSON.stringify(section.data)) continue;
    await db.update(schema.pageSections).set({ data: patched as Record<string, unknown> }).where(and(
      eq(schema.pageSections.tenantId, tenantId),
      eq(schema.pageSections.id, section.id),
    ));
  }

  const [active] = await db.select().from(schema.publishedSnapshots).where(and(
    eq(schema.publishedSnapshots.tenantId, tenantId),
    eq(schema.publishedSnapshots.isActive, true),
  )).limit(1);
  if (!active) return;
  const patchedSnapshot = replaceCopy(active.snapshot, replacements);
  if (JSON.stringify(patchedSnapshot) === JSON.stringify(active.snapshot)) return;
  const checksum = createHash('sha256').update(JSON.stringify(patchedSnapshot)).digest('hex');
  const [latest] = await db.select({ version: schema.publishedSnapshots.version })
    .from(schema.publishedSnapshots)
    .where(eq(schema.publishedSnapshots.tenantId, tenantId))
    .orderBy(desc(schema.publishedSnapshots.version))
    .limit(1);
  await db.update(schema.publishedSnapshots).set({ isActive: false }).where(and(
    eq(schema.publishedSnapshots.tenantId, tenantId),
    eq(schema.publishedSnapshots.isActive, true),
  ));
  await db.insert(schema.publishedSnapshots).values({
    tenantId,
    version: (latest?.version ?? 0) + 1,
    snapshot: patchedSnapshot as Record<string, unknown>,
    checksum,
    createdBy: 'script:ensure-collection-overview-pages:copy',
    isActive: true,
  });
}

async function ensureTarget(controlDb: Database, target: OverviewTarget) {
  const [tenant] = await controlDb.select({
    id: schema.tenants.id,
    vercelProjectId: schema.tenants.vercelProjectId,
  }).from(schema.tenants).where(eq(schema.tenants.slug, target.tenantSlug)).limit(1);
  if (!tenant) throw new Error(`Tenant ${target.tenantSlug} not found.`);

  let db: Database | null = null;
  if (
    process.env.CRM_CONFIG_ENCRYPTION_KEY?.trim()
    || process.env.CONFIG_ENCRYPTION_KEY?.trim()
  ) {
    try {
      db = (await getRequiredStandaloneDatabase(tenant.id)).db;
    } catch (error) {
      console.warn(
        `Standalone registry lookup failed for ${target.tenantSlug}; trying explicit/Vercel environment.`,
        error instanceof Error ? error.message : error,
      );
    }
  }
  if (!db) {
    const explicitKey = `${target.tenantSlug.toUpperCase().replace(/-/g, '_')}_DATABASE_URL`;
    const projectEnvironment = tenant.vercelProjectId
      ? await loadProjectEnvironment(tenant.vercelProjectId)
      : {};
    const databaseUrl = process.env[explicitKey]
      || projectEnvironment.DATABASE_URL
      || projectEnvironment.TENANT_DATABASE_URL;
    if (!databaseUrl?.startsWith('postgres')) {
      throw new Error(`No standalone DATABASE_URL available for ${target.tenantSlug}.`);
    }
    db = createDb(databaseUrl);
  }
  await patchTargetedCopy(db, tenant.id, target.copyReplacements || []);

  const [collection] = await db.select({ id: schema.collections.id })
    .from(schema.collections)
    .where(and(
      eq(schema.collections.tenantId, tenant.id),
      eq(schema.collections.key, target.collectionKey),
    ))
    .limit(1);
  if (!collection) throw new Error(`Collection ${target.collectionKey} missing for ${target.tenantSlug}.`);

  const [existing] = await db.select({ id: schema.pages.id })
    .from(schema.pages)
    .where(and(eq(schema.pages.tenantId, tenant.id), eq(schema.pages.slug, target.pageSlug)))
    .limit(1);
  if (existing) {
    const published = await publishTargetedSnapshot(db, tenant.id, target.pageSlug);
    console.log(JSON.stringify({
      tenant: target.tenantSlug,
      page: target.pageSlug,
      status: published ? 'existing-published' : 'existing',
    }));
    return;
  }

  const [lastPage] = await db.select({ sortOrder: schema.pages.sortOrder })
    .from(schema.pages)
    .where(eq(schema.pages.tenantId, tenant.id))
    .orderBy(desc(schema.pages.sortOrder))
    .limit(1);
  const pageId = randomUUID();
  await db.insert(schema.pages).values({
    id: pageId,
    tenantId: tenant.id,
    title: target.title,
    slug: target.pageSlug,
    type: 'collection_overview',
    status: 'published',
    visible: true,
    sortOrder: (lastPage?.sortOrder ?? 0) + 1,
  });
  try {
    await db.insert(schema.pageSections).values(target.sections.map((section, index) => ({
      id: randomUUID(),
      tenantId: tenant.id,
      pageId,
      type: section.type,
      data: section.data,
      styleOverrides: section.styleOverrides || null,
      visible: true,
      container: section.container || 'default',
      spacingTop: section.spacingTop || 'm',
      spacingBottom: section.spacingBottom || 'm',
      sortOrder: index,
    })));
    await db.insert(schema.seoPage).values({
      tenantId: tenant.id,
      pageId,
      metaTitle: target.metaTitle,
      metaDescription: target.metaDescription,
    });
  } catch (error) {
    await db.delete(schema.pages).where(and(eq(schema.pages.tenantId, tenant.id), eq(schema.pages.id, pageId)));
    throw error;
  }
  await publishTargetedSnapshot(db, tenant.id, target.pageSlug);
  console.log(JSON.stringify({ tenant: target.tenantSlug, page: target.pageSlug, status: 'created-and-published' }));
}

async function main() {
  if (!process.env.DATABASE_URL) {
    const controlEnvironment = await loadProjectEnvironment(CONTROL_PROJECT);
    if (controlEnvironment.DATABASE_URL) process.env.DATABASE_URL = controlEnvironment.DATABASE_URL;
  }
  if (!process.env.DATABASE_URL?.startsWith('postgres')) {
    throw new Error('DATABASE_URL or VERCEL_TOKEN is required for the control database.');
  }
  const controlDb = getDb();
  for (const target of targets) await ensureTarget(controlDb, target);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

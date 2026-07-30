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
      ['Eine vertikale Referenz für Marken, die nicht nur einzelne Bilder, sondern direkt nutzbaren Content brauchen.', 'Ich entwickle Foto und Film gemeinsam – vom Konzept bis zu fertigen Formaten für Website, Social Media und Kampagne.'],
      ['Sport als bewegte Referenz', 'Sport in Bewegung'],
      ['Golf, Timing und Bewegung im Reel-Format – konzipiert für Social, Website und Kampagnenkontext.', 'Beim Sportfilm zählen Timing, Perspektive und Rhythmus. Daraus entsteht Bewegtbild für Social Media, Website und Kampagne.'],
      ['Video-Asset im Hochformat', 'Produkt im Fokus'],
      ['Ein weiteres Reel als Beispiel für kurze, verwertbare Bildstrecken mit klarer visueller Linie.', 'Kurze Produktfilme verdichten Licht, Bewegung und Schnitt zu einem klaren visuellen Auftritt.'],
      ['AI Workflows', 'AI + Fotografie'],
      ['Ich teste die Bildwelt, bevor wir sie produzieren.', 'Ich mache Ideen sichtbar, bevor sie teuer werden.'],
      ['Ich nutze KI nicht als Selbstzweck. Sie hilft mir, Wirkung, Look, Zuschnitt und Ausgabe früh zu prüfen — bevor Foto, Film und Retusche Zeit kosten.', 'Mit kontrollierten AI-Looktests entwickle ich Licht, Farbe, Perspektive und Formate, bevor wir produzieren. So gehen Foto und Film mit einer klaren Bildidee ins Set.'],
      ['Vorher / Nachher', 'Lookentwicklung'],
      ['Ein Motiv muss tragen, bevor es fertig aussieht.', 'Eine Idee. Zwei Bildwelten.'],
      ['Ich prüfe Licht, Farbe, Tiefe und Format früh. So wird sichtbar, ob aus einem Motiv ein Website-Hero, Kampagnenbild oder Social-Asset werden kann.', 'Aus einem neutralen Ausgangsmotiv entwickle ich eine visuelle Richtung, die zu Marke, Kampagne und Medium passt.'],
      ['Die AI-Variante ist ein Prüfstand für Wirkung und Bildsprache — nicht das Endprodukt.', 'Der Looktest macht Licht, Farbe und Atmosphäre früh entscheidbar.'],
      ['Produktionslogik', 'Von der Idee zur Produktion'],
      ['Vom ersten Eindruck zur fertigen Strecke.', 'Erst die Richtung. Dann das Bild.'],
      ['Ich arbeite nicht linear von Shooting zu Export. Ich plane rückwärts vom späteren Einsatz: Wo erscheint das Motiv, wie nah muss es sein, welches Format braucht es?', 'Ich plane vom späteren Einsatz zurück: Welche Wirkung braucht das Motiv, welche Perspektive trägt sie und welche Formate müssen am Ende funktionieren?'],
      ['vor Kamera und KI', 'vor der Gestaltung'],
      ['als Entscheidung', 'als klare Richtung'],
      ['mit Ausgabe im Kopf', 'für Foto und Film'],
      ['Am Ende stehen verwendbare Assets.', 'Am Ende stehen fertige Formate.'],
      ['statt Rohdatenchaos', 'bereit für den Einsatz'],
      ['Bildaufbau', 'Bildentscheidung'],
      ['Ich zerlege ein Motiv nach seiner späteren Aufgabe.', 'Jedes Detail arbeitet für die Wirkung.'],
      ['Nicht jede gute Aufnahme funktioniert automatisch als Website-Hero, Reel-Cover oder Kampagnenmotiv. Diese Fragen kläre ich früh.', 'Botschaft, Raum, Licht und Zuschnitt stimme ich vor dem Shooting aufeinander ab – damit das Motiv dort funktioniert, wo es gebraucht wird.'],
      ['Ein Motiv muss in mehreren Situationen funktionieren.', 'Die Bildwelt bleibt wiedererkennbar.'],
      ['Ich plane nicht nur das schöne Einzelbild. Ich plane die Varianten, die später wirklich gebraucht werden.', 'Vom Website-Hero bis zum Reel-Cover: Ich entwickle Varianten, die zusammengehören und für ihren jeweiligen Einsatz gestaltet sind.'],
      ['Workflow-Karte', 'Zusammenarbeit'],
      ['So bleibt ein Projekt kontrolliert, ohne steif zu werden.', 'Klare Entscheidungen. Genug Raum für den Moment.'],
      ['Die Karte zeigt, welche Entscheidungen früh fallen und wo im Prozess noch Spielraum bleibt.', 'Wir legen Wirkung und Bildsprache früh fest. Am Set bleibt dadurch mehr Freiheit für echte Situationen, Ausdruck und Bewegung.'],
      ['Sie bekommen sortierte Assets für Website, Social, Kampagne und Print.', 'Sie erhalten fertig aufbereitete Dateien für Website, Social Media, Kampagne und Print.'],
      ['AI Production System', 'Foto + Film'],
      ['Foto, Film und Content aus einer Hand.', 'Ein Auftritt. Eine Bildsprache. Alle Formate.'],
      ['Konzept, Bildwelt, Shooting, Schnitt und Formatadaption greifen ineinander. So entsteht ein konsistenter visueller Auftritt für Website, Social, Kampagne und Recruiting.', 'Ich verbinde Konzept, Fotografie, Film und Schnitt zu einem Auftritt, der auf Website, Social Media, in Kampagnen und im Recruiting wiedererkennbar bleibt.'],
      ['Produktion für Content, Kampagnen und Social Assets.', 'Fotografie und Film für Marken, Unternehmen und Persönlichkeiten.'],
      ['Nutzbare Assets liefern', 'Bereit für Ihre Kanäle'],
      ['Sie bekommen Bild- und Filmdateien, die nicht nur gut aussehen, sondern Vertrauen aufbauen und Entscheidungen beeinflussen.', 'Sie erhalten fertig aufbereitete Bilder und Filme für Website, Social Media, Kampagne, Recruiting und Print.'],
      ['Kampagnenfähig', 'Direkt einsetzbar'],
      ['Production System', 'Arbeitsweise'],
      ['So wird aus einem Motiv ein kompletter Markenauftritt.', 'Gute Bilder beginnen lange vor dem Auslösen.'],
      ['Ich zerlege ein Projekt vor der Produktion in Wirkung, Bildsprache, Führung, Formate und Auslieferung. Dadurch entstehen nicht nur einzelne Bilder, sondern Assets für Website, Social, Kampagne und Recruiting.', 'Ich verbinde Ziel, Bildsprache, Führung und Finish zu einer Produktion, die Menschen glaubwürdig zeigt und Marken unverwechselbar macht.'],
      ['Briefing', 'Konzept'],
      ['Ich kläre Ziel, Zielgruppe, Einsatzkanäle und gewünschte Wirkung, bevor Kamera oder AI ins Spiel kommen.', 'Ich kläre Ziel, Zielgruppe, Einsatzkanäle und gewünschte Wirkung, bevor die Kamera ins Spiel kommt.'],
      ['Licht, Farbe, Perspektive und Setting werden als klare visuelle Linie für Marke, Mensch oder Kampagne angelegt.', 'Licht, Farbe, Perspektive und Setting formen eine klare visuelle Linie für Marke, Mensch oder Kampagne.'],
      ['AI Workflow', 'Looktests'],
      ['KI nutze ich kontrolliert für Varianten, Planung und Adaptionen – nicht als Zufallsgenerator, sondern als Erweiterung der Bildwelt.', 'Mit kontrollierten AI-Tests prüfe ich Varianten und Formate, bevor wir Zeit in die Produktion investieren.'],
      ['Geliefert werden nutzbare Dateien für Website, Social Media, Kampagnen, Recruiting, Präsentation und Print.', 'Sie erhalten fertige Bilder und Filme für Website, Social Media, Kampagnen, Recruiting und Print.'],
      ['Von Portrait bis Buchprojekt.', 'Arbeiten mit eigener Haltung.'],
      ['Die wichtigsten Linien aus Portrait, Business, Sport, Commercial und Buchprojekten.', 'Portraits, Kampagnen, Sport und freie Serien – konzentriert auf Menschen, Bewegung und eine klare visuelle Idee.'],
      ['Work Map', 'Portfolio entdecken'],
      ['Portfolio als visuelle Landkarte.', 'Arbeiten, die für sich sprechen.'],
      ['Eine reduzierte Bildlandkarte aus Portrait, Sport, Commercial und Buchprojekten – performant kuratiert statt überladen.', 'Portraits, Kampagnen, Sport und freie Serien – mit Raum für Nähe, Bewegung und Details.'],
      ['Cases', 'Ausgewählte Arbeiten'],
      ['Ausgewählte Linien.', 'Serien mit eigener Haltung.'],
      ['Ausgewählte Projekte mit direktem Weg zur Detailseite und Galerie.', 'Jedes Projekt folgt seinem eigenen Rhythmus: von leisen Portraits bis zu Bewegung, Marke und dokumentarischer Beobachtung.'],
      ['Serien, Kampagnen und freie Arbeiten mit eigener Detailseite und Galerie.', 'Serien, Kampagnen und freie Arbeiten – mit Bildern, Kontext und eigener Geschichte.'],
      ['Portraits, Stills und dokumentarische Motive.', 'Portraits, freie Serien und Bücher.'],
      ['Auswahl aus Portrait, Studio, Buchprojekten und freien Arbeiten – dichter und näher an der ursprünglichen Info-Seite.', 'Arbeiten zwischen Nähe, klarer Form und dokumentarischer Beobachtung.'],
      ['Projekt auf einen Blick.', 'Eine Bildwelt für den ganzen Auftritt.'],
      ['Bereich, Umfang und Einsatz der Arbeit.', 'Von Portraits bis Kampagnenmotiven – konsistent über alle relevanten Kanäle.'],
      ['Projektprofil', 'Arbeitsweise'],
      ['Was die Serie ausmacht.', 'Klar positioniert. Sicher fotografiert.'],
      ['Auswahl aus der Projektgalerie.', 'Portraits, Details und Motive aus der Serie.'],
      ['Ähnliches Projekt', 'Ihr Projekt'],
      ['Eine starke Bildwelt planen?', 'Wie soll Ihr Auftritt wirken?'],
      ['Kurz Projektziel, Einsatzkanäle und Timing senden.', 'Gemeinsam entwickeln wir eine Bildwelt, die zu Ihrer Marke, Ihren Menschen und Ihrem Einsatz passt.'],
      ['Sport, Bewegung und Timing werden so fotografiert und geschnitten, dass aus einem Moment Material für Social, Website und Kampagne entsteht.', 'Ich fotografiere Sport dort, wo Konzentration in Bewegung kippt – präzise im Timing, nah am Moment und mit einem klaren Gefühl für Rhythmus.'],
      ['Serie zur Präsentation eines neuen Modells des ikonischen CONVERSE-Schuhs; gezeigt im Berliner Flagshipstore in Mitte.', 'Für die Präsentation eines neuen CONVERSE-Modells entwickelte ich eine Serie, die im Berliner Flagshipstore in Mitte gezeigt wurde.'],
      ['Buch: „INGOLSTADT“, 2021 – aus 15 Jahren analoger Fotografie editiert. Stückzahl 500, 149 Seiten, Vorwort von Architekt A. Häusler.', 'Für mein Buch „INGOLSTADT“ habe ich 15 Jahre analoge Fotografie zu einer persönlichen Sicht auf die Stadt verdichtet. Erschienen 2021 mit einem Vorwort von Architekt A. Häusler.'],
      ['Die Motive zeigen die visuelle Linie der Serie und machen den Charakter des Projekts schnell erfassbar.', 'Übersichten, Details und Momente verbinden sich zu einer zusammenhängenden Serie.'],
      ['Die Motive zeigen, wie der Look auf Website, Social und Kampagne wirkt.', 'Licht, Perspektive und Bildrhythmus geben der Arbeit ihren eigenen Charakter.'],
      ['Portfolio · Website · Anfrage', 'Fotografie · Bildserie'],
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

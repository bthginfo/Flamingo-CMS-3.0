import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  containsBannedCopy,
  legacyChromeReason,
  mergeRepairIntoDraftSection,
  patchSnapshot,
  repairPage,
  type RepairPage,
  type RepairSection,
} from './lib/freie-waehler-content-repair';
import {
  buildFwCacheInvalidationUrl,
  invalidateFwRendererCache,
} from './lib/renderer-cache-invalidation';

function section(id: string, type: string, sortOrder: number, data: Record<string, unknown>): RepairSection {
  return {
    id,
    type,
    definitionKey: `${type}.shared.v1`,
    schemaVersion: 1,
    variant: null,
    visible: true,
    locked: false,
    sortOrder,
    container: 'default',
    spacingTop: 'l',
    spacingBottom: 'l',
    anchorId: null,
    data,
    styleOverrides: null,
  };
}

test('detects banned import and direction copy', () => {
  assert.equal(containsBannedCopy({ headline: 'Informationen aus der bisherigen Seite' }), true);
  assert.equal(containsBannedCopy({ title: 'Worum es geht' }), true);
  assert.equal(containsBannedCopy({ title: 'Externer Inhalt – Inhalte anzeigen' }), true);
  assert.equal(containsBannedCopy({ title: 'Weitere Informationen folgen.' }), true);
  assert.equal(containsBannedCopy({ text: 'Hierbei werden Daten an Facebook &uuml;bertragen.' }), true);
  assert.equal(containsBannedCopy({ text: 'Importierte Inhalte aus der alten Website' }), true);
  assert.equal(containsBannedCopy({ text: 'Das Layout der Source Page wird als Cards übernommen.' }), true);
  assert.equal(containsBannedCopy({ text: 'Diese Sektion folgt der bisherigen Website-Mechanik.' }), true);
  assert.equal(containsBannedCopy({ text: 'Direkter Kontakt für den Stadtbezirk.' }), false);
});

test('repairs a BZA detail page in place and remains idempotent', () => {
  const page: RepairPage = {
    id: 'page-bza',
    title: 'Stadtbezirk 1 Mitte',
    slug: 'bezirksausschuesse/bza-01-mitte',
    visible: true,
    sections: [
      section('hero', 'editorialHero', 0, { headline: 'Stadtbezirk 1 Mitte', text: 'Navigation und alter Seiteninhalt' }),
      section('generic', 'spotlightCards', 1, {
        headline: 'Informationen aus der bisherigen Seite',
        cards: [{ title: 'Worum es geht', text: 'Importtext' }],
      }),
      section('raw', 'richText', 2, {
        content: '<h4>Franz Ullinger</h4><p>Beruf: Berufsschullehrer Vorsitzender des BZA Mitte E-Mail: franz.ullinger@fw-ingolstadt.de</p><a href="https://example.test/bza-01.pdf">Stadtbezirk als PDF</a>',
      }),
      section('cta', 'ctaBand', 3, { headline: 'Ein Thema aus dem Bezirk melden?' }),
    ],
  };
  const result = repairPage(page);
  assert.equal(result.changed, true);
  assert.deepEqual(result.page.sections.map((entry) => entry.id), ['hero', 'generic', 'raw', 'cta']);
  assert.deepEqual(result.page.sections.map((entry) => entry.type), ['editorialHero', 'teamSpotlight', 'spotlightCards', 'ctaBand']);
  assert.equal(result.page.sections.some((entry) => entry.type === 'richText'), false);
  assert.match(JSON.stringify(result.page), /Franz Ullinger/);
  assert.match(JSON.stringify(result.page), /franz\.ullinger@fw-ingolstadt\.de/);
  assert.match(JSON.stringify(result.page), /bza-01\.pdf/);
  assert.equal(containsBannedCopy(result.page), false);

  const secondRun = repairPage(result.page);
  assert.equal(secondRun.changed, false);
  assert.deepEqual(secondRun.page, result.page);
});

test('removes only noisy core-page sections', () => {
  const page: RepairPage = {
    id: 'page-core',
    title: 'Bezirksausschüsse',
    slug: 'bezirksausschuesse',
    visible: true,
    sections: [
      section('hero', 'editorialHero', 0, { text: 'Alter Sammeltext' }),
      section('list', 'collectionList', 1, { subline: 'Informationen aus der bisherigen Website.' }),
      section('noise', 'spotlightCards', 2, { cards: [{ title: 'Nächster Schritt', text: 'Facebook-Feed' }] }),
      section('cta', 'ctaBand', 3, { headline: 'Anliegen senden' }),
    ],
  };
  const result = repairPage(page);
  assert.deepEqual(result.deleteIds, ['noise']);
  assert.deepEqual(result.page.sections.map((entry) => entry.id), ['hero', 'list', 'cta']);
  assert.match(String(result.page.sections[0].data.text), /Stadtteilen/);
  assert.equal(containsBannedCopy(result.page), false);
});

test('sanitizes collection-list contamination without deleting the collection', () => {
  const page: RepairPage = {
    id: 'page-events',
    title: 'Veranstaltungen',
    slug: 'veranstaltungen',
    visible: true,
    sections: [
      section('hero', 'editorialHero', 0, { text: 'Termine' }),
      section('list', 'collectionList', 1, {
        headline: 'Termine',
        subline: 'Externer Inhalt – Inhalte anzeigen',
        collectionKey: 'events',
        items: [{ title: 'Bürgergespräch', excerpt: 'Austausch in Ingolstadt.' }],
      }),
    ],
  };
  const result = repairPage(page);
  const list = result.page.sections.find((entry) => entry.id === 'list');
  assert.equal(list?.type, 'collectionList');
  assert.equal(list?.data.subline, '');
  assert.deepEqual(list?.data.items, [{ title: 'Bürgergespräch', excerpt: 'Austausch in Ingolstadt.' }]);
  assert.equal(containsBannedCopy(result.page), false);
});

test('sparse BZA input produces a visible resource section, never an empty team', () => {
  const page: RepairPage = {
    id: 'page-sparse',
    title: 'Stadtbezirk 2 Nordwest',
    slug: 'bezirksausschuesse/bza-02-nordwest',
    visible: true,
    sections: [
      section('hero', 'editorialHero', 0, { text: 'Alter Text' }),
      section('noise', 'richText', 1, { content: '<p>Externer Inhalt. Inhalte anzeigen.</p>' }),
    ],
  };
  const result = repairPage(page);
  assert.deepEqual(result.page.sections.map((entry) => entry.type), ['editorialHero', 'spotlightCards']);
  assert.ok(Array.isArray(result.page.sections[1].data.cards) && result.page.sections[1].data.cards.length > 0);
  assert.equal(result.page.sections.some((entry) => entry.type === 'teamSpotlight'), false);
});

test('target-aware detector removes standalone BZA membership chrome but preserves intentional CTA', () => {
  const membership = section('membership', 'spotlightCards', 1, {
    cards: [{
      title: 'Mitglied werden',
      text: 'Mitgliedsantrag herunterladen und das ausgefüllte Beitrittsformular einsenden.',
      href: '/mitgliedsantrag.pdf',
      ctaLabel: 'Mitgliedsantrag',
    }],
  });
  const cta = section('cta', 'ctaBand', 2, {
    headline: 'In Ingolstadt mitgestalten.',
    subline: 'Wir freuen uns über Menschen, die sich kommunal engagieren möchten.',
    ctaPrimary: { label: 'Mitglied werden', href: '/mitmachen' },
  });
  const page: RepairPage = {
    id: 'bza-membership',
    title: 'Stadtbezirk 3 Nordost',
    slug: 'bezirksausschuesse/bza-03-nordost',
    visible: true,
    sections: [
      section('hero', 'editorialHero', 0, { text: 'Kontakt im Stadtbezirk.' }),
      membership,
      cta,
    ],
  };
  assert.equal(legacyChromeReason(page, membership), 'legacy-membership');
  assert.equal(legacyChromeReason(page, cta), null);
  const result = repairPage(page);
  assert.equal(result.page.sections.some((entry) => entry.id === 'membership' && entry.type === 'spotlightCards'), true);
  assert.deepEqual(result.page.sections.find((entry) => entry.id === 'cta'), cta);
  assert.doesNotMatch(JSON.stringify(result.page.sections.find((entry) => entry.id === 'membership')), /Mitgliedsantrag|Beitrittsformular/);
});

test('target-aware detector removes imported core navigation and footer fragments', () => {
  const navigation = section('nav', 'spotlightCards', 1, {
    cards: ['Aktuelles', 'Vorstand', 'Fraktion', 'Veranstaltungen', 'Kontakt']
      .map((title) => ({ title, href: `/${title.toLocaleLowerCase('de-DE')}` })),
  });
  const footer = section('footer', 'content', 2, {
    text: '© 2026 Freie Wähler Ingolstadt · Alle Rechte vorbehalten · Impressum · Datenschutz',
  });
  const legitimate = section('participate', 'spotlightCards', 3, {
    cards: [{
      title: 'Mitglied werden',
      text: 'Wer unsere kommunale Arbeit dauerhaft unterstützen möchte, findet hier den direkten Einstieg.',
      href: '/mitmachen',
      ctaLabel: 'Mehr erfahren',
    }],
  });
  const page: RepairPage = {
    id: 'core-chrome',
    title: 'Vorstand',
    slug: 'vorstand',
    visible: true,
    sections: [
      section('hero', 'editorialHero', 0, { text: 'Vorstand der Freien Wähler Ingolstadt.' }),
      navigation,
      footer,
      legitimate,
    ],
  };
  assert.equal(legacyChromeReason(page, navigation), 'legacy-navigation');
  assert.equal(legacyChromeReason(page, footer), 'legacy-footer');
  assert.equal(legacyChromeReason(page, legitimate), null);
  const result = repairPage(page);
  assert.deepEqual(result.deleteIds.sort(), ['footer', 'nav']);
  assert.equal(result.page.sections.some((entry) => entry.id === 'participate'), true);
});

test('duplicate CTA fragment is removed while the intentional CTA remains', () => {
  const duplicate = section('duplicate', 'spotlightCards', 1, {
    cards: [{ title: 'Kontakt', text: 'Kontakt aufnehmen.', href: '/kontakt', ctaLabel: 'Kontakt aufnehmen' }],
  });
  const intentional = section('intentional', 'ctaBand', 2, {
    headline: 'Sprechen Sie uns an.',
    ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' },
  });
  const page: RepairPage = {
    id: 'duplicate-cta-page',
    title: 'Kreisvereinigung',
    slug: 'kreisvereinigung',
    visible: true,
    sections: [
      section('hero', 'editorialHero', 0, { text: 'Kommunales Engagement bündeln.' }),
      duplicate,
      intentional,
    ],
  };
  assert.equal(legacyChromeReason(page, duplicate), 'duplicate-cta');
  assert.equal(legacyChromeReason(page, intentional), null);
  const result = repairPage(page);
  assert.deepEqual(result.deleteIds, ['duplicate']);
  assert.equal(result.page.sections.some((entry) => entry.id === 'intentional'), true);
});

test('collects media links from all legacy sections and never creates empty cards', () => {
  const page: RepairPage = {
    id: 'page-media',
    title: 'Medien',
    slug: 'medien',
    visible: true,
    sections: [
      section('hero', 'editorialHero', 0, { text: 'Alter Sammeltext' }),
      section('generic', 'spotlightCards', 1, {
        headline: 'Informationen aus der bisherigen Seite',
        cards: [{ title: 'Worum es geht', text: 'Importtext' }],
      }),
      section('raw', 'richText', 2, {
        content: '<a href="https://example.test/film">Film ansehen</a><a href="/downloads/zeitung.pdf">Zeitung laden</a>',
      }),
    ],
  };
  const result = repairPage(page);
  const media = result.page.sections.find((entry) => entry.id === 'generic');
  assert.equal(media?.type, 'spotlightCards');
  assert.match(JSON.stringify(media?.data.cards), /example\.test\/film/);
  assert.match(JSON.stringify(media?.data.cards), /zeitung\.pdf/);
  assert.ok(Array.isArray(media?.data.cards) && media.data.cards.length > 0);
});

test('patches only matching pages in an active snapshot', () => {
  const repaired: RepairPage = {
    id: 'target',
    title: 'Target',
    slug: 'vorstand',
    visible: true,
    sections: [section('s1', 'team', 0, { headline: 'Vorstand' })],
  };
  const source = {
    pages: [
      { id: 'target', title: 'Old', slug: 'vorstand', visible: true, sections: [section('s1', 'team', 0, { headline: 'Old' })] },
      { id: 'untouched', title: 'News', slug: 'aktuelles', visible: true, sections: [{ id: 'news' }] },
    ],
    collections: [{ id: 'news', items: [1, 2, 3] }],
    generatedAt: 'before',
  };
  const repair = {
    page: repaired,
    changed: true,
    upserts: repaired.sections,
    deleteIds: [],
    beforeTypes: [],
    afterTypes: ['team'],
  };
  const patched = patchSnapshot(source, [repair], 'after') as typeof source;
  assert.equal(patched.generatedAt, 'after');
  assert.deepEqual(patched.pages[0].sections, repaired.sections);
  assert.deepEqual(patched.pages[1], source.pages[1]);
  assert.deepEqual(patched.collections, source.collections);
});

test('active snapshot remains authoritative when draft page and untouched section diverge', () => {
  const activeChanged = section('changed', 'editorialHero', 0, {
    headline: 'Vorstand',
    text: 'Alter aktiver Introtext',
    imagePrimary: '/active-image.jpg',
  });
  const activeUntouched = section('untouched', 'ctaBand', 1, { headline: 'Aktive CTA' });
  const activePage: RepairPage = {
    id: 'page',
    title: 'Aktiver Titel',
    slug: 'vorstand',
    visible: true,
    sections: [activeChanged, activeUntouched],
  };
  const result = repairPage(activePage);
  const snapshot = {
    pages: [{
      id: 'page',
      title: 'Aktiver Titel',
      slug: 'vorstand',
      visible: true,
      sections: [activeChanged, activeUntouched],
    }],
    collections: [{ id: 'news', items: ['active'] }],
  };
  const patched = patchSnapshot(snapshot, [result], 'after') as typeof snapshot;
  assert.equal(patched.pages[0].title, 'Aktiver Titel');
  assert.deepEqual(patched.pages[0].sections.find((entry) => entry.id === 'untouched'), activeUntouched);
  assert.deepEqual(patched.collections, snapshot.collections);

  const repairedChanged = result.upserts.find((entry) => entry.id === 'changed');
  assert.ok(repairedChanged);
  const divergentDraft = {
    ...activeChanged,
    data: { ...activeChanged.data, draftOnlyNote: 'Nicht veröffentlichen' },
  };
  const draftPatch = mergeRepairIntoDraftSection(activeChanged, repairedChanged, divergentDraft);
  assert.equal((draftPatch.data as Record<string, unknown>).draftOnlyNote, 'Nicht veröffentlichen');
});

test('snapshot patch fails closed when a repaired active section is missing', () => {
  const repaired = section('missing', 'team', 0, { headline: 'Kontakt' });
  assert.throws(() => patchSnapshot(
    { pages: [{ id: 'page', slug: 'vorstand', sections: [] }] },
    [{
      page: { id: 'page', title: 'Vorstand', slug: 'vorstand', visible: true, sections: [repaired] },
      changed: true,
      upserts: [repaired],
      deleteIds: [],
      beforeTypes: [],
      afterTypes: ['team'],
    }],
    'after',
  ), /missing/);
});

test('cache invalidation uses only the approved secret-protected renderer boundary', async () => {
  const url = buildFwCacheInvalidationUrl('tenant-1');
  assert.equal(url.hostname, 'flamingo-freie-waehler-ingolstadt.vercel.app');
  assert.equal(url.searchParams.get('tenant'), 'tenant-1');
  assert.throws(
    () => buildFwCacheInvalidationUrl('tenant-1', 'https://attacker.example/api/revalidate'),
    /approved/,
  );
  let request: { url: string; init?: RequestInit } | undefined;
  const result = await invalidateFwRendererCache({
    tenantId: 'tenant-1',
    secret: 'test-secret',
    fetchImpl: (async (input, init) => {
      request = { url: String(input), init };
      return new Response(JSON.stringify({ revalidated: true, scope: 'tenant' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as typeof fetch,
  });
  assert.equal(result.scope, 'tenant');
  assert.equal(request?.init?.headers && (request.init.headers as Record<string, string>)['x-revalidate-secret'], 'test-secret');
});

test('targeted patch script cannot invoke the destructive reseed', () => {
  const source = readFileSync(new URL('./patch-freie-waehler-content.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /seedTenant|provision-freie-waehler-ingolstadt/);
  assert.match(source, /--apply/);
});

test('future FW provisioning no longer emits generic import sections', () => {
  const source = readFileSync(new URL('./provision-freie-waehler-ingolstadt.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /infoCardsSection/);
  assert.doesNotMatch(source, /Informationen aus der bisherigen Seite|Details aus der bisherigen Seite/);
  assert.match(source, /districtTeamSection/);
  assert.match(source, /districtResourcesSection/);
});

test('GitHub workflow audits on push and applies only after explicit dispatch', () => {
  const source = readFileSync(new URL('../.github/workflows/fw-targeted-content-repair.yml', import.meta.url), 'utf8');
  const auditBlock = source.split('\n  apply:')[0];
  const applyBlock = source.split('\n  apply:')[1] || '';
  assert.match(source, /REVALIDATE_SECRET: \$\{\{ secrets\.REVALIDATE_SECRET \}\}/);
  assert.match(source, /VERCEL_TOKEN: \$\{\{ secrets\.VERCEL_TOKEN \}\}/);
  assert.match(auditBlock, /pnpm exec tsx scripts\/patch-freie-waehler-content\.ts\s*$/m);
  assert.doesNotMatch(auditBlock, /environment:\s*production|--apply/);
  assert.match(applyBlock, /github\.event_name == 'workflow_dispatch' && inputs\.apply/);
  assert.match(applyBlock, /environment:\s*production/);
  assert.match(applyBlock, /needs:\s*audit/);
  assert.match(applyBlock, /patch-freie-waehler-content\.ts --apply/);
});

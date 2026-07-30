export type RepairSection = {
  id: string;
  type: string;
  definitionKey?: string | null;
  schemaVersion?: number | null;
  variant?: string | null;
  visible: boolean;
  locked: boolean;
  sortOrder: number;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId?: string | null;
  data: Record<string, unknown>;
  styleOverrides?: Record<string, unknown> | null;
};

export type RepairPage = {
  id: string;
  title: string;
  slug: string;
  visible: boolean;
  sections: RepairSection[];
};

export type PageRepair = {
  page: RepairPage;
  changed: boolean;
  upserts: RepairSection[];
  deleteIds: string[];
  beforeTypes: string[];
  afterTypes: string[];
};

const CORE_SLUGS = new Set([
  'vorstand',
  'fraktion',
  'bezirksausschuesse',
  'veranstaltungen',
  'kreisvereinigung',
  'medien',
]);

const BANNED_COPY = [
  /informationen aus der bisherigen seite/i,
  /details aus der bisherigen seite/i,
  /\bwor[üu]m es geht\b/i,
  /\bwas wichtig ist\b/i,
  /\bn[äa]chster schritt\b/i,
  /\bdiese seite zeigt\b/i,
  /\bhier werden\b.*\bdargestellt\b/i,
  /hierbei werden daten an facebook [üu]bertragen/i,
  /daten werden an facebook [üu]bertragen/i,
  /daten an facebook [üu]bertragen/i,
  /facebook-feed/i,
  /facebook[- ](?:inhalt|plugin|seite)/i,
  /datenschutzvereinbarung von facebook/i,
  /datenschutz(?:bestimmungen|erkl[äa]rung)? (?:von|bei) facebook/i,
  /externer inhalt/i,
  /inhalte anzeigen/i,
  /weitere informationen folgen/i,
  /\bimport(?:iert|ierte|ierten|ierter|prozess|hinweis|quelle)?\b/i,
  /\b(?:quellseite|source page)\b/i,
  /aus (?:der )?(?:alten|urspr[üu]nglichen|vorherigen) (?:seite|website|quelle)/i,
  /\bprevious website\b/i,
  /bisherige(?:n)? website/i,
  /bisherige(?:n)? seite/i,
  /\b(?:section|sektion)(?:en)?\b/i,
  /\blayout\b/i,
  /\bcard(?:s)?\b/i,
  /\bkarten(?:layout|mechanik)\b/i,
  /\bwebsite[- ]mechanik\b/i,
  /seiten(?:struktur|layout) (?:der|aus der) (?:alten|bisherigen|vorherigen)/i,
  /karten(?:layout|mechanik) (?:der|aus der) (?:alten|bisherigen|vorherigen)/i,
];

const CORE_HERO_COPY: Record<string, string> = {
  vorstand: 'Der Vorstand koordiniert den Verein, bündelt Themen und ist Ansprechpartner für Mitglieder und Interessierte.',
  fraktion: 'Unsere Stadtratsfraktion bringt konkrete Anliegen in den Stadtrat ein und macht Anträge und Ansprechpartner transparent.',
  bezirksausschuesse: 'In den Bezirksausschüssen werden Anliegen aus den Stadtteilen aufgenommen und in die kommunale Arbeit eingebracht.',
  veranstaltungen: 'Bei unseren Terminen und Veranstaltungen kommen wir über aktuelle Themen und Anliegen aus Ingolstadt ins Gespräch.',
  kreisvereinigung: 'Die Kreisvereinigung bündelt das kommunalpolitische Engagement der Freien Wähler in Ingolstadt.',
  medien: 'Filme, Bilder, Zeitungen und weitere Veröffentlichungen der Freien Wähler Ingolstadt.',
};

export function isTargetPageSlug(slug: string) {
  return CORE_SLUGS.has(slug) || /^bezirksausschuesse\/bza-\d{2}(?:-|$)/i.test(slug);
}

export function textOf(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(textOf).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(textOf).join(' ');
  return '';
}

export function containsBannedCopy(value: unknown) {
  const text = stripHtml(textOf(value));
  return BANNED_COPY.some((pattern) => pattern.test(text));
}

function stripHtml(value: string) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&auml;/gi, 'ä')
    .replace(/&ouml;/gi, 'ö')
    .replace(/&uuml;/gi, 'ü')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&Uuml;/g, 'Ü')
    .replace(/&szlig;/gi, 'ß')
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_match, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeBannedStrings(value: unknown): unknown {
  if (typeof value === 'string') return containsBannedCopy(value) ? '' : value;
  if (Array.isArray(value)) return value.map(sanitizeBannedStrings);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, entry]) => [key, sanitizeBannedStrings(entry)]),
  );
}

function extractHrefEntries(value: unknown) {
  const html = textOf(value);
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: match[1].trim(), label: stripHtml(match[2]).slice(0, 100) }))
    .filter((entry) => entry.href && entry.label);
}

function extractStructuredHrefEntries(value: unknown): Array<{ href: string; label: string }> {
  if (Array.isArray(value)) return value.flatMap(extractStructuredHrefEntries);
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  const own = typeof record.href === 'string'
    ? [{
      href: record.href,
      label: typeof record.title === 'string'
        ? record.title
        : typeof record.label === 'string'
          ? record.label
          : '',
    }]
    : [];
  return [...own, ...Object.values(record).flatMap(extractStructuredHrefEntries)];
}

function extractAllLinks(value: unknown) {
  const links = [...extractHrefEntries(value), ...extractStructuredHrefEntries(value)];
  return [...new Map(links.filter((link) => link.href).map((link) => [link.href, link])).values()];
}

const LEGACY_CARRIER_TYPES = new Set([
  'spotlightCards',
  'bentoGrid',
  'featureGrid',
  'content',
  'text',
  'richText',
]);

const LEGACY_NAV_LABELS = new Set([
  'home',
  'startseite',
  'aktuelles',
  'wahlprogramm',
  'vorstand',
  'fraktion',
  'stadtrat',
  'veranstaltungen',
  'bezirksausschüsse',
  'bezirksausschuesse',
  'kreisvereinigung',
  'medien',
  'kontakt',
  'impressum',
  'datenschutz',
]);

function normalizeLabel(value: string) {
  return stripHtml(value).toLocaleLowerCase('de-DE').replace(/[.!?:]+$/g, '').trim();
}

function structuredEntryLabels(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(structuredEntryLabels);
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  const own = ['title', 'label', 'ctaLabel']
    .map((key) => record[key])
    .filter((entry): entry is string => typeof entry === 'string');
  return [...own, ...Object.values(record).flatMap(structuredEntryLabels)];
}

function intentionalCtaLinks(page: RepairPage) {
  return new Set(page.sections
    .filter((section) => /hero|ctaBand|ctaSplit/i.test(section.type))
    .flatMap((section) => extractAllLinks(section.data))
    .map((link) => link.href));
}

export function legacyChromeReason(page: RepairPage, section: RepairSection): string | null {
  if (!isTargetPageSlug(page.slug) || !LEGACY_CARRIER_TYPES.has(section.type)) return null;
  const text = stripHtml(textOf(section.data));
  const labels = structuredEntryLabels(section.data).map(normalizeLabel);
  const links = extractAllLinks(section.data);

  const membershipMarkers = [
    /\bmitglied werden\b/i,
    /\bmitgliedsantrag\b/i,
    /\bbeitrittsformular\b/i,
    /\bbeitrittserkl[äa]rung\b/i,
    /\bausgef[üu]llte[sn]? antrag\b/i,
  ].filter((pattern) => pattern.test(text)).length;
  if (membershipMarkers >= 2) return 'legacy-membership';

  const navLabels = new Set([
    ...labels,
    ...links.map((link) => normalizeLabel(link.label)),
  ].filter((label) => LEGACY_NAV_LABELS.has(label)));
  if (navLabels.size >= 4 && (labels.length >= 4 || links.length >= 4)) return 'legacy-navigation';

  const footerMarkers = [
    /(?:©|&copy;|\bcopyright\b)/i,
    /\balle rechte vorbehalten\b/i,
    /\bimpressum\b/i,
    /\bdatenschutz\b/i,
    /\bmade with\b/i,
    /\bfooter\b/i,
  ].filter((pattern) => pattern.test(text)).length;
  if (footerMarkers >= 2) return 'legacy-footer';

  const uniqueHrefs = [...new Set(links.map((link) => link.href))];
  const intentionalHrefs = intentionalCtaLinks(page);
  const duplicateIntentionalHref = uniqueHrefs.length === 1 && intentionalHrefs.has(uniqueHrefs[0]);
  const genericLabels = labels.filter((label) =>
    /^(kontakt|kontakt aufnehmen|mitglied werden|anliegen senden|mehr erfahren|zur übersicht|übersicht öffnen)$/.test(label),
  );
  if (
    duplicateIntentionalHref
    && genericLabels.length > 0
    && text.length <= 220
    && links.length <= 2
  ) return 'duplicate-cta';

  return null;
}

function extractDistrictFacts(page: RepairPage) {
  const raw = textOf(page.sections.map((section) => section.data));
  const plain = stripHtml(raw);
  const district = page.title.replace(/\s+-\s+FREIE\s+WÄHLER\s+Ingolstadt$/i, '').trim();
  const existingMember = page.sections
    .map((section) => section.data.members)
    .find((members) => Array.isArray(members) && members.length)?.[0] as Record<string, unknown> | undefined;
  const email = (typeof existingMember?.email === 'string' ? existingMember.email : '')
    || plain.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0]
    || '';
  const occupation = (Array.isArray(existingMember?.focus) ? textOf(existingMember.focus) : '') || (
    plain.match(/Beruf:\s*(.+?)(?=\s+(?:Vorsitz|Mitglied|Vertreter|Kontaktdaten|E-Mail:))/i)?.[1] || ''
  ).trim().slice(0, 100);
  const role = (typeof existingMember?.role === 'string' ? existingMember.role : '') || (
    plain.match(/((?:stellvertretende[rn]?\s+)?Vorsitzende?r(?:in)?\s+des\s+BZA[^.]*|Mitglied\s+(?:des|im)\s+BZA[^.]*)/i)?.[1]
    || `Ansprechpartner im ${district}`
  ).trim().slice(0, 120);
  const headingNames = [...raw.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/gi)]
    .map((match) => stripHtml(match[1]).slice(0, 90))
    .filter((value) => value && !/kontakt/i.test(value));
  const name = (typeof existingMember?.name === 'string' ? existingMember.name : '')
    || headingNames[0]
    || (
      plain.match(/Stadtbezirk\s+\d+\s+.+?\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.'-]+(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß.'-]+){1,3})\s+Beruf:/i)?.[1]
      || ''
    ).trim().slice(0, 90);
  const links = extractAllLinks(page.sections.map((section) => section.data));
  const districtPdf = links.find((link) =>
    /\.pdf(?:$|[?#])/i.test(link.href)
    && /stadtbezirk|bezirksgrenzen|bza/i.test(`${link.label} ${link.href}`),
  );
  const heroImage = (typeof existingMember?.image === 'string' ? existingMember.image : '')
    || page.sections.find((section) => /hero/i.test(section.type))?.data?.imagePrimary;
  return {
    district,
    email,
    occupation,
    role,
    name,
    districtPdf,
    image: typeof heroImage === 'string' ? heroImage : '',
  };
}

function sectionWith(
  source: RepairSection,
  type: string,
  data: Record<string, unknown>,
  spacingTop = 'l',
  spacingBottom = 'l',
): RepairSection {
  return {
    ...source,
    type,
    definitionKey: `${type}.shared.v1`,
    schemaVersion: 1,
    variant: null,
    container: 'default',
    spacingTop,
    spacingBottom,
    data,
    styleOverrides: null,
  };
}

function noisySection(page: RepairPage, section: RepairSection) {
  return section.type === 'richText'
    || containsBannedCopy(section.data)
    || legacyChromeReason(page, section) !== null;
}

function repairDistrictPage(page: RepairPage): PageRepair {
  const facts = extractDistrictFacts(page);
  const beforeTypes = page.sections.map((section) => section.type);
  const sections = page.sections.map((section) => ({ ...section, data: { ...section.data } }));
  const upserts: RepairSection[] = [];
  const deleteIds: string[] = [];
  const hero = sections.find((section) => /hero/i.test(section.type));
  if (hero) {
    const cleanText = facts.name
      ? `${facts.name} ist ${facts.role}${facts.occupation ? ` und arbeitet als ${facts.occupation}` : ''}.`
      : `Kontakt, Ansprechpartner und Unterlagen für ${facts.district}.`;
    if (hero.data.text !== cleanText) {
      hero.data = { ...hero.data, headline: facts.district, text: cleanText };
      upserts.push(hero);
    }
  }

  const candidates = sections.filter((section) => noisySection(page, section));
  if (candidates[0] && facts.name) {
    const team = sectionWith(candidates[0], 'teamSpotlight', {
      badge: 'Ansprechpartner vor Ort',
      headline: facts.name ? `Ihr Kontakt für ${facts.district}` : facts.district,
      subline: facts.email
        ? 'Fragen und Anliegen aus dem Stadtbezirk können direkt per E-Mail übermittelt werden.'
        : 'Fragen und Anliegen aus dem Stadtbezirk können über unser Kontaktformular übermittelt werden.',
      members: [{
        name: facts.name,
        role: facts.role,
        image: facts.image,
        focus: facts.occupation ? [facts.occupation] : [],
        email: facts.email || undefined,
      }],
    }, 'xl', 'l');
    sections[sections.findIndex((section) => section.id === candidates[0].id)] = team;
    upserts.push(team);
  }
  const resourceCandidate = facts.name ? candidates[1] : candidates[0];
  if (resourceCandidate) {
    const cards: Array<Record<string, unknown>> = [{
      title: 'Anliegen aus dem Stadtbezirk',
      text: 'Teilen Sie uns mit, welches Thema wir aus Ihrem Stadtbezirk aufnehmen sollen.',
      icon: 'MessageCircle',
      href: '/kontakt',
      ctaLabel: 'Anliegen senden',
    }];
    if (facts.districtPdf) {
      cards.push({
        title: 'Stadtbezirk als PDF',
        text: `Unterlagen und Abgrenzung für ${facts.district}.`,
        icon: 'FileDown',
        href: facts.districtPdf.href,
        ctaLabel: 'PDF öffnen',
      });
    }
    cards.push({
      title: 'Alle Bezirksausschüsse',
      text: 'Ansprechpartner und Unterlagen der weiteren Ingolstädter Stadtbezirke.',
      icon: 'Map',
      href: '/bezirksausschuesse',
      ctaLabel: 'Übersicht öffnen',
    });
    const resources = sectionWith(resourceCandidate, 'spotlightCards', {
      badge: 'Kontakt und Unterlagen',
      headline: 'Das Wichtigste für Ihren Stadtbezirk.',
      cards,
    });
    sections[sections.findIndex((section) => section.id === resourceCandidate.id)] = resources;
    upserts.push(resources);
  }
  for (const candidate of candidates.slice(facts.name ? 2 : 1)) {
    deleteIds.push(candidate.id);
  }
  const finalSections = sections
    .filter((section) => !deleteIds.includes(section.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    page: { ...page, sections: finalSections },
    changed: upserts.length > 0 || deleteIds.length > 0,
    upserts: uniqueById(upserts),
    deleteIds,
    beforeTypes,
    afterTypes: finalSections.map((section) => section.type),
  };
}

function cleanMediaCards(section: RepairSection, sources: RepairSection[]) {
  const links = extractAllLinks(sources.map((source) => source.data))
    .filter((link) => !/mitglied|facebook|cookie|datenschutz|impressum/i.test(`${link.label} ${link.href}`))
    .slice(0, 6);
  const cards = links.length
    ? links.map((link, index) => ({
      title: link.label || 'Veröffentlichung öffnen',
      text: 'Direkt zum veröffentlichten Angebot.',
      icon: index % 2 === 0 ? 'Images' : 'ExternalLink',
      href: link.href,
      ctaLabel: 'Öffnen',
    }))
    : [
      {
        title: 'Aktuelle Meldungen',
        text: 'Pressemitteilungen, Anträge und Positionen aus Ingolstadt.',
        icon: 'Newspaper',
        href: '/aktuelles',
        ctaLabel: 'Aktuelles öffnen',
      },
      {
        title: 'Medienanfrage',
        text: 'Direkter Kontakt für Bilder, Informationen und Rückfragen.',
        icon: 'Mail',
        href: '/kontakt',
        ctaLabel: 'Kontakt aufnehmen',
      },
    ];
  return sectionWith(section, 'spotlightCards', {
    badge: 'Medien',
    headline: 'Bilder, Filme und Veröffentlichungen.',
    subline: 'Ausgewählte Medienangebote der Freien Wähler Ingolstadt.',
    cards,
  }, 'xl', 'xl');
}

function repairCorePage(page: RepairPage): PageRepair {
  const beforeTypes = page.sections.map((section) => section.type);
  const sections = page.sections.map((section) => ({ ...section, data: { ...section.data } }));
  const upserts: RepairSection[] = [];
  const deleteIds: string[] = [];
  const hero = sections.find((section) => /hero/i.test(section.type));
  const heroCopy = CORE_HERO_COPY[page.slug];
  if (hero && heroCopy && hero.data.text !== heroCopy) {
    hero.data = { ...hero.data, text: heroCopy };
    upserts.push(hero);
  }
  for (const list of sections.filter((section) => section.type === 'collectionList' && containsBannedCopy(section.data))) {
    const sanitized = sanitizeBannedStrings(list.data) as Record<string, unknown>;
    list.data = page.slug === 'bezirksausschuesse'
      ? {
        ...sanitized,
        subline: '12 Bezirksausschüsse mit Ansprechpartnern, Kontaktdaten und Unterlagen.',
      }
      : sanitized;
    upserts.push(list);
  }
  const noisy = sections.filter((section) => section.type !== 'collectionList' && noisySection(page, section));
  if (page.slug === 'medien' && noisy[0]) {
    const media = cleanMediaCards(noisy[0], noisy);
    sections[sections.findIndex((section) => section.id === noisy[0].id)] = media;
    upserts.push(media);
    for (const candidate of noisy.slice(1)) deleteIds.push(candidate.id);
  } else {
    for (const candidate of noisy) deleteIds.push(candidate.id);
  }
  if (page.slug === 'bezirksausschuesse') {
    const list = sections.find((section) => section.type === 'collectionList');
    const subline = '12 Bezirksausschüsse mit Ansprechpartnern, Kontaktdaten und Unterlagen.';
    if (list && list.data.subline !== subline) {
      list.data = { ...list.data, subline };
      upserts.push(list);
    }
  }
  const finalSections = sections
    .filter((section) => !deleteIds.includes(section.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    page: { ...page, sections: finalSections },
    changed: upserts.length > 0 || deleteIds.length > 0,
    upserts: uniqueById(upserts),
    deleteIds,
    beforeTypes,
    afterTypes: finalSections.map((section) => section.type),
  };
}

function uniqueById(sections: RepairSection[]) {
  return [...new Map(sections.map((section) => [section.id, section])).values()];
}

export function repairPage(page: RepairPage): PageRepair {
  if (!isTargetPageSlug(page.slug)) {
    return {
      page,
      changed: false,
      upserts: [],
      deleteIds: [],
      beforeTypes: page.sections.map((section) => section.type),
      afterTypes: page.sections.map((section) => section.type),
    };
  }
  return /^bezirksausschuesse\/bza-\d{2}(?:-|$)/i.test(page.slug)
    ? repairDistrictPage(page)
    : repairCorePage(page);
}

export function patchSnapshot(
  snapshot: Record<string, unknown>,
  repairs: PageRepair[],
  generatedAt: string,
) {
  const replacements = new Map(repairs.map((repair) => [repair.page.id, repair]));
  const matched = new Set<string>();
  const sourcePages = Array.isArray(snapshot.pages) ? snapshot.pages : [];
  const result = {
    ...snapshot,
    pages: sourcePages.map((page) => {
      if (!page || typeof page !== 'object') return page;
      const current = page as Record<string, unknown>;
      const repair = typeof current.id === 'string' ? replacements.get(current.id) : undefined;
      if (!repair) return page;
      matched.add(repair.page.id);
      const upserts = new Map(repair.upserts.map((section) => [section.id, section]));
      const deleteIds = new Set(repair.deleteIds);
      const currentSections = Array.isArray(current.sections) ? current.sections : [];
      const seenSections = new Set<string>();
      const sections = currentSections.flatMap((section) => {
        if (!section || typeof section !== 'object') return [section];
        const currentSection = section as Record<string, unknown>;
        if (typeof currentSection.id !== 'string') return [section];
        if (deleteIds.has(currentSection.id)) {
          seenSections.add(currentSection.id);
          return [];
        }
        const replacement = upserts.get(currentSection.id);
        if (!replacement) return [section];
        seenSections.add(currentSection.id);
        return [{ ...currentSection, ...replacement }];
      });
      const expected = new Set([...upserts.keys(), ...deleteIds]);
      for (const sectionId of expected) {
        if (!seenSections.has(sectionId)) {
          throw new Error(`Active snapshot section ${sectionId} is missing; refusing repair.`);
        }
      }
      return { ...current, sections };
    }),
    generatedAt,
  };
  for (const pageId of replacements.keys()) {
    if (!matched.has(pageId)) throw new Error(`Active snapshot page ${pageId} is missing; refusing repair.`);
  }
  return result;
}

export function mergeRepairIntoDraftSection(
  active: RepairSection,
  repaired: RepairSection,
  draft: RepairSection,
): Partial<RepairSection> {
  if (active.id !== repaired.id || active.id !== draft.id) throw new Error('Section IDs do not match.');
  const patch: Partial<RepairSection> = {};
  const scalarKeys = [
    'type',
    'definitionKey',
    'schemaVersion',
    'variant',
    'visible',
    'locked',
    'container',
    'spacingTop',
    'spacingBottom',
    'anchorId',
    'styleOverrides',
  ] as const;
  for (const key of scalarKeys) {
    if (JSON.stringify(active[key]) !== JSON.stringify(repaired[key])) {
      (patch as Record<string, unknown>)[key] = repaired[key];
    }
  }
  const mergedData = { ...draft.data };
  let dataChanged = false;
  const dataKeys = new Set([...Object.keys(active.data), ...Object.keys(repaired.data)]);
  for (const key of dataKeys) {
    if (JSON.stringify(active.data[key]) === JSON.stringify(repaired.data[key])) continue;
    dataChanged = true;
    if (key in repaired.data) mergedData[key] = repaired.data[key];
    else delete mergedData[key];
  }
  if (dataChanged) patch.data = mergedData;
  return patch;
}

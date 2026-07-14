import { isSectionDefinitionKey, parseSectionDefinitionKey } from './section-definition-registry';
import { validateAdvancedSectionData } from './advanced-section-validation';

export type QualitySeverity = 'error' | 'warning';

export type RepairInstruction = {
  operation: 'add' | 'replace' | 'remove' | 'review';
  instruction: string;
  acceptance: string;
};

export type ContentQualityIssue = {
  code: string;
  severity: QualitySeverity;
  message: string;
  location: string;
  hint: string;
  repair: RepairInstruction;
};

export type SiteProfile = {
  schemaVersion: '1.0';
  identity: {
    businessName: string;
    legalName?: string;
    locations: Array<{ city: string; region?: string; country?: string; address?: string }>;
    serviceAreas?: string[];
  };
  audience: {
    primary: string;
    needs: string[];
    objections: string[];
  };
  goals: {
    primary: string;
    conversions: string[];
  };
  offers: Array<{
    name: string;
    outcome: string;
    proof?: string;
    ctaLabel: string;
    ctaHref: string;
  }>;
  voice: {
    attributes: string[];
    avoid: string[];
  };
  facts: {
    approvedClaims: string[];
    prohibitedClaims: string[];
    unknowns: string[];
  };
};

export type PlannedSection = {
  type: string;
  definitionKey?: string;
  schemaVersion?: number;
  purpose?: string;
  data: Record<string, unknown>;
  styleOverrides?: Record<string, unknown>;
};

export type PlannedPage = {
  id?: string;
  slug: string;
  title: string;
  purpose?: string;
  primaryAction?: string;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string };
  sections: PlannedSection[];
};

export type ContentQualityInput = {
  mode?: 'profile' | 'plan' | 'stored';
  siteProfile?: SiteProfile | null;
  brand?: Record<string, unknown> | null;
  contact?: Record<string, unknown> | null;
  seoGlobal?: Record<string, unknown> | null;
  navigation?: unknown;
  footer?: unknown;
  pages: PlannedPage[];
  collections?: Array<{ key: string; items?: Array<{ slug: string; title?: string; data?: Record<string, unknown> }> }>;
  allowedSectionTypes?: string[];
  sectionSchemas?: Record<string, object>;
  referenceCorpus?: Array<{ tenantKey: string; phrases?: string[]; images?: string[] }>;
};

export type ContentQualityResult = {
  valid: boolean;
  summary: { errors: number; warnings: number; issues: number };
  issues: ContentQualityIssue[];
};

type WalkEntry = { path: string; key: string; value: unknown; parent?: Record<string, unknown> };

const GENERIC_COPY: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bwillkommen (?:auf|bei) (?:unserer|unserem|uns)\b/i, replacement: 'Beginne mit einem konkreten Ergebnis, Angebot oder Anlass.' },
  { pattern: /\bmaßgeschneiderte lösungen\b/i, replacement: 'Nenne die konkrete Leistung, Zielgruppe und das sichtbare Ergebnis.' },
  { pattern: /\bihr (?:zuverlässiger|kompetenter|starker) partner\b/i, replacement: 'Ersetze die Behauptung durch einen überprüfbaren Beleg.' },
  { pattern: /\bqualität und service\b/i, replacement: 'Beschreibe, woran Qualität und Service im Ablauf erkennbar sind.' },
  { pattern: /\bwir stehen ihnen (?:gerne )?zur verfügung\b/i, replacement: 'Nenne Kontaktweg, Reaktionszeit und nächsten Schritt.' },
  { pattern: /\bentdecken sie (?:unsere|die welt)\b/i, replacement: 'Formuliere einen spezifischen Nutzen statt einer generischen Aufforderung.' },
  { pattern: /\blorem ipsum\b/i, replacement: 'Ersetze Platzhalter vollständig durch verifizierten Inhalt.' },
  { pattern: /\b(?:hier|jetzt) klicken\b/i, replacement: 'Verwende ein aktionsspezifisches CTA-Label.' },
];

const GENERIC_TITLES = new Set(['home', 'homepage', 'startseite', 'willkommen', 'website', 'flamingo cms']);
const IMAGE_KEYS = new Set(['image', 'imageurl', 'imagesrc', 'src', 'coverimage', 'heroimage', 'imageprimary', 'imagesecondary']);
const ARRAY_MINIMA: Record<string, number> = {
  items: 3,
  cards: 3,
  manualcards: 3,
  steps: 3,
  members: 2,
  doctors: 2,
  images: 3,
  services: 3,
  features: 3,
  routes: 3,
  places: 3,
  plans: 3,
  players: 3,
};

const KNOWN_LOCATIONS = [
  'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf',
  'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden', 'Hannover', 'Nürnberg',
  'Salzburg', 'Innsbruck', 'Wien', 'Graz', 'Linz', 'Zürich', 'Basel', 'Bern',
  'Ingolstadt', 'Mittenwald', 'Starnberg', 'Seefeld', 'Kitzbühel', 'Mainz',
];

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isSubstantive(value: unknown): boolean {
  if (typeof value === 'string') return Boolean(value.trim());
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
  return value !== null && value !== undefined;
}

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

function plain(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizedImage(value: string): string {
  try {
    const url = new URL(value);
    return `${url.hostname.toLowerCase()}${url.pathname.replace(/\/$/, '')}`;
  } catch {
    return value.split(/[?#]/)[0].trim().toLowerCase();
  }
}

function walk(value: unknown, path: string, visit: (entry: WalkEntry) => void, parent?: Record<string, unknown>, key = ''): void {
  visit({ path, key, value, parent });
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, visit, undefined, String(index)));
    return;
  }
  if (!value || typeof value !== 'object') return;
  const record = value as Record<string, unknown>;
  for (const [childKey, child] of Object.entries(record)) {
    walk(child, path ? `${path}.${childKey}` : childKey, visit, record, childKey);
  }
}

function repair(operation: RepairInstruction['operation'], instruction: string, acceptance: string): RepairInstruction {
  return { operation, instruction, acceptance };
}

function issue(input: Omit<ContentQualityIssue, 'hint'> & { hint?: string }): ContentQualityIssue {
  return {
    ...input,
    hint: input.hint || input.repair.instruction,
  };
}

function isInternalHref(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//');
}

function internalTarget(value: string): string {
  return value.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function collectAllowedRoutes(input: ContentQualityInput): Set<string> {
  const routes = new Set<string>(['', '/']);
  for (const page of input.pages) {
    if (!isObjectRecord(page)) continue;
    const slug = text(page.slug).replace(/^\/+|\/+$/g, '');
    routes.add(slug);
    routes.add(`/${slug}`);
    if (slug === 'startseite' || slug === 'home') routes.add('/');
  }
  for (const collection of input.collections || []) {
    if (!isObjectRecord(collection)) continue;
    const key = text(collection.key);
    if (!key) continue;
    routes.add(key);
    routes.add(`/${key}`);
    for (const item of Array.isArray(collection.items) ? collection.items : []) {
      if (!isObjectRecord(item)) continue;
      const slug = text(item.slug);
      if (!slug) continue;
      routes.add(`c/${key}/${slug}`);
      routes.add(`/c/${key}/${slug}`);
    }
  }
  return routes;
}

function validateProfile(profile: SiteProfile | null | undefined, issues: ContentQualityIssue[]): void {
  if (!profile) {
    issues.push(issue({
      code: 'profile.missing', severity: 'error', location: 'siteProfile',
      message: 'A structured siteProfile is required before page generation.',
      repair: repair('add', 'Fill siteProfile from verified tenant facts; put uncertain values in facts.unknowns.', 'identity, audience, goals, offers, voice and facts are present.'),
    }));
    return;
  }
  if (profile.schemaVersion !== '1.0') {
    issues.push(issue({
      code: 'profile.version', severity: 'error', location: 'siteProfile.schemaVersion',
      message: 'Unsupported siteProfile schemaVersion.',
      repair: repair('replace', 'Use schemaVersion "1.0".', 'schemaVersion equals "1.0".'),
    }));
  }
  const required: Array<[string, unknown, string]> = [
    ['siteProfile.identity.businessName', profile.identity?.businessName, 'Add the verified public business name.'],
    ['siteProfile.audience.primary', profile.audience?.primary, 'Describe the primary audience in one concrete sentence.'],
    ['siteProfile.goals.primary', profile.goals?.primary, 'Name the single primary website outcome.'],
  ];
  for (const [location, value, instruction] of required) {
    if (!text(value)) {
      issues.push(issue({
        code: 'profile.required', severity: 'error', location,
        message: `${location} is required.`,
        repair: repair('add', instruction, `${location} is non-empty and verified.`),
      }));
    }
  }
  const arrayRequirements: Array<[string, unknown, number]> = [
    ['siteProfile.identity.locations', profile.identity?.locations, 1],
    ['siteProfile.audience.needs', profile.audience?.needs, 2],
    ['siteProfile.audience.objections', profile.audience?.objections, 1],
    ['siteProfile.goals.conversions', profile.goals?.conversions, 1],
    ['siteProfile.offers', profile.offers, 1],
    ['siteProfile.voice.attributes', profile.voice?.attributes, 2],
  ];
  for (const [location, value, min] of arrayRequirements) {
    if (!Array.isArray(value) || value.length < min) {
      issues.push(issue({
        code: 'profile.array_minimum', severity: 'error', location,
        message: `${location} needs at least ${min} substantive entr${min === 1 ? 'y' : 'ies'}.`,
        repair: repair('add', `Add verified entries until the array contains at least ${min}.`, `Array length is at least ${min}; no placeholder entries remain.`),
      }));
    }
  }
}

function validatePlanStructure(input: ContentQualityInput, issues: ContentQualityIssue[]): void {
  if (!Array.isArray(input.pages) || input.pages.length === 0) {
    issues.push(issue({
      code: 'plan.pages_missing', severity: 'error', location: 'pages',
      message: 'The page plan is empty.',
      repair: repair('add', 'Plan the homepage, offer/service pages, about, contact and legal pages before writing.', 'At least one complete page plan is present.'),
    }));
    return;
  }

  const allowed = input.allowedSectionTypes ? new Set(input.allowedSectionTypes) : null;
  const slugCounts = new Map<string, number>();
  for (const [pageIndex, page] of input.pages.entries()) {
    const pageLocation = `pages[${pageIndex}]`;
    if (!isObjectRecord(page)) {
      issues.push(issue({
        code: 'plan.page_invalid', severity: 'error', location: pageLocation,
        message: 'Each page must be an object.',
        repair: repair('replace', 'Replace this value with a page object containing slug, title, purpose, seo and sections.', 'Every pages entry is an object.'),
      }));
      continue;
    }
    const slug = text(page.slug).replace(/^\/+|\/+$/g, '');
    slugCounts.set(slug, (slugCounts.get(slug) || 0) + 1);
    const validStoredHome = input.mode === 'stored' && slug === '';
    if (!validStoredHome && (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
      issues.push(issue({
        code: 'plan.invalid_slug', severity: 'error', location: `${pageLocation}.slug`,
        message: `Invalid page slug "${page.slug}".`,
        repair: repair('replace', 'Use a lowercase ASCII slug without a leading slash.', 'Slug matches lowercase kebab-case.'),
      }));
    }
    if (!text(page.title)) {
      issues.push(issue({
        code: 'plan.title_missing', severity: 'error', location: `${pageLocation}.title`,
        message: 'Page title is missing.',
        repair: repair('add', 'Add a descriptive human-readable page title.', 'Title is non-empty and not generic.'),
      }));
    }
    if (input.mode !== 'stored' && !text(page.purpose)) {
      issues.push(issue({
        code: 'plan.purpose_missing', severity: 'warning', location: `${pageLocation}.purpose`,
        message: 'Page purpose is not explicit.',
        repair: repair('add', 'State audience need, page job and desired next action in one sentence.', 'Purpose explains why the page exists.'),
      }));
    }
    if (!Array.isArray(page.sections) || page.sections.length === 0) {
      issues.push(issue({
        code: 'plan.sections_missing', severity: 'error', location: `${pageLocation}.sections`,
        message: 'Page has no planned sections.',
        repair: repair('add', 'Add a conversion-oriented section sequence with one job per section.', 'Page contains at least one valid section.'),
      }));
      continue;
    }
    for (const [sectionIndex, section] of page.sections.entries()) {
      const loc = `${pageLocation}.sections[${sectionIndex}]`;
      if (!isObjectRecord(section)) {
        issues.push(issue({
          code: 'plan.section_invalid', severity: 'error', location: loc,
          message: 'Each section must be an object.',
          repair: repair('replace', 'Replace this value with { type, data } using availableSectionTypes and sectionDataSchemas.', 'Every sections entry is an object.'),
        }));
        continue;
      }
      if (allowed && !allowed.has(section.type)) {
        issues.push(issue({
          code: 'plan.section_not_allowed', severity: 'error', location: `${loc}.type`,
          message: `Section type "${section.type}" is not available for this tenant.`,
          repair: repair('replace', 'Choose a type from availableSectionTypes.', 'Every section type exists in availableSectionTypes.'),
        }));
      }
      if (section.definitionKey != null && (!isSectionDefinitionKey(section.definitionKey) || parseSectionDefinitionKey(section.definitionKey)?.type !== section.type)) {
        issues.push(issue({
          code: 'plan.definition_key_invalid', severity: 'error', location: `${loc}.definitionKey`,
          message: `definitionKey must use type.owner.vN and match section type "${section.type}".`,
          repair: repair('replace', `Use a stable key such as ${section.type}.shared.v1, or omit definitionKey during the compatibility phase.`, 'definitionKey is absent or valid and its first segment equals section.type.'),
        }));
      }
      if (section.schemaVersion != null && (!Number.isSafeInteger(section.schemaVersion) || section.schemaVersion < 1)) {
        issues.push(issue({
          code: 'plan.schema_version_invalid', severity: 'error', location: `${loc}.schemaVersion`,
          message: 'schemaVersion must be a positive integer.',
          repair: repair('replace', 'Set schemaVersion to the positive contract version, or omit it during the compatibility phase.', 'schemaVersion is absent or a positive integer.'),
        }));
      }
      if (!section.data || typeof section.data !== 'object' || Array.isArray(section.data)) {
        issues.push(issue({
          code: 'plan.section_data_invalid', severity: 'error', location: `${loc}.data`,
          message: 'Section data must be an object.',
          repair: repair('replace', 'Create data using the exact sectionDataSchemas entry for this type.', 'data is an object using documented fields only.'),
        }));
        continue;
      }

      if (input.mode !== 'stored') {
        const schema = input.sectionSchemas?.[section.type] as { fields?: Record<string, unknown> } | undefined;
        for (const [field, spec] of Object.entries(schema?.fields || {})) {
          const required = typeof spec === 'string' && !spec.includes('?');
          if (required && !isSubstantive(section.data[field])) {
            issues.push(issue({
              code: 'plan.required_field', severity: 'error', location: `${loc}.data.${field}`,
              message: `Required field "${field}" is missing for ${section.type}.`,
              repair: repair('add', `Fill ${field} using sectionDataSchemas.${section.type}.fields.${field}.`, `${field} has a substantive value with the documented shape.`),
            }));
          }
        }
        for (const advancedIssue of validateAdvancedSectionData(section.type, section.data, `${loc}.data`)) {
          const genericIndex = issues.findIndex(existing => existing.location === advancedIssue.path && existing.code === 'plan.required_field');
          if (genericIndex >= 0) issues.splice(genericIndex, 1);
          if (issues.some(existing => existing.location === advancedIssue.path)) continue;
          issues.push(issue({
            code: 'plan.advanced_section_invalid',
            severity: 'error',
            location: advancedIssue.path,
            message: advancedIssue.message,
            repair: repair('replace', advancedIssue.instruction, `${advancedIssue.path} satisfies the documented Advanced section contract.`),
          }));
        }
      }
    }
  }
  for (const [slug, count] of slugCounts) {
    if (count > 1) {
      issues.push(issue({
        code: 'plan.duplicate_slug', severity: 'error', location: `pages[${slug}]`,
        message: `Page slug "${slug}" occurs ${count} times.`,
        repair: repair('remove', 'Merge duplicate page plans or assign unique slugs.', 'Every page slug is unique.'),
      }));
    }
  }
}

function validateCopyAndBudgets(input: ContentQualityInput, issues: ContentQualityIssue[]): void {
  const roots: Array<[string, unknown]> = [
    ['brand', input.brand], ['contact', input.contact], ['seoGlobal', input.seoGlobal],
    ['navigation', input.navigation], ['footer', input.footer], ['pages', input.pages],
    ['collections', input.collections],
  ];
  const seenGeneric = new Set<string>();

  for (const [rootPath, rootValue] of roots) {
    walk(rootValue, rootPath, ({ path, key, value }) => {
      if (typeof value !== 'string') return;
      const clean = plain(value);
      if (!clean) return;

      for (const generic of GENERIC_COPY) {
        if (!generic.pattern.test(clean)) continue;
        const fingerprint = `${path}:${generic.pattern.source}`;
        if (seenGeneric.has(fingerprint)) continue;
        seenGeneric.add(fingerprint);
        issues.push(issue({
          code: 'copy.generic', severity: 'warning', location: path,
          message: `Generic copy detected: "${clean.slice(0, 100)}${clean.length > 100 ? '…' : ''}"`,
          repair: repair('replace', generic.replacement, 'Copy names a concrete audience, offer, outcome or proof and contains no generic phrase.'),
        }));
      }

      const lowerKey = key.toLowerCase();
      const isHeadline = lowerKey === 'headline' || lowerKey.endsWith('headline');
      const isSubline = lowerKey === 'subline' || lowerKey.endsWith('subline');
      const isMetaTitle = lowerKey === 'metatitle';
      const isMetaDescription = lowerKey === 'metadescription';
      const isAlt = lowerKey === 'alt' || lowerKey.endsWith('alt');
      const isCtaLabel = lowerKey === 'ctalabel' || (lowerKey === 'label' && /cta|button/i.test(path));
      const budget = isMetaTitle ? [20, 70]
        : isMetaDescription ? [70, 170]
          : isHeadline ? [12, 90]
            : isSubline ? [30, 220]
              : isAlt ? [8, 160]
                : isCtaLabel ? [2, 36]
                  : null;
      if (!budget) return;
      const [min, max] = budget;
      if (clean.length > max) {
        issues.push(issue({
          code: 'budget.too_long', severity: isMetaTitle || isMetaDescription ? 'error' : 'warning', location: path,
          message: `${key} has ${clean.length} characters; maximum is ${max}.`,
          repair: repair('replace', `Shorten to ${max} characters without losing the concrete outcome.`, `Length is ${min}-${max} characters.`),
        }));
      } else if (clean.length < min) {
        issues.push(issue({
          code: 'budget.too_short', severity: 'warning', location: path,
          message: `${key} has ${clean.length} characters; recommended minimum is ${min}.`,
          repair: repair('replace', `Add specific context until the field has at least ${min} characters.`, `Length is ${min}-${max} characters and remains specific.`),
        }));
      }
    });
  }
}

function validateArraysAndImages(input: ContentQualityInput, issues: ContentQualityIssue[]): void {
  const imageUses = new Map<string, string[]>();
  walk({ pages: input.pages, collections: input.collections }, '', ({ path, key, value, parent }) => {
    const lowerKey = key.toLowerCase();
    if (Array.isArray(value) && ARRAY_MINIMA[lowerKey] && value.length > 0 && value.length < ARRAY_MINIMA[lowerKey]) {
      const min = ARRAY_MINIMA[lowerKey];
      issues.push(issue({
        code: 'array.minimum', severity: 'warning', location: path,
        message: `${key} has ${value.length} entries; ${min} are recommended for a complete section.`,
        repair: repair('add', `Add distinct, substantive entries until ${key} contains at least ${min}.`, `Array has at least ${min} non-duplicate entries.`),
      }));
    }
    if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return;
    if (!IMAGE_KEYS.has(lowerKey) && !/\.(?:avif|webp|jpe?g|png)(?:[?#]|$)/i.test(value) && !/images\.unsplash\.com/i.test(value)) return;
    const normalized = normalizedImage(value);
    imageUses.set(normalized, [...(imageUses.get(normalized) || []), path]);

    if (IMAGE_KEYS.has(lowerKey) && lowerKey !== 'src') {
      const alt = text(parent?.alt) || text(parent?.imageAlt) || text(parent?.[`${key}Alt`]);
      const decorative = /background|bgimage|logo|icon|ogimage/i.test(key);
      if (!alt && !decorative) {
        issues.push(issue({
          code: 'image.alt_missing', severity: 'warning', location: path,
          message: 'Content image has no explicit alt text.',
          repair: repair('add', 'Add an adjacent alt/imageAlt field describing the subject and context; use empty alt only for decorative images.', 'Every informative image has meaningful alt text.'),
        }));
      }
    }
  });
  for (const [image, locations] of imageUses) {
    if (locations.length < 3) continue;
    issues.push(issue({
      code: 'image.reused', severity: 'warning', location: locations[0],
      message: `The same image is reused ${locations.length} times.`,
      hint: `Replace duplicates at: ${locations.slice(1, 5).join(', ')}`,
      repair: repair('replace', 'Keep the strongest use and replace the other occurrences with tenant-specific images.', 'No non-brand image is reused more than twice site-wide.'),
    }));
  }
}

function validateLinks(input: ContentQualityInput, issues: ContentQualityIssue[]): void {
  const allowed = collectAllowedRoutes(input);
  walk({ navigation: input.navigation, footer: input.footer, pages: input.pages, collections: input.collections }, '', ({ path, key, value }) => {
    const linkKey = key.toLowerCase();
    if (typeof value !== 'string' || (!linkKey.endsWith('href') && linkKey !== 'link' && linkKey !== 'to')) return;
    if (value === '#') {
      issues.push(issue({
        code: 'link.placeholder', severity: 'error', location: path,
        message: 'Placeholder href="#" is not a valid destination.',
        repair: repair('replace', 'Point to an existing page, collection item, anchor, phone, email or verified external URL.', 'The link has a reachable, intentional destination.'),
      }));
      return;
    }
    if (!isInternalHref(value)) return;
    const target = internalTarget(value);
    if (!target || target.startsWith('api/') || target === 'admin' || target.startsWith('admin/')) return;
    if (allowed.has(target) || allowed.has(`/${target}`)) return;
    // Demo/tenant prefixes may precede an otherwise valid planned route.
    const suffixMatches = [...allowed].some(route => {
      const normalizedRoute = route.replace(/^\/+|\/+$/g, '');
      return Boolean(normalizedRoute) && (target === normalizedRoute || target.endsWith(`/${normalizedRoute}`));
    });
    if (suffixMatches) return;
    issues.push(issue({
      code: 'link.unknown_internal_route', severity: 'error', location: path,
      message: `Internal link "${value}" does not resolve to a planned page or collection item.`,
      repair: repair('replace', 'Use a slug from the page plan or create the missing target before linking to it.', 'Every internal link resolves to a known route.'),
    }));
  });
}

function validateSeo(input: ContentQualityInput, issues: ContentQualityIssue[]): void {
  const titles = new Map<string, string[]>();
  const descriptions = new Map<string, string[]>();
  const businessName = text(input.siteProfile?.identity?.businessName) || text(input.brand?.companyName);
  for (const [index, page] of input.pages.entries()) {
    if (!isObjectRecord(page)) continue;
    const loc = `pages[${index}].seo`;
    const metaTitle = text(page.seo?.metaTitle);
    const metaDescription = text(page.seo?.metaDescription);
    if (!metaTitle) {
      issues.push(issue({
        code: 'seo.title_missing', severity: 'warning', location: `${loc}.metaTitle`,
        message: `Page "${page.slug}" has no explicit meta title.`,
        repair: repair('add', 'Write a unique 20-70 character title focused on this page; do not repeat the brand if titleTemplate adds it.', 'metaTitle is unique, specific and within budget.'),
      }));
    } else {
      const key = normalize(metaTitle);
      titles.set(key, [...(titles.get(key) || []), page.slug]);
      if (GENERIC_TITLES.has(key)) {
        issues.push(issue({
          code: 'seo.title_generic', severity: 'warning', location: `${loc}.metaTitle`,
          message: `Generic meta title "${metaTitle}".`,
          repair: repair('replace', 'Use the page topic, offer or local intent instead of Home/Startseite/Flamingo CMS.', 'The title identifies this page without generic filler.'),
        }));
      }
      if (businessName) {
        const occurrences = normalize(metaTitle).split(normalize(businessName)).length - 1;
        if (occurrences > 1) {
          issues.push(issue({
            code: 'seo.brand_repeated', severity: 'warning', location: `${loc}.metaTitle`,
            message: 'Business name is repeated in the meta title.',
            repair: repair('replace', 'Keep the brand once; if titleTemplate adds it, remove it from metaTitle.', 'Rendered title contains the business name at most once.'),
          }));
        }
      }
    }
    if (!metaDescription) {
      issues.push(issue({
        code: 'seo.description_missing', severity: 'warning', location: `${loc}.metaDescription`,
        message: `Page "${page.slug}" has no explicit meta description.`,
        repair: repair('add', 'Write a unique 70-170 character summary with audience, offer and local context where relevant.', 'metaDescription is unique and within budget.'),
      }));
    } else {
      const key = normalize(metaDescription);
      descriptions.set(key, [...(descriptions.get(key) || []), page.slug]);
    }
  }
  for (const [value, slugs] of titles) {
    if (value && slugs.length > 1) {
      issues.push(issue({
        code: 'seo.title_duplicate', severity: 'warning', location: 'pages.seo.metaTitle',
        message: `The same meta title is used on ${slugs.length} pages: ${slugs.join(', ')}.`,
        repair: repair('replace', 'Give each page a title aligned to its own search intent.', 'Every indexable page has a unique meta title.'),
      }));
    }
  }
  for (const [value, slugs] of descriptions) {
    if (value && slugs.length > 1) {
      issues.push(issue({
        code: 'seo.description_duplicate', severity: 'warning', location: 'pages.seo.metaDescription',
        message: `The same meta description is used on ${slugs.length} pages: ${slugs.join(', ')}.`,
        repair: repair('replace', 'Summarize the distinct content and next action of each page.', 'Every indexable page has a unique meta description.'),
      }));
    }
  }
}

function validateIdentity(input: ContentQualityInput, issues: ContentQualityIssue[]): void {
  const rawLocations = input.siteProfile?.identity?.locations;
  const locations = Array.isArray(rawLocations)
    ? rawLocations.filter((location): location is { city: string; address?: string } => (
      Boolean(location) && typeof location === 'object' && typeof location.city === 'string'
    ))
    : [];
  const rawServiceAreas = input.siteProfile?.identity?.serviceAreas;
  const serviceAreas = Array.isArray(rawServiceAreas)
    ? rawServiceAreas.filter((area): area is string => typeof area === 'string')
    : [];
  const inferredContactLocations = KNOWN_LOCATIONS.filter(city => normalize(text(input.contact?.address)).includes(normalize(city)));
  const localSeo = input.brand?.localSeo && typeof input.brand.localSeo === 'object'
    ? input.brand.localSeo as Record<string, unknown>
    : {};
  const inferredServiceLocations = KNOWN_LOCATIONS.filter(city => normalize(text(localSeo.serviceArea)).includes(normalize(city)));
  const approved = new Set([
    ...locations.map(location => normalize(location.city)),
    ...serviceAreas.map(normalize),
    ...(locations.length === 0 ? inferredContactLocations.map(normalize) : []),
    ...inferredServiceLocations.map(normalize),
  ].filter(Boolean));
  const contactAddress = text(input.contact?.address);

  if (locations.length > 0 && contactAddress && !locations.some(location => normalize(contactAddress).includes(normalize(location.city)))) {
    issues.push(issue({
      code: 'identity.contact_location_mismatch', severity: 'error', location: 'contact.address',
      message: 'Contact address does not contain any location approved in siteProfile.',
      repair: repair('review', 'Correct either the verified siteProfile location or the contact address; never guess.', 'Contact address and siteProfile identify the same location.'),
    }));
  }
  if (approved.size === 0) return;

  const identityText = JSON.stringify({ brand: input.brand, contact: input.contact, seoGlobal: input.seoGlobal });
  for (const city of KNOWN_LOCATIONS) {
    const cityKey = normalize(city);
    if (!normalize(identityText).includes(cityKey) || approved.has(cityKey)) continue;
    issues.push(issue({
      code: 'identity.unapproved_location', severity: 'error', location: 'brand/contact/seoGlobal',
      message: `Identity-bearing content mentions "${city}", which is not listed in siteProfile locations/serviceAreas.`,
      repair: repair('review', `Verify whether ${city} is real. Add it to serviceAreas only if verified; otherwise replace the inconsistent mention.`, 'Brand, contact and global SEO use only verified locations.'),
    }));
  }
}

function validateCrossTenantDrift(input: ContentQualityInput, issues: ContentQualityIssue[]): void {
  if (!input.referenceCorpus?.length) return;
  const ownPhrases = new Map<string, string>();
  const ownImages = new Map<string, string>();
  walk({ pages: input.pages, collections: input.collections }, '', ({ path, value }) => {
    if (typeof value !== 'string') return;
    const clean = plain(value);
    if (clean.length >= 70) ownPhrases.set(normalize(clean), path);
    if (/^https?:\/\//i.test(value) && (/images\.unsplash\.com/i.test(value) || /\.(?:jpe?g|png|webp|avif)/i.test(value))) {
      ownImages.set(normalizedImage(value), path);
    }
  });

  const emitted = new Set<string>();
  for (const reference of input.referenceCorpus) {
    for (const phrase of reference.phrases || []) {
      const key = normalize(plain(phrase));
      const location = ownPhrases.get(key);
      if (!location || emitted.has(`phrase:${key}`)) continue;
      emitted.add(`phrase:${key}`);
      issues.push(issue({
        code: 'drift.cross_tenant_phrase', severity: 'warning', location,
        message: `A substantive phrase is identical to reference tenant "${reference.tenantKey}".`,
        repair: repair('replace', 'Rewrite from this tenant’s verified offer, audience, place and voice; do not paraphrase mechanically.', 'The sentence is tenant-specific and no longer matches the reference corpus.'),
      }));
    }
    for (const image of reference.images || []) {
      const key = normalizedImage(image);
      const location = ownImages.get(key);
      if (!location || emitted.has(`image:${key}`)) continue;
      emitted.add(`image:${key}`);
      issues.push(issue({
        code: 'drift.cross_tenant_image', severity: 'warning', location,
        message: `Image is already used by reference tenant "${reference.tenantKey}".`,
        repair: repair('replace', 'Select or produce an image unique to this tenant’s visual narrative.', 'No showcase tenant shares this non-brand image.'),
      }));
    }
  }
}

export function validateContentQuality(input: ContentQualityInput): ContentQualityResult {
  const normalizedInput: ContentQualityInput = {
    ...input,
    pages: Array.isArray(input.pages) ? input.pages : [],
    collections: Array.isArray(input.collections) ? input.collections : [],
  };
  const issues: ContentQualityIssue[] = [];
  if (normalizedInput.mode !== 'stored') validateProfile(normalizedInput.siteProfile, issues);
  if (normalizedInput.mode !== 'profile') {
    validatePlanStructure(normalizedInput, issues);
    validateCopyAndBudgets(normalizedInput, issues);
    validateArraysAndImages(normalizedInput, issues);
    validateLinks(normalizedInput, issues);
    validateSeo(normalizedInput, issues);
  }
  validateIdentity(normalizedInput, issues);
  if (normalizedInput.mode !== 'profile') validateCrossTenantDrift(normalizedInput, issues);

  const deduped = [...new Map(issues.map(entry => [`${entry.code}:${entry.location}:${entry.message}`, entry])).values()];
  const errors = deduped.filter(entry => entry.severity === 'error').length;
  const warnings = deduped.length - errors;
  return {
    valid: errors === 0,
    summary: { errors, warnings, issues: deduped.length },
    issues: deduped,
  };
}

export const CONTENT_FIELD_BUDGETS = {
  headline: { min: 12, max: 90, guidance: 'One concrete promise or page job; no welcome copy.' },
  subline: { min: 30, max: 220, guidance: 'Audience, offer, context and proof in one or two sentences.' },
  ctaLabel: { min: 2, max: 36, guidance: 'Specific action plus object, e.g. "Zimmer ansehen".' },
  metaTitle: { min: 20, max: 70, guidance: 'Unique search intent; omit brand when titleTemplate adds it.' },
  metaDescription: { min: 70, max: 170, guidance: 'Unique page summary with offer and local intent.' },
  imageAlt: { min: 8, max: 160, guidance: 'Describe subject and context; empty only when decorative.' },
} as const;

export const CONTENT_GOOD_BAD_EXAMPLES = {
  headline: {
    bad: 'Willkommen bei Ihrem zuverlässigen Partner',
    good: 'Wärmepumpen, die zum Altbau und zum Verbrauch passen',
    why: 'The good version names offer, context and decision value.',
  },
  cta: {
    bad: { label: 'Mehr erfahren', href: '#' },
    good: { label: 'Badprojekt besprechen', href: '/kontakt' },
    why: 'The good CTA states the next action and resolves to a planned route.',
  },
  proof: {
    bad: 'Höchste Qualität und bester Service',
    good: 'Ein Bauleiter, wöchentlicher Status und dokumentierte Abnahme',
    why: 'The good copy provides observable proof without invented awards or ratings.',
  },
  alt: {
    bad: 'Bild',
    good: 'Installateur prüft die Wärmepumpe im Keller eines Altbaus',
    why: 'The good alt text communicates subject and relevant context.',
  },
} as const;

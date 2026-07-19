import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import * as secretStorageNamespace from '../../../apps/marketing/src/lib/secret-storage';

type SecretStorageModule = typeof import('../../../apps/marketing/src/lib/secret-storage');
const secretStorage = ('default' in secretStorageNamespace
  ? secretStorageNamespace.default
  : secretStorageNamespace) as SecretStorageModule;
const { revealCrmSecret } = secretStorage;

type Json = Record<string, unknown>;
type SqlClient = NeonQueryFunction<false, false>;
type PageRow = { id: string; title: string; slug: string; type: string };
type SectionRow = { id: string; tenant_id: string; page_id: string; type: string; definition_key: string | null; schema_version: number | null; variant: string | null; title_internal: string | null; visible: boolean; locked: boolean; container: string; spacing_top: string; spacing_bottom: string; anchor_id: string | null; style_overrides: Json | null; data: Json; sort_order: number };
type CollectionRow = { id: string; key: string; label: string };
type ItemRow = { id: string; collection_id: string; slug: string; title: string; data: Json; published: boolean; priority: number };
type SettingsRow = { id: string; tenant_id: string; brand: Json; design: Json };

type Target = {
  id: string;
  slug: 'schubert-design' | 'schubert-grabdenkmal';
  pages: string[];
  collectionKey: string;
  itemSlugs: string[];
  preset: 'architectural' | 'quiet';
  palette: { page: string; section: string; alternate: string; card: string; heading: string; body: string; muted: string; accent: string; border: string };
  fonts: { heading: string; body: string };
};

export const REDESIGN_TARGETS: Record<Target['slug'], Target> = {
  'schubert-design': {
    id: 'e7b96166-8c3d-4e9b-901a-3c4eadee4673', slug: 'schubert-design',
    pages: ['startseite', 'leistungen', 'showroom', 'projekte', 'ueber-uns', 'kontakt', 'impressum', 'datenschutz'],
    collectionKey: 'projekte', itemSlugs: ['baeder', 'naturstein', 'spas', 'wcs', 'gastro', 'gewerbe'], preset: 'architectural',
    palette: { page: '#090B0B', section: '#090B0B', alternate: '#141817', card: '#141817', heading: '#F2EFE8', body: '#D8D0C4', muted: '#A8AEA9', accent: '#B99B65', border: '#3A3D3A' },
    fonts: { heading: 'Space Grotesk', body: 'Manrope' },
  },
  'schubert-grabdenkmal': {
    id: 'ff2102e2-f07e-4d44-9046-12c55d78a60d', slug: 'schubert-grabdenkmal',
    pages: ['startseite', 'leistungen', 'galerie', 'ratgeber', 'ueber-uns', 'kontakt', 'impressum', 'datenschutz'],
    collectionKey: 'leistungen', itemSlugs: ['grabdenkmale', 'grabeinfassungen', 'abdeckplatten', 'grabaccessoires', 'grabpflege-wartung', 'restaurierung-nachbeschriftung', 'beratung-planung'], preset: 'quiet',
    palette: { page: '#100F0D', section: '#100F0D', alternate: '#191815', card: '#211F1B', heading: '#E8E0D3', body: '#D4C9B8', muted: '#AAA297', accent: '#C5AF8A', border: '#443D33' },
    fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
  },
};

type PageModule = 'hero' | 'collectionHero' | 'glowHero' | 'cinematicHero' | 'uspStrip' | 'servicesGrid' | 'spotlightCards' | 'serviceDetail' | 'signatureGrid' | 'textImage' | 'categoryMosaic' | 'collectionList' | 'scrollStory' | 'locationVibe' | 'team' | 'timeline' | 'galleryGrid' | 'testimonialMarquee' | 'logoMarquee' | 'stats' | 'processSteps' | 'faq' | 'contact' | 'map' | 'richText' | 'legalContent' | 'ctaBand';

/** Explicit narrative systems; no page falls back to a shared generic formula. */
export const PAGE_COMPOSITION_MAPS: Record<Target['slug'], Record<string, PageModule[]>> = {
  'schubert-design': {
    startseite: ['glowHero', 'spotlightCards', 'textImage', 'categoryMosaic', 'testimonialMarquee', 'logoMarquee', 'ctaBand'],
    leistungen: ['cinematicHero', 'serviceDetail', 'signatureGrid', 'ctaBand'],
    showroom: ['collectionHero', 'scrollStory', 'locationVibe', 'ctaBand'],
    projekte: ['glowHero', 'collectionList', 'ctaBand'],
    'ueber-uns': ['cinematicHero', 'textImage', 'team', 'timeline', 'galleryGrid', 'spotlightCards', 'ctaBand'],
    kontakt: ['cinematicHero', 'contact', 'map'],
    impressum: ['legalContent'], datenschutz: ['legalContent'],
  },
  'schubert-grabdenkmal': {
    startseite: ['hero', 'uspStrip', 'servicesGrid', 'textImage', 'processSteps', 'ctaBand'],
    leistungen: ['hero', 'servicesGrid', 'richText', 'faq'],
    galerie: ['hero', 'galleryGrid'],
    ratgeber: ['hero', 'richText', 'faq'],
    'ueber-uns': ['collectionHero', 'textImage', 'stats', 'processSteps', 'galleryGrid', 'faq', 'ctaBand'],
    kontakt: ['hero', 'contact', 'map'],
    impressum: ['richText'], datenschutz: ['richText'],
  },
};

type ItemModule = 'cinematicHero' | 'portfolioGallery' | 'collectionHero' | 'textImage' | 'processSteps' | 'ctaBand';

/** Every detail has its own rhythm. Item ateliers can only consume that item's media. */
export const COLLECTION_DETAIL_COMPOSITION_MAPS: Record<Target['slug'], Record<string, ItemModule[]>> = {
  'schubert-design': {
    baeder: ['cinematicHero', 'portfolioGallery', 'ctaBand'],
    naturstein: ['cinematicHero', 'portfolioGallery', 'ctaBand'],
    spas: ['cinematicHero', 'portfolioGallery', 'ctaBand'],
    wcs: ['cinematicHero', 'portfolioGallery', 'ctaBand'],
    gastro: ['cinematicHero', 'portfolioGallery', 'ctaBand'],
    gewerbe: ['cinematicHero', 'portfolioGallery', 'ctaBand'],
  },
  'schubert-grabdenkmal': {
    grabdenkmale: ['collectionHero', 'textImage', 'processSteps', 'ctaBand'],
    grabeinfassungen: ['collectionHero', 'textImage', 'processSteps', 'ctaBand'],
    abdeckplatten: ['collectionHero', 'textImage', 'processSteps', 'ctaBand'],
    grabaccessoires: ['collectionHero', 'textImage', 'processSteps', 'ctaBand'],
    'grabpflege-wartung': ['collectionHero', 'textImage', 'processSteps', 'ctaBand'],
    'restaurierung-nachbeschriftung': ['collectionHero', 'textImage', 'processSteps', 'ctaBand'],
    'beratung-planung': ['collectionHero', 'textImage', 'processSteps', 'ctaBand'],
  },
};

type Unit = { id: string; title: string; kicker?: string; text?: string; image?: string; href?: string; meta?: string[] };
type DraftSection = Omit<SectionRow, 'tenant_id' | 'page_id'>;

function record(value: unknown): Json { return value && typeof value === 'object' && !Array.isArray(value) ? value as Json : {}; }
function nonEmpty(value: unknown): value is string { return typeof value === 'string' && Boolean(value.trim()); }
function firstString(data: Json, keys: string[]) { for (const key of keys) if (nonEmpty(data[key])) return String(data[key]); return ''; }
function stableUuid(seed: string) { const hex = createHash('sha256').update(seed).digest('hex').slice(0, 32).split(''); hex[12] = '4'; hex[16] = ((parseInt(hex[16], 16) & 3) | 8).toString(16); return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20).join('')}`; }

const KNOWN_UNAVAILABLE_MEDIA = [
  'manufaktur_001-ZXDYKNe2vW5CYHgWJAJixnkLPob8lV.webp',
  '61c334a9842e5daac2534246_bad-1_001-TJhAdbOKLJA4o4jG1O2HJ4ZvrtdPuI.webp',
  'Steinboden-Naturstein-Esszimmer-1-uyPJ0vTD27kRW0IDrOYX4zoes6M7U3.webp',
  'stein-fliese-3_001-nUk3lzbC62rGXXdrUjrrLO6Vq3aHAX.webp',
  'Zach-Export-Masterbad-8-1-HlHmtLgPFzOX3Ut13b7LaGGIwNyGJN.webp',
] as const;

const MEDIA_KEY = /(image|img|src|photo|thumbnail|poster|background|cover)/i;
const NARRATIVE_KEY = /(headline|title|heading|name|label|text|subline|description|intro|body|copy|answer|quote|excerpt|caption|kicker|eyebrow|badge|category|meta|feature|fact|trust)/i;

export function isCssColorLiteral(value: unknown): value is string {
  if (!nonEmpty(value)) return false;
  const input = value.trim();
  return /^#(?:[0-9a-f]{3,8})$/i.test(input)
    || /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\(/i.test(input)
    || /^(?:var|color-mix)\(/i.test(input);
}

function isSafeDestination(value: unknown): value is string {
  return nonEmpty(value) && value.trim() !== '#' && /^(\/|https?:\/\/|mailto:|tel:)/i.test(value.trim());
}

function mediaUnavailable(url: string, unavailable: Set<string>) {
  return KNOWN_UNAVAILABLE_MEDIA.some((part) => url.includes(part)) || unavailable.has(url);
}

export function sanitizeVisibleContent(value: unknown, unavailable = new Set<string>(), key = ''): unknown {
  if (typeof value === 'string') {
    if (MEDIA_KEY.test(key) && mediaUnavailable(value, unavailable)) return undefined;
    if (NARRATIVE_KEY.test(key) && isCssColorLiteral(value)) return undefined;
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeVisibleContent(entry, unavailable, key)).filter((entry) => {
      if (entry === undefined) return false;
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return true;
      const source = entry as Json;
      const hasMediaShape = Object.keys(source).some((childKey) => MEDIA_KEY.test(childKey));
      return !hasMediaShape || Object.entries(source).some(([childKey, child]) => MEDIA_KEY.test(childKey) && nonEmpty(child));
    });
  }
  if (!value || typeof value !== 'object') return value;
  const input = value as Json;
  if (/(?:cta|action|button)/i.test(key)) {
    const label = firstString(input, ['label', 'text', 'title']);
    const destination = firstString(input, ['href', 'url', 'link']);
    if (!label || isCssColorLiteral(label) || !isSafeDestination(destination)) return undefined;
  }
  return Object.fromEntries(Object.entries(input)
    .map(([childKey, child]) => [childKey, sanitizeVisibleContent(child, unavailable, childKey)] as const)
    .filter(([, child]) => child !== undefined));
}

function sanitizeSectionData(type: string, data: Json, unavailable: Set<string>) {
  const sanitized = record(sanitizeVisibleContent(data, unavailable));
  if (type === 'ctaBand' && !sanitized.ctaPrimary && sanitized.cta) {
    sanitized.ctaPrimary = sanitized.cta;
    delete sanitized.cta;
  }
  if (type === 'processSteps' && Array.isArray(sanitized.steps)) {
    const steps = (sanitized.steps as Json[]).filter((step, index, list) => {
      const stepTitle = title(step, '');
      const stepText = text(step);
      return Boolean(stepTitle && stepText) && list.findIndex((candidate) => title(candidate, '') === stepTitle && text(candidate) === stepText) === index;
    }).slice(0, 4);
    if (steps.length < 3) throw new Error('A visible process requires three distinct, content-backed steps.');
    sanitized.steps = steps;
  }
  for (const key of ['images', 'items']) {
    if (!Array.isArray(sanitized[key])) continue;
    const seen = new Set<string>();
    sanitized[key] = (sanitized[key] as unknown[]).filter((entry) => {
      const url = images(entry)[0];
      if (!url) return true;
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }
  return sanitized;
}

function walk(value: unknown, visit: (key: string, value: unknown) => void, key = '') {
  visit(key, value);
  if (Array.isArray(value)) value.forEach((entry) => walk(entry, visit, key));
  else if (value && typeof value === 'object') Object.entries(value as Json).forEach(([childKey, child]) => childKey !== '_premiumRedesign' && walk(child, visit, childKey));
}

function replacePlaceholderLinks(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(replacePlaceholderLinks);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value as Json).map(([key, child]) => [
    key,
    nonEmpty(child) && child.trim() === '#' && /(href|link|url)$/i.test(key) && !/(image|video|embed)/i.test(key)
      ? '/kontakt'
      : replacePlaceholderLinks(child),
  ]));
}

function images(value: unknown) {
  const result: string[] = [];
  walk(value, (key, child) => {
    if (!nonEmpty(child) || !/(image|img|src|photo|thumbnail|poster|background|cover)/i.test(key)) return;
    if (/^(https?:\/\/|\/|data:image\/)/i.test(child)) result.push(child);
  });
  return [...new Set(result)];
}

function directImages(value: Json) {
  return [...new Set(Object.entries(value).flatMap(([key, child]) =>
    nonEmpty(child)
    && /(image|img|src|photo|thumbnail|poster|background|cover)/i.test(key)
    && /^(https?:\/\/|\/|data:image\/)/i.test(child)
      ? [child]
      : [],
  ))];
}

function href(value: unknown) {
  let found = '';
  walk(value, (key, child) => { if (!found && nonEmpty(child) && child.trim() !== '#' && /(href|link|url)$/i.test(key) && !/(image|video|embed)/i.test(key) && /^(#|\/|https?:\/\/|mailto:|tel:)/i.test(child)) found = child; });
  return found;
}

function text(value: unknown) {
  const data = record(value);
  const narrativeKeys = new Set(['subline', 'text', 'description', 'intro', 'body', 'copy', 'answer', 'quote', 'excerpt', 'caption', 'storyText', 'introText', 'vibeText', 'supportingText']);
  for (const key of narrativeKeys) {
    if (nonEmpty(data[key]) && !isCssColorLiteral(data[key])) return String(data[key]);
  }
  let found = '';
  walk(value, (key, child) => {
    if (!found && narrativeKeys.has(key) && nonEmpty(child) && !isCssColorLiteral(child)) found = child;
  });
  return found;
}

function title(value: unknown, fallback: string) {
  const data = record(value);
  for (const key of ['headline', 'title', 'heading', 'name', 'label', 'question', 'alt']) {
    if (nonEmpty(data[key]) && !isCssColorLiteral(data[key])) return String(data[key]);
  }
  return fallback;
}

function unitsFrom(value: unknown, fallback: string): Unit[] {
  const root = record(value);
  const candidates: Json[] = [];
  walk(root, (_key, child) => {
    if (!child || typeof child !== 'object' || Array.isArray(child)) return;
    const candidate = child as Json;
    if (directImages(candidate).length) candidates.push(candidate);
  });
  let ordinal = 0;
  const output = candidates.flatMap((candidate) => directImages(candidate).map((image) => {
    ordinal += 1;
    const fallbackTitle = candidate === root && candidates.length === 1 ? fallback : `${fallback} ${String(ordinal).padStart(2, '0')}`;
    return {
      id: `${fallback}-${ordinal}`,
      title: title(candidate, fallbackTitle),
      kicker: firstString(candidate, ['kicker', 'eyebrow', 'badge', 'badgeText', 'category']),
      text: text(candidate), image, href: href(candidate),
      meta: Array.isArray(candidate.features) ? (candidate.features as unknown[]).filter(nonEmpty).slice(0, 5) : [],
    };
  })).filter((unit, index, all) => all.findIndex((candidate) => candidate.image === unit.image) === index);
  return output;
}

function sourceArchive(sections: SectionRow[]) {
  for (const section of sections) {
    const marker = record(section.data._premiumRedesign);
    if (Array.isArray(marker.sourceSections)) return marker.sourceSections as SectionRow[];
  }
  return sections;
}

function localizeData(data: Json, locale?: string): Json {
  if (!locale) return data;
  const localized = record(record(data._localized)[locale]);
  return { ...data, ...localized, _localized: data._localized };
}

function localesIn(sections: SectionRow[]) {
  const locales = new Set<string>();
  sections.forEach((section) => Object.keys(record(section.data._localized)).forEach((locale) => locales.add(locale)));
  return [...locales];
}

function darkStyle(target: Target): Json {
  const p = target.palette;
  return { '--token-section-bg': p.section, '--token-section-bg-alt': p.alternate, '--token-card-bg': p.card, '--token-heading': p.heading, '--token-body': p.body, '--token-muted': p.muted, '--token-card-heading': p.heading, '--token-card-body': p.body, '--token-card-muted': p.muted, '--token-accent': p.accent, '--token-eyebrow': p.accent, '--token-btn-bg': p.accent, '--token-btn-text': p.page, '--token-btn-secondary-bg': 'transparent', '--token-btn-secondary-text': p.heading, '--token-btn-secondary-border': p.border, '--token-card-border': p.border, '--token-divider': p.border, '--token-image-overlay': 'rgba(9,9,8,0.82)', '--token-on-dark-heading': p.heading, '--token-on-dark-body': p.body, '--token-on-dark-muted': p.muted, '--token-shadow': 'rgba(0,0,0,0.42)', '--token-card-radius': target.preset === 'quiet' ? '0.25rem' : '0.5rem', '--token-button-radius': '0.25rem' };
}

function draft(target: Target, page: PageRow, index: number, type: string, data: Json, titleInternal: string, source?: SectionRow): SectionRow {
  return {
    id: stableUuid(`premium-redesign:${target.id}:${page.id}:${index}:${type}`), tenant_id: target.id, page_id: page.id, type,
    definition_key: `${type}.shared.v1`, schema_version: 1, variant: null, title_internal: titleInternal, visible: true, locked: false,
    container: 'default', spacing_top: 'none', spacing_bottom: 'none', anchor_id: source?.anchor_id || null,
    style_overrides: { ...(source?.style_overrides || {}), ...darkStyle(target) }, data, sort_order: index,
  };
}

function itemUnits(items: ItemRow[]) {
  return items.map((item) => ({ id: item.slug, title: item.title, kicker: '', text: text(item.data), image: images(item.data)[0], href: href(item.data), meta: [] })).filter((unit) => unit.image) as Unit[];
}

const SOURCE_FAMILIES: Record<string, RegExp> = {
  sourceProof: /(testimonial|review|proof|socialProof|stat|rating|certification)/i,
  sourceLogos: /(logo|sponsor|partner|brand)/i,
  sourceCta: /(cta|campaign|booking|consultation|inquiry|offer|action)/i,
  sourceGuidance: /(faq|richText|freeText|textBlock|notice|process|timeline|comparison|advice|guide)/i,
  sourceContact: /(contact|map|opening|location)/i,
  sourceTeam: /(team|story|about|history|craft)/i,
  sourceReassurance: /(testimonial|review|proof|socialProof|stat|faq|notice|process|timeline|richText|textBlock)/i,
};

function retainedSection(target: Target, page: PageRow, section: SectionRow, index: number) {
  return { ...section, id: stableUuid(`premium-redesign:${target.id}:${page.id}:${index}:${section.id}`), tenant_id: target.id, page_id: page.id, sort_order: index, style_overrides: { ...(section.style_overrides || {}), ...darkStyle(target) } };
}

function legacyLocalizedComposition(target: Target, page: PageRow, source: SectionRow[], collectionUnits: Unit[], locale?: string): SectionRow[] {
  const localizedSource = source.map((section) => ({ ...section, data: localizeData(section.data, locale) }));
  const pageUnits = localizedSource.flatMap((section, index) => unitsFrom(section.data, section.title_internal || `${page.title} ${index + 1}`));
  const allUnits = [...pageUnits, ...collectionUnits].filter((unit, index, list) => unit.image && list.findIndex((entry) => entry.title === unit.title && entry.image === unit.image) === index);
  if (!allUnits.length) throw new Error(`${target.slug}/${page.slug}: no reusable image content found.`);
  const lead = pageUnits[0] || allUnits[0];
  const opener = draft(target, page, 0, 'cinematicHero', { eyebrow: lead.kicker || page.title, headline: lead.title || page.title, subline: lead.text || '', image: lead.image, primaryCta: lead.href ? { label: 'Mehr erfahren', href: lead.href } : undefined, align: 'left' }, 'Cinematic Arrival');
  if (page.slug === 'impressum' || page.slug === 'datenschutz' || page.type === 'legal') {
    return localizedSource.map((section, index) => ({ ...section, tenant_id: target.id, page_id: page.id, sort_order: index, spacing_top: index ? section.spacing_top : 'l', spacing_bottom: index === localizedSource.length - 1 ? 'l' : section.spacing_bottom, style_overrides: { ...(section.style_overrides || {}), ...darkStyle(target) } }));
  }
  const atelierItems = (collectionUnits.length >= 3 ? collectionUnits : allUnits).slice(0, 8);
  if (atelierItems.length < 3) throw new Error(`${target.slug}/${page.slug}: material atelier needs at least three image-backed source entries.`);
  const result: SectionRow[] = [opener];
  if (page.slug === 'startseite' || ['leistungen', 'showroom', 'projekte', 'galerie', 'ratgeber'].includes(page.slug)) {
    result.push(draft(target, page, result.length, 'materialAtelier', { badge: target.preset === 'quiet' ? 'Orientierung' : 'Materialatelier', headline: page.title, subline: lead.text || '', preset: target.preset, items: atelierItems }, 'Material Atelier'));
  }
  const chapterItems = allUnits.slice(0, 6);
  if (chapterItems.length >= 3 && ['startseite', 'ueber-uns', 'ratgeber'].includes(page.slug)) {
    result.push(draft(target, page, result.length, 'cinematicChapters', { badge: page.title, headline: lead.title, intro: lead.text || '', transition: target.preset === 'quiet' ? 'crossfade' : 'depth', chapters: chapterItems.map((unit, index) => ({ kicker: unit.kicker || `${String(index + 1).padStart(2, '0')} · ${page.title}`, title: unit.title, text: unit.text, image: unit.image, ctaLabel: unit.href ? 'Mehr erfahren' : undefined, ctaHref: unit.href })) }, 'Editorial Chapters'));
  } else if (allUnits.length >= 3) {
    result.push(draft(target, page, result.length, 'editorialCardMorph', { badge: page.title, headline: lead.title, subline: lead.text || '', layout: 'rail', items: allUnits.slice(0, 8).map((unit) => ({ ...unit, ctaLabel: unit.href ? 'Details ansehen' : undefined })) }, 'Selected Stories'));
  }
  const paths = [...pageUnits, ...collectionUnits].slice(0, 7);
  if (paths.length >= 3) result.push(draft(target, page, result.length, 'signaturePath', { badge: target.preset === 'quiet' ? 'In Ruhe begleitet' : 'Unser Weg', headline: page.title, subline: lead.text || '', pathPreset: target.preset === 'quiet' ? 'flow' : 'craft', items: paths.map((unit) => ({ id: unit.id, title: unit.title, text: unit.text, image: unit.image, href: unit.href })) }, 'Signature Path'));
  // Functional and long-form content remains visible, not merely archived.
  localizedSource.filter((section) => /^(contact|contactForm|map|faq|faqContactSplit|richText|freeText|textBlock)$/i.test(section.type)).forEach((section) => result.push({ ...section, id: stableUuid(`premium-redesign:${target.id}:${page.id}:${result.length}:${section.type}`), tenant_id: target.id, page_id: page.id, definition_key: section.definition_key, sort_order: result.length, style_overrides: { ...(section.style_overrides || {}), ...darkStyle(target) } }));
  return result;
}

function localizedComposition(target: Target, page: PageRow, source: SectionRow[], _collectionUnits: Unit[], locale?: string, unavailable = new Set<string>()): SectionRow[] {
  const localizedSource = source.map((section) => ({ ...section, data: localizeData(section.data, locale) }));
  const modules = PAGE_COMPOSITION_MAPS[target.slug][page.slug];
  if (!modules) throw new Error(`${target.slug}/${page.slug}: no explicit composition map exists.`);
  const legal = page.slug === 'impressum' || page.slug === 'datenschutz' || page.type === 'legal';
  const used = new Set<string>();
  const result = modules.map((type, index) => {
    const section = localizedSource.find((candidate) => candidate.type === type && !used.has(candidate.id));
    if (!section) throw new Error(`${target.slug}/${page.slug}: required source section ${type} is missing.`);
    used.add(section.id);
    return {
      ...section,
      id: stableUuid(`premium-redesign:${target.id}:${page.id}:${index}:${section.id}`),
      tenant_id: target.id,
      page_id: page.id,
      sort_order: index,
      data: legal ? section.data : sanitizeSectionData(section.type, record(replacePlaceholderLinks(section.data)), unavailable),
      style_overrides: { ...(section.style_overrides || {}), ...darkStyle(target) },
    };
  });
  if (!legal && result.length > 7) throw new Error(`${target.slug}/${page.slug}: premium composition exceeds seven visible sections.`);
  return result;
}

export function buildPageComposition(target: Target, page: PageRow, current: SectionRow[], collectionUnits: Unit[], unavailable = new Set<string>()) {
  const source = sourceArchive(current);
  if (!source.length) throw new Error(`${target.slug}/${page.slug}: page has no source sections.`);
  const base = localizedComposition(target, page, source, collectionUnits, undefined, unavailable);
  const localized = localesIn(source);
  for (const locale of localized) {
    const version = localizedComposition(target, page, source, collectionUnits, locale, unavailable);
    base.forEach((section, index) => {
      if (!version[index] || version[index].type !== section.type) throw new Error(`${target.slug}/${page.slug}: localized ${locale} composition drifted.`);
      section.data = { ...section.data, _localized: { ...record(section.data._localized), [locale]: version[index].data } };
    });
  }
  if (base[0]) base[0].data = { ...base[0].data, _premiumRedesign: { version: 1, sourceSections: source } };
  return base;
}

function sourceItemSections(item: ItemRow) {
  const current = Array.isArray(item.data.sections) ? item.data.sections as Json[] : [];
  const marker = current.map((section) => record(record(section.data)._premiumRedesign)).find((entry) => Array.isArray(entry.sourceSections));
  return (marker ? marker.sourceSections : current) as Json[];
}

function legacyBuildItemData(target: Target, collection: CollectionRow, item: ItemRow, allItems: ItemRow[]): Json {
  const source = sourceItemSections(item);
  if (!source.length) throw new Error(`${target.slug}/${collection.key}/${item.slug}: collection item has no source sections.`);
  const own = unitsFrom(item.data, item.title);
  const shared = itemUnits(allItems);
  const units = [...own, ...shared].filter((unit, index, list) => unit.image && list.findIndex((entry) => entry.title === unit.title && entry.image === unit.image) === index);
  if (units.length < 3) throw new Error(`${target.slug}/${collection.key}/${item.slug}: needs at least three existing image-backed entries.`);
  const hero = units[0];
  const embedded: Json[] = [
    { id: `${item.slug}-arrival`, type: 'cinematicHero', definitionKey: 'cinematicHero.shared.v1', schemaVersion: 1, visible: true, data: { eyebrow: collection.label, headline: item.title, subline: text(item.data) || hero.text || '', image: hero.image, _premiumRedesign: { version: 1, sourceSections: source } }, styleOverrides: darkStyle(target) },
    { id: `${item.slug}-atelier`, type: 'materialAtelier', definitionKey: 'materialAtelier.shared.v1', schemaVersion: 1, visible: true, data: { badge: collection.label, headline: item.title, subline: hero.text || '', preset: target.preset, items: units.slice(0, 8) }, styleOverrides: darkStyle(target) },
    { id: `${item.slug}-path`, type: 'signaturePath', definitionKey: 'signaturePath.shared.v1', schemaVersion: 1, visible: true, data: { badge: target.preset === 'quiet' ? 'Orientierung' : 'Im Detail', headline: item.title, pathPreset: target.preset === 'quiet' ? 'flow' : 'craft', items: units.slice(0, 7).map((unit) => ({ id: unit.id, title: unit.title, text: unit.text, image: unit.image, href: unit.href })) }, styleOverrides: darkStyle(target) },
    ...source.filter((section) => /^(faq|faqContactSplit|richText|freeText|textBlock|contact|contactForm)$/i.test(String(section.type))).map((section) => ({ ...section, styleOverrides: { ...record(section.styleOverrides), ...darkStyle(target) } })),
  ];
  return { ...record(replacePlaceholderLinks(item.data)), sections: embedded, _premiumRedesign: { version: 1 } };
}

function itemNarrative(item: ItemRow, source: Json[]): Unit[] {
  const candidates: Array<{ data: Json; fallback: string }> = [{ data: record(replacePlaceholderLinks(item.data)), fallback: item.title }];
  source.forEach((section, index) => {
    const data = record(section.data);
    candidates.push({ data, fallback: String(section.titleInternal || section.title_internal || section.type || `${item.title} ${index + 1}`) });
    walk(data, (_key, child) => {
      if (!child || typeof child !== 'object' || Array.isArray(child)) return;
      const nested = child as Json;
      if (title(nested, '') || text(nested)) candidates.push({ data: nested, fallback: item.title });
    });
  });
  return candidates.map(({ data, fallback }, index) => ({
    id: `${item.slug}-narrative-${index + 1}`,
    title: title(data, fallback),
    kicker: firstString(data, ['kicker', 'eyebrow', 'badge', 'badgeText', 'category']),
    text: text(data),
    image: images(data)[0],
    href: href(data),
  })).filter((unit, index, list) =>
    Boolean(unit.title || unit.text || unit.image)
    && list.findIndex((entry) => entry.title === unit.title && entry.text === unit.text && entry.image === unit.image) === index,
  );
}

function generatedBuildItemData(target: Target, collection: CollectionRow, item: ItemRow, _allItems: ItemRow[]): Json {
  const source = sourceItemSections(item);
  if (!source.length) throw new Error(`${target.slug}/${collection.key}/${item.slug}: collection item has no source sections.`);
  const modules = COLLECTION_DETAIL_COMPOSITION_MAPS[target.slug][item.slug];
  if (!modules) throw new Error(`${target.slug}/${collection.key}/${item.slug}: no explicit detail composition map exists.`);

  // Media isolation is intentional: a detail may never borrow images from a sibling item.
  const narrative = itemNarrative(item, source);
  const imageUrls = images({ ...item.data, sections: source });
  const imageUnits: Unit[] = imageUrls.map((image, index) => {
    const context = narrative.find((unit) => unit.image === image);
    return {
      id: `${item.slug}-asset-${index + 1}`,
      title: context?.title || `${item.title} ${index + 1}`,
      kicker: context?.kicker || collection.label,
      text: context?.text || text(item.data),
      image,
      href: context?.href,
    };
  });
  const hero = imageUnits[0] || narrative[0];
  if (!hero) throw new Error(`${target.slug}/${collection.key}/${item.slug}: no reusable item content found.`);

  const embedded: Json[] = [];
  const generatedTypes = new Set<string>();
  const add = (type: string, suffix: string, data: Json) => {
    if (generatedTypes.has(type)) return;
    generatedTypes.add(type);
    embedded.push({
      id: `${item.slug}-${suffix}`,
      type,
      definitionKey: `${type}.shared.v1`,
      schemaVersion: 1,
      visible: true,
      data,
      styleOverrides: darkStyle(target),
    });
  };
  const gallery = () => {
    if (!imageUnits.length) return;
    add('galleryPro', 'gallery', {
      badge: collection.label,
      headline: item.title,
      subline: text(item.data),
      images: imageUnits.slice(0, 12).map((unit) => ({ src: unit.image, alt: unit.title, caption: unit.text, category: unit.kicker })),
    });
  };
  const path = () => {
    const stations = narrative.slice(0, 7);
    if (stations.length < 3) throw new Error(`${target.slug}/${collection.key}/${item.slug}: detail path needs three item-owned narrative stations.`);
    add('signaturePath', 'path', {
      badge: target.preset === 'quiet' ? 'Behutsam begleitet' : 'Im Detail',
      headline: item.title,
      subline: text(item.data),
      pathPreset: target.preset === 'quiet' ? 'flow' : 'craft',
      items: stations.map((unit) => ({ id: unit.id, title: unit.title, text: unit.text, image: unit.image, href: unit.href })),
    });
  };

  for (const module of modules) {
    if (module === 'cinematicArrival') add('cinematicHero', 'arrival', { eyebrow: collection.label, headline: item.title, subline: text(item.data) || hero.text || '', image: hero.image });
    else if (module === 'editorialArrival') add('editorialHero', 'arrival', { eyebrow: collection.label, headline: item.title, text: text(item.data) || hero.text || '', imagePrimary: hero.image, imageSecondary: imageUnits[1]?.image });
    else if (module === 'collectionArrival') add('collectionHero', 'arrival', { category: collection.label, headline: item.title, subline: text(item.data) || hero.text || '', bgImage: hero.image, imageEffect: 'kenBurns', imageEffectIntensity: 'subtle' });
    else if (module === 'glowArrival') add('glowHero', 'arrival', { eyebrow: collection.label, headline: item.title, subline: text(item.data) || hero.text || '', image: hero.image, glowColor: target.palette.accent });
    else if (module === 'ownAtelier') {
      if (imageUnits.length >= 3) add('materialAtelier', 'atelier', { badge: collection.label, headline: item.title, subline: text(item.data) || hero.text || '', preset: target.preset, items: imageUnits.slice(0, 8) });
      else gallery();
    } else if (module === 'ownGallery') gallery();
    else if (module === 'ownChapters') {
      if (imageUnits.length >= 3) add('cinematicChapters', 'chapters', { badge: collection.label, headline: item.title, intro: text(item.data), transition: target.preset === 'quiet' ? 'crossfade' : 'depth', chapters: imageUnits.slice(0, 6).map((unit, index) => ({ kicker: unit.kicker || `${String(index + 1).padStart(2, '0')} · ${collection.label}`, title: unit.title, text: unit.text, image: unit.image, ctaLabel: unit.href ? 'Mehr erfahren' : undefined, ctaHref: unit.href })) });
      else path();
    } else if (module === 'ownMorph') {
      if (imageUnits.length >= 3) add('editorialCardMorph', 'morph', { badge: collection.label, headline: item.title, subline: text(item.data), layout: 'stack', items: imageUnits.slice(0, 8).map((unit) => ({ ...unit, ctaLabel: unit.href ? 'Details ansehen' : undefined })) });
      else gallery();
    } else if (module === 'ownTransformation') {
      if (imageUnits.length >= 3) add('transformationSequence', 'transformation', { badge: collection.label, headline: item.title, subline: text(item.data), states: imageUnits.slice(0, 6).map((unit, index) => ({ kicker: unit.kicker || `${index + 1}`, title: unit.title, text: unit.text, image: unit.image })) });
      else path();
    } else if (module === 'ownPath') path();
    else if (module === 'sourceContent') {
      source.filter((section) => !/(hero|gallery|mosaic|showcase)/i.test(String(section.type))).forEach((section, index) => embedded.push({
        ...section,
        id: section.id || `${item.slug}-source-${index + 1}`,
        styleOverrides: { ...record(section.styleOverrides || section.style_overrides), ...darkStyle(target) },
      }));
    }
  }

  if (!embedded.length) throw new Error(`${target.slug}/${collection.key}/${item.slug}: detail composition is empty.`);
  embedded[0] = { ...embedded[0], data: { ...record(embedded[0].data), _premiumRedesign: { version: 1, sourceSections: source } } };
  return { ...item.data, sections: embedded, _premiumRedesign: { version: 1 } };
}

function conciseGrabDetailText(value: unknown) {
  if (!nonEmpty(value)) return value;
  return value.replace(/<p>Im persönlichen Gespräch werden Umfang,[\s\S]*?nachvollziehbar bleibt\.<\/p>/i, '').trim();
}

export function buildItemData(target: Target, collection: CollectionRow, item: ItemRow, _allItems: ItemRow[], unavailable = new Set<string>()): Json {
  const source = sourceItemSections(item);
  if (!source.length) throw new Error(`${target.slug}/${collection.key}/${item.slug}: collection item has no source sections.`);
  const modules = COLLECTION_DETAIL_COMPOSITION_MAPS[target.slug][item.slug];
  if (!modules) throw new Error(`${target.slug}/${collection.key}/${item.slug}: no explicit detail composition map exists.`);
  const used = new Set<number>();
  const embedded = modules.map((type, index) => {
    const sourceIndex = source.findIndex((candidate, candidateIndex) => !used.has(candidateIndex) && candidate.type === type);
    if (sourceIndex < 0) throw new Error(`${target.slug}/${collection.key}/${item.slug}: required source section ${type} is missing.`);
    used.add(sourceIndex);
    const section = source[sourceIndex];
    const visibleSource = record(replacePlaceholderLinks(record(section.data)));
    if (target.slug === 'schubert-grabdenkmal' && type === 'textImage') visibleSource.text = conciseGrabDetailText(visibleSource.text);
    return {
      ...section,
      id: section.id || `${item.slug}-source-${index + 1}`,
      data: sanitizeSectionData(type, visibleSource, unavailable),
      styleOverrides: { ...record(section.styleOverrides || section.style_overrides), ...darkStyle(target) },
    } as Json;
  });
  if (!embedded.length) throw new Error(`${target.slug}/${collection.key}/${item.slug}: detail composition is empty.`);
  embedded[0] = { ...embedded[0], data: { ...record(embedded[0].data), _premiumRedesign: { version: 1, sourceSections: source } } };
  return { ...item.data, sections: embedded, _premiumRedesign: { version: 1 } };
}

function brandAndDesign(target: Target, settings: SettingsRow) {
  const p = target.palette;
  return {
    brand: { ...settings.brand, headingFont: target.fonts.heading, bodyFont: target.fonts.body, primaryColor: p.accent, secondaryColor: p.muted, accentColor: p.accent, pageBg: p.page, sectionBg: p.section, sectionBgAlt: p.alternate, cardBg: p.card, topBarColor: p.page, footerColor: p.page, footerTextColor: p.body, footerLinkColor: p.heading, navBgColor: p.page, navLinkColor: p.heading, navBrandColor: p.heading, headingColor: p.heading, bodyTextColor: p.body, mutedTextColor: p.muted, linkColor: p.accent, linkHoverColor: p.heading, btnPrimaryBg: p.accent, btnPrimaryText: p.page, btnSecondaryBg: p.alternate, btnSecondaryText: p.heading, btnSecondaryBorder: p.border, badgeBg: p.alternate, badgeText: p.accent, badgeBorder: p.border, cardBorder: p.border, borderColor: p.border, dividerColor: p.border, iconColor: p.accent, btnRadius: '0.25rem', cardRadius: target.preset === 'quiet' ? '0.25rem' : '0.5rem' },
    design: { ...settings.design, sectionBg: p.section, sectionBgAlt: p.alternate, cardBg: p.card, headingColor: p.heading, bodyColor: p.body, mutedColor: p.muted, accentColor: p.accent, btnBg: p.accent, btnText: p.page, btnSecondaryBg: p.alternate, btnSecondaryText: p.heading, btnSecondaryBorder: p.border, borderColor: p.border, dividerColor: p.border, imageOverlay: 'rgba(9,9,8,0.82)' },
  };
}

export const REDESIGN_HELP = `Usage: pnpm --filter @flamingo/db redesign:schubert -- [options]

Options:
  --tenant schubert-design|schubert-grabdenkmal|all
  --dry-run                    Read, validate and write a backup only (default)
  --apply                      Atomically update draft data; never publishes
  --backup-dir <path>          Override the timestamped backup directory
  --legacy-shared-standalone   Opt in to the legacy central-DB fallback described below
  --help                       Show this help

Legacy fallback:
  --legacy-shared-standalone is honored only for a standalone tenant when the
  tenant_database_connections registry is absent (PostgreSQL 42P01) or has no
  record yet for that exact legacy tenant. It then uses the exact control
  DATABASE_URL as the data database. Duplicate/inactive records, decryption
  failures and every other DB error remain fail-closed.`;

export function parseArgs(argv: string[]) {
  const apply = argv.includes('--apply');
  if (apply && argv.includes('--dry-run')) throw new Error('Choose either --apply or --dry-run.');
  const value = (flag: string) => { const index = argv.indexOf(flag); return index >= 0 ? argv[index + 1] : undefined; };
  const tenant = value('--tenant') || 'all';
  if (!['all', ...Object.keys(REDESIGN_TARGETS)].includes(tenant)) throw new Error('Invalid --tenant. Use schubert-design, schubert-grabdenkmal or all.');
  return { apply, tenant: tenant as Target['slug'] | 'all', backupDir: path.resolve(value('--backup-dir') || path.join('packages', 'db', 'backups', 'tenant-redesign')), legacySharedStandalone: argv.includes('--legacy-shared-standalone'), help: argv.includes('--help') };
}

function postgresErrorCode(error: unknown): string | null {
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current && typeof current === 'object'; depth += 1) {
    const candidate = current as { code?: unknown; cause?: unknown };
    if (typeof candidate.code === 'string') return candidate.code;
    current = candidate.cause;
  }
  return null;
}

export function canUseLegacySharedStandalone(input: { enabled: boolean; deploymentMode: string; error: unknown }) {
  return input.enabled && input.deploymentMode === 'standalone' && postgresErrorCode(input.error) === '42P01';
}

export function canUseLegacySharedRecordFallback(input: { enabled: boolean; deploymentMode: string; recordCount: number }) {
  return input.enabled && input.deploymentMode === 'standalone' && input.recordCount === 0;
}

async function dataConnection(controlSql: SqlClient, controlUrl: string, target: Target, options: ReturnType<typeof parseArgs>) {
  const tenants = await controlSql`SELECT id, slug, deployment_mode::text FROM tenants WHERE id = ${target.id} AND slug = ${target.slug}` as { id: string; slug: string; deployment_mode: string }[];
  if (tenants.length !== 1) throw new Error(`${target.slug}: exact control-plane tenant identity not found.`);
  if (tenants[0].deployment_mode !== 'standalone') return { sql: neon(controlUrl, { fetchOptions: { cache: 'no-store' } }), legacySharedStandalone: false };
  let records: { connection_uri_encrypted: string; status: string }[];
  try {
    records = await controlSql`SELECT connection_uri_encrypted, status FROM tenant_database_connections WHERE tenant_id = ${target.id}` as { connection_uri_encrypted: string; status: string }[];
  } catch (error) {
    if (!canUseLegacySharedStandalone({ enabled: options.legacySharedStandalone, deploymentMode: tenants[0].deployment_mode, error })) throw error;
    console.warn(`${target.slug}: legacy shared-standalone mode active (registry table is absent; exact control DATABASE_URL is used).`);
    return { sql: neon(controlUrl, { fetchOptions: { cache: 'no-store' } }), legacySharedStandalone: true };
  }
  if (canUseLegacySharedRecordFallback({ enabled: options.legacySharedStandalone, deploymentMode: tenants[0].deployment_mode, recordCount: records.length })) {
    console.warn(`${target.slug}: legacy shared-standalone mode active (registry record is absent; exact control DATABASE_URL is used).`);
    return { sql: neon(controlUrl, { fetchOptions: { cache: 'no-store' } }), legacySharedStandalone: true };
  }
  if (records.length !== 1 || records[0].status !== 'active') throw new Error(`${target.slug}: active standalone database registry entry not found.`);
  const url = revealCrmSecret(records[0].connection_uri_encrypted);
  if (!url) throw new Error(`${target.slug}: standalone database URI cannot be decrypted.`);
  return { sql: neon(url, { fetchOptions: { cache: 'no-store' } }), legacySharedStandalone: false };
}

async function load(sql: SqlClient, target: Target) {
  const tenants = await sql`SELECT id, slug FROM tenants WHERE id = ${target.id} AND slug = ${target.slug}` as { id: string; slug: string }[];
  if (tenants.length !== 1) throw new Error(`${target.slug}: exact tenant identity not found in data database.`);
  const pages = await sql`SELECT id, title, slug, type::text FROM pages WHERE tenant_id = ${target.id} ORDER BY sort_order, slug` as PageRow[];
  const missingPages = target.pages.filter((slug) => !pages.some((page) => page.slug === slug));
  if (missingPages.length) throw new Error(`${target.slug}: required pages missing: ${missingPages.join(', ')}`);
  const sections = await sql`SELECT id, tenant_id, page_id, type, definition_key, schema_version, variant, title_internal, visible, locked, container, spacing_top, spacing_bottom, anchor_id, style_overrides, data, sort_order FROM page_sections WHERE tenant_id = ${target.id} ORDER BY page_id, sort_order, id` as SectionRow[];
  const collections = await sql`SELECT id, key, label FROM collections WHERE tenant_id = ${target.id} AND key = ${target.collectionKey}` as CollectionRow[];
  if (collections.length !== 1) throw new Error(`${target.slug}: required ${target.collectionKey} collection missing.`);
  const items = await sql`SELECT id, collection_id, slug, title, data, published, priority FROM collection_items WHERE tenant_id = ${target.id} AND collection_id = ${collections[0].id} ORDER BY priority DESC, slug` as ItemRow[];
  const missingItems = target.itemSlugs.filter((slug) => !items.some((item) => item.slug === slug));
  if (missingItems.length || items.length !== target.itemSlugs.length) throw new Error(`${target.slug}: collection identity mismatch; missing=${missingItems.join(', ') || 'none'}, count=${items.length}/${target.itemSlugs.length}.`);
  const settings = await sql`SELECT id, tenant_id, brand, design FROM global_settings WHERE tenant_id = ${target.id}` as SettingsRow[];
  if (settings.length !== 1) throw new Error(`${target.slug}: global settings row missing or duplicated.`);
  return { pages, sections, collection: collections[0], items, settings: settings[0] };
}

function selectedMedia(target: Target, before: Awaited<ReturnType<typeof load>>) {
  const urls = new Set<string>();
  for (const page of before.pages) {
    const wanted = PAGE_COMPOSITION_MAPS[target.slug][page.slug] || [];
    const source = sourceArchive(before.sections.filter((section) => section.page_id === page.id));
    source.filter((section) => wanted.includes(section.type)).forEach((section) => images(section.data).forEach((url) => urls.add(url)));
  }
  for (const item of before.items) {
    const wanted = COLLECTION_DETAIL_COMPOSITION_MAPS[target.slug][item.slug] || [];
    sourceItemSections(item).filter((section) => wanted.includes(String(section.type))).forEach((section) => images(section.data).forEach((url) => urls.add(url)));
  }
  return [...urls].filter((url) => /^https?:\/\//i.test(url));
}

async function mediaAvailable(url: string) {
  if (KNOWN_UNAVAILABLE_MEDIA.some((part) => url.includes(part))) return false;
  const request = async (method: 'HEAD' | 'GET') => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      return await fetch(url, { method, redirect: 'follow', signal: controller.signal, headers: method === 'GET' ? { Range: 'bytes=0-1023' } : undefined });
    } finally {
      clearTimeout(timeout);
    }
  };
  try {
    const head = await request('HEAD');
    if (head.ok) return true;
    const get = await request('GET');
    return get.ok;
  } catch {
    return false;
  }
}

export async function findUnavailableSelectedMedia(urls: string[]) {
  const unavailable = new Set<string>();
  for (let index = 0; index < urls.length; index += 12) {
    const batch = urls.slice(index, index + 12);
    const results = await Promise.all(batch.map(async (url) => ({ url, available: await mediaAvailable(url) })));
    results.filter((result) => !result.available).forEach((result) => unavailable.add(result.url));
  }
  return unavailable;
}

async function processTarget(sql: SqlClient, target: Target, options: ReturnType<typeof parseArgs>, legacySharedStandalone: boolean) {
  const before = await load(sql, target);
  const collections = itemUnits(before.items);
  const unavailable = await findUnavailableSelectedMedia(selectedMedia(target, before));
  const afterSections = before.pages.flatMap((page) => buildPageComposition(target, page, before.sections.filter((section) => section.page_id === page.id), collections, unavailable));
  const afterItems = before.items.map((item) => ({ ...item, data: buildItemData(target, before.collection, item, before.items, unavailable) }));
  const settings = brandAndDesign(target, before.settings);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await mkdir(options.backupDir, { recursive: true });
  const backupPath = path.join(options.backupDir, `${target.slug}-${timestamp}.json`);
  await writeFile(backupPath, JSON.stringify({ version: 1, createdAt: new Date().toISOString(), tenant: { id: target.id, slug: target.slug }, globalSettings: { id: before.settings.id, tenantId: before.settings.tenant_id, brand: before.settings.brand, design: before.settings.design }, pageSections: before.sections, collectionItems: before.items }, null, 2), { encoding: 'utf8', flag: 'wx' });
  const manifest = { tenant: target.slug, mode: options.apply ? 'apply' : 'dry-run', legacySharedStandalone, backupPath, media: { checked: selectedMedia(target, before).length, excludedFromVisibleComposition: unavailable.size }, before: { pages: before.pages.length, pageSections: before.sections.length, collectionItems: before.items.length }, after: { pages: before.pages.length, pageSections: afterSections.length, collectionItems: afterItems.length, sectionTypes: [...new Set(afterSections.map((section) => section.type))] }, untouched: ['pages', 'SEO', 'media', 'navigation', 'footer', 'contact settings', 'published snapshots'] };
  console.log(JSON.stringify(manifest, null, 2));
  if (!options.apply) return manifest;
  await sql.transaction((tx) => [
    tx`UPDATE global_settings SET brand = ${JSON.stringify(settings.brand)}::jsonb, design = ${JSON.stringify(settings.design)}::jsonb, updated_at = now() WHERE id = ${before.settings.id} AND tenant_id = ${target.id}`,
    tx`DELETE FROM page_sections WHERE tenant_id = ${target.id}`,
    ...afterSections.map((section) => tx`INSERT INTO page_sections (id, tenant_id, page_id, type, definition_key, schema_version, variant, title_internal, visible, locked, container, spacing_top, spacing_bottom, anchor_id, style_overrides, data, sort_order, created_at, updated_at) VALUES (${section.id}::uuid, ${target.id}::uuid, ${section.page_id}::uuid, ${section.type}, ${section.definition_key}, ${section.schema_version}, ${section.variant}, ${section.title_internal}, ${section.visible}, ${section.locked}, ${section.container}, ${section.spacing_top}, ${section.spacing_bottom}, ${section.anchor_id}, ${JSON.stringify(section.style_overrides)}::jsonb, ${JSON.stringify(section.data)}::jsonb, ${section.sort_order}, now(), now())`),
    ...afterItems.map((item) => tx`UPDATE collection_items SET data = ${JSON.stringify(item.data)}::jsonb, updated_at = now() WHERE id = ${item.id}::uuid AND tenant_id = ${target.id}::uuid AND collection_id = ${before.collection.id}::uuid AND slug = ${item.slug}`),
  ], { isolationLevel: 'Serializable' });
  return manifest;
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) { console.log(REDESIGN_HELP); return; }
  const controlUrl = process.env.DATABASE_URL?.trim();
  if (!controlUrl) throw new Error('DATABASE_URL is required. Dry-run is the default; use --apply explicitly to write.');
  const controlSql = neon(controlUrl, { fetchOptions: { cache: 'no-store' } });
  const targets = options.tenant === 'all' ? Object.values(REDESIGN_TARGETS) : [REDESIGN_TARGETS[options.tenant]];
  for (const target of targets) {
    const connection = await dataConnection(controlSql, controlUrl, target, options);
    await processTarget(connection.sql, target, options, connection.legacySharedStandalone);
  }
  if (!options.apply) console.log('Dry-run complete. No database rows or published snapshots were changed.');
  else console.log('Draft redesign applied. Nothing was published.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });

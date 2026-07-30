import { createHash } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import { createDb, type Database } from '@flamingo/db';
import * as schema from '../packages/db/src/schema';
import { getDb } from '../apps/marketing/src/lib/db';
import { getTenantDataDb } from '../apps/marketing/src/lib/tenant-data-db';

type ScrapedPage = {
  url: string;
  slug: string;
  title: string;
  date?: Date;
  image?: string;
  excerpt: string;
  content: string;
  text: string;
};

type SectionDef = {
  type: string;
  data: Record<string, unknown>;
  container?: string;
  spacingTop?: string;
  spacingBottom?: string;
  anchorId?: string;
  styleOverrides?: Record<string, unknown>;
};

type PageDef = {
  slug: string;
  title: string;
  type?: 'free' | 'legal';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    canonical?: string;
    noindex?: boolean;
  };
  sections: SectionDef[];
};

type CollectionDef = {
  key: string;
  label: string;
  schema: Record<string, unknown>;
  settings: Record<string, unknown>;
  items: Array<{
    slug: string;
    title: string;
    priority: number;
    createdAt?: Date;
    updatedAt?: Date;
    data: Record<string, unknown>;
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      ogImage?: string;
      canonical?: string;
      noindex?: boolean;
    };
  }>;
};

const DRY_RUN = process.argv.includes('--dry-run');
const BASE_URL = 'https://www.fw-ingolstadt.de';
const SLUG = 'freie-waehler-ingolstadt';
const PROJECT_NAME = 'flamingo-freie-waehler-ingolstadt';
const PREVIEW_URL = `https://${PROJECT_NAME}.vercel.app`;
const PROJECT_ID = 'prj_YJ11JcHEmhrHiuby0eZZEUe0Ig4Z';
const VERCEL_ENV_PROJECT = process.env.VERCEL_ENV_PROJECT || 'flamingo-cms-3-0';
const PAGES_SITEMAP_URL = `${BASE_URL}/sitemap.xml?sitemap=pages&cHash=e57fb11c444801be70f13b7a37a3ace9`;
const NEWS_SITEMAP_URL = `${BASE_URL}/sitemap.xml?sitemap=newsAktuelles&cHash=b444f208c226e3ecec79898722597d9a`;
const MAX_NEWS = Number(process.env.FW_MAX_NEWS || '2000');
const MAX_PAGES = Number(process.env.FW_MAX_PAGES || '400');
const CONCURRENCY = Number(process.env.FW_IMPORT_CONCURRENCY || '7');

const FW_LOGO = `${BASE_URL}/assets/img/FW-logo-design-noclaim.png`;
const FW_SOCIAL = `${BASE_URL}/assets/img/freie-waehler-social.png`;
const FW_HERO = `${BASE_URL}/fileadmin/Verbaende/ov-ingolstadt/Bilder_2026/26-03-18_Slider_Wahl_Platz_1-5_1567x700pix.jpg`;
const MEMBER_PDF = `${BASE_URL}/fileadmin/Verbaende/ov-ingolstadt/PDF_Dokumente/Mitgliedsantrag_Einzugserm%C3%A4chtigung_SEPA_2025.pdf`;

async function loadVercelProjectEnv() {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token) return;
  const response = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(VERCEL_ENV_PROJECT)}/env?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null) as { envs?: Array<{ key: string; value?: string; target?: string[] }> } | { error?: unknown } | null;
  if (!response.ok || !data || !('envs' in data)) {
    console.warn(`Vercel Env konnte nicht geladen werden (${VERCEL_ENV_PROJECT}); nutze vorhandene lokale/GitHub-Env.`);
    return;
  }
  for (const envVar of data.envs || []) {
    if (envVar.key === 'VERCEL_TOKEN') continue;
    const targets = Array.isArray(envVar.target) ? envVar.target : [];
    if (targets.length && !targets.includes('production')) continue;
    const value = typeof envVar.value === 'string' ? envVar.value : '';
    if (!value || value.startsWith('__PLACEHOLDER')) continue;
    if (!process.env[envVar.key]) process.env[envVar.key] = value;
  }
}

async function loadTenantVercelProjectEnv(projectId: string, mapKeys: Record<string, string> = {}) {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token || !projectId) return;
  const response = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/env?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null) as { envs?: Array<{ key: string; value?: string; target?: string[] }> } | { error?: unknown } | null;
  if (!response.ok || !data || !('envs' in data)) return;
  for (const envVar of data.envs || []) {
    const targets = Array.isArray(envVar.target) ? envVar.target : [];
    if (targets.length && !targets.includes('production')) continue;
    const value = typeof envVar.value === 'string' ? envVar.value : '';
    if (!value || value.startsWith('__PLACEHOLDER')) continue;
    const envKey = mapKeys[envVar.key] || envVar.key;
    if ((envKey.endsWith('DATABASE_URL') || envKey === 'TENANT_DATABASE_URL') && !value.startsWith('postgres')) continue;
    if (!process.env[envKey]) process.env[envKey] = value;
  }
}

const CORE_PAGE_PATHS = [
  '',
  'aktuelles',
  'vorstand',
  'fraktion',
  'kreisvereinigung',
  'kommunalwahl-2026/unser-wahlprogramm',
  'kommunalwahl-2026/unsere-stadtratskandidaten',
  'kommunalwahl-2026/unterstuetzer',
  'medien/mitglied-werden',
  'medien',
  'veranstaltungen',
  'bezirksausschuesse',
  'kontakt',
  'impressum',
  'datenschutz',
  'transparenzhinweis',
];

const PERSON_PATH_HINTS = [
  'vorstand',
  'fraktion/',
  'kreisvereinigung',
  'hans-stachel',
  'gerlinde-walter',
  'prof-dr-reinhard-buechl',
  'werner-stief',
  'thomas-thoene',
  'astrid-schob',
];

const VEREIN_SECTION_TYPES = new Set([
  'hero',
  'editorialHero',
  'zigzagShowcase',
  'statsCounter',
  'processSteps',
  'principlesGrid',
  'bentoGrid',
  'comparisonCardsPro',
  'galleryPro',
  'timeline',
  'testimonials',
  'faq',
  'contact',
  'map',
  'team',
  'newsPreview',
  'newsGrid',
  'immersiveCtaBanner',
  'ctaBand',
  'logoCloud',
  'richText',
  'legalContent',
  'collectionHero',
]);

const SHARED_SECTION_TYPES = new Set([
  'collectionList',
  'editorialFeatureRail',
  'featureShowcase',
  'proofWall',
  'signatureGrid',
  'spotlightCards',
  'teamSpotlight',
  'ctaSplit',
]);

function sectionIdentity(type: string) {
  const owner = VEREIN_SECTION_TYPES.has(type) ? 'verein' : SHARED_SECTION_TYPES.has(type) ? 'shared' : 'shared';
  return { definitionKey: `${type}.${owner}.v1`, schemaVersion: 1 };
}

function absoluteUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = decodeHtml(raw.trim());
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return undefined;
  try {
    return new URL(trimmed, BASE_URL).toString();
  } catch {
    return undefined;
  }
}

function isBrandOrLogoImage(url: string | undefined): boolean {
  const value = (url || '').toLowerCase();
  return !value
    || value.includes('/assets/img/fw-logo')
    || value.includes('/assets/img/icon-')
    || value.endsWith('.svg')
    || value.includes('logo_quadratisch')
    || value.includes('freiewaehler-logo')
    || value.includes('freie-waehler-social')
    || value.includes('slider_wahl')
    || value.includes('26-03-18_slider')
    || value.includes('platz_1-5');
}

function contentImage(url: string | undefined): string | undefined {
  return isBrandOrLogoImage(url) ? undefined : url;
}

function decodeHtml(input: string): string {
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripTags(html: string): string {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanText(input: string, max = 0): string {
  const value = input
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim();
  if (!max || value.length <= max) return value;
  return `${value.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

function slugify(input: string): string {
  const fallback = input || 'eintrag';
  return decodeHtml(fallback)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180) || 'eintrag';
}

function stableSlug(base: string, existing: Set<string>): string {
  const root = slugify(base);
  let slug = root;
  let index = 2;
  while (existing.has(slug)) {
    slug = `${root}-${index}`;
    index += 1;
  }
  existing.add(slug);
  return slug;
}

function pathFromUrl(url: string): string {
  const parsed = new URL(url);
  return decodeURIComponent(parsed.pathname.replace(/^\/+|\/+$/g, ''));
}

function sitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)]
    .map((match) => decodeHtml(match[1]).trim())
    .filter(Boolean);
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Flamingo CMS tenant importer (+https://flamingomedia.online)',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const bytes = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') || '';
  const charset = /charset=([^;\s]+)/i.exec(contentType)?.[1]?.trim().toLowerCase();
  const decode = (label: string) => {
    try {
      return new TextDecoder(label).decode(bytes);
    } catch {
      return new TextDecoder('utf-8').decode(bytes);
    }
  };
  if (charset && charset !== 'utf-8' && charset !== 'utf8') return decode(charset);
  const utf8 = decode('utf-8');
  return utf8.includes('\uFFFD') ? decode('windows-1252') : utf8;
}

async function mapConcurrent<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

function firstMatch(html: string, regex: RegExp): string {
  return regex.exec(html)?.[1] || '';
}

function extractFirstImage(html: string): string | undefined {
  const newsBlock = firstMatch(html, /<div[^>]+class="[^"]*news-1st-image[^"]*"[^>]*>([\s\S]*?)<div class="clearfix">/i);
  const source = newsBlock || html;
  const candidates: string[] = [];

  for (const img of source.matchAll(/<img\b[^>]*>/gi)) {
    const tag = img[0];
    const srcset = firstMatch(tag, /srcset="([^"]+)"/i);
    if (srcset) {
      const srcsetCandidates = srcset
        .split(',')
        .map((part) => part.trim().split(/\s+/)[0])
        .filter(Boolean);
      candidates.push(...srcsetCandidates.reverse());
    }

    const dataSrc = firstMatch(tag, /\bdata-src="([^"]+)"/i);
    if (dataSrc) candidates.push(dataSrc);

    const src = firstMatch(tag, /\bsrc="([^"]+)"/i);
    if (src) candidates.push(src);
  }

  const preferred = candidates
    .map((candidate) => contentImage(absoluteUrl(candidate)))
    .filter((url): url is string => Boolean(url))
    .sort((a, b) => {
      const score = (url: string) => {
        const value = url.toLowerCase();
        let result = 0;
        if (value.includes('/fileadmin/')) result += 10;
        if (value.includes('/_processed_/')) result += 8;
        if (/stachel|koenig|könig|mayr|boell|böll|roessler|rößler|kandidat/i.test(value)) result += 6;
        if (value.includes('slider_wahl')) result -= 2;
        return result;
      };
      return score(b) - score(a);
    });

  return preferred[0];
}

function extractDate(html: string): Date | undefined {
  const datetime = firstMatch(html, /datetime="([^"]+)"/i);
  if (datetime) {
    const parsed = new Date(datetime);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const germanDate = firstMatch(html, /(\d{1,2}\.\d{1,2}\.\d{4})/);
  if (germanDate) {
    const [day, month, year] = germanDate.split('.').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day, 12));
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const isoDate = firstMatch(html, /(\d{4}-\d{2}-\d{2})/);
  if (isoDate) {
    const parsed = new Date(`${isoDate}T12:00:00Z`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return undefined;
}

function extractNewsHeader(html: string): string {
  return firstMatch(html, /<div[^>]+class="[^"]*news-header[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
}

function sanitizeFragment(html: string): string {
  const withAbsoluteLinks = html
    .replace(/(<a\b[^>]*href=")([^"]+)("[^>]*>)/gi, (_all, pre, href, post) => {
      const url = absoluteUrl(href);
      return url ? `${pre}${url}" target="_blank" rel="noopener">` : '<span>';
    })
    .replace(/(<img\b[^>]*src=")([^"]+)("[^>]*>)/gi, (_all, pre, src) => {
      const url = absoluteUrl(src);
      return url ? `<img src="${url}" alt="">` : '';
    });

  return withAbsoluteLinks
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(div|section|article|main|header|footer|span)[^>]*>/gi, '')
    .replace(/<h1[^>]*>/gi, '<h2>')
    .replace(/<\/h1>/gi, '</h2>')
    .replace(/<(h[2-4]|p|ul|ol|li|strong|b|em|i|blockquote|br)\b[^>]*>/gi, '<$1>')
    .replace(/<(?!\/?(h[2-4]|p|ul|ol|li|strong|b|em|i|blockquote|br|a|img)\b)[^>]+>/gi, '')
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractMainHtml(html: string, news = false): string {
  if (news) {
    const newsText = firstMatch(html, /<div[^>]+class="[^"]*news-text-wrap[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)
      || firstMatch(html, /<div[^>]+class="[^"]*news-text-wrap[^"]*"[^>]*>([\s\S]*?)<div class="news-related-wrap"/i)
      || firstMatch(html, /<div[^>]+class="[^"]*news-text-wrap[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
    if (newsText) return sanitizeFragment(newsText);
  }
  const main = firstMatch(html, /<div[^>]+class="[^"]*main-content[^"]*"[^>]*>([\s\S]*?)<footer\b/i)
    || firstMatch(html, /<main[^>]*>([\s\S]*?)<\/main>/i)
    || firstMatch(html, /<body[^>]*>([\s\S]*?)<\/body>/i);
  return sanitizeFragment(main);
}

function extractTitle(html: string, url: string, news = false): string {
  if (news) {
    const header = extractNewsHeader(html);
    const withoutDate = header.replace(/<span[^>]+class="[^"]*news-list-date[^"]*"[^>]*>[\s\S]*?<\/span>/i, '');
    const title = cleanText(stripTags(withoutDate));
    if (title) return title;
  }
  const pageHeader = firstMatch(html, /<div[^>]+class="[^"]*page-header[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const h1 = firstMatch(pageHeader || html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = cleanText(stripTags(h1));
  if (title) return title;
  const metaTitle = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i).replace(/\s*\|\s*.*$/, '');
  if (metaTitle) return cleanText(stripTags(metaTitle));
  return cleanText(pathFromUrl(url).split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Startseite');
}

async function scrapePage(url: string, news = false): Promise<ScrapedPage | null> {
  try {
    const html = await fetchText(url);
    const content = extractMainHtml(html, news);
    const text = stripTags(content);
    const title = extractTitle(html, url, news);
    const date = extractDate(news ? extractNewsHeader(html) || html : html);
    const image = extractFirstImage(html) || undefined;
    return {
      url,
      slug: pathFromUrl(url),
      title,
      date,
      image,
      content,
      text,
      excerpt: cleanText(text, 220),
    };
  } catch (error) {
    console.warn(`[skip] ${url}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function getByPath(pages: ScrapedPage[], path: string): ScrapedPage | undefined {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  return pages.find((page) => page.slug === normalized);
}

function sectionStyle(mode: 'light' | 'soft' | 'dark' = 'light'): Record<string, unknown> | undefined {
  if (mode === 'dark') {
    return {
      '--token-section-bg': '#08152c',
      '--token-section-bg-alt': '#0d2247',
      '--token-heading': '#ffffff',
      '--token-body': 'rgba(255,255,255,0.82)',
      '--token-muted': 'rgba(255,255,255,0.64)',
      '--token-card-bg': 'rgba(255,255,255,0.08)',
      '--token-card-border': 'rgba(255,255,255,0.18)',
      '--token-card-heading': '#ffffff',
      '--token-card-body': 'rgba(255,255,255,0.78)',
      '--token-card-muted': 'rgba(255,255,255,0.62)',
      '--token-eyebrow': '#f8b334',
      '--token-badge-bg': 'rgba(248,179,52,0.16)',
      '--token-badge-text': '#fff2d6',
      '--token-badge-border': 'rgba(248,179,52,0.34)',
      '--token-card-badge-bg': 'rgba(255,255,255,0.16)',
      '--token-card-badge-text': '#ffffff',
      '--token-icon': '#f8b334',
      '--token-divider': 'rgba(255,255,255,0.16)',
      '--token-btn-bg': '#f28c00',
      '--token-btn-text': '#061532',
    };
  }
  if (mode === 'soft') {
    return {
      '--token-section-bg': '#fff8ef',
      '--token-section-bg-alt': '#ffffff',
      '--token-card-bg': '#ffffff',
      '--token-card-border': 'rgba(10,35,72,0.12)',
    };
  }
  return undefined;
}

function collectionItemSections(item: ScrapedPage, collectionLabel: string): Array<Record<string, unknown>> {
  return [
    {
      id: `${item.slug || slugify(item.title)}-hero`,
      type: 'collectionHero',
      definitionKey: 'collectionHero.verein.v1',
      schemaVersion: 1,
      visible: true,
      locked: false,
      data: {
        headline: item.title,
        subline: item.excerpt,
        bgImage: item.image || FW_HERO,
        category: collectionLabel,
        date: item.date ? item.date.toISOString() : '',
        overlayColor: '#061532',
        overlayOpacity: item.image ? 0.62 : 0.8,
      },
      container: 'full',
      spacingTop: 'none',
      spacingBottom: 'l',
      styleOverrides: sectionStyle('dark'),
    },
    {
      id: `${item.slug || slugify(item.title)}-content`,
      type: 'richText',
      definitionKey: 'richText.verein.v1',
      schemaVersion: 1,
      visible: true,
      locked: false,
      data: {
        content: item.content || `<p>${item.excerpt}</p>`,
      },
      container: 'narrow',
      spacingTop: 'l',
      spacingBottom: 'xl',
    },
  ];
}

function buildCollection(
  key: string,
  label: string,
  sourceItems: ScrapedPage[],
  options: { pageSlug: string; categoryLabel?: string; sortNewestFirst?: boolean; imageFallback?: string; noindex?: boolean } = { pageSlug: key },
): CollectionDef {
  const used = new Set<string>();
  const items = sourceItems
    .filter((item) => item.title && item.excerpt)
    .sort((a, b) => {
      if (!options.sortNewestFirst) return a.slug.localeCompare(b.slug);
      return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
    })
    .map((item, index) => {
      const slug = stableSlug(item.slug.split('/').filter(Boolean).pop() || item.title, used);
      const date = item.date || new Date(Date.UTC(2026, 0, 1, 12));
      const data = {
        excerpt: item.excerpt,
        content: item.content,
        image: contentImage(item.image) || options.imageFallback || '',
        date: date.toISOString(),
        sourceUrl: item.url,
        category: options.categoryLabel || label,
        sections: collectionItemSections({ ...item, slug, date }, label),
      };
      return {
        slug,
        title: item.title,
        priority: index,
        createdAt: date,
        updatedAt: date,
        data,
        seo: {
          metaTitle: cleanText(item.title, 68),
          metaDescription: cleanText(item.excerpt, 160),
          ogImage: contentImage(item.image) || options.imageFallback || FW_SOCIAL,
          canonical: item.url,
          noindex: options.noindex || false,
        },
      };
    });

  return {
    key,
    label,
    schema: {
      fields: [
        { key: 'excerpt', label: 'Kurztext', type: 'textarea' },
        { key: 'content', label: 'Inhalt', type: 'richtext' },
        { key: 'image', label: 'Bild', type: 'image' },
        { key: 'date', label: 'Datum', type: 'date' },
        { key: 'sourceUrl', label: 'Quelle', type: 'url' },
      ],
    },
    settings: {
      pageSlug: options.pageSlug,
      dateField: 'date',
      imageField: 'image',
      excerptField: 'excerpt',
      source: BASE_URL,
    },
    items,
  };
}

function makeListItems(items: CollectionDef['items'], limit = 9999) {
  return items.slice(0, limit).map((item) => ({
    title: item.title,
    slug: item.slug,
    image: item.data.image,
    excerpt: item.data.excerpt,
    date: item.data.date,
    priority: item.priority,
  }));
}

function personKey(name: string): string {
  const roleWords = new Set([
    '1',
    'fraktionsvorsitzender',
    'vorsitzender',
    'vorsitzende',
    'stadtrat',
    'stellvertretender',
    'stellvertretende',
    'schriftfuehrerin',
    'mitgliederverwaltung',
    'kassier',
    'schatzmeister',
  ]);
  const parts = slugify(name).split('-').filter((part) => part && !roleWords.has(part));
  return parts.slice(0, 3).join('-') || slugify(name);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function personBio(page: ScrapedPage, role: string): string {
  let bio = page.excerpt || '';
  if (page.title) bio = bio.replace(new RegExp(`^\\s*${escapeRegExp(page.title)}\\s*`, 'i'), '');
  if (role) bio = bio.replace(new RegExp(`^\\s*${escapeRegExp(role)}\\s*`, 'i'), '');
  bio = bio
    .replace(/\bFW Ingolstadt e\.V\.\b/gi, ' ')
    .replace(/\bKontaktdaten\b/gi, ' ')
    .replace(/\s*E-Mail:\s*\S+@\S+\s*/gi, ' ')
    .replace(/\bSie wollen Mitglied\b[\s\S]*$/i, ' ')
    .replace(/\bMitglied werden\b[\s\S]*$/i, ' ');
  bio = cleanText(bio, 180);
  return bio.length > 24 ? bio : cleanText((page.excerpt || '').replace(/\bSie wollen Mitglied\b[\s\S]*$/i, ' ').replace(/\bMitglied werden\b[\s\S]*$/i, ' '), 180);
}

function isPersonPage(page: ScrapedPage): boolean {
  const slug = page.slug.toLowerCase();
  const title = page.title.trim();
  const excludedSlugHints = [
    'newsletter',
    'interview',
    'mitglied-werden',
    'mitgliedsantrag',
    'veranstaltungen',
    'termine',
    'bezirksausschuesse',
    'antraege',
    'aktuelles',
    'wahlprogramm',
    'unterstuetzer',
  ];
  if (excludedSlugHints.some((hint) => slug.includes(hint))) return false;
  if (!PERSON_PATH_HINTS.some((hint) => slug.includes(hint)) || slug.includes('antraege')) return false;
  if (!title || title.length >= 100) return false;
  if (['Vorstand', 'Fraktion', 'Kreisvereinigung'].includes(title)) return false;
  if (/freie\s+w[aä]hler|newsletter|interview|mitglied\s+werden|stadtratsfraktion|kreisvereinigung|vorstand|fraktion|termine/i.test(title)) return false;
  const nameParts = title.split(/\s+/).filter(Boolean);
  if (nameParts.length < 2 || nameParts.length > 5) return false;
  return nameParts.some((part) => /^[A-ZÄÖÜ][a-zäöüß]+/.test(part));
}

function curatedPersonProfile(name: string): { role: string; bio: string } | null {
  const profiles: Record<string, { role: string; bio: string }> = {
    'lisa-stachel': {
      role: 'Stadträtin',
      bio: 'Mitglied in Ausschüssen rund um Kultur, Bildung, Sport, Stadtwerke und städtische Infrastruktur.',
    },
    'hans-stachel': {
      role: 'Fraktionsvorsitzender · Vorsitzender FW Ingolstadt e.V.',
      bio: 'Vorsitzender der Freien Wähler Ingolstadt und Ansprechpartner für Stadtratsarbeit und Fraktion.',
    },
    'stefan-koenig': {
      role: 'Stadtrat',
      bio: 'Engagiert in Ausschüssen für Stadtentwicklung, Bau, Telekommunikation und städtische Beteiligungen.',
    },
    'herbert-boell': {
      role: 'stellv. Vorsitzender',
      bio: 'Stellvertretender Vorsitzender der Freien Wähler Ingolstadt e.V.',
    },
    'angela-mayr': {
      role: 'stellv. Vorsitzende',
      bio: 'Stellvertretende Vorsitzende der Freien Wähler Ingolstadt e.V.',
    },
    'jakob-roessler': {
      role: 'Schriftführer',
      bio: 'Schriftführer der Freien Wähler Ingolstadt e.V.',
    },
    'klaus-huber-nischler': {
      role: 'Kassier / Schatzmeister',
      bio: 'Verantwortlich für Kasse und Finanzen der Freien Wähler Ingolstadt e.V.',
    },
    'petra-flauger': {
      role: 'Vorsitzende der Kreisvereinigung Ingolstadt',
      bio: 'Vorsitzende der Kreisvereinigung Ingolstadt.',
    },
    'franz-appel': {
      role: 'stellv. Vorsitzender der Kreisvereinigung',
      bio: 'Stellvertretender Vorsitzender der Kreisvereinigung Ingolstadt.',
    },
    'wolfgang-baumann': {
      role: 'stellv. Vorsitzender der Kreisvereinigung',
      bio: 'Stellvertretender Vorsitzender der Kreisvereinigung Ingolstadt.',
    },
    'markus-reichhart': {
      role: 'Stadtrat · stellv. Fraktionsvorsitzender',
      bio: 'Stellvertretender Fraktionsvorsitzender mit Schwerpunkten in Finanzen, Personal und städtischen Beteiligungen.',
    },
  };
  return profiles[personKey(name)] || null;
}

function extractPeople(pages: ScrapedPage[]): CollectionDef {
  const peoplePages = pages.filter(isPersonPage);
  const used = new Set<string>();
  const seenPeople = new Set<string>();
  const people = peoplePages
    .filter((page) => {
      const key = personKey(page.title);
      if (seenPeople.has(key)) return false;
      seenPeople.add(key);
      return true;
    })
    .slice(0, 60)
    .map((page, index) => {
      const role = cleanText(page.text.split('\n').find((line) => /vorsitz|stadtrat|bezirks|kreis|mitglied|referent|fraktion/i.test(line) && !/sie wollen mitglied|mitglied werden|mitgliedsantrag|kontaktdaten|e-mail/i.test(line)) || '', 110);
      const curated = curatedPersonProfile(page.title);
      const slug = stableSlug(page.title, used);
      return {
        slug,
        title: page.title,
        priority: index,
        data: {
          name: page.title,
          role: curated?.role || role || 'Freie Wähler Ingolstadt',
          bio: curated?.bio || personBio(page, role),
          image: contentImage(page.image) || '',
          content: page.content,
          sourceUrl: page.url,
        },
        seo: {
          metaTitle: cleanText(`${page.title} | Freie Wähler Ingolstadt`, 68),
          metaDescription: cleanText(page.excerpt, 160),
          ogImage: contentImage(page.image) || FW_SOCIAL,
          canonical: page.url,
        },
      };
    });

  return {
    key: 'menschen',
    label: 'Menschen',
    schema: {
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'role', label: 'Rolle', type: 'text' },
        { key: 'bio', label: 'Kurzprofil', type: 'textarea' },
        { key: 'image', label: 'Bild', type: 'image' },
      ],
    },
    settings: { pageSlug: 'menschen', imageField: 'image', excerptField: 'bio' },
    items: people,
  };
}

function richContentFromPage(page: ScrapedPage | undefined, fallback: string): string {
  if (page?.content && stripTags(page.content).length > 30) return page.content;
  return fallback;
}

function textFromPage(page: ScrapedPage | undefined, fallback: string, max = 380): string {
  if (page?.text && page.text.length > 30) return cleanText(page.text, max);
  return fallback;
}

function pageLinks(page: ScrapedPage | undefined) {
  if (!page?.content) return [] as Array<{ label: string; href: string }>;
  return [...page.content.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      href: decodeHtml(match[1]).trim(),
      label: cleanText(stripTags(match[2]), 90),
    }))
    .filter((entry) => entry.href && entry.label);
}

function districtProfile(page: ScrapedPage, index: number) {
  const district = page.title.replace(/\s+-\s+FREIE\s+WÄHLER\s+Ingolstadt$/i, '');
  const plainText = cleanText(stripTags(page.content || page.text), 0);
  const headingNames = [...(page.content || '').matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/gi)]
    .map((match) => cleanText(stripTags(match[1]), 80))
    .filter((value) => value && !/kontaktdaten|kontakt/i.test(value));
  const email = plainText.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || '';
  const name = headingNames[0] || cleanText(
    plainText.match(/Stadtbezirk\s+\d+\s+.+?\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.'-]+(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß.'-]+){1,3})\s+Beruf:/i)?.[1] || '',
    80,
  );
  const occupation = cleanText(plainText.match(/Beruf:\s*(.+?)(?=\s+(?:Vorsitz|Mitglied|Vertreter|Kontaktdaten|E-Mail:))/i)?.[1] || '', 100);
  const role = cleanText(
    plainText.match(/((?:stellvertretende[rn]?\s+)?Vorsitzende?r(?:in)?\s+des\s+BZA[^.]*|Mitglied\s+(?:des|im)\s+BZA[^.]*)/i)?.[1]
      || `Ansprechpartner im ${district}`,
    110,
  );
  const districtPdf = pageLinks(page).find((link) =>
    /\.pdf(?:$|[?#])/i.test(link.href)
    && /stadtbezirk|bezirksgrenzen|bza/i.test(`${link.label} ${link.href}`),
  );
  return {
    district,
    number: String(index + 1).padStart(2, '0'),
    name,
    occupation,
    role,
    email,
    image: contentImage(page.image) || '',
    districtPdf,
  };
}

function districtTeamSection(page: ScrapedPage, index: number): SectionDef {
  const profile = districtProfile(page, index);
  return {
    type: 'teamSpotlight',
    container: 'default',
    spacingTop: 'xl',
    spacingBottom: 'l',
    data: {
      badge: 'Ansprechpartner vor Ort',
      headline: profile.name ? `Ihr Kontakt für ${profile.district}` : profile.district,
      subline: profile.email
        ? 'Fragen und Anliegen aus dem Stadtbezirk können direkt per E-Mail übermittelt werden.'
        : 'Fragen und Anliegen aus dem Stadtbezirk können über unser Kontaktformular übermittelt werden.',
      members: profile.name ? [{
        name: profile.name,
        role: profile.role,
        image: profile.image,
        focus: profile.occupation ? [profile.occupation] : [],
        email: profile.email || undefined,
      }] : [],
    },
  };
}

function districtResourcesSection(page: ScrapedPage, index: number): SectionDef {
  const profile = districtProfile(page, index);
  const cards: Array<Record<string, unknown>> = [
    {
      title: 'Anliegen aus dem Stadtbezirk',
      text: 'Teilen Sie uns mit, welches Thema wir aus Ihrem Stadtbezirk aufnehmen sollen.',
      icon: 'MessageCircle',
      href: '/kontakt',
      ctaLabel: 'Anliegen senden',
    },
  ];
  if (profile.districtPdf) {
    cards.push({
      title: 'Stadtbezirk als PDF',
      text: `Unterlagen und Abgrenzung für ${profile.district}.`,
      icon: 'FileDown',
      href: profile.districtPdf.href,
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
  return {
    type: 'spotlightCards',
    container: 'default',
    spacingTop: 'l',
    spacingBottom: 'l',
    data: {
      badge: 'Kontakt und Unterlagen',
      headline: 'Das Wichtigste für Ihren Stadtbezirk.',
      cards,
    },
  };
}

function mediaResourcesSection(page: ScrapedPage): SectionDef {
  const links = pageLinks(page)
    .filter((link) => !/mitglied|facebook|cookie|datenschutz|impressum|shop|landtag|europaparlament/i.test(`${link.label} ${link.href}`))
    .slice(0, 6);
  const cards = links.length
    ? links.map((link, index) => ({
      title: link.label,
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
  return {
    type: 'spotlightCards',
    container: 'default',
    spacingTop: 'xl',
    spacingBottom: 'xl',
    data: {
      badge: 'Medien',
      headline: 'Bilder, Filme und Veröffentlichungen.',
      subline: 'Ausgewählte Medienangebote der Freien Wähler Ingolstadt.',
      cards,
    },
  };
}

function heroSection(data: Record<string, unknown>, styleOverrides?: Record<string, unknown>): SectionDef {
  return {
    type: 'editorialHero',
    container: 'full',
    spacingTop: 'none',
    spacingBottom: 'xl',
    styleOverrides,
    data,
  };
}

function isLegacyPlaceholder(page: ScrapedPage): boolean {
  const haystack = `${page.title} ${page.excerpt} ${page.text}`.toLowerCase();
  return /lorem ipsum|consetetur sadipscing|aliquyam erat|nonumy eirmod/.test(haystack);
}

function buildSite(scrapedPages: ScrapedPage[], scrapedNews: ScrapedPage[]) {
  const contentPages = scrapedPages.filter((page) => !isLegacyPlaceholder(page));
  const contentNews = scrapedNews.filter((item) => !isLegacyPlaceholder(item));

  const latestNews = contentNews
    .filter((item) => item.title && item.excerpt)
    .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  const antragPages = contentPages.filter((page) => page.slug.includes('fraktion/antraege'));
  const bzaPages = contentPages
    .filter((page) => /^bezirksausschuesse\/bza-\d{2}/i.test(page.slug) && page.title && page.excerpt)
    .sort((a, b) => a.slug.localeCompare(b.slug, 'de'));
  const archivePages = contentPages.filter((page) => {
    if (!page.title || !page.excerpt) return false;
    if (CORE_PAGE_PATHS.includes(page.slug)) return false;
    if (page.slug.includes('fraktion/antraege')) return false;
    if (/^bezirksausschuesse\/bza-\d{2}/i.test(page.slug)) return false;
    if (PERSON_PATH_HINTS.some((hint) => page.slug.includes(hint))) return false;
    return true;
  });

  const news = buildCollection('news', 'Aktuelles', latestNews, { pageSlug: 'aktuelles', categoryLabel: 'Aktuelles', sortNewestFirst: true });
  const antraege = buildCollection('antraege', 'Anträge', antragPages, { pageSlug: 'stadtrat', categoryLabel: 'Stadtrat', sortNewestFirst: true });
  const archiv = buildCollection('seitenarchiv', 'Interne Seitenquelle', archivePages, { pageSlug: '', categoryLabel: 'Interne Quelle', sortNewestFirst: false, noindex: true });
  const menschen = extractPeople(contentPages);

  const home = getByPath(contentPages, '');
  const kontakt = getByPath(contentPages, 'kontakt');
  const vorstand = getByPath(contentPages, 'vorstand');
  const fraktion = getByPath(contentPages, 'fraktion');
  const kreis = getByPath(contentPages, 'kreisvereinigung');
  const wahlprogramm = getByPath(contentPages, 'kommunalwahl-2026/unser-wahlprogramm');
  const kandidaten = getByPath(contentPages, 'kommunalwahl-2026/unsere-stadtratskandidaten');
  const unterstuetzer = getByPath(contentPages, 'kommunalwahl-2026/unterstuetzer');
  const mitglied = getByPath(contentPages, 'medien/mitglied-werden');
  const veranstaltungen = getByPath(contentPages, 'veranstaltungen');
  const bza = getByPath(contentPages, 'bezirksausschuesse');
  const medien = getByPath(contentPages, 'medien');
  const impressum = getByPath(contentPages, 'impressum');
  const datenschutz = getByPath(contentPages, 'datenschutz');
  const transparenz = getByPath(contentPages, 'transparenzhinweis');

  const latestItems = makeListItems(news.items, 6);
  const peopleItems = menschen.items.slice(0, 8).map((item) => ({
    name: item.data.name,
    role: item.data.role,
    image: item.data.image,
    bio: item.data.bio,
  }));

  const brand = {
    companyName: 'Freie Wähler Ingolstadt',
    tagline: 'Unabhängig. Bürgernah. Sachorientiert.',
    logoUrl: FW_LOGO,
    faviconUrl: FW_LOGO,
    primaryColor: '#f28c00',
    secondaryColor: '#0a2348',
    accentColor: '#f8b334',
    fontFamily: 'Inter',
    headingFontFamily: 'Inter Tight',
  };

  const contact = {
    email: 'info@fw-ingolstadt.de',
    address: 'Ingolstadt',
    contactPerson: 'Freie Wähler Ingolstadt e.V.',
  };

  const design = {
    radius: '1.35rem',
    shadow: 'soft',
    typography: 'editorial',
    tokens: {
      background: '#ffffff',
      sectionBg: '#ffffff',
      sectionBgAlt: '#fff8ef',
      heading: '#061532',
      body: '#25344f',
      muted: '#6c7690',
      accent: '#f28c00',
      cardBg: '#ffffff',
      cardBorder: 'rgba(10,35,72,0.12)',
      badgeBg: 'rgba(242,140,0,0.10)',
      badgeText: '#a85a00',
      badgeBorder: 'rgba(242,140,0,0.22)',
      btnBg: '#f28c00',
      btnText: '#061532',
      btnSecondaryBg: '#ffffff',
      btnSecondaryText: '#061532',
      btnSecondaryBorder: 'rgba(10,35,72,0.18)',
    },
  };

  const bzaListItems = bzaPages.map((page, index) => ({
    title: page.title.replace(/\s+-\s+FREIE\s+WÄHLER\s+Ingolstadt$/i, ''),
    slug: page.slug.split('/').filter(Boolean).pop() || slugify(page.title),
    image: contentImage(page.image) || FW_HERO,
    excerpt: page.excerpt,
    priority: index,
  }));

  const bzaDetailPages: PageDef[] = bzaPages.map((page, index) => {
    const profile = districtProfile(page, index);
    return {
      slug: page.slug,
      title: profile.district,
      seo: {
        metaTitle: cleanText(page.title, 68),
        metaDescription: cleanText(page.excerpt, 160),
        ogImage: contentImage(page.image) || FW_SOCIAL,
        canonical: page.url,
      },
      sections: [
        heroSection({
          eyebrow: `Bezirksausschuss ${String(index + 1).padStart(2, '0')}`,
          headline: profile.district,
          text: profile.name
            ? `${profile.name} ist ${profile.role.toLowerCase()}${profile.occupation ? ` und arbeitet als ${profile.occupation}` : ''}.`
            : `Hier finden Sie den direkten Kontakt und die Unterlagen für ${profile.district}.`,
          layout: 'fullBleedImage',
          imagePrimary: contentImage(page.image) || FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
          secondaryCta: { label: 'Alle Bezirke', href: '/bezirksausschuesse' },
        }, sectionStyle('soft')),
        districtTeamSection(page, index),
        districtResourcesSection(page, index),
        {
          type: 'ctaBand',
          container: 'default',
          spacingTop: 'l',
          spacingBottom: 'xl',
          data: {
            badgeText: 'Anliegen im Stadtteil',
            headline: 'Ein Thema aus dem Bezirk melden?',
            subline: 'Kurze Nachricht senden, damit das Anliegen in die kommunalpolitische Arbeit aufgenommen werden kann.',
            ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'ArrowRight' },
            ctaSecondary: { label: 'Zurück zu allen Bezirken', href: '/bezirksausschuesse' },
          },
        },
      ],
    };
  });

  const pages: PageDef[] = [
    {
      slug: '',
      title: 'Startseite',
      seo: {
        metaTitle: 'Freie Wähler Ingolstadt',
        metaDescription: 'Freie Wähler Ingolstadt: unabhängig, bürgernah und sachorientiert für Ingolstadt.',
        ogImage: FW_HERO,
        canonical: PREVIEW_URL,
      },
      sections: [
        heroSection({
          eyebrow: 'Freie Wähler Ingolstadt',
          headline: 'Für Ingolstadt. Sachlich. Bürgernah. Unabhängig.',
          text: 'Wir engagieren uns ehrenamtlich für Ingolstadt — sachorientiert, unabhängig und nah an den Themen der Bürgerinnen und Bürger.',
          layout: 'fullBleedImage',
          imageFit: 'landscapeContain',
          imagePrimary: FW_HERO,
          primaryCta: { label: 'Aktuelles lesen', href: '/aktuelles' },
          secondaryCta: { label: 'Mitmachen', href: '/mitmachen' },
          hint: 'Kommunalpolitik aus Ingolstadt – ohne Parteizwang, mit Blick auf konkrete Lösungen.',
        }, sectionStyle('soft')),
        {
          type: 'bentoGrid',
          container: 'full',
          spacingTop: 'none',
          spacingBottom: 'xl',
          styleOverrides: sectionStyle('dark'),
          data: {
            badge: 'Unser Anspruch',
            headline: 'Politik beginnt vor Ort.',
            subline: 'Kommunalpolitik muss verständlich, unabhängig und konkret bleiben. Diese vier Prinzipien führen durch Programm, Stadtrat und Vereinsarbeit.',
            items: [
              { icon: 'Scale', title: 'Unabhängig entscheiden', description: 'Keine Parteiideologie, sondern Lösungen, die Ingolstadt konkret weiterbringen.', span: 'wide' },
              { icon: 'MapPin', title: 'Nah an den Stadtteilen', description: 'Anliegen aus Bezirken, Vereinen und Alltag gehören sichtbar in die politische Arbeit.' },
              { icon: 'FileCheck', title: 'Fakten statt Schlagworte', description: 'Anträge und Entscheidungen sollen nachvollziehbar begründet und auffindbar sein.' },
              { icon: 'Handshake', title: 'Ehrenamt ernst nehmen', description: 'Kommunalpolitik lebt von Menschen, die Zeit, Erfahrung und Verantwortung einbringen.' },
            ],
          },
        },
        {
          type: 'newsPreview',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          data: {
            headline: 'Aktuelles aus Ingolstadt',
            subline: 'Pressemitteilungen, Anträge und Beiträge aus Verein und Stadtratsfraktion.',
            collectionKey: 'news',
            collectionBasePath: '/c/news',
            linkHref: '/aktuelles',
            linkLabel: 'Alle Meldungen',
            limit: 6,
            columns: 3,
            items: latestItems,
          },
        },
        {
          type: 'editorialFeatureRail',
          container: 'full',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          styleOverrides: {
            '--token-section-bg': '#ffffff',
            '--token-heading': '#061532',
            '--token-body': '#25344f',
            '--token-card-bg': '#08152c',
            '--token-card-border': 'rgba(10,35,72,0.14)',
            '--token-card-heading': '#ffffff',
            '--token-card-body': 'rgba(255,255,255,0.86)',
            '--token-card-muted': 'rgba(255,255,255,0.74)',
            '--token-on-dark-heading': '#ffffff',
            '--token-eyebrow': '#f8b334',
            '--token-btn-bg': '#f28c00',
            '--token-btn-text': '#061532',
          },
          data: {
            badge: 'Schwerpunkte',
            headline: 'Alles Wichtige ohne Seitendschungel.',
            subline: 'Programm, aktuelle Meldungen, Stadtratsarbeit, Organisation und Mitmachen sind bewusst gebündelt.',
            items: [
              { kicker: 'Programm', title: 'Wofür wir antreten.', text: 'Die politischen Schwerpunkte für Ingolstadt gebündelt und verständlich.', image: contentImage(wahlprogramm?.image) || FW_HERO, ctaLabel: 'Programm ansehen', ctaHref: '/wahlprogramm' },
              { kicker: 'Stadtrat', title: 'Anträge und Positionen.', text: 'Anträge, Initiativen und Arbeit der Stadtratsfraktion mit Suche und Archiv.', image: contentImage(fraktion?.image) || FW_HERO, ctaLabel: 'Zum Archiv', ctaHref: '/stadtrat#antraege' },
              { kicker: 'Organisation', title: 'Menschen und Struktur.', text: 'Vorstand, Fraktion, Kreisvereinigung und Bezirksausschüsse an einem Ort.', image: contentImage(kreis?.image) || FW_HERO, ctaLabel: 'Menschen ansehen', ctaHref: '/menschen' },
              { kicker: 'Mitmachen', title: 'Einbringen statt zuschauen.', text: 'Mitglied werden, Termine besuchen oder direkt Kontakt aufnehmen.', image: contentImage(veranstaltungen?.image) || FW_HERO, ctaLabel: 'Mitmachen', ctaHref: '/mitmachen' },
            ],
          },
        },
        {
          type: 'team',
          container: 'default',
          spacingTop: 'l',
          spacingBottom: 'xl',
          data: {
            headline: 'Menschen hinter den Freien Wählern',
            subline: 'Vorstand, Fraktion und Engagierte aus Ingolstadt.',
            members: peopleItems,
          },
        },
        {
          type: 'ctaBand',
          container: 'default',
          spacingTop: 'l',
          spacingBottom: 'xl',
          data: {
            badgeText: 'Mitmachen',
            headline: 'Kommunalpolitik braucht Menschen, die sich einbringen.',
            subline: 'Wer Ingolstadt mitgestalten möchte, findet hier Kontakt, Informationen und den Mitgliedsantrag.',
            ctaPrimary: { label: 'Mitmachen', href: '/mitmachen', icon: 'ArrowRight' },
            ctaSecondary: { label: 'Kontakt aufnehmen', href: '/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'aktuelles',
      title: 'Aktuelles',
      seo: {
        metaTitle: 'Aktuelles | Freie Wähler Ingolstadt',
        metaDescription: 'Aktuelle Meldungen der Freien Wähler Ingolstadt.',
        ogImage: latestNews[0]?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Aktuelles',
          headline: 'Meldungen, Anträge und Positionen.',
          text: 'Beiträge und Pressemitteilungen der Freien Wähler Ingolstadt, sortiert nach Datum.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kontakt', href: '/kontakt' },
        }, sectionStyle('soft')),
        {
          type: 'collectionList',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          data: {
            headline: 'Alle Meldungen',
            subline: `${news.items.length} Beiträge aus dem Archiv der Freien Wähler Ingolstadt.`,
            items: makeListItems(news.items),
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
    {
      slug: 'news',
      title: 'News',
      seo: {
        metaTitle: 'News | Freie Wähler Ingolstadt',
        metaDescription: 'Meldungen, Anträge und Pressemitteilungen der Freien Wähler Ingolstadt mit Suche und Archiv.',
        ogImage: latestNews[0]?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'News & Archiv',
          headline: 'Was Ingolstadt aktuell bewegt.',
          text: 'Meldungen, Anträge und Pressemitteilungen der Freien Wähler Ingolstadt – durchsuchbar und nach Datum geordnet.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kontakt', href: '/kontakt' },
        }, sectionStyle('soft')),
        {
          type: 'collectionList',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          data: {
            headline: 'Alle Meldungen',
            subline: `${news.items.length} Beiträge aus dem Archiv der Freien Wähler Ingolstadt.`,
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
    {
      slug: 'wahlprogramm',
      title: 'Wahlprogramm',
      seo: {
        metaTitle: 'Wahlprogramm | Freie Wähler Ingolstadt',
        metaDescription: cleanText(textFromPage(wahlprogramm, 'Wahlprogramm der Freien Wähler Ingolstadt.', 160), 160),
        ogImage: wahlprogramm?.image || FW_HERO,
      },
      sections: [
        heroSection({
          eyebrow: 'Kommunalwahl 2026',
          headline: 'Unser Wahlprogramm',
          text: textFromPage(wahlprogramm, 'Ziele und Themen der Freien Wähler Ingolstadt.', 280),
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kandidaten ansehen', href: '/menschen' },
          secondaryCta: { label: 'Mitmachen', href: '/mitmachen' },
        }, sectionStyle('soft')),
        {
          type: 'bentoGrid',
          container: 'default',
          spacingTop: 'l',
          spacingBottom: 'xl',
          styleOverrides: sectionStyle('light'),
          data: {
            badge: 'Programm',
            headline: 'Themen klar geordnet.',
            subline: 'Finanzen, Stadtentwicklung, Mobilität und Transparenz als klare Themenfelder für Ingolstadt.',
            items: [
              { icon: 'PiggyBank', title: 'Haushalt & Verantwortung', description: 'Solide Finanzen schaffen Spielraum für Familien, Sicherheit, Bildung und Gesundheit.', span: 'wide' },
              { icon: 'Building2', title: 'Stadtentwicklung', description: 'Ingolstadt soll sich nachvollziehbar, bezahlbar und lebenswert weiterentwickeln.' },
              { icon: 'Route', title: 'Mobilität & Alltag', description: 'Entscheidungen müssen im Alltag der Bürgerinnen und Bürger funktionieren.' },
              { icon: 'SearchCheck', title: 'Transparenz', description: 'Kommunalpolitik braucht klare Grundlagen, nachvollziehbare Zahlen und offene Kommunikation.' },
            ],
          },
        },
        {
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'l',
          spacingBottom: 'xl',
          data: {
            badge: 'Kommunalwahl 2026',
            headline: 'Weitere Inhalte zur Wahl',
            cards: [
              { title: 'Stadtratskandidaten', text: 'Kandidatinnen, Kandidaten und Ansprechpartner der Freien Wähler Ingolstadt.', icon: 'Users', href: '/menschen', ctaLabel: 'Menschen ansehen' },
              { title: 'Kreisvereinigung', text: 'Organisation, Vorstand und kommunalpolitisches Engagement vor Ort.', icon: 'Building2', href: '/kreisvereinigung', ctaLabel: 'Organisation ansehen' },
              { title: 'Aktuelle Meldungen', text: 'Beiträge rund um Kommunalpolitik, Anträge und Wahlkampf.', icon: 'Newspaper', href: '/aktuelles', ctaLabel: 'Aktuelles lesen' },
            ],
          },
        },
      ],
    },
    {
      slug: 'menschen',
      title: 'Menschen',
      seo: {
        metaTitle: 'Vorstand und Fraktion | Freie Wähler Ingolstadt',
        metaDescription: 'Menschen der Freien Wähler Ingolstadt.',
        ogImage: menschen.items[0]?.data.image as string | undefined,
      },
      sections: [
        heroSection({
          eyebrow: 'Vorstand & Fraktion',
          headline: 'Menschen, die Verantwortung übernehmen.',
          text: 'Eine Übersicht über Vorstand, Fraktion und weitere Ansprechpartnerinnen und Ansprechpartner.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
        }, sectionStyle('soft')),
        {
          type: 'team',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          data: {
            headline: 'Vorstand, Fraktion und Ansprechpartner',
            subline: 'Ansprechpartnerinnen und Ansprechpartner aus Vorstand, Fraktion und Kreisvereinigung.',
            members: menschen.items.map((item) => ({
              name: item.data.name,
              role: item.data.role,
              image: item.data.image,
              bio: item.data.bio,
            })),
          },
        },
        {
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'l',
          spacingBottom: 'xl',
          data: {
            badge: 'Organisation',
            headline: 'Vor Ort organisiert.',
            subline: 'Die wichtigsten organisatorischen Bereiche sind gebündelt, statt als einzelne Altseiten ausgespielt.',
            cards: [
              { title: 'Vorstand', text: 'Der Vorstand koordiniert Verein, Themenarbeit und Ansprechpartner vor Ort.', icon: 'Users', href: '/vorstand', ctaLabel: 'Vorstand ansehen' },
              { title: 'Kreisvereinigung', text: 'Die Kreisvereinigung bündelt das kommunalpolitische Engagement in Ingolstadt.', icon: 'Building2', href: '/kreisvereinigung', ctaLabel: 'Mehr erfahren' },
              { title: 'Bezirksausschüsse', text: 'Stadtteilthemen, lokale Anliegen und kommunale Arbeit in den Bezirken.', icon: 'Map', href: '/bezirksausschuesse', ctaLabel: 'Ausschüsse ansehen' },
            ],
          },
        },
      ],
    },
    {
      slug: 'stadtrat',
      title: 'Stadtrat',
      seo: {
        metaTitle: 'Stadtrat und Anträge | Freie Wähler Ingolstadt',
        metaDescription: 'Stadtratsfraktion und Anträge der Freien Wähler Ingolstadt.',
        ogImage: fraktion?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Stadtratsfraktion',
          headline: 'Anträge und Arbeit im Stadtrat.',
          text: 'Stadtratsarbeit, Anträge und Stadtteilthemen an einem Ort: sachlich gebündelt, nachvollziehbar sortiert und schnell auffindbar.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Alle Anträge', href: '#antraege' },
        }, sectionStyle('dark')),
        {
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'l',
          spacingBottom: 'l',
          data: {
            badge: 'Stadtrat',
            headline: 'Arbeit nachvollziehbar machen.',
            subline: 'Fraktion, Anträge und Stadtteilthemen sind auf einer Seite gebündelt.',
            cards: [
              { title: 'Stadtratsfraktion', text: 'Ansprechpartner, Arbeitsschwerpunkte und kommunalpolitische Initiativen der Fraktion.', icon: 'Landmark' },
              { title: 'Bezirksausschüsse', text: textFromPage(bza, 'Kommunale Themen entstehen in den Stadtteilen. Die Bezirksausschüsse sind dafür ein wichtiger Ort.', 180), icon: 'Map' },
              { title: 'Antragsarchiv', text: `${antraege.items.length} Anträge und Stadtratsseiten chronologisch sortiert.`, icon: 'FileText', href: '#antraege' },
            ],
          },
        },
        {
          type: 'collectionList',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          anchorId: 'antraege',
          data: {
            headline: 'Anträge aus dem Archiv',
            subline: `${antraege.items.length} Anträge und Stadtratsseiten aus dem Archiv.`,
            items: makeListItems(antraege.items),
            collectionBasePath: '/c/antraege',
            showImage: false,
            showDate: true,
            showExcerpt: true,
            showSortControls: true,
            showSearch: true,
            searchPlaceholder: 'Anträge und Stadtratsthemen durchsuchen',
            paginate: true,
            itemsPerPage: 12,
            sortBy: 'date-desc',
            columns: 3,
          },
        },
      ],
    },
    {
      slug: 'mitmachen',
      title: 'Mitmachen',
      seo: {
        metaTitle: 'Mitmachen | Freie Wähler Ingolstadt',
        metaDescription: 'Mitglied werden, Veranstaltungen besuchen oder die Freien Wähler Ingolstadt unterstützen.',
        ogImage: mitglied?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Mitmachen',
          headline: 'Ingolstadt mitgestalten.',
          text: textFromPage(mitglied, 'Wer sich politisch vor Ort einbringen möchte, kann Mitglied der Freien Wähler Ingolstadt werden oder die Arbeit unterstützen.', 300),
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Mitgliedsantrag öffnen', href: MEMBER_PDF },
          secondaryCta: { label: 'Kontakt', href: '/kontakt' },
        }, sectionStyle('soft')),
        {
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'l',
          spacingBottom: 'xl',
          data: {
            badge: 'Engagement',
            headline: 'Drei einfache Wege mitzumachen.',
            subline: 'Mitglied werden, Termine wahrnehmen oder direkt Kontakt aufnehmen.',
            cards: [
              { title: 'Mitglied werden', text: 'Mitgliedsantrag herunterladen, ausfüllen und direkt an die Freien Wähler Ingolstadt senden.', icon: 'Handshake', href: MEMBER_PDF, ctaLabel: 'PDF öffnen' },
              { title: 'Veranstaltungen', text: 'Termine, Treffen und Veranstaltungen der Freien Wähler Ingolstadt auf einen Blick.', icon: 'Calendar', href: '/veranstaltungen', ctaLabel: 'Termine ansehen' },
              { title: 'Unterstützen', text: 'Wer Ideen, Fragen oder Unterstützung anbieten möchte, kann direkt Kontakt aufnehmen.', icon: 'Heart', href: '/kontakt', ctaLabel: 'Kontakt aufnehmen' },
            ],
          },
        },
      ],
    },
    {
      slug: 'vorstand',
      title: 'Vorstand',
      seo: {
        metaTitle: 'Vorstand | Freie Wähler Ingolstadt',
        metaDescription: 'Vorstand und Organisation der Freien Wähler Ingolstadt.',
        ogImage: vorstand?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Organisation',
          headline: 'Vorstand der Freien Wähler Ingolstadt.',
          text: 'Der Vorstand koordiniert den Verein, bündelt Themen und ist Ansprechpartner für Mitglieder und Interessierte.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
          secondaryCta: { label: 'Menschen ansehen', href: '/menschen' },
        }, sectionStyle('soft')),
        {
          type: 'team',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'l',
          data: {
            headline: 'Ansprechpartner im Vorstand',
            subline: 'Die wichtigsten Personen aus Vorstand und Organisation.',
            members: menschen.items.filter((item) => String(item.data.role || '').toLowerCase().includes('vorsitz') || String(item.data.role || '').toLowerCase().includes('kassier') || String(item.data.role || '').toLowerCase().includes('schrift')).slice(0, 8).map((item) => ({
              name: item.data.name,
              role: item.data.role,
              image: item.data.image,
              bio: item.data.bio,
            })),
          },
        },
      ],
    },
    {
      slug: 'fraktion',
      title: 'Fraktion',
      seo: {
        metaTitle: 'Fraktion | Freie Wähler Ingolstadt',
        metaDescription: 'Stadtratsfraktion der Freien Wähler Ingolstadt.',
        ogImage: fraktion?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Stadtrat',
          headline: 'Stadtratsfraktion und kommunale Arbeit.',
          text: 'Unsere Stadtratsfraktion bringt konkrete Anliegen in den Stadtrat ein und macht Anträge und Ansprechpartner transparent.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Anträge ansehen', href: '/stadtrat#antraege' },
          secondaryCta: { label: 'Kontakt', href: '/kontakt' },
        }, sectionStyle('dark')),
        {
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'l',
          data: {
            badge: 'Fraktion',
            headline: 'Stadtratsarbeit auf einen Blick.',
            cards: [
              { title: 'Anträge', text: `${antraege.items.length} Anträge und Stadtratsthemen im Archiv.`, icon: 'FileText', href: '/stadtrat#antraege', ctaLabel: 'Archiv öffnen' },
              { title: 'Bezirksausschüsse', text: 'Stadtteilthemen und lokale Anliegen gehören sichtbar zur Stadtratsarbeit.', icon: 'Map', href: '/bezirksausschuesse', ctaLabel: 'Ausschüsse ansehen' },
              { title: 'Ansprechpartner', text: 'Fraktion und Vorstand sind über die Personenseite gebündelt auffindbar.', icon: 'Users', href: '/menschen', ctaLabel: 'Menschen ansehen' },
            ],
          },
        },
      ],
    },
    {
      slug: 'bezirksausschuesse',
      title: 'Bezirksausschüsse',
      seo: {
        metaTitle: 'Bezirksausschüsse | Freie Wähler Ingolstadt',
        metaDescription: 'Bezirksausschüsse und Stadtteilthemen der Freien Wähler Ingolstadt.',
        ogImage: bza?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Stadtteile',
          headline: 'Politik beginnt in den Bezirken.',
          text: 'In den Bezirksausschüssen werden Anliegen aus den Stadtteilen aufgenommen und in die kommunale Arbeit eingebracht.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
          secondaryCta: { label: 'Stadtrat ansehen', href: '/stadtrat' },
        }, sectionStyle('soft')),
        {
          type: 'collectionList',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'l',
          data: {
            headline: 'Alle Bezirksausschüsse',
            subline: `${bzaListItems.length} Bezirksausschüsse mit Ansprechpartnern, Kontaktdaten und Unterlagen.`,
            items: bzaListItems,
            collectionBasePath: '/bezirksausschuesse',
            showImage: false,
            showDate: false,
            showExcerpt: true,
            showSortControls: true,
            showSearch: true,
            searchPlaceholder: 'Bezirk suchen',
            paginate: true,
            itemsPerPage: 12,
            sortBy: 'priority',
            columns: 3,
          },
        },
        {
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'l',
          data: {
            badge: 'Bezirke',
            headline: 'Lokale Anliegen sichtbar machen.',
            cards: [
              { title: 'Stadtteilthemen', text: 'Anliegen aus den Bezirken werden gesammelt, priorisiert und in die politische Arbeit getragen.', icon: 'MapPin', href: '/kontakt', ctaLabel: 'Anliegen senden' },
              { title: 'Austausch vor Ort', text: 'Kommunalpolitik braucht Rückmeldung aus Vereinen, Nachbarschaften und Alltag.', icon: 'MessageCircle', href: '/veranstaltungen', ctaLabel: 'Termine ansehen' },
              { title: 'Stadtrat', text: 'Themen aus den Bezirken verbinden sich mit Anträgen und Entscheidungen im Stadtrat.', icon: 'Landmark', href: '/stadtrat', ctaLabel: 'Zur Stadtratsarbeit' },
            ],
          },
        },
      ],
    },
    ...bzaDetailPages,
    {
      slug: 'veranstaltungen',
      title: 'Veranstaltungen',
      seo: {
        metaTitle: 'Veranstaltungen | Freie Wähler Ingolstadt',
        metaDescription: 'Termine und Veranstaltungen der Freien Wähler Ingolstadt.',
        ogImage: veranstaltungen?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Termine',
          headline: 'Veranstaltungen und Austausch.',
          text: 'Bei unseren Terminen und Veranstaltungen kommen wir über aktuelle Themen und Anliegen aus Ingolstadt ins Gespräch.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
          secondaryCta: { label: 'Mitglied werden', href: MEMBER_PDF },
        }, sectionStyle('soft')),
        {
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'l',
          data: {
            badge: 'Mitmachen',
            headline: 'So bleibst du nah dran.',
            cards: [
              { title: 'Termine', text: 'Veranstaltungen und Treffen bieten Gelegenheit zum Austausch über Ingolstadt.', icon: 'Calendar', href: '/kontakt', ctaLabel: 'Termin anfragen' },
              { title: 'Mitglied werden', text: 'Wer dauerhaft mitarbeiten möchte, kann den Mitgliedsantrag direkt öffnen.', icon: 'Handshake', href: MEMBER_PDF, ctaLabel: 'PDF öffnen' },
              { title: 'Aktuelles', text: 'Meldungen, Anträge und Positionen zeigen, welche Themen gerade relevant sind.', icon: 'Newspaper', href: '/aktuelles', ctaLabel: 'Aktuelles lesen' },
            ],
          },
        },
      ],
    },
    {
      slug: 'kreisvereinigung',
      title: 'Kreisvereinigung',
      seo: {
        metaTitle: 'Kreisvereinigung | Freie Wähler Ingolstadt',
        metaDescription: 'Kreisvereinigung der Freien Wähler Ingolstadt.',
        ogImage: kreis?.image || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Kreisvereinigung',
          headline: 'Kommunales Engagement bündeln.',
          text: 'Die Kreisvereinigung bündelt das kommunalpolitische Engagement der Freien Wähler in Ingolstadt.',
          layout: 'fullBleedImage',
          imagePrimary: FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Vorstand ansehen', href: '/vorstand' },
          secondaryCta: { label: 'Kontakt', href: '/kontakt' },
        }, sectionStyle('soft')),
        {
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'l',
          data: {
            badge: 'Organisation',
            headline: 'Verein, Fraktion und Stadtteile verbinden.',
            cards: [
              { title: 'Vorstand', text: 'Koordination von Verein, Mitgliedern und kommunalpolitischer Arbeit.', icon: 'Users', href: '/vorstand', ctaLabel: 'Vorstand ansehen' },
              { title: 'Fraktion', text: 'Die politische Arbeit im Stadtrat bleibt über Anträge und Themen nachvollziehbar.', icon: 'Landmark', href: '/fraktion', ctaLabel: 'Fraktion ansehen' },
              { title: 'Bezirksausschüsse', text: 'Stadtteilthemen fließen in die kommunale Arbeit ein.', icon: 'Map', href: '/bezirksausschuesse', ctaLabel: 'Bezirke ansehen' },
            ],
          },
        },
      ],
    },
    ...(medien ? [{
      slug: 'medien',
      title: 'Medien',
      seo: {
        metaTitle: 'Medien | Freie Wähler Ingolstadt',
        metaDescription: 'Medien, Downloads und Informationen der Freien Wähler Ingolstadt.',
        ogImage: contentImage(medien.image) || FW_SOCIAL,
      },
      sections: [
        heroSection({
          eyebrow: 'Medien',
          headline: 'Downloads und Informationen.',
          text: 'Filme, Bilder, Zeitungen und weitere Veröffentlichungen der Freien Wähler Ingolstadt.',
          layout: 'fullBleedImage',
          imagePrimary: contentImage(medien.image) || FW_HERO,
          imageFit: 'landscapeContain',
          primaryCta: { label: 'Kontakt', href: '/kontakt' },
          secondaryCta: { label: 'Mitglied werden', href: MEMBER_PDF },
        }, sectionStyle('soft')),
        mediaResourcesSection(medien),
      ],
    } satisfies PageDef] : []),
    {
      slug: 'kontakt',
      title: 'Kontakt',
      seo: {
        metaTitle: 'Kontakt | Freie Wähler Ingolstadt',
        metaDescription: 'Kontakt zu den Freien Wählern Ingolstadt.',
        ogImage: FW_SOCIAL,
      },
      sections: [
        {
          type: 'contact',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          data: {
            badgeText: 'Kontakt',
            headline: 'Kontakt aufnehmen',
            introText: textFromPage(kontakt, 'Fragen, Hinweise oder Anliegen können direkt an die Freien Wähler Ingolstadt gerichtet werden.', 240),
            email: 'info@fw-ingolstadt.de',
            address: 'Ingolstadt',
            formEnabled: true,
            submitLabel: 'Nachricht senden',
            infoCards: [
              { icon: 'Mail', label: 'E-Mail', value: 'info@fw-ingolstadt.de' },
              { icon: 'MapPin', label: 'Ort', value: 'Ingolstadt' },
              { icon: 'FileText', label: 'Mitgliedsantrag', value: 'PDF online verfügbar' },
            ],
          },
        },
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      type: 'legal',
      seo: { metaTitle: 'Impressum | Freie Wähler Ingolstadt', noindex: false },
      sections: [{ type: 'legalContent', container: 'narrow', spacingTop: 'xl', spacingBottom: 'xl', data: { headline: 'Impressum', content: richContentFromPage(impressum, '<p>Impressum der Freien Wähler Ingolstadt.</p>') } }],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutz',
      type: 'legal',
      seo: { metaTitle: 'Datenschutz | Freie Wähler Ingolstadt', noindex: false },
      sections: [{ type: 'legalContent', container: 'narrow', spacingTop: 'xl', spacingBottom: 'xl', data: { headline: 'Datenschutz', content: richContentFromPage(datenschutz, '<p>Datenschutzhinweise der Freien Wähler Ingolstadt.</p>') } }],
    },
    {
      slug: 'transparenzhinweis',
      title: 'Transparenzhinweis',
      type: 'legal',
      seo: { metaTitle: 'Transparenzhinweis | Freie Wähler Ingolstadt', noindex: false },
      sections: [{ type: 'legalContent', container: 'narrow', spacingTop: 'xl', spacingBottom: 'xl', data: { headline: 'Transparenzhinweis', content: richContentFromPage(transparenz, '<p>Transparenzhinweis der Freien Wähler Ingolstadt.</p>') } }],
    },
  ];

  return {
    brand,
    contact,
    socialLinks: {
      facebook: 'https://www.facebook.com/FWIngolstadt',
      website: BASE_URL,
    },
    openingHours: [],
    formFields: [
      { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
    ],
    design,
    navigation: {
      items: [
        { label: 'Aktuelles', href: '/aktuelles' },
        { label: 'Wahlprogramm', href: '/wahlprogramm' },
        { label: 'Menschen', href: '/menschen' },
        { label: 'Stadtrat', href: '/stadtrat' },
        { label: 'Kontakt', href: '/kontakt' },
      ],
      cta: {
        label: 'Mitmachen',
        href: '/mitmachen',
        buttonColor: '#f28c00',
        buttonTextColor: '#061532',
        topBar: { enabled: false },
      },
    },
    footer: {
      columns: [
        { title: 'Inhalte', links: [{ label: 'Aktuelles', href: '/aktuelles' }, { label: 'Wahlprogramm', href: '/wahlprogramm' }, { label: 'Stadtrat & Anträge', href: '/stadtrat' }, { label: 'Veranstaltungen', href: '/veranstaltungen' }, ...(medien ? [{ label: 'Medien', href: '/medien' }] : [])] },
        { title: 'Organisation', links: [{ label: 'Menschen', href: '/menschen' }, { label: 'Vorstand', href: '/vorstand' }, { label: 'Kreisvereinigung', href: '/kreisvereinigung' }, { label: 'Bezirksausschüsse', href: '/bezirksausschuesse' }, { label: 'Kontakt', href: '/kontakt' }] },
      ],
      legalLinks: [
        { label: 'Impressum', href: '/impressum' },
        { label: 'Datenschutz', href: '/datenschutz' },
        { label: 'Transparenzhinweis', href: '/transparenzhinweis' },
      ],
      cta: { label: 'Kontakt', href: '/kontakt' },
    },
    seoGlobal: {
      defaultTitle: 'Freie Wähler Ingolstadt',
      titleTemplate: '%s | Freie Wähler Ingolstadt',
      defaultDescription: 'Freie Wähler Ingolstadt: unabhängig, bürgernah und sachorientiert für Ingolstadt.',
      defaultOgImage: FW_SOCIAL,
      canonicalBase: PREVIEW_URL,
      locale: 'de_DE',
      robots: 'index,follow',
    },
    collections: [news, antraege, menschen, archiv],
    pages,
  };
}

async function getExistingTenant(controlDb: Database) {
  const [tenant] = await controlDb
    .select()
    .from(schema.tenants)
    .where(and(eq(schema.tenants.slug, SLUG), eq(schema.tenants.status, 'active')))
    .limit(1);
  if (!tenant) {
    throw new Error(`Tenant "${SLUG}" fehlt im CRM. Bitte erst standalone provisionieren.`);
  }
  return tenant;
}

async function updateTenantRows(controlDb: Database, dataDb: Database, tenantId: string) {
  const setValues = {
    name: 'Freie Wähler Ingolstadt',
    industry: 'verein' as const,
    activeStyle: 'premium-civic',
    status: 'active' as const,
    deploymentMode: 'standalone' as const,
    vercelProjectId: PROJECT_ID,
    updatedAt: new Date(),
  };
  await controlDb.update(schema.tenants).set(setValues).where(eq(schema.tenants.id, tenantId));
  const [existingDataTenant] = await dataDb.select().from(schema.tenants).where(eq(schema.tenants.id, tenantId)).limit(1);
  if (existingDataTenant) {
    await dataDb.update(schema.tenants).set(setValues).where(eq(schema.tenants.id, tenantId));
  } else {
    await dataDb.insert(schema.tenants).values({
      id: tenantId,
      slug: SLUG,
      isDemo: false,
      isLead: false,
      i18nEnabled: false,
      i18nMaxLanguages: 2,
      i18nDefaultLocale: 'de',
      i18nLocales: 'de',
      i18nSwitcherStyle: 'dropdown',
      i18nSwitcherPosition: 'nav-right',
      ...setValues,
    });
  }
}

async function seedTenant(dataDb: Database, tenantId: string, site: ReturnType<typeof buildSite>) {
  await dataDb.delete(schema.publishedSnapshots).where(eq(schema.publishedSnapshots.tenantId, tenantId));
  await dataDb.delete(schema.seoItem).where(eq(schema.seoItem.tenantId, tenantId));
  await dataDb.delete(schema.seoPage).where(eq(schema.seoPage.tenantId, tenantId));
  await dataDb.delete(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  await dataDb.delete(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  await dataDb.delete(schema.collectionItems).where(eq(schema.collectionItems.tenantId, tenantId));
  await dataDb.delete(schema.collections).where(eq(schema.collections.tenantId, tenantId));
  await dataDb.delete(schema.navigation).where(eq(schema.navigation.tenantId, tenantId));
  await dataDb.delete(schema.footer).where(eq(schema.footer.tenantId, tenantId));
  await dataDb.delete(schema.seoGlobal).where(eq(schema.seoGlobal.tenantId, tenantId));
  await dataDb.delete(schema.globalSettings).where(eq(schema.globalSettings.tenantId, tenantId));

  await dataDb.insert(schema.globalSettings).values({
    tenantId,
    brand: site.brand,
    contact: site.contact,
    socialLinks: site.socialLinks,
    openingHours: site.openingHours,
    design: site.design,
    formFields: site.formFields,
  });
  await dataDb.insert(schema.navigation).values({ tenantId, items: site.navigation.items, cta: site.navigation.cta });
  await dataDb.insert(schema.footer).values({ tenantId, columns: site.footer.columns, legalLinks: site.footer.legalLinks, cta: site.footer.cta });
  await dataDb.insert(schema.seoGlobal).values({ tenantId, ...site.seoGlobal });

  for (const collection of site.collections) {
    const [dbCollection] = await dataDb.insert(schema.collections).values({
      tenantId,
      key: collection.key,
      label: collection.label,
      schema: collection.schema,
      settings: collection.settings,
    }).returning();
    for (const item of collection.items) {
      const [dbItem] = await dataDb.insert(schema.collectionItems).values({
        tenantId,
        collectionId: dbCollection.id,
        slug: item.slug,
        title: item.title,
        data: item.data,
        published: true,
        priority: item.priority,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }).returning();
      if (item.seo) {
        await dataDb.insert(schema.seoItem).values({
          tenantId,
          collectionItemId: dbItem.id,
          metaTitle: item.seo.metaTitle || null,
          metaDescription: item.seo.metaDescription ? cleanText(item.seo.metaDescription, 160) : null,
          ogImage: item.seo.ogImage || null,
          canonical: item.seo.canonical || null,
          noindex: item.seo.noindex || false,
        });
      }
    }
  }

  for (const [pageIndex, page] of site.pages.entries()) {
    const [dbPage] = await dataDb.insert(schema.pages).values({
      tenantId,
      title: page.title,
      slug: page.slug,
      type: page.type || 'free',
      status: 'published',
      visible: true,
      sortOrder: pageIndex,
    }).returning();
    if (page.seo) {
      await dataDb.insert(schema.seoPage).values({
        tenantId,
        pageId: dbPage.id,
        metaTitle: page.seo.metaTitle || null,
        metaDescription: page.seo.metaDescription ? cleanText(page.seo.metaDescription, 160) : null,
        ogImage: page.seo.ogImage || null,
        canonical: page.seo.canonical || null,
        noindex: page.seo.noindex || false,
      });
    }
    for (const [sectionIndex, section] of page.sections.entries()) {
      await dataDb.insert(schema.pageSections).values({
        tenantId,
        pageId: dbPage.id,
        type: section.type,
        ...sectionIdentity(section.type),
        sortOrder: sectionIndex,
        visible: true,
        container: section.container || 'default',
        spacingTop: section.spacingTop || 'l',
        spacingBottom: section.spacingBottom || 'l',
        anchorId: section.anchorId || null,
        styleOverrides: section.styleOverrides || null,
        data: section.data,
      });
    }
  }

  const allPages = await dataDb.select().from(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  const allSections = await dataDb.select().from(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  const allCollections = await dataDb.select().from(schema.collections).where(eq(schema.collections.tenantId, tenantId));
  const allItems = await dataDb.select().from(schema.collectionItems).where(eq(schema.collectionItems.tenantId, tenantId));
  const snapshot = {
    pages: allPages
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        visible: page.visible,
        sections: allSections
          .filter((section) => section.pageId === page.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((section) => ({
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
    collections: allCollections.map((collection) => ({
      id: collection.id,
      key: collection.key,
      label: collection.label,
      schema: collection.schema,
      settings: collection.settings,
      items: allItems
        .filter((item) => item.collectionId === collection.id && item.published)
        .sort((a, b) => a.priority - b.priority)
        .map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          data: item.data,
          priority: item.priority,
          createdAt: item.createdAt?.toISOString?.() || '',
          updatedAt: item.updatedAt?.toISOString?.() || '',
        })),
    })),
    generatedAt: new Date().toISOString(),
  };
  const checksum = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  await dataDb.insert(schema.publishedSnapshots).values({
    tenantId,
    version: 1,
    snapshot,
    checksum,
    isActive: true,
    createdBy: 'seed-freie-waehler-ingolstadt',
  });

  return {
    pages: site.pages.length,
    sections: site.pages.reduce((sum, page) => sum + page.sections.length, 0),
    collections: site.collections.length,
    items: site.collections.reduce((sum, collection) => sum + collection.items.length, 0),
  };
}

async function scrapeLegacy() {
  const [pagesXml, newsXml] = await Promise.all([fetchText(PAGES_SITEMAP_URL), fetchText(NEWS_SITEMAP_URL)]);
  const pageUrls = sitemapUrls(pagesXml).slice(0, MAX_PAGES);
  const newsUrls = sitemapUrls(newsXml).slice(0, MAX_NEWS);
  console.log(JSON.stringify({ step: 'sitemaps', pageUrls: pageUrls.length, newsUrls: newsUrls.length }));

  const pages = (await mapConcurrent(pageUrls, CONCURRENCY, (url) => scrapePage(url, false))).filter(Boolean) as ScrapedPage[];
  const news = (await mapConcurrent(newsUrls, CONCURRENCY, (url) => scrapePage(url, true))).filter(Boolean) as ScrapedPage[];
  return { pages, news };
}

async function resolveDataDb(controlDb: Database, tenantId: string) {
  const explicit = process.env.FREIE_WAEHLER_DATABASE_URL || process.env.TENANT_DATABASE_URL;
  if (explicit) return createDb(requirePostgresUrl('FREIE_WAEHLER_DATABASE_URL', explicit));
  return getTenantDataDb(tenantId);
}

function requirePostgresUrl(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed || !/^postgres(?:ql)?:\/\//i.test(trimmed)) {
    throw new Error(`${name} must be a decrypted Postgres connection URL.`);
  }
  return trimmed;
}

async function main() {
  if (!DRY_RUN) await loadVercelProjectEnv();
  const scraped = await scrapeLegacy();
  const site = buildSite(scraped.pages, scraped.news);

  if (DRY_RUN) {
    console.log(JSON.stringify({
      dryRun: true,
      scrapedPages: scraped.pages.length,
      scrapedNews: scraped.news.length,
      pages: site.pages.length,
      collections: Object.fromEntries(site.collections.map((collection) => [collection.key, collection.items.length])),
      latestNews: site.collections.find((collection) => collection.key === 'news')?.items.slice(0, 5).map((item) => item.title),
    }, null, 2));
    return;
  }

  process.env.DATABASE_URL = requirePostgresUrl('DATABASE_URL', process.env.DATABASE_URL);
  const controlDb = getDb();
  const tenant = await getExistingTenant(controlDb);
  if (!process.env.FREIE_WAEHLER_DATABASE_URL && !process.env.TENANT_DATABASE_URL) {
    const tenantProjectId = (tenant as { vercelProjectId?: string | null }).vercelProjectId || PROJECT_ID;
    await loadTenantVercelProjectEnv(tenantProjectId, { DATABASE_URL: 'FREIE_WAEHLER_DATABASE_URL' });
  }
  const dataDb = await resolveDataDb(controlDb, tenant.id);
  await updateTenantRows(controlDb, dataDb, tenant.id);
  const result = await seedTenant(dataDb, tenant.id, site);
  console.log(JSON.stringify({
    seeded: true,
    tenantId: tenant.id,
    url: PREVIEW_URL,
    scrapedPages: scraped.pages.length,
    scrapedNews: scraped.news.length,
    ...result,
    collections: Object.fromEntries(site.collections.map((collection) => [collection.key, collection.items.length])),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

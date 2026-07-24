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
const PAGES_SITEMAP_URL = `${BASE_URL}/sitemap.xml?sitemap=pages&cHash=e57fb11c444801be70f13b7a37a3ace9`;
const NEWS_SITEMAP_URL = `${BASE_URL}/sitemap.xml?sitemap=newsAktuelles&cHash=b444f208c226e3ecec79898722597d9a`;
const MAX_NEWS = Number(process.env.FW_MAX_NEWS || '2000');
const MAX_PAGES = Number(process.env.FW_MAX_PAGES || '400');
const CONCURRENCY = Number(process.env.FW_IMPORT_CONCURRENCY || '7');

const FW_LOGO = `${BASE_URL}/assets/img/FW-logo-design-noclaim.png`;
const FW_SOCIAL = `${BASE_URL}/assets/img/freie-waehler-social.png`;
const FW_HERO = `${BASE_URL}/fileadmin/Verbaende/ov-ingolstadt/Bilder_2026/26-03-18_Slider_Wahl_Platz_1-5_1567x700pix.jpg`;
const MEMBER_PDF = `${BASE_URL}/fileadmin/Verbaende/ov-ingolstadt/PDF_Dokumente/Mitgliedsantrag_Einzugserm%C3%A4chtigung_SEPA_2025.pdf`;

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
  'proofWall',
  'signatureGrid',
  'spotlightCards',
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
  return !value || value.includes('/assets/img/fw-logo') || value.includes('logo_quadratisch') || value.includes('freiewaehler-logo') || value.includes('freie-waehler-social');
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
  return res.text();
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
  const srcset = firstMatch(source, /srcset="([^"]+)"/i);
  if (srcset) {
    const candidates = srcset
      .split(',')
      .map((part) => part.trim().split(/\s+/)[0])
      .filter(Boolean);
    const last = candidates[candidates.length - 1];
    const url = contentImage(absoluteUrl(last));
    if (url) return url;
  }
  const src = firstMatch(source, /<img[^>]+src="([^"]+)"/i);
  return contentImage(absoluteUrl(src));
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

function extractPeople(pages: ScrapedPage[]): CollectionDef {
  const peoplePages = pages.filter((page) => PERSON_PATH_HINTS.some((hint) => page.slug.includes(hint)) && !page.slug.includes('antraege'));
  const used = new Set<string>();
  const people = peoplePages
    .filter((page) => page.title && page.title.length < 100 && !['Vorstand', 'Fraktion', 'Kreisvereinigung'].includes(page.title))
    .slice(0, 60)
    .map((page, index) => {
      const role = cleanText(page.text.split('\n').find((line) => /vorsitz|stadtrat|bezirks|kreis|mitglied|referent|fraktion/i.test(line)) || '', 110);
      const slug = stableSlug(page.title, used);
      return {
        slug,
        title: page.title,
        priority: index,
        data: {
          name: page.title,
          role: role || 'Freie Wähler Ingolstadt',
          bio: page.excerpt,
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
  const archivePages = contentPages.filter((page) => {
    if (!page.title || !page.excerpt) return false;
    if (CORE_PAGE_PATHS.includes(page.slug)) return false;
    if (page.slug.includes('fraktion/antraege')) return false;
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
          layout: 'campaignBleed',
          imagePrimary: FW_HERO,
          primaryCta: { label: 'Aktuelles lesen', href: '/aktuelles' },
          secondaryCta: { label: 'Mitmachen', href: '/mitmachen' },
          hint: 'Kommunalpolitik aus Ingolstadt – ohne Parteizwang, mit Blick auf konkrete Lösungen.',
        }, sectionStyle('soft')),
        {
          type: 'principlesGrid',
          container: 'full',
          spacingTop: 'none',
          spacingBottom: 'xl',
          styleOverrides: sectionStyle('dark'),
          data: {
            badge: 'Unser Anspruch',
            headline: 'Politik beginnt vor Ort.',
            subline: 'Die Freien Wähler Ingolstadt arbeiten kommunal, unabhängig und lösungsorientiert.',
            principles: [
              { eyebrow: 'Unabhängig', title: 'Keine Parteiideologie', text: 'Entscheidend ist, was Ingolstadt konkret weiterbringt.' },
              { eyebrow: 'Bürgernah', title: 'Nahe an den Themen', text: 'Anliegen aus Stadtteilen, Vereinen und Alltag gehören in den Stadtrat.' },
              { eyebrow: 'Sachorientiert', title: 'Fakten statt Schlagworte', text: 'Anträge und Entscheidungen sollen nachvollziehbar begründet sein.' },
              { eyebrow: 'Ehrenamtlich', title: 'Engagement für die Stadt', text: 'Kommunalpolitik lebt von Menschen, die Verantwortung übernehmen.' },
            ],
            cta: { label: 'Menschen kennenlernen', href: '/menschen' },
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
          type: 'spotlightCards',
          container: 'default',
          spacingTop: 'xl',
          spacingBottom: 'xl',
          data: {
            badge: 'Schwerpunkte',
            headline: 'Die wichtigsten Bereiche',
            subline: 'Programm, aktuelle Meldungen, Stadtratsarbeit und Möglichkeiten zum Mitmachen auf einen Blick.',
            cards: [
              { title: 'Themen & Wahlprogramm', text: 'Die politischen Schwerpunkte für Ingolstadt gebündelt und verständlich.', icon: 'FileText', href: '/wahlprogramm' },
              { title: 'Stadtrat & Anträge', text: 'Anträge, Initiativen und Arbeit der Stadtratsfraktion.', icon: 'Landmark', href: '/stadtrat' },
              { title: 'Menschen', text: 'Vorstand, Fraktion und Ansprechpartnerinnen und Ansprechpartner.', icon: 'Users', href: '/menschen' },
              { title: 'Mitmachen', text: 'Mitglied werden, Termine finden oder direkt Kontakt aufnehmen.', icon: 'Handshake', href: '/mitmachen' },
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
          imagePrimary: latestNews[0]?.image || FW_HERO,
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
          imagePrimary: FW_HERO,
          imageFit: 'contain',
          primaryCta: { label: 'Kandidaten ansehen', href: '/menschen' },
          secondaryCta: { label: 'Mitmachen', href: '/mitmachen' },
        }, sectionStyle('soft')),
        {
          type: 'principlesGrid',
          container: 'full',
          spacingTop: 'l',
          spacingBottom: 'xl',
          styleOverrides: sectionStyle('light'),
          data: {
            badge: 'Programm',
            headline: 'Themen klar geordnet.',
            subline: 'Das Wahlprogramm wird als kuratierte Themenübersicht dargestellt, nicht als alter HTML-Dump.',
            principles: [
              { eyebrow: '01', title: 'Haushalt & Verantwortung', text: 'Solide Finanzen schaffen Spielraum für Familien, Sicherheit, Bildung und Gesundheit.' },
              { eyebrow: '02', title: 'Stadtentwicklung', text: 'Ingolstadt soll sich nachvollziehbar, bezahlbar und lebenswert weiterentwickeln.' },
              { eyebrow: '03', title: 'Mobilität & Alltag', text: 'Entscheidungen müssen im Alltag der Bürgerinnen und Bürger funktionieren.' },
              { eyebrow: '04', title: 'Transparenz', text: 'Kommunalpolitik braucht klare Grundlagen, nachvollziehbare Zahlen und offene Kommunikation.' },
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
              { title: 'Stadtratskandidaten', text: textFromPage(kandidaten, 'Informationen zu den Kandidatinnen und Kandidaten.', 160), icon: 'Users', href: '/menschen' },
              { title: 'Unterstützer', text: textFromPage(unterstuetzer, 'Unterstützerinnen und Unterstützer der Freien Wähler Ingolstadt.', 160), icon: 'Heart', href: '/mitmachen' },
              { title: 'Aktuelle Meldungen', text: 'Beiträge rund um Kommunalpolitik und Wahlkampf.', icon: 'Newspaper', href: '/aktuelles' },
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
          imagePrimary: FW_HERO,
          imageFit: 'contain',
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
              { title: 'Vorstand', text: textFromPage(vorstand, 'Der Vorstand koordiniert die Arbeit der Freien Wähler Ingolstadt.', 180), icon: 'Users' },
              { title: 'Kreisvereinigung', text: textFromPage(kreis, 'Die Kreisvereinigung bündelt das kommunalpolitische Engagement.', 180), icon: 'Building2' },
              { title: 'Kontakt', text: 'Fragen und Anliegen können direkt an die Freien Wähler Ingolstadt gerichtet werden.', icon: 'Mail', href: '/kontakt' },
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
          text: textFromPage(fraktion, 'Informationen aus der Stadtratsfraktion und eine Übersicht der Anträge.', 280),
          imagePrimary: FW_HERO,
          imageFit: 'contain',
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
              { title: 'Stadtratsfraktion', text: textFromPage(fraktion, 'Informationen aus der Stadtratsfraktion und aktuelle Anträge.', 180), icon: 'Landmark' },
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
          imagePrimary: FW_HERO,
          imageFit: 'contain',
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
              { title: 'Mitglied werden', text: textFromPage(mitglied, 'Der Mitgliedsantrag kann als PDF heruntergeladen werden.', 180), icon: 'Handshake', href: MEMBER_PDF },
              { title: 'Veranstaltungen', text: textFromPage(veranstaltungen, 'Termine und Veranstaltungen der Freien Wähler Ingolstadt.', 180), icon: 'Calendar' },
              { title: 'Unterstützen', text: textFromPage(unterstuetzer, 'Unterstützerinnen und Unterstützer können sich direkt melden.', 180), icon: 'Heart', href: '/kontakt' },
            ],
          },
        },
      ],
    },
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
      cta: { label: 'Mitmachen', href: '/mitmachen' },
      topBar: { enabled: true, text: 'Freie Wähler Ingolstadt e.V.', linkLabel: 'Aktuelles', linkHref: '/aktuelles' },
    },
    footer: {
      columns: [
        { title: 'Inhalte', links: [{ label: 'Aktuelles', href: '/aktuelles' }, { label: 'Wahlprogramm', href: '/wahlprogramm' }, { label: 'Stadtrat & Anträge', href: '/stadtrat' }] },
        { title: 'Organisation', links: [{ label: 'Menschen', href: '/menschen' }, { label: 'Mitmachen', href: '/mitmachen' }, { label: 'Kontakt', href: '/kontakt' }] },
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

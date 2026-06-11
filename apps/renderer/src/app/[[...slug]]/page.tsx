import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantSeoGlobal, getTenantSeoPage, getTenantStyle, getTenantI18n } from '@/lib/tenant-data';
import ReactDOM from 'react-dom';

// Default Next.js `deviceSizes` — must mirror what next/image generates so the
// preload entry matches a srcset candidate and the browser reuses it instead
// of fetching a duplicate variant.
const NEXT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/**
 * Inject a `<link rel="preload" as="image">` for the LCP hero image into the
 * HTML head at render time. next/image's `priority` only flags the `<img>`
 * with fetchpriority=high once the JS bundle has executed — by then the
 * resource discovery is already late (we measured ~1300ms LCP load delay).
 *
 * Works universally for any tenant page because every hero template reads
 * `data.bgImage` / `data.bgImageMobile` from the section payload.
 */
function preloadHeroImage(section: { type: string; data: Record<string, unknown> } | undefined): void {
  if (!section || section.type !== 'hero') return;
  const bg = section.data?.bgImage as string | undefined;
  const bgMobile = section.data?.bgImageMobile as string | undefined;
  if (bg) preloadOptimizedImage(bg, bgMobile ? '(min-width: 768px) 100vw' : '100vw');
  if (bgMobile) preloadOptimizedImage(bgMobile, '(max-width: 767px) 100vw');
}

function preloadOptimizedImage(rawUrl: string, sizes: string): void {
  if (!rawUrl || rawUrl.startsWith('data:')) return;
  const srcSet = NEXT_DEVICE_SIZES
    .map(w => `/_next/image?url=${encodeURIComponent(rawUrl)}&w=${w}&q=75 ${w}w`)
    .join(', ');
  const href = `/_next/image?url=${encodeURIComponent(rawUrl)}&w=${NEXT_DEVICE_SIZES[NEXT_DEVICE_SIZES.length - 1]}&q=75`;
  ReactDOM.preload(href, {
    as: 'image',
    fetchPriority: 'high',
    imageSrcSet: srcSet,
    imageSizes: sizes,
  });
}

// ISR: revalidate every 60s, on-demand revalidation via publish webhook
export const revalidate = 60;
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getDesignCssVars } from '@/lib/design-vars';
import { getDb } from '@/lib/db';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { generateCollectionItemMetadata, renderCollectionItemPage } from '@/app/c/[collection]/[slug]/collection-item-page';

// Known locale codes for i18n routing (first slug segment)
const LOCALE_PATTERN = /^[a-z]{2}$/;

/**
 * Detect `<locale>/c/<collection>/<slug>` URLs after tenant-prefix is stripped.
 * Bare `/c/...` is handled by the dedicated route under app/c/[collection]/[slug]
 * (Next routes that more specifically). The locale-prefixed variant falls
 * through to this catch-all instead, so we delegate it back to the same
 * renderer with an explicit locale.
 */
async function tryResolveCollectionItemRoute(slug: string[] | undefined) {
  const requestedSlug = slug || [];
  const tenantId = await resolveTenant(requestedSlug[0]);
  if (!tenantId) return null;

  let pathSegments = requestedSlug;
  let linkPrefix = '';

  // Strip optional shared-renderer tenant slug prefix.
  const db = getDb();
  const [tenant] = await db.select({ slug: tenants.slug }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (tenant?.slug && pathSegments[0] === tenant.slug) {
    linkPrefix = `/${tenant.slug}`;
    pathSegments = pathSegments.slice(1);
  }

  const i18n = await getTenantI18n(tenantId);
  let locale: string | undefined;
  if (i18n.enabled && pathSegments.length > 0 && LOCALE_PATTERN.test(pathSegments[0]) && i18n.locales.includes(pathSegments[0])) {
    locale = pathSegments[0];
    pathSegments = pathSegments.slice(1);
  }

  if (pathSegments.length === 3 && pathSegments[0] === 'c') {
    return {
      collection: pathSegments[1],
      slug: pathSegments[2],
      tenantSlug: tenant?.slug && requestedSlug[0] === tenant.slug ? tenant.slug : undefined,
      linkPrefix,
      locale,
    };
  }
  return null;
}

async function resolvePageData(slug?: string[]) {
  const requestedSlug = slug || [];
  const tenantId = await resolveTenant(requestedSlug[0]);
  if (!tenantId) return null;
  const [snapshot, i18n] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantI18n(tenantId),
  ]);
  if (!snapshot) return null;

  // i18n: detect locale prefix from slug (e.g. /en/about → locale='en', pageSlug='about')
  let locale: string | undefined;
  let pageSlug = requestedSlug;
  let linkPrefix = '';

  // Shared renderer tenant URLs can use /:tenantSlug/... without a custom domain.
  // If the first segment belongs to the resolved tenant, it is routing context,
  // not the CMS page slug.
  if (pageSlug.length > 0) {
    const db = getDb();
    const [tenant] = await db.select({ slug: tenants.slug }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    if (tenant?.slug && pageSlug[0] === tenant.slug) {
      linkPrefix = `/${tenant.slug}`;
      pageSlug = pageSlug.slice(1);
    }
  }
  if (i18n.enabled && pageSlug.length > 0 && LOCALE_PATTERN.test(pageSlug[0])) {
    if (i18n.locales.includes(pageSlug[0])) {
      locale = pageSlug[0];
      pageSlug = pageSlug.slice(1);
    }
  }
  // If no locale detected but i18n is enabled, use default
  if (i18n.enabled && !locale) {
    locale = i18n.defaultLocale;
  }

  const targetSlug = pageSlug.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );
  if (!page || page.visible === false) return null;
  return { tenantId, snapshot, page, locale, i18n: i18n.enabled ? i18n : undefined, linkPrefix };
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  // Collection-item URLs with locale prefix (/en/c/blog/foo) land here because
  // the static c/[collection]/[slug] route only matches the bare /c/... form.
  const collectionRoute = await tryResolveCollectionItemRoute(slug);
  if (collectionRoute) {
    return generateCollectionItemMetadata(
      Promise.resolve({ collection: collectionRoute.collection, slug: collectionRoute.slug }),
      collectionRoute.tenantSlug,
    );
  }
  const result = await resolvePageData(slug);
  if (!result) return {};

  const { tenantId, page, i18n } = result;
  const [seoGlobal, seoPage, { brand }] = await Promise.all([
    getTenantSeoGlobal(tenantId),
    getTenantSeoPage(tenantId, page.id),
    getTenantBrand(tenantId),
  ]);

  const pageTitle = seoPage?.metaTitle || page.title;
  const title = seoGlobal?.titleTemplate
    ? seoGlobal.titleTemplate.replace('%s', pageTitle)
    : pageTitle;
  const description = seoPage?.metaDescription || seoGlobal?.defaultDescription || undefined;
  const ogImage = seoPage?.ogImage || seoGlobal?.defaultOgImage || undefined;
  const canonical = seoPage?.canonical || (seoGlobal?.canonicalBase ? `${seoGlobal.canonicalBase}/${page.slug}` : undefined);

  // Build hreflang `alternates.languages` map when i18n is enabled so search
  // engines understand which URL serves which language and don't penalise us
  // for duplicate content across locale variants.
  let languageAlternates: Record<string, string> | undefined;
  if (i18n?.enabled && i18n.locales.length > 0 && seoGlobal?.canonicalBase) {
    const base = seoGlobal.canonicalBase.replace(/\/$/, '');
    const isHome = page.slug === '' || page.slug === 'home' || page.slug === 'startseite';
    const slugForUrl = isHome ? '' : page.slug;
    languageAlternates = {};
    for (const loc of i18n.locales) {
      const prefix = loc !== i18n.defaultLocale ? `/${loc}` : '';
      languageAlternates[loc] = `${base}${prefix}${slugForUrl ? `/${slugForUrl}` : ''}` || base;
    }
    languageAlternates['x-default'] = `${base}${slugForUrl ? `/${slugForUrl}` : ''}` || base;
  }

  const faviconUrl = brand.faviconUrl || brand.logoUrl;

  return {
    title,
    description,
    ...(faviconUrl && {
      icons: {
        icon: faviconUrl,
        apple: faviconUrl,
      },
    }),
    openGraph: {
      title,
      description,
      type: page.slug === '' || page.slug === 'home' || page.slug === 'startseite' ? 'website' : 'article',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
      locale: seoGlobal?.locale || 'de_DE',
      siteName: brand.companyName || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    ...((canonical || languageAlternates) && {
      alternates: {
        ...(canonical && { canonical }),
        ...(languageAlternates && { languages: languageAlternates }),
      },
    }),
    robots: seoPage?.noindex ? 'noindex,nofollow' : (seoGlobal?.robots || 'index,follow'),
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    return await renderPage(params);
  } catch (err) {
    console.error('[CatchAllPage] Render error:', err instanceof Error ? err.message : err);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Seite konnte nicht geladen werden</h1>
          <p className="text-gray-500">Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.</p>
        </div>
      </div>
    );
  }
}

async function renderPage(params: Promise<{ slug?: string[] }>) {
  const { slug } = await params;
  // Locale-prefixed collection item: /en/c/blog/foo (or /:tenant/en/c/blog/foo).
  const collectionRoute = await tryResolveCollectionItemRoute(slug);
  if (collectionRoute) {
    return renderCollectionItemPage(
      Promise.resolve({ collection: collectionRoute.collection, slug: collectionRoute.slug }),
      collectionRoute.tenantSlug,
      collectionRoute.linkPrefix,
      collectionRoute.locale,
    );
  }
  const result = await resolvePageData(slug);
  if (!result) notFound();

  const { tenantId, snapshot, page, locale, i18n, linkPrefix } = result;
  const [navData, footerData, { brand, contact, openingHours, socialLinks, design }, tenantStyle, seoGlobal] = await Promise.all([
    getTenantNav(tenantId, locale),
    getTenantFooter(tenantId, locale),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
    getTenantSeoGlobal(tenantId),
  ]);

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);

  // Merge custom design overrides from DB into CSS variables
  const designOverrides: Record<string, string> = {};
  if (brand.primaryColor) designOverrides['--style-brand'] = brand.primaryColor;
  if (brand.accentColor) designOverrides['--style-accent'] = brand.accentColor;
  Object.assign(designOverrides, getDesignCssVars(design));
  const visibleSections = page.sections.filter(s => s.visible);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';
  preloadHeroImage(visibleSections[0]);

  // Custom font loading
  const customFonts = [brand.headingFont, brand.bodyFont].filter(Boolean) as string[];
  const googleFontsUrl = customFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${customFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`
    : null;
  const fontCssVars: Record<string, string> = {};
  // Custom uploaded fonts take priority
  const headingFontName = brand.customHeadingFontName || brand.headingFont || '';
  const bodyFontName = brand.customBodyFontName || brand.bodyFont || '';
  if (headingFontName) fontCssVars['--style-heading-font'] = `"${headingFontName}", var(--font-outfit), system-ui, sans-serif`;
  if (bodyFontName) fontCssVars['--custom-body-font'] = `"${bodyFontName}", var(--font-inter), system-ui, sans-serif`;

  // @font-face declarations for custom uploaded fonts
  const fontFaceRules: string[] = [];
  if (brand.customHeadingFontUrl && brand.customHeadingFontName) {
    fontFaceRules.push(`@font-face { font-family: "${brand.customHeadingFontName}"; src: url("${brand.customHeadingFontUrl}"); font-display: swap; }`);
  }
  if (brand.customBodyFontUrl && brand.customBodyFontName) {
    fontFaceRules.push(`@font-face { font-family: "${brand.customBodyFontName}"; src: url("${brand.customBodyFontUrl}"); font-display: swap; }`);
  }

  // JSON-LD structured data
  const isHome = !slug || slug.length === 0;
  const canonicalBase = seoGlobal?.canonicalBase || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'localhost:3000'}`;
  const pageUrl = isHome ? canonicalBase : `${canonicalBase.replace(/\/$/, '')}/${page.slug}`;

  // Parse address into structured components
  const addressParts = contact.address?.split(',').map(s => s.trim()) || [];
  const structuredAddress = contact.address ? {
    '@type': 'PostalAddress' as const,
    streetAddress: addressParts[0] || contact.address,
    ...(addressParts[1] && { addressLocality: addressParts[1] }),
    ...(addressParts[2] && { postalCode: addressParts[2] }),
    addressCountry: 'DE',
  } : undefined;

  // Build breadcrumb list
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Startseite', item: canonicalBase },
    ...(!isHome ? [{ '@type': 'ListItem', position: 2, name: page.title, item: pageUrl }] : []),
  ];

  // Detect FAQ sections for FAQPage schema
  const faqSections = visibleSections.filter(s => s.type === 'faq');
  const faqEntries = faqSections.flatMap(s => {
    const items = (s.data.items as { question: string; answer: string }[] | undefined) || [];
    return items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }));
  });

  const jsonLdList: Record<string, unknown>[] = [];
  const openingHoursSpecification = buildOpeningHoursSpecification(openingHours);
  const specialOpeningHoursSpecification = buildSpecialOpeningHoursSpecification(openingHours);
  const localSeo = isRecord(brand.localSeo) ? brand.localSeo : {};
  const localBusinessType = getLocalBusinessType(typeof localSeo.businessType === 'string' ? localSeo.businessType : undefined);
  const sameAs = [
    ...(typeof localSeo.googleBusinessUrl === 'string' && localSeo.googleBusinessUrl ? [localSeo.googleBusinessUrl] : []),
    ...(Array.isArray(localSeo.sameAs) ? localSeo.sameAs.filter((url): url is string => typeof url === 'string' && url.length > 0) : []),
  ];

  // Main entity
  if (isHome) {
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': localBusinessType,
      '@id': `${canonicalBase}/#business`,
      name: brand.companyName || '',
      url: canonicalBase,
      ...(brand.logoUrl && { logo: brand.logoUrl, image: brand.logoUrl }),
      ...(contact.phone && { telephone: contact.phone }),
      ...(contact.email && { email: contact.email }),
      ...(structuredAddress && { address: structuredAddress }),
      ...(openingHoursSpecification.length > 0 && { openingHoursSpecification }),
      ...(specialOpeningHoursSpecification.length > 0 && { specialOpeningHoursSpecification }),
      ...(typeof localSeo.priceRange === 'string' && localSeo.priceRange && { priceRange: localSeo.priceRange }),
      ...(typeof localSeo.serviceArea === 'string' && localSeo.serviceArea && { areaServed: localSeo.serviceArea }),
      ...(sameAs.length > 0 && { sameAs }),
    });
  } else {
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': pageUrl,
      name: page.title,
      url: pageUrl,
      isPartOf: { '@type': 'WebSite', '@id': `${canonicalBase}/#website`, name: brand.companyName || '', url: canonicalBase },
    });
  }

  // BreadcrumbList (always)
  jsonLdList.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  });

  // FAQPage if FAQ sections exist
  if (faqEntries.length > 0) {
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqEntries,
    });
  }

  const brandCssVars = getBrandCssVars(brand);
  const sectionsNeedingTenantId = new Set(['bookingWidget', 'bookingSlotPicker', 'bookingDateRange', 'availabilityCalendar', 'resourceBookingShowcase', 'bookingCtaPro']);

  // Build dynamic style overrides that need !important to beat Tailwind utilities
  const importantOverrides: string[] = [];
  if (brand.headingColor) importantOverrides.push(`[data-style] main h1, [data-style] main h2, [data-style] main h3, [data-style] main h4, [data-style] main h5, [data-style] main h6 { color: ${brand.headingColor} !important; }`);
  if (brand.bodyTextColor) importantOverrides.push(`[data-style] main p, [data-style] main li { color: ${brand.bodyTextColor} !important; }`);
  if (brand.mutedTextColor) importantOverrides.push(`[data-style] main .text-gray-500, [data-style] main .text-slate-500, [data-style] main .text-gray-600 { color: ${brand.mutedTextColor} !important; }`);
  if (brand.linkColor) importantOverrides.push(`[data-style] main a:not([class*="btn-"]):not([class*="bg-brand"]):not([class*="text-brand"]):not([class*="text-white"]) { color: ${brand.linkColor} !important; }`);

  return (
    <div data-style={tenantStyle.activeStyle} className="overflow-x-clip" style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties}>
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      {fontFaceRules.length > 0 && <style dangerouslySetInnerHTML={{ __html: fontFaceRules.join('\n') }} />}
      {bodyFontName && <style dangerouslySetInnerHTML={{ __html: `[data-style] { font-family: var(--custom-body-font) !important; }` }} />}
      {importantOverrides.length > 0 && <style dangerouslySetInnerHTML={{ __html: importantOverrides.join('\n') }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={firstSectionIsHero} cta={navData.cta} topBar={navData.topBar} i18n={i18n ? { locales: i18n.locales, currentLocale: locale || i18n.defaultLocale, defaultLocale: i18n.defaultLocale } : undefined} linkPrefix={linkPrefix} />
      <main>
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={(section.type.startsWith('shop') || sectionsNeedingTenantId.has(section.type)) ? { ...section, data: { ...section.data, tenantId } } : section} collections={snapshot.collections} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} locale={locale} defaultLocale={i18n?.defaultLocale} linkPrefix={linkPrefix} />
        ))}
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} linkPrefix={linkPrefix} />
      {contact.whatsappEnabled && contact.whatsapp && <WhatsAppFab phone={contact.whatsapp} color={contact.whatsappColor} />}
    </div>
  );
}

type OpeningHoursInput = { day?: string; hours?: string; note?: string; closed?: boolean; type?: string; date?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const LOCAL_BUSINESS_TYPES = new Set([
  'LocalBusiness',
  'Restaurant',
  'MedicalBusiness',
  'Store',
  'LodgingBusiness',
  'HealthAndBeautyBusiness',
  'HomeAndConstructionBusiness',
  'ProfessionalService',
  'Florist',
  'EventVenue',
  'SportsActivityLocation',
]);

function getLocalBusinessType(value?: string) {
  return value && LOCAL_BUSINESS_TYPES.has(value) ? value : 'LocalBusiness';
}

const DAY_MAP: Record<string, string> = {
  mo: 'Monday',
  montag: 'Monday',
  di: 'Tuesday',
  dienstag: 'Tuesday',
  mi: 'Wednesday',
  mittwoch: 'Wednesday',
  do: 'Thursday',
  donnerstag: 'Thursday',
  fr: 'Friday',
  freitag: 'Friday',
  sa: 'Saturday',
  samstag: 'Saturday',
  so: 'Sunday',
  sonntag: 'Sunday',
};

const WEEKDAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function parseDayToken(value: string) {
  const token = value.trim().toLowerCase().replace(/\.$/, '');
  return DAY_MAP[token] || null;
}

function expandDays(day: string | undefined) {
  if (!day) return [];
  const normalized = day.replace(/[–—]/g, '-').trim();
  const range = normalized.split('-').map(part => parseDayToken(part));
  if (range.length === 2 && range[0] && range[1]) {
    const start = WEEKDAY_ORDER.indexOf(range[0]);
    const end = WEEKDAY_ORDER.indexOf(range[1]);
    if (start >= 0 && end >= 0) {
      return start <= end
        ? WEEKDAY_ORDER.slice(start, end + 1)
        : [...WEEKDAY_ORDER.slice(start), ...WEEKDAY_ORDER.slice(0, end + 1)];
    }
  }
  return normalized
    .split(/[,/&]+|\s+und\s+/i)
    .map(parseDayToken)
    .filter(Boolean) as string[];
}

function parseTimeRange(hours: string | undefined) {
  if (!hours) return null;
  const match = hours.match(/(\d{1,2})(?::(\d{2}))?\s*(?:-|–|—|bis)\s*(\d{1,2})(?::(\d{2}))?/i);
  if (!match) return null;
  const opens = `${match[1].padStart(2, '0')}:${match[2] || '00'}`;
  const closes = `${match[3].padStart(2, '0')}:${match[4] || '00'}`;
  return { opens, closes };
}

function buildOpeningHoursSpecification(rows: OpeningHoursInput[] = []) {
  return rows.flatMap(row => {
    if (row.type === 'special' || row.closed) return [];
    const days = expandDays(row.day);
    const range = parseTimeRange(row.hours);
    if (days.length === 0 || !range) return [];
    return [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days,
      opens: range.opens,
      closes: range.closes,
    }];
  });
}

function buildSpecialOpeningHoursSpecification(rows: OpeningHoursInput[] = []) {
  return rows.flatMap(row => {
    if (row.type !== 'special' || !row.date) return [];
    const range = parseTimeRange(row.hours);
    return [{
      '@type': 'OpeningHoursSpecification',
      validFrom: row.date,
      validThrough: row.date,
      ...(row.closed ? { opens: '00:00', closes: '00:00' } : range ? { opens: range.opens, closes: range.closes } : {}),
      ...(row.note ? { description: row.note } : {}),
    }];
  });
}

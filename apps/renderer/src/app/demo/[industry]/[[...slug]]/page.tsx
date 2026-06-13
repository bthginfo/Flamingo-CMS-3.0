import ReactDOM from 'react-dom';
import { notFound } from 'next/navigation';
import { resolveDemoTenant, resolveDemoTenantBySlug, getActiveSnapshot } from '@/lib/snapshot';
import type { SnapshotSection, SnapshotCollection, SnapshotCollectionItem } from '@/lib/snapshot';
import { getTenantStyle, getTenantNav, getTenantFooter, getTenantBrand } from '@/lib/tenant-data';
import { DemoPageShell } from '../../demo-page-shell';
import { getDemoSite } from '../../pages';
import { getDemoSiteData, type IndustryKey } from '../../demo-data';

// Default Next.js `deviceSizes` (next.config has no override). Must stay in
// sync with next/image so the browser picks our preloaded variant instead of
// fetching a different one.
const NEXT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/**
 * Preload the LCP hero image at HTML-parse time so the browser starts the
 * fetch BEFORE React/JS executes. Without this, next/image's `priority` only
 * adds `fetchpriority="high"` to the `<img>` tag — discovered far too late.
 *
 * Works universally across all industry templates because every hero uses the
 * same `data.bgImage` (and optional `data.bgImageMobile`) convention.
 */
function preloadHeroImages(sections: SnapshotSection[]): void {
  const first = sections.find(s => isHeroSection(s.type));
  if (!first) return;
  const bg = (first.data?.bgImage as string | undefined) || undefined;
  const bgMobile = (first.data?.bgImageMobile as string | undefined) || undefined;
  if (bg) preloadOptimizedImage(bg, bgMobile ? '(min-width: 768px) 100vw' : '100vw');
  if (bgMobile) preloadOptimizedImage(bgMobile, '(max-width: 767px) 100vw');
}

function preloadOptimizedImage(rawUrl: string, sizes: string): void {
  if (!rawUrl || rawUrl.startsWith('data:')) return;
  // Match next/image's URL shape exactly so the browser deduplicates.
  const srcSet = NEXT_DEVICE_SIZES
    .map(w => `/_next/image?url=${encodeURIComponent(rawUrl)}&w=${w}&q=75 ${w}w`)
    .join(', ');
  // Use the largest variant as the canonical href fallback.
  const href = `/_next/image?url=${encodeURIComponent(rawUrl)}&w=${NEXT_DEVICE_SIZES[NEXT_DEVICE_SIZES.length - 1]}&q=75`;
  ReactDOM.preload(href, {
    as: 'image',
    fetchPriority: 'high',
    imageSrcSet: srcSet,
    imageSizes: sizes,
  });
}

// Map URL keys to DB industry enum values
const INDUSTRY_MAP: Record<string, string> = {
  handwerk: 'tradesman',
  hotel: 'hotel',
  restaurant: 'restaurant',
  salon: 'salon',
  tourism: 'tourism',
  medical: 'medical',
  wedding: 'wedding',
  photography: 'photography',
  consulting: 'consulting',
  realestate: 'realestate',
  cafe: 'cafe',
  tattoo: 'tattoo',
  showcase: 'tradesman',
  shop: 'ecommerce',
  retail: 'retail',
  florist: 'florist',
  fitness: 'fitness',
  location: 'location',
};

function isHeroSection(type?: string | null): boolean {
  if (!type) return false;
  return type === 'hero' || type.endsWith('Hero') || type.startsWith('hero');
}

/** Recursively prefix internal hrefs in section data with the demo path */
function prefixSectionHrefs(data: Record<string, unknown>, prefix: string): Record<string, unknown> {
  const json = JSON.stringify(data);
  // Match "href":"/" patterns that are internal links (not /demo/, not external)
  const rewritten = json.replace(/"href"\s*:\s*"(\/(?!demo\/)[^"]*?)"/g, (_match, path) => {
    // Skip anchors, tel:, mailto: etc. that somehow start with /
    return `"href":"${prefix}${path}"`;
  });
  return JSON.parse(rewritten);
}

function prefixSections(sections: SnapshotSection[], prefix: string): SnapshotSection[] {
  return sections.map(s => ({
    ...s,
    data: prefixSectionHrefs(s.data, prefix),
  }));
}

function readText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeDemoShopSections(
  sections: SnapshotSection[],
  targetSlug: string,
  contact: Record<string, unknown> | null | undefined,
): SnapshotSection[] {
  const isSubpage = targetSlug !== '' && targetSlug !== 'home' && targetSlug !== 'startseite';
  const ctaRedOverrides: Record<string, string> = {
    '--token-section-bg': '#4A1625',
    '--token-section-bg-alt': '#6B2436',
    '--token-card-bg': '#5B1D2E',
    '--token-card-border': '#8A4354',
    '--token-heading': '#FFFFFF',
    '--token-body': 'rgba(255,255,255,0.88)',
    '--token-muted': 'rgba(255,255,255,0.68)',
    '--token-btn-bg': '#4A1625',
    '--token-btn-text': '#FFFFFF',
  };

  return sections.map((section) => {
    let nextData = section.data;
    let nextStyleOverrides = section.styleOverrides;

    if (section.type === 'socialProofBar') {
      const items = (section.data.items as Array<Record<string, unknown>> | undefined) ?? [];
      if (items.length > 0 && items.some(item => !readText(item.value) && readText(item.text))) {
        nextData = {
          ...nextData,
          items: items.map((item) => {
            const value = readText(item.value) || readText(item.text);
            const label = readText(item.label);
            return {
              ...item,
              value,
              label,
            };
          }),
        };
      }
    }

    if (section.type === 'portfolio') {
      const projects = Array.isArray(section.data.projects) ? (section.data.projects as Array<Record<string, unknown>>) : [];
      const items = Array.isArray(section.data.items) ? (section.data.items as Array<Record<string, unknown>>) : [];
      if (projects.length === 0 && items.length > 0) {
        nextData = {
          ...nextData,
          projects: items.map((item) => {
            const meta = Array.isArray(item.meta) ? (item.meta as Array<Record<string, unknown>>) : [];
            return {
              title: readText(item.title),
              category: readText(item.category),
              description: readText(item.description) || readText(item.text),
              image: readText(item.image),
              href: readText(item.href),
              icon: readText(item.icon),
              stats: meta
                .map((entry) => ({
                  label: readText(entry.label),
                  value: readText(entry.value),
                }))
                .filter((entry) => entry.label || entry.value),
            };
          }).filter((project) => project.title),
        };
      }
    }

    if (section.type === 'featureShowcase') {
      const hasImage = readText(section.data.image)
        || readText(section.data.imageUrl)
        || readText(section.data.imageSrc)
        || readText(section.data.backgroundImage)
        || readText(section.data.bgImage)
        || readText(section.data.media);
      if (!hasImage) {
        nextData = {
          ...nextData,
          image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=82',
        };
      }
    }

    if (section.type === 'contact') {
      const infoCards = Array.isArray(section.data.infoCards) ? (section.data.infoCards as Array<Record<string, unknown>>) : [];
      const hasContent = infoCards.some((card) => readText(card.value));
      if (!hasContent) {
        const fallbackCards = [
          { icon: 'phone', label: 'Telefon', value: readText(contact?.phone) },
          { icon: 'mail', label: 'E-Mail', value: readText(contact?.email) },
          { icon: 'map-pin', label: 'Standort', value: readText(contact?.address) },
        ].filter((card) => card.value);

        if (fallbackCards.length > 0) {
          nextData = {
            ...nextData,
            infoCards: fallbackCards,
          };
        }
      }
    }

    if (isSubpage && section.type === 'ctaBand') {
      nextStyleOverrides = {
        ...((section.styleOverrides as Record<string, unknown> | null) || {}),
        ...ctaRedOverrides,
      };
    }

    if (nextData === section.data && nextStyleOverrides === section.styleOverrides) {
      return section;
    }
    return {
      ...section,
      data: nextData,
      styleOverrides: nextStyleOverrides,
    };
  });
}

function getImageUrl(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = getImageUrl(item);
      if (url) return url;
    }
    return undefined;
  }
  if (!value || typeof value !== 'object') return undefined;

  const record = value as Record<string, unknown>;
  for (const key of ['url', 'src', 'href', 'image', 'imageUrl', 'publicUrl']) {
    const url = getImageUrl(record[key]);
    if (url) return url;
  }
  return undefined;
}

const COLLECTION_IMAGE_KEYS = [
  'image',
  'coverImage',
  'heroImage',
  'backgroundImage',
  'bgImage',
  'thumbnail',
  'thumbnailUrl',
  'poster',
  'posterImage',
  'ogImage',
  'images',
  'gallery',
  'media',
];

/** Extract best image from a collection item */
function extractItemImage(item: SnapshotCollectionItem): string | undefined {
  for (const key of COLLECTION_IMAGE_KEYS) {
    const url = getImageUrl(item.data[key]);
    if (url) return url;
  }

  const sections = item.data.sections as Array<{ type: string; data: Record<string, unknown> }> | undefined;
  if (sections) {
    const hero = sections.find(s => (
      s.type === 'hero' ||
      s.type === 'collectionHero' ||
      s.type === 'cinematicHero' ||
      s.type === 'glowHero' ||
      s.type === 'floristHero' ||
      s.type === 'fitnessHero' ||
      s.type === 'locationHero'
    ));
    if (hero?.data) {
      for (const key of COLLECTION_IMAGE_KEYS) {
        const url = getImageUrl(hero.data[key]);
        if (url) return url;
      }
    }
  }
  return undefined;
}

/** Inject collection items into collectionList/newsPreview/newsGrid sections server-side */
function injectCollections(sections: SnapshotSection[], collections: SnapshotCollection[] | undefined, linkPrefix: string): SnapshotSection[] {
  if (!collections) return sections;
  return sections.map(section => {
    if (section.type === 'newsPreview' || section.type === 'newsGrid') {
      const key = (section.data.collectionKey as string) || 'news';
      const col = collections.find(c => c.key === key);
      if (col) {
        return { ...section, data: { ...section.data, items: col.items.slice(0, 3).map(item => ({ title: item.title, slug: item.slug, image: extractItemImage(item), excerpt: (item.data.excerpt as string) || undefined, date: item.createdAt })) } };
      }
    }
    if (section.type === 'collectionList') {
      const key = (section.data.collectionKey as string) || '';
      const col = collections.find(c => c.key === key);
      if (col) {
        return { ...section, data: { ...section.data, items: col.items.map(item => ({ title: item.title, slug: item.slug, image: extractItemImage(item), excerpt: (item.data.excerpt as string) || undefined, date: item.createdAt, priority: item.priority })), collectionBasePath: `${linkPrefix}/c/${key}` } };
      }
    }
    return section;
  });
}

export default async function DemoPage({ params }: { params: Promise<{ industry: string; slug?: string[] }> }) {
  const { industry, slug } = await params;

  const dbIndustry = INDUSTRY_MAP[industry];
  if (!dbIndustry) return notFound();

  // Resolve demo tenant from DB
  const SLUG_MAP: Record<string, string> = { showcase: 'demo-showcase', shop: 'demo-shop' };
  let tenantId: string | null = null;
  try {
    tenantId = SLUG_MAP[industry]
      ? await resolveDemoTenantBySlug(SLUG_MAP[industry])
      : await resolveDemoTenant(dbIndustry, industry);
  } catch {
    // DB enum may not include this industry yet — fall through to static
  }

  // Fallback to static demo pages if no DB tenant exists
  if (!tenantId) {
    const staticSite = getDemoSite(industry);
    if (!staticSite) return notFound();
    const targetSlug = slug?.join('/') || '';
    const page = staticSite.pages.find(p =>
      p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
    );
    if (!page) return notFound();
    const siteData = getDemoSiteData(industry as IndustryKey);
    const demoPrefix = `/demo/${industry}`;
    const visibleSections = page.sections.filter(s => s.visible) as SnapshotSection[];
    const normalizedSections = industry === 'shop'
      ? normalizeDemoShopSections(visibleSections, targetSlug, siteData.contact as Record<string, unknown> | undefined)
      : visibleSections;
    const staticSections = prefixSections(normalizedSections, demoPrefix);
    preloadHeroImages(staticSections);
    return (
      <DemoPageShell
        sections={staticSections}
        industry={staticSite.industry}
        industryKey={industry}
        defaultStyle={staticSite.defaultStyle}
        siteData={{
          navItems: siteData.navItems,
          cta: siteData.cta,
          brand: siteData.brand,
          contact: siteData.contact,
          socialLinks: siteData.socialLinks,
          footer: siteData.footer,
        }}
        darkBg={isHeroSection(page.sections[0]?.type)}
      />
    );
  }

  const [snapshot, tenantStyle, navData, footerData, brandData] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantStyle(tenantId),
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
  ]);

  if (!snapshot || !tenantStyle || !navData || !brandData) return notFound();

  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );

  const demoPrefix = `/demo/${industry}`;

  // If no page found but industry is shop and slug is checkout, render checkout with demo flag
  if (!page && industry === 'shop' && targetSlug === 'checkout') {
    return (
      <DemoPageShell
        sections={[{ id: 'checkout', type: 'shopCheckout', variant: null, visible: true, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null, data: { tenantId, basePath: demoPrefix } }]}
        industry={tenantStyle.industry}
        industryKey={industry}
        defaultStyle={tenantStyle.activeStyle}
        siteData={{
          navItems: navData.items.map(item => ({ ...item, href: item.href.startsWith('/demo/') ? item.href : `${demoPrefix}${item.href}` })),
          cta: navData.cta ? { ...navData.cta, href: navData.cta.href.startsWith('/demo/') ? navData.cta.href : `${demoPrefix}${navData.cta.href}` } : { label: '', href: '' },
          brand: brandData.brand,
          contact: brandData.contact,
          socialLinks: brandData.socialLinks,
          footer: footerData ? {
            columns: (footerData.columns || []).map(col => ({
              ...col,
              items: (col.items || []).map(item => ({ ...item, href: item.href && !item.href.startsWith('/demo/') ? `${demoPrefix}${item.href}` : item.href })),
            })),
            legalLinks: (footerData.legalLinks || []).map(l => ({ ...l, href: l.href?.startsWith('/demo/') ? l.href : `${demoPrefix}${l.href}` })),
          } : { columns: [], legalLinks: [] },
        }}
        darkBg={false}
      />
    );
  }

  // If no page found but industry is shop, treat last slug segment as product slug
  if (!page && industry === 'shop' && targetSlug) {
    const productSlug = targetSlug.includes('/') ? targetSlug.split('/').pop()! : targetSlug;
    return (
      <DemoPageShell
        sections={[{ id: 'product-detail', type: 'shopProductDetail', variant: null, visible: true, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null, data: { _slug: productSlug, tenantId, basePath: demoPrefix } }]}
        industry={tenantStyle.industry}
        industryKey={industry}
        defaultStyle={tenantStyle.activeStyle}
        siteData={{
          navItems: navData.items.map(item => ({ ...item, href: item.href.startsWith('/demo/') ? item.href : `${demoPrefix}${item.href}` })),
          cta: navData.cta ? { ...navData.cta, href: navData.cta.href.startsWith('/demo/') ? navData.cta.href : `${demoPrefix}${navData.cta.href}` } : { label: '', href: '' },
          brand: brandData.brand,
          contact: brandData.contact,
          socialLinks: brandData.socialLinks,
          footer: footerData ? {
            columns: (footerData.columns || []).map(col => ({
              ...col,
              items: (col.items || []).map(item => ({ ...item, href: item.href && !item.href.startsWith('/demo/') ? `${demoPrefix}${item.href}` : item.href })),
            })),
            legalLinks: (footerData.legalLinks || []).map(l => ({ ...l, href: l.href?.startsWith('/demo/') ? l.href : `${demoPrefix}${l.href}` })),
          } : { columns: [], legalLinks: [] },
        }}
        darkBg={false}
      />
    );
  }

  if (!page) return notFound();

  const firstIsHero = isHeroSection(page.sections[0]?.type);
  const sectionsNeedingTenantId = new Set(['bookingWidget', 'bookingSlotPicker', 'bookingDateRange', 'availabilityCalendar', 'resourceBookingShowcase', 'bookingCtaPro']);
  const visibleSections = page.sections.filter(s => s.visible).map(s => (s.type.startsWith('shop') || sectionsNeedingTenantId.has(s.type)) ? { ...s, data: { ...s.data, tenantId, ...(s.type.startsWith('shop') ? { basePath: demoPrefix, ...(s.type === 'shopCategoryOverview' ? { shopGridPath: `${demoPrefix}/shop` } : {}) } : {}) } } : s);
  const normalizedSections = industry === 'shop'
    ? normalizeDemoShopSections(visibleSections, targetSlug, brandData.contact)
    : visibleSections;
  const finalSections = injectCollections(prefixSections(normalizedSections, demoPrefix), snapshot.collections, demoPrefix);
  preloadHeroImages(finalSections);

  return (
    <DemoPageShell
      sections={finalSections}
      industry={tenantStyle.industry}
      industryKey={industry}
      defaultStyle={tenantStyle.activeStyle}
      siteData={{
        navItems: navData.items.map(item => ({ ...item, href: item.href.startsWith('/demo/') ? item.href : `${demoPrefix}${item.href}` })),
        cta: navData.cta ? { ...navData.cta, href: navData.cta.href.startsWith('/demo/') ? navData.cta.href : `${demoPrefix}${navData.cta.href}` } : { label: '', href: '' },
        brand: brandData.brand,
        contact: brandData.contact,
        socialLinks: brandData.socialLinks,
        footer: footerData ? {
          columns: (footerData.columns || []).map(col => ({
            ...col,
            items: (col.items || []).map(item => ({ ...item, href: item.href && !item.href.startsWith('/demo/') ? `${demoPrefix}${item.href}` : item.href })),
          })),
          legalLinks: (footerData.legalLinks || []).map(l => ({ ...l, href: l.href?.startsWith('/demo/') ? l.href : `${demoPrefix}${l.href}` })),
        } : { columns: [], legalLinks: [] },
      }}
      darkBg={firstIsHero}
    />
  );
}

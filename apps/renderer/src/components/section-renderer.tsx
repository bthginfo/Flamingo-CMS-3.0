import type { SnapshotSection, SnapshotCollection, SnapshotCollectionItem } from '@/lib/snapshot';
import { getIndustryTemplates } from '@/templates';
import { SectionErrorBoundary } from './section-error-boundary';

/** Extract the best image from a collection item — checks data.image first, then looks into hero section data */
function extractItemImage(item: SnapshotCollectionItem): string | undefined {
  if (item.data.image) return item.data.image as string;
  // Items store sections in data.sections — find the hero and grab its background image
  const sections = item.data.sections as Array<{ type: string; data: Record<string, unknown> }> | undefined;
  if (sections) {
    const hero = sections.find(s => s.type === 'hero' || s.type === 'collectionHero');
    if (hero?.data) {
      return (hero.data.backgroundImage as string) || (hero.data.image as string) || undefined;
    }
  }
  return undefined;
}

const SPACING: Record<string, string> = {
  none: 'py-0',
  s: 'py-6',
  m: 'py-12',
  l: 'py-20',
  xl: 'py-28',
};

const CONTAINER: Record<string, string> = {
  default: 'max-w-7xl mx-auto px-6',
  wide: 'max-w-[1400px] mx-auto px-6',
  narrow: 'max-w-3xl mx-auto px-6',
  full: 'w-full px-6',
};

export function SectionRenderer({ section, collections, styleVariant, industry = 'tradesman', locale }: { section: SnapshotSection; collections?: SnapshotCollection[]; styleVariant?: string; industry?: string; locale?: string }) {
  // i18n locale resolution: if section.data contains locale keys, resolve to the active locale
  if (locale && section.data && typeof section.data[locale] === 'object' && section.data[locale] !== null) {
    section = { ...section, data: section.data[locale] as Record<string, unknown> };
  } else if (locale && section.data && section.data._localized) {
    // Fallback: if _localized flag exists but requested locale missing, try 'de'
    const fallback = (section.data['de'] as Record<string, unknown>) ?? section.data;
    section = { ...section, data: fallback };
  }

  const Component = getIndustryTemplates(industry)[section.type];

  // Inject collection items into newsPreview/newsGrid sections
  if ((section.type === 'newsPreview' || section.type === 'newsGrid') && collections) {
    const key = (section.data.collectionKey as string) || 'news';
    const col = collections.find(c => c.key === key);
    if (col) {
      section = {
        ...section,
        data: {
          ...section.data,
          items: col.items.slice(0, 3).map(item => ({
            title: item.title,
            slug: item.slug,
            image: extractItemImage(item),
            excerpt: (item.data.excerpt as string) || undefined,
            date: item.createdAt,
          })),
        },
      };
    }
  }

  // Inject collection items into collectionList sections
  if (section.type === 'collectionList' && collections) {
    const key = (section.data.collectionKey as string) || '';
    const col = collections.find(c => c.key === key);
    if (col) {
      section = {
        ...section,
        data: {
          ...section.data,
          items: col.items.map(item => ({
            title: item.title,
            slug: item.slug,
            image: extractItemImage(item),
            excerpt: (item.data.excerpt as string) || undefined,
            date: item.createdAt,
            priority: item.priority,
          })),
          collectionBasePath: `/c/${key}`,
        },
      };
    }
  }
  if (!Component) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm">
        Unbekannter Sektionstyp: {section.type}
      </div>
    );
  }

  // Full-bleed sections render their own background/padding — skip wrapper spacing/container
  const FULL_BLEED_TYPES = new Set([
    'hero', 'collectionHero', 'noticeBanner', 'atmosphereGallery',
    // Tattoo
    'styleGallery', 'artistGrid', 'artistHero', 'tattooBookingCta',
    'aftercareSteps', 'pricingInfo', 'tattooBooking', 'flashDayBanner',
    // Photography
    'photographerAbout', 'shootingProcess',
    // Real estate
    'marketReport', 'valuationCta',
    // Wedding
    'eventSchedule', 'faqGallery', 'giftRegistry', 'rsvp', 'venueInfo',
    // Cafe
    'dailySpecials',
    // USP strip (uses negative margin for hero overlap)
    'uspStrip',
    // Generic
    'servicePackages',
    // Premium shared
    'beforeAfterSlider', 'horizontalScrollShowcase', 'verticalTimeline', 'cinematicHero',
  ]);

  // Full-bleed sections that have LIGHT backgrounds (don't apply data-theme="dark")
  const FULL_BLEED_LIGHT = new Set(['dailySpecials', 'servicePackages', 'uspStrip', 'beforeAfterSlider', 'verticalTimeline']);

  const isFullBleed = FULL_BLEED_TYPES.has(section.type);

  // Per-section color overrides (from CMS) applied as inline CSS vars
  const overrideStyle = section.styleOverrides
    ? Object.fromEntries(Object.entries(section.styleOverrides).filter(([, v]) => v)) as React.CSSProperties
    : undefined;

  if (isFullBleed) {
    const isDark = !FULL_BLEED_LIGHT.has(section.type);
    return (
      <section id={section.anchorId ?? undefined} data-section-id={section.id} {...(isDark ? { 'data-theme': 'dark' } : {})} style={overrideStyle}>
        <SectionErrorBoundary sectionType={section.type}>
          <Component data={section.data} variant={section.variant} styleVariant={styleVariant} />
        </SectionErrorBoundary>
      </section>
    );
  }

  const spacingClass = SPACING[section.spacingTop] ?? SPACING.m;
  const spacingBottomClass = SPACING[section.spacingBottom] ?? SPACING.m;
  const containerClass = CONTAINER[section.container] ?? CONTAINER.default;

  return (
    <section id={section.anchorId ?? undefined} data-section-id={section.id} className={`${spacingClass} ${spacingBottomClass}`} style={overrideStyle}>
      <div className={containerClass}>
        <SectionErrorBoundary sectionType={section.type}>
          <Component data={section.data} variant={section.variant} styleVariant={styleVariant} />
        </SectionErrorBoundary>
      </div>
    </section>
  );
}

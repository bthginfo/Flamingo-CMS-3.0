import type { SnapshotSection, SnapshotCollection } from '@/lib/snapshot';
import { getIndustryTemplates } from '@/templates';
import { SectionErrorBoundary } from './section-error-boundary';

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

export function SectionRenderer({ section, collections, styleVariant, industry = 'tradesman' }: { section: SnapshotSection; collections?: SnapshotCollection[]; styleVariant?: string; industry?: string }) {
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
            image: (item.data.image as string) || undefined,
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
            image: (item.data.image as string) || undefined,
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
    // Generic
    'servicePackages',
  ]);

  // Full-bleed sections that have LIGHT backgrounds (don't apply data-theme="dark")
  const FULL_BLEED_LIGHT = new Set(['dailySpecials', 'servicePackages']);

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

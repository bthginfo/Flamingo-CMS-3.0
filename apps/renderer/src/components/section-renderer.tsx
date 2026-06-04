import type { SnapshotSection, SnapshotCollection, SnapshotCollectionItem } from '@/lib/snapshot';
import { getIndustryTemplates } from '@/templates';
import { SectionErrorBoundary } from './section-error-boundary';
import { prefixInternalLinks } from '@/lib/link-prefix';
import { sanitizeHtml } from '@/lib/sanitize-html';

/** Extract the best image from a collection item — checks data.image first, then looks into hero section data */
function extractItemImage(item: SnapshotCollectionItem): string | undefined {
  if (item.data.image) return item.data.image as string;
  // Items store sections in data.sections — find the hero and grab its background image
  const sections = item.data.sections as Array<{ type: string; data: Record<string, unknown> }> | undefined;
  if (sections) {
    const hero = sections.find(s => s.type === 'hero' || s.type === 'collectionHero');
    if (hero?.data) {
      return (hero.data.backgroundImage as string) || (hero.data.bgImage as string) || (hero.data.image as string) || undefined;
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

const BOOKING_SECTION_TYPES = new Set(['bookingWidget', 'bookingSlotPicker', 'bookingDateRange', 'availabilityCalendar', 'resourceBookingShowcase', 'bookingCtaPro']);
const MEDIA_OVERLAY_SECTION_TYPES = new Set([
  'hero',
  'collectionHero',
  'cinematicHero',
  'glowHero',
  'floristHero',
  'fitnessHero',
  'locationHero',
  'immersiveCtaBanner',
]);

function withBookingStyleAliases(sectionType: string, style?: React.CSSProperties): React.CSSProperties | undefined {
  if (!style || !BOOKING_SECTION_TYPES.has(sectionType)) return style;
  const source = style as Record<string, string>;
  return {
    ...style,
    ...(source['--style-section-bg'] ? { '--booking-section-bg': source['--style-section-bg'] } : {}),
    ...(source['--style-card-bg'] ? { '--booking-card-bg': source['--style-card-bg'] } : {}),
    ...(source['--style-heading-color'] ? { '--booking-heading-color': source['--style-heading-color'] } : {}),
    ...(source['--style-body-color'] ? { '--booking-body-color': source['--style-body-color'] } : {}),
    ...(source['--style-text-muted'] ? { '--booking-muted-color': source['--style-text-muted'] } : {}),
    ...(source['--style-text-primary'] ? { '--booking-text-primary': source['--style-text-primary'] } : {}),
    ...(source['--style-text-secondary'] ? { '--booking-text-secondary': source['--style-text-secondary'] } : {}),
    ...(source['--style-badge-bg'] ? { '--booking-badge-bg': source['--style-badge-bg'] } : {}),
    ...(source['--style-badge-text'] ? { '--booking-badge-text': source['--style-badge-text'] } : {}),
    ...(source['--style-border-color'] ? { '--booking-border-color': source['--style-border-color'] } : {}),
    ...(source['--style-accent-color'] ? { '--booking-accent-color': source['--style-accent-color'] } : {}),
  } as React.CSSProperties;
}

const SECTION_STYLE_TOKEN_ALIASES: Record<string, string[]> = {
  '--style-section-bg': ['--token-section-bg', '--style-section-bg-alt', '--token-section-bg-alt'],
  '--style-section-bg-alt': ['--token-section-bg-alt', '--style-section-bg', '--token-section-bg'],
  '--style-card-bg': ['--token-card-bg'],
  '--style-border-color': ['--token-card-border', '--token-divider', '--style-border'],
  '--style-border': ['--token-card-border', '--style-border-color'],
  '--style-card-border-color': ['--token-card-border'],
  '--style-divider-color': ['--token-divider'],
  '--style-heading-color': ['--style-heading', '--token-heading'],
  '--style-heading': ['--style-heading-color', '--token-heading'],
  '--style-subheading-color': ['--token-subheading'],
  '--style-body-color': ['--style-body', '--token-body'],
  '--style-body': ['--style-body-color', '--token-body'],
  '--style-text-primary': ['--token-heading'],
  '--style-text-secondary': ['--token-body'],
  '--style-text-muted': ['--style-muted', '--token-muted'],
  '--style-muted': ['--style-text-muted', '--token-muted'],
  '--style-icon-color': ['--token-icon'],
  '--style-accent-color': ['--style-accent', '--token-eyebrow', '--token-stat-value', '--token-quote', '--token-rating-star', '--token-check'],
  '--style-accent': ['--style-accent-color', '--token-eyebrow', '--token-stat-value', '--token-quote', '--token-rating-star', '--token-check'],
  '--style-badge-bg': ['--token-badge-bg'],
  '--style-badge-text': ['--token-badge-text'],
  '--style-badge-border': ['--token-badge-border'],
  '--brand-btn-bg': ['--token-btn-bg'],
  '--brand-btn-text': ['--token-btn-text'],
  '--style-button-bg': ['--token-btn-bg', '--brand-btn-bg'],
  '--style-button-text': ['--token-btn-text', '--brand-btn-text'],
  '--style-image-text-color': ['--token-on-dark-heading', '--token-on-dark-body', '--token-on-dark-muted'],
  '--style-image-overlay': ['--style-overlay-color'],
  '--token-section-bg': ['--style-section-bg', '--style-section-bg-alt', '--token-section-bg-alt'],
  '--token-section-bg-alt': ['--style-section-bg-alt', '--style-section-bg', '--token-section-bg'],
  '--token-card-bg': ['--style-card-bg'],
  '--token-card-border': ['--style-border-color', '--style-card-border-color', '--style-border'],
  '--token-divider': ['--style-divider-color'],
  '--token-heading': ['--style-heading-color', '--style-text-primary', '--style-heading'],
  '--token-subheading': ['--style-subheading-color'],
  '--token-body': ['--style-body-color', '--style-text-secondary', '--style-body'],
  '--token-muted': ['--style-text-muted', '--style-muted'],
  '--token-icon': ['--style-icon-color'],
  '--token-eyebrow': ['--style-accent-color', '--style-accent'],
  '--token-btn-bg': ['--brand-btn-bg', '--style-button-bg'],
  '--token-btn-text': ['--brand-btn-text', '--style-button-text'],
  '--token-badge-bg': ['--style-badge-bg'],
  '--token-badge-text': ['--style-badge-text'],
  '--token-badge-border': ['--style-badge-border'],
  '--token-on-dark-heading': ['--style-image-text-color'],
  '--token-on-dark-body': ['--style-image-body-color'],
  '--token-on-dark-muted': ['--style-image-muted-color'],
};

function normalizeSectionStyle(style?: React.CSSProperties): React.CSSProperties | undefined {
  if (!style) return undefined;
  const normalized: Record<string, unknown> = { ...style };
  const source = style as Record<string, unknown>;

  for (const [sourceVar, targetVars] of Object.entries(SECTION_STYLE_TOKEN_ALIASES)) {
    const value = source[sourceVar];
    if (typeof value !== 'string' || !value.trim()) continue;
    for (const targetVar of targetVars) {
      if (typeof normalized[targetVar] !== 'string' || !(normalized[targetVar] as string).trim()) {
        normalized[targetVar] = value;
      }
    }
  }

  return normalized as React.CSSProperties;
}

function sanitizeRenderValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return /<[a-z][\s\S]*>/i.test(value) ? sanitizeHtml(value) : value;
  }
  if (Array.isArray(value)) return value.map(sanitizeRenderValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitizeRenderValue(child)]));
  }
  return value;
}

export function SectionRenderer({ section, collections, styleVariant, industry = 'tradesman', locale, linkPrefix = '' }: { section: SnapshotSection; collections?: SnapshotCollection[]; styleVariant?: string; industry?: string; locale?: string; linkPrefix?: string }) {
  // i18n locale resolution: if section.data contains locale keys, resolve to the active locale
  if (locale && section.data && typeof section.data[locale] === 'object' && section.data[locale] !== null) {
    section = { ...section, data: section.data[locale] as Record<string, unknown> };
  } else if (locale && section.data && section.data._localized) {
    // Fallback: if _localized flag exists but requested locale missing, try 'de'
    const fallback = (section.data['de'] as Record<string, unknown>) ?? section.data;
    section = { ...section, data: fallback };
  }

  const Component = getIndustryTemplates(industry)[section.type];
  section = { ...section, data: sanitizeRenderValue(prefixInternalLinks(section.data, linkPrefix)) as Record<string, unknown> };

  // Inject collection items into newsPreview/newsGrid sections
  if (section.type === 'newsPreview' || section.type === 'newsGrid') {
    const key = (section.data.collectionKey as string) || 'news';
    const col = collections?.find(c => c.key === key);
    const collectionBasePath = prefixInternalLinks(`/c/${key}`, linkPrefix);
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
          collectionBasePath,
          linkPrefix,
        },
      };
    } else {
      section = { ...section, data: { ...section.data, collectionBasePath, linkPrefix } };
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
          collectionBasePath: prefixInternalLinks(`/c/${key}`, linkPrefix),
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
    'immersiveCtaBanner', 'editorialFeatureRail', 'offerCampaignStrip',
    'glowHero', 'floristHero', 'fitnessHero', 'locationHero', 'popup',
  ]);

  const isFullBleed = FULL_BLEED_TYPES.has(section.type);
  const hasMediaOverlay = MEDIA_OVERLAY_SECTION_TYPES.has(section.type) || Boolean(section.data.overlay);
  const headingColorVar = hasMediaOverlay
    ? 'var(--token-on-dark-heading, var(--token-heading, var(--style-heading-color, var(--style-text-primary, inherit))))'
    : 'var(--token-heading, var(--style-heading-color, var(--style-text-primary, inherit)))';
  const bodyColorVar = hasMediaOverlay
    ? 'var(--token-on-dark-body, var(--token-body, var(--style-body-color, var(--style-text-secondary, inherit))))'
    : 'var(--token-body, var(--style-body-color, var(--style-text-secondary, inherit)))';

  // Per-section color overrides (from CMS) applied as inline CSS vars
  const overrideStyle = section.styleOverrides
    ? Object.fromEntries(Object.entries(section.styleOverrides).filter(([, v]) => v)) as React.CSSProperties
    : undefined;
  const sectionStyle = withBookingStyleAliases(section.type, normalizeSectionStyle(overrideStyle));
  const sectionOverrideCss = sectionStyle
    ? `
[data-section-id="${section.id}"][data-style] :is(h1,h2,h3,h4,h5,h6):not([class*="text-white"]):not([class*="text-black"]) { color: ${headingColorVar} !important; }
[data-section-id="${section.id}"][data-style] :is(p,li):not([class*="text-white"]):not([class*="text-black"]) { color: ${bodyColorVar} !important; }
[data-section-id="${section.id}"][data-style] .section-badge { color: var(--style-badge-text, var(--style-accent-color, inherit)) !important; background-color: var(--style-badge-bg, transparent) !important; }
[data-section-id="${section.id}"][data-style] [class*="brand-btn"] { color: var(--brand-btn-text, inherit) !important; background-color: var(--brand-btn-bg, transparent) !important; }
`
    : '';

  if (isFullBleed) {
    return (
      <section id={section.anchorId ?? undefined} data-section-id={section.id} className="bg-[var(--style-section-bg,transparent)]" {...(sectionStyle ? { 'data-style': '' } : {})} style={sectionStyle}>
        {sectionOverrideCss && <style dangerouslySetInnerHTML={{ __html: sectionOverrideCss }} />}
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
    <section id={section.anchorId ?? undefined} data-section-id={section.id} className={`${spacingClass} ${spacingBottomClass} bg-[var(--style-section-bg,transparent)]`} {...(sectionStyle ? { 'data-style': '' } : {})} style={sectionStyle}>
      {sectionOverrideCss && <style dangerouslySetInnerHTML={{ __html: sectionOverrideCss }} />}
      <div className={containerClass}>
        <SectionErrorBoundary sectionType={section.type}>
          <Component data={section.data} variant={section.variant} styleVariant={styleVariant} />
        </SectionErrorBoundary>
      </div>
    </section>
  );
}

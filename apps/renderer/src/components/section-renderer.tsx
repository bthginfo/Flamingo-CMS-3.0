import React from 'react';
import type { SnapshotSection, SnapshotCollection, SnapshotCollectionItem } from '@/lib/snapshot';
import { resolveSectionDefinition } from '@/templates';
import { SectionErrorBoundary } from './section-error-boundary';
import { prefixInternalLinks } from '@/lib/link-prefix';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { SectionReveal } from './section-reveal';
import {
  escapeCssAttributeValue,
  escapeStyleElementText,
  normalizeStyleOverridesForSection,
} from '@/lib/section-style-overrides';
import { mergeContactFormFields, type ContactFormFieldDefinition } from '@/lib/contact-form';
import { resolveAccessibleRoleForeground } from '@/lib/brand-colors';
import { parseCssColor } from '@/lib/color-engine';
import { isMediaOverlaySectionType, resolveMediaOverlaySecondaryAction } from '@/lib/media-overlay-actions';
import { isContentUrlField, safeContentUrl } from '@/lib/safe-content-url';

/** Extract the best image from a collection item. Supports strings, media objects, arrays, and embedded hero sections. */
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

function extractItemImage(item: SnapshotCollectionItem): string | undefined {
  for (const key of COLLECTION_IMAGE_KEYS) {
    const url = getImageUrl(item.data[key]);
    if (url) return url;
  }
  // Items store sections in data.sections — find the most image-heavy section and grab its image field.
  const sections = item.data.sections as Array<{ type: string; data: Record<string, unknown> }> | undefined;
  if (sections) {
    const imageSection = sections.find((section) => (
      section.type === 'hero' ||
      section.type === 'collectionHero' ||
      section.type === 'cinematicHero' ||
      section.type === 'glowHero' ||
      section.type === 'floristHero' ||
      section.type === 'fitnessHero' ||
      section.type === 'locationHero'
    ));
    if (imageSection?.data) {
      for (const key of COLLECTION_IMAGE_KEYS) {
        const url = getImageUrl(imageSection.data[key]);
        if (url) return url;
      }
    }
  }
  return undefined;
}

const SPACING_TOP: Record<string, string> = {
  none: 'pt-0',
  s: 'pt-6',
  m: 'pt-12',
  l: 'pt-20',
  xl: 'pt-28',
};

const SPACING_BOTTOM: Record<string, string> = {
  none: 'pb-0',
  s: 'pb-6',
  m: 'pb-12',
  l: 'pb-20',
  xl: 'pb-28',
};

const CONTAINER: Record<string, string> = {
  default: 'max-w-7xl mx-auto px-6',
  wide: 'max-w-[1400px] mx-auto px-6',
  narrow: 'max-w-3xl mx-auto px-6',
  full: 'w-full px-6',
};

const BOOKING_SECTION_TYPES = new Set(['bookingWidget', 'bookingSlotPicker', 'bookingDateRange', 'availabilityCalendar', 'resourceBookingShowcase', 'bookingCtaPro']);
const CONTACT_FORM_SECTION_TYPES = new Set(['contact', 'contactForm', 'locationContact', 'tourismContact', 'smartInquiry']);
const SKIP_REVEAL_SECTION_TYPES = new Set([
  'hero',
  'collectionHero',
  'cinematicHero',
  'glowHero',
  'floristHero',
  'fitnessHero',
  'locationHero',
  'popup',
  'mobileActionDock',
  'dualWave',
  'cinematicChapters',
  'transformationSequence',
  'xrayReveal',
  'sceneLab',
  'infiniteCanvas',
  'kineticIdentity',
  'signaturePath',
  'layeredAnatomy',
  'guidedChoice',
  'dayToNight',
  'livingBlueprint',
  'editorialCardMorph',
  'materialAtelier',
]);

function getSectionFamily(type: string): 'hero' | 'form' | 'data' | 'cta' | 'proof' | 'grid' | 'content' {
  const normalized = type.toLowerCase();
  if (/(hero|masthead)/.test(normalized)) return 'hero';
  if (/(form|contact|booking|rsvp|newsletter)/.test(normalized)) return 'form';
  if (/(table|comparison|schedule|calendar|pricing)/.test(normalized)) return 'data';
  if (/(cta|banner|campaign|offer)/.test(normalized)) return 'cta';
  if (/(proof|testimonial|review|logo|trust|stat)/.test(normalized)) return 'proof';
  if (/(grid|gallery|cards|showcase|services|team|products|features)/.test(normalized)) return 'grid';
  return 'content';
}

function escapeCssAttr(value: string): string {
  return escapeCssAttributeValue(value);
}

function parseOverlayColor(input: string): { r: number; g: number; b: number; a: number } {
  const value = input.trim();
  const rgbMatch = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/i);
  if (rgbMatch) {
    return {
      r: Math.max(0, Math.min(255, Number(rgbMatch[1]) || 0)),
      g: Math.max(0, Math.min(255, Number(rgbMatch[2]) || 0)),
      b: Math.max(0, Math.min(255, Number(rgbMatch[3]) || 0)),
      a: Math.max(0, Math.min(1, Number(rgbMatch[4] ?? 1))),
    };
  }

  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1].length === 3
      ? hexMatch[1].split('').map(char => char + char).join('')
      : hexMatch[1];
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }

  return { r: 0, g: 0, b: 0, a: 1 };
}

function buildImageOverlayCss(section: SnapshotSection): string {
  const rules: string[] = [];

  const pushRule = (imageKey: string, selectorScope: string, colorRaw: unknown, opacityRaw: unknown) => {
    const opacity = typeof opacityRaw === 'number'
      ? opacityRaw
      : (typeof opacityRaw === 'string' && opacityRaw.trim() ? Number(opacityRaw) : 0);
    if (!Number.isFinite(opacity) || opacity <= 0) return;

    const parsed = parseOverlayColor(typeof colorRaw === 'string' && colorRaw.trim() ? colorRaw : '#000000');
    const alpha = Math.max(0, Math.min(1, parsed.a * Math.max(0, Math.min(1, opacity))));
    const escapedKey = escapeCssAttr(imageKey);
    rules.push(
      `[data-section-id="${escapeCssAttr(section.id)}"] ${selectorScope}[data-edit-image="${escapedKey}"] { box-shadow: inset 0 0 0 9999px rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha}); }`
    );
  };

  const visitNode = (node: unknown, selectorScope: string) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return;

    const record = node as Record<string, unknown>;

    for (const [key, value] of Object.entries(record)) {
      if (typeof value === 'string' && value.trim() && /image|background|photo|avatar|poster|logo/i.test(key)) {
        pushRule(key, selectorScope, record[`${key}OverlayColor`], record[`${key}OverlayOpacity`]);
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const nestedScope = `${selectorScope}[data-edit-collection="${escapeCssAttr(key)}"][data-edit-index="${index}"] `;
          visitNode(item, nestedScope);
        });
        continue;
      }

      if (value && typeof value === 'object') {
        visitNode(value, selectorScope);
      }
    }
  };

  visitNode(section.data, '');

  return rules.join('\n');
}

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
    ...(source['--token-section-bg'] ? { '--booking-section-bg': source['--token-section-bg'] } : {}),
    ...(source['--token-card-bg'] ? { '--booking-card-bg': source['--token-card-bg'] } : {}),
    ...(source['--token-heading'] ? { '--booking-heading-color': source['--token-heading'] } : {}),
    ...(source['--token-body'] ? { '--booking-body-color': source['--token-body'] } : {}),
    ...(source['--token-muted'] ? { '--booking-muted-color': source['--token-muted'] } : {}),
    ...(source['--token-badge-bg'] ? { '--booking-badge-bg': source['--token-badge-bg'] } : {}),
    ...(source['--token-badge-text'] ? { '--booking-badge-text': source['--token-badge-text'] } : {}),
    ...(source['--token-card-border'] ? { '--booking-border-color': source['--token-card-border'] } : {}),
    ...(source['--token-accent'] ? { '--booking-accent-color': source['--token-accent'] } : {}),
  } as React.CSSProperties;
}

const SECTION_STYLE_TOKEN_ALIASES: Record<string, string[]> = {
  '--style-section-bg': ['--token-section-bg'],
  '--style-section-bg-alt': ['--token-section-bg-alt'],
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
  '--style-accent-color': ['--style-accent', '--token-accent'],
  '--style-accent': ['--style-accent-color', '--token-accent'],
  '--style-badge-bg': ['--token-badge-bg'],
  '--style-badge-text': ['--token-badge-text'],
  '--style-badge-border': ['--token-badge-border'],
  '--brand-btn-bg': ['--token-btn-bg'],
  '--brand-btn-text': ['--token-btn-text'],
  '--brand-btn-secondary-bg': ['--token-btn-secondary-bg'],
  '--brand-btn-secondary-text': ['--token-btn-secondary-text'],
  '--brand-btn-secondary-border': ['--token-btn-secondary-border'],
  '--style-button-bg': ['--token-btn-bg', '--brand-btn-bg'],
  '--style-button-text': ['--token-btn-text', '--brand-btn-text'],
  '--style-button-secondary-bg': ['--token-btn-secondary-bg', '--brand-btn-secondary-bg'],
  '--style-button-secondary-text': ['--token-btn-secondary-text', '--brand-btn-secondary-text'],
  '--style-button-secondary-border': ['--token-btn-secondary-border', '--brand-btn-secondary-border'],
  '--style-image-text-color': ['--token-on-dark-heading', '--token-on-dark-body', '--token-on-dark-muted'],
  '--style-image-overlay': ['--style-overlay-color'],
  '--token-section-bg': ['--style-section-bg'],
  '--token-section-bg-alt': ['--style-section-bg-alt'],
  '--token-card-bg': ['--style-card-bg'],
  '--token-card-border': ['--style-border-color', '--style-card-border-color', '--style-border'],
  '--token-divider': ['--style-divider-color'],
  '--token-heading': ['--style-heading-color', '--style-text-primary', '--style-heading'],
  '--token-subheading': ['--style-subheading-color'],
  '--token-body': ['--style-body-color', '--style-text-secondary', '--style-body'],
  '--token-muted': ['--style-text-muted', '--style-muted'],
  '--token-icon': ['--style-icon-color'],
  '--token-accent': ['--style-accent-color', '--style-accent'],
  '--token-btn-bg': ['--brand-btn-bg', '--style-button-bg'],
  '--token-btn-text': ['--brand-btn-text', '--style-button-text'],
  '--token-btn-secondary-bg': ['--brand-btn-secondary-bg', '--style-button-secondary-bg'],
  '--token-btn-secondary-text': ['--brand-btn-secondary-text', '--style-button-secondary-text'],
  '--token-btn-secondary-border': ['--brand-btn-secondary-border', '--style-button-secondary-border'],
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

  // Legacy snapshots can predate the publish-time contrast validator. Repair
  // only complete, concrete foreground/background pairs at render time; CSS
  // variable references remain untouched because their effective surface is
  // resolved by the brand layer.
  const repairPair = (foregroundKey: string, backgroundKey: string, minimumContrast = 4.5) => {
    const foreground = normalized[foregroundKey];
    const background = normalized[backgroundKey];
    if (typeof foreground !== 'string' || typeof background !== 'string') return;
    const parsedBackground = parseCssColor(background);
    if (!parseCssColor(foreground) || !parsedBackground || parsedBackground.a < 0.999) return;
    const repaired = resolveAccessibleRoleForeground([background], foreground, minimumContrast);
    normalized[foregroundKey] = repaired;
    for (const alias of SECTION_STYLE_TOKEN_ALIASES[foregroundKey] || []) normalized[alias] = repaired;
  };
  repairPair('--token-btn-text', '--token-btn-bg');
  repairPair('--token-btn-secondary-text', '--token-btn-secondary-bg');
  repairPair('--token-badge-text', '--token-badge-bg');
  repairPair('--token-card-badge-text', '--token-card-badge-bg');
  repairPair('--token-input-text', '--token-input-bg');
  repairPair('--token-success', '--token-success-bg');
  repairPair('--token-danger', '--token-danger-bg');

  return normalized as React.CSSProperties;
}

/**
 * Media sections expose only the canonical heading/body/muted controls in the
 * CMS. Mirror section-local overrides to the inverse implementation aliases so
 * older templates that still read --token-on-dark-* render the same value.
 * Global page text is intentionally never mirrored here.
 */
function withMediaTextAliases(style?: React.CSSProperties): React.CSSProperties | undefined {
  if (!style) return style;
  const next: Record<string, unknown> = { ...style };
  const source = style as Record<string, unknown>;
  const mirror = (canonical: string, internal: string) => {
    const value = source[canonical];
    if (typeof value === 'string' && value.trim() && !next[internal]) next[internal] = value;
  };
  mirror('--token-heading', '--token-on-dark-heading');
  mirror('--token-body', '--token-on-dark-body');
  mirror('--token-muted', '--token-on-dark-muted');
  return next as React.CSSProperties;
}

function sanitizeRenderValue(value: unknown, key = ''): unknown {
  if (typeof value === 'string') {
    if (isContentUrlField(key)) return safeContentUrl(value);
    return /<[a-z][\s\S]*>/i.test(value) ? sanitizeHtml(value) : value;
  }
  if (Array.isArray(value)) return value.map(item => sanitizeRenderValue(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, sanitizeRenderValue(child, childKey)]));
  }
  return value;
}

export function SectionRenderer({ section, collections, styleVariant: _styleVariant, industry = 'tradesman', locale, defaultLocale, linkPrefix = '', globalFormFields }: { section: SnapshotSection; collections?: SnapshotCollection[]; styleVariant?: string; industry?: string; locale?: string; defaultLocale?: string; linkPrefix?: string; globalFormFields?: ContactFormFieldDefinition[] }) {
  const effectiveStyleVariant = 'classic';
  // i18n locale resolution: if section.data contains locale keys, resolve to the active locale
  if (locale && section.data && typeof section.data[locale] === 'object' && section.data[locale] !== null) {
    section = { ...section, data: section.data[locale] as Record<string, unknown> };
  } else if (locale && section.data && section.data._localized) {
    // Fallback: requested locale missing → try the tenant's default locale,
    // then 'de' as a last resort. Hardcoding 'de' was wrong for tenants that
    // configured a different default (e.g. 'en').
    const fb = defaultLocale ? section.data[defaultLocale] : undefined;
    const fallback = (typeof fb === 'object' && fb !== null)
      ? (fb as Record<string, unknown>)
      : ((section.data['de'] as Record<string, unknown>) ?? section.data);
    section = { ...section, data: fallback };
  }

  const resolvedDefinition = resolveSectionDefinition({
    type: section.type,
    industry,
    definitionKey: section.definitionKey,
    schemaVersion: section.schemaVersion,
  });
  const Component = resolvedDefinition?.component;
  section = {
    ...section,
    data: sanitizeRenderValue(prefixInternalLinks(section.data, linkPrefix)) as Record<string, unknown>,
    // Published snapshots and legacy rows are untrusted input too. Reapply the
    // section contract at the final rendering boundary before CSS interpolation.
    styleOverrides: normalizeStyleOverridesForSection(section.type, section.styleOverrides, industry, section.definitionKey),
  };

  // Tenant fields are the authoritative contract. A section may add fields,
  // but it cannot hide or weaken globally required fields in the rendered UI.
  if (CONTACT_FORM_SECTION_TYPES.has(section.type) && globalFormFields?.length) {
    const formFieldKey = section.type === 'smartInquiry' ? 'fields' : 'formFields';
    section = {
      ...section,
      data: {
        ...section.data,
        [formFieldKey]: mergeContactFormFields(globalFormFields, section.data[formFieldKey]),
      },
    };
  }

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
  // Collection injections and legacy snapshots pass the same final boundary.
  section = { ...section, data: sanitizeRenderValue(section.data) as Record<string, unknown> };
  if (!Component) {
    if (process.env.NODE_ENV === 'production') return null;
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
    'beforeAfterSlider', 'horizontalScrollShowcase', 'verticalTimeline', 'cinematicHero', 'editorialHero',
    'immersiveCtaBanner', 'editorialFeatureRail', 'offerCampaignStrip',
    'glowHero', 'floristHero', 'fitnessHero', 'locationHero', 'popup', 'mobileActionDock',
    'dualWave', 'cinematicChapters', 'transformationSequence', 'xrayReveal', 'sceneLab', 'infiniteCanvas',
    'kineticIdentity', 'signaturePath', 'layeredAnatomy', 'guidedChoice', 'dayToNight', 'livingBlueprint', 'editorialCardMorph', 'materialAtelier',
  ]);

  const isFullBleed = FULL_BLEED_TYPES.has(section.type);
  // UNIFIED colour resolution — no dark/light decision. Each text role resolves
  // to whatever the section actually set for it: the plain slot first, then its
  // on-dark alias (so it doesn't matter which the data used), then the global
  // style default. There is no "this section is dark" branch — you pick the
  // section background AND the text colour, and the renderer paints exactly that.
  //
  // MEDIA sections (photo/overlay behind the text) are the one exception to the
  // var() chain: the page-level defaults define --token-heading etc. on the page
  // wrapper, so a blind var(--token-heading, …) ALWAYS resolves to the page's
  // dark ink there and the light terminal fallback is unreachable — that painted
  // dark headlines onto dark hero photos whenever a hero had no own overrides.
  // On media sections only the section's OWN overrides may override the light
  // default; page-level tokens must not bleed through.
  const hasMediaOverlay = isMediaOverlaySectionType(section.type) || Boolean(section.data.overlay);
  const overrideStyle = section.styleOverrides
    ? Object.fromEntries(Object.entries(section.styleOverrides).filter(([, v]) => v)) as React.CSSProperties
    : undefined;
  const normalizedStyle = normalizeSectionStyle(overrideStyle);
  const ownOverrides = (normalizedStyle ?? {}) as Record<string, unknown>;
  const own = (...keys: string[]) => {
    for (const k of keys) { const v = ownOverrides[k]; if (typeof v === 'string' && v) return v; }
    return null;
  };
  const headingColorVar = hasMediaOverlay
    ? (own('--token-heading', '--token-on-dark-heading') ?? '#ffffff')
    : 'var(--token-heading, var(--token-on-dark-heading, var(--style-heading-color, var(--style-text-primary, inherit))))';
  const bodyColorVar = hasMediaOverlay
    ? (own('--token-body', '--token-on-dark-body') ?? 'rgba(255,255,255,0.86)')
    : 'var(--token-body, var(--token-on-dark-body, var(--style-body-color, var(--style-text-secondary, inherit))))';
  const mutedColorVar = hasMediaOverlay
    ? (own('--token-muted', '--token-on-dark-muted') ?? 'rgba(255,255,255,0.72)')
    : 'var(--token-muted, var(--token-on-dark-muted, var(--style-text-muted, var(--style-text-secondary, inherit))))';
  // Cards keep the full chain even on media sections: they sit on an opaque
  // --token-card-bg, so the page-level text defaults are the right backdrop-
  // matched colours for them.
  const cardHeadingColorVar = `var(--token-card-heading, var(--token-heading, var(--token-on-dark-heading, var(--style-heading-color, ${hasMediaOverlay ? '#ffffff' : 'inherit'}))))`;
  const cardBodyColorVar = `var(--token-card-body, var(--token-body, var(--token-on-dark-body, var(--style-body-color, ${hasMediaOverlay ? 'rgba(255,255,255,0.86)' : 'inherit'}))))`;
  const cardMutedColorVar = `var(--token-card-muted, var(--token-muted, var(--token-on-dark-muted, var(--style-text-muted, ${hasMediaOverlay ? 'rgba(255,255,255,0.72)' : 'inherit'}))))`;
  const badgeBgVar = hasMediaOverlay
    ? (own('--token-badge-bg') ?? 'rgba(2,6,23,0.72)')
    : 'var(--token-badge-bg)';
  const badgeTextVar = hasMediaOverlay
    ? (own('--token-badge-text') ?? '#ffffff')
    : 'var(--token-badge-text)';
  const badgeBorderVar = hasMediaOverlay
    ? (own('--token-badge-border') ?? 'rgba(255,255,255,0.28)')
    : 'var(--token-badge-border)';
  const darkContextHeadingVar = own('--token-on-dark-heading', '--token-heading') ?? '#ffffff';
  const darkContextBodyVar = own('--token-on-dark-body', '--token-body') ?? 'rgba(255,255,255,0.86)';
  const darkContextMutedVar = own('--token-on-dark-muted', '--token-muted') ?? 'rgba(255,255,255,0.72)';

  // Per-section color overrides (from CMS) applied as inline CSS vars.
  const baseSectionStyle = withBookingStyleAliases(
    section.type,
    hasMediaOverlay ? withMediaTextAliases(normalizedStyle) : normalizedStyle,
  );
  const mediaSecondaryAction = hasMediaOverlay
    ? resolveMediaOverlaySecondaryAction({
        background: own('--token-btn-secondary-bg'),
        text: own('--token-btn-secondary-text'),
        border: own('--token-btn-secondary-border'),
      })
    : null;
  const sectionStyle = hasMediaOverlay
    ? ({
        ...(baseSectionStyle || {}),
        // Media overlays need their own secondary action contract. Inheriting a
        // light page's pale secondary button can make the CTA disappear over a
        // photograph even when the hero copy itself was correctly inverted.
        '--token-btn-secondary-bg': mediaSecondaryAction!.background,
        '--token-btn-secondary-text': mediaSecondaryAction!.text,
        '--token-btn-secondary-border': mediaSecondaryAction!.border,
      } as React.CSSProperties)
    : baseSectionStyle;

  // Global bridge: strict 1:1 CSS var → data prop mapping.
  // NO cross-token fallbacks. Each token maps to exactly ONE data property.
  // This ensures CMS fields don't interfere with unrelated component color properties.
  // Also provides legacy prop aliases (bgColor for sectionBg, textColor for bodyColor, etc)
  // for templates that haven't migrated to new token-based prop names.
  if (sectionStyle) {
    const s = sectionStyle as Record<string, string>;
    const injected: Record<string, unknown> = {};

    // STRICT 1:1 MAPPINGS + legacy aliases: each token to ONE prop, NO FALLBACKS ACROSS TOKENS
    if (s['--token-section-bg'] && !section.data.sectionBg) {
      injected.sectionBg = s['--token-section-bg'];
      injected.bgColor = s['--token-section-bg']; // Legacy alias
    }
    if (s['--token-section-bg-alt'] && !section.data.sectionBgAlt) injected.sectionBgAlt = s['--token-section-bg-alt'];
    if (s['--token-card-bg'] && !section.data.cardBg) injected.cardBg = s['--token-card-bg'];
    if (s['--token-heading'] && !section.data.headingColor) injected.headingColor = s['--token-heading'];
    if (s['--token-card-heading'] && !section.data.cardHeadingColor) injected.cardHeadingColor = s['--token-card-heading'];
    if (s['--token-subheading'] && !section.data.subheadingColor) injected.subheadingColor = s['--token-subheading'];
    if (s['--token-body'] && !section.data.bodyColor) {
      injected.bodyColor = s['--token-body'];
      injected.textColor = s['--token-body']; // Legacy alias
    }
    if (s['--token-card-body'] && !section.data.cardBodyColor) injected.cardBodyColor = s['--token-card-body'];
    if (s['--token-muted'] && !section.data.mutedColor) injected.mutedColor = s['--token-muted'];
    if (s['--token-icon'] && !section.data.iconColor) injected.iconColor = s['--token-icon'];
    if (s['--token-card-icon'] && !section.data.cardIconColor) injected.cardIconColor = s['--token-card-icon'];
    if (s['--token-eyebrow'] && !section.data.eyebrowColor) injected.eyebrowColor = s['--token-eyebrow'];
    if (s['--token-accent'] && !section.data.accentColor) injected.accentColor = s['--token-accent'];
    if (s['--token-stat-value'] && !section.data.statValue) injected.statValue = s['--token-stat-value'];
    if (s['--token-on-dark-heading'] && !section.data.onDarkHeading) injected.onDarkHeading = s['--token-on-dark-heading'];
    if (s['--token-on-dark-body'] && !section.data.onDarkBody) injected.onDarkBody = s['--token-on-dark-body'];
    if (s['--token-on-dark-muted'] && !section.data.onDarkMuted) injected.onDarkMuted = s['--token-on-dark-muted'];
    if (s['--token-btn-bg'] && !section.data.btnBg) injected.btnBg = s['--token-btn-bg'];
    if (s['--token-btn-text'] && !section.data.btnText) injected.btnText = s['--token-btn-text'];
    if (s['--token-badge-bg'] && !section.data.badgeBg) injected.badgeBg = s['--token-badge-bg'];
    // NOTE: --token-badge-text is the badge text COLOUR. It must NOT be injected
    // into data.badgeText, which is the badge LABEL string — doing so rendered the
    // colour value (e.g. "#FFFFFF") as the badge text. The colour is applied via
    // the --token-badge-text CSS var directly; no data-prop bridge is needed.
    if (s['--token-card-border'] && !section.data.borderColor) injected.borderColor = s['--token-card-border'];
    if (s['--token-divider'] && !section.data.dividerColor) injected.dividerColor = s['--token-divider'];
    if (s['--token-divider'] && !section.data.lineColor) injected.lineColor = s['--token-divider'];

    if (Object.keys(injected).length > 0) {
      section = { ...section, data: { ...section.data, ...injected } };
    }
  }
  // ALWAYS emitted — not gated on styleOverrides. Without this, a section that
  // has no overrides yet is painted by a different regime than one with a
  // single override (the unified chain only kicked in after the first value),
  // and the CMS editors' DOM scans could not see the universal token slots on
  // fresh sections — which hid the heading/body/muted controls exactly when
  // the user needed them to set a first colour.
  const escapedSectionId = escapeCssAttr(section.id);
  const sectionColorCss = `
[data-section-id="${escapedSectionId}"][data-style] { --_card-h:${cardHeadingColorVar}; --_card-b:${cardBodyColorVar}; --_card-m:${cardMutedColorVar}; --_on-dark-h:${darkContextHeadingVar}; --_on-dark-b:${darkContextBodyVar}; --_on-dark-m:${darkContextMutedVar}; }
[data-section-id="${escapedSectionId}"][data-style] [data-edit-collection],[data-section-id="${escapedSectionId}"][data-style] [data-card] { --token-heading:var(--_card-h); --token-on-dark-heading:var(--_card-h); --token-body:var(--_card-b); --token-on-dark-body:var(--_card-b); --token-card-body:var(--_card-b); --token-muted:var(--_card-m); --token-on-dark-muted:var(--_card-m); --token-card-muted:var(--_card-m); }
[data-section-id="${escapedSectionId}"][data-style] :is(h1,h2,h3,h4,h5,h6):not([class*="text-white"]):not([class*="text-black"]) { color: ${headingColorVar} !important; }
[data-section-id="${escapedSectionId}"][data-style] :is(p,li):not(.section-badge):not([class*="text-white"]):not([class*="text-black"]) { color: ${bodyColorVar} !important; }
[data-section-id="${escapedSectionId}"][data-style] :is(small,figcaption,[class*="text-muted"],[class*="text-zinc"],[class*="text-gray"]):not([class*="text-white"]):not([class*="text-black"]) { color: ${mutedColorVar} !important; }
[data-section-id="${escapedSectionId}"][data-style] [data-edit-collection] :is(h1,h2,h3,h4,h5,h6):not([class*="text-white"]):not([class*="text-black"]),[data-section-id="${escapedSectionId}"][data-style] [data-card] :is(h1,h2,h3,h4,h5,h6):not([class*="text-white"]):not([class*="text-black"]) { color: ${cardHeadingColorVar} !important; }
[data-section-id="${escapedSectionId}"][data-style] [data-edit-collection] :is(p,li):not(.section-badge):not([class*="text-white"]):not([class*="text-black"]),[data-section-id="${escapedSectionId}"][data-style] [data-card] :is(p,li):not(.section-badge):not([class*="text-white"]):not([class*="text-black"]) { color: ${cardBodyColorVar} !important; }
[data-section-id="${escapedSectionId}"][data-style] [data-edit-collection] :is(small,figcaption,[class*="text-muted"],[class*="text-zinc"],[class*="text-gray"]):not([class*="text-white"]):not([class*="text-black"]),[data-section-id="${escapedSectionId}"][data-style] [data-card] :is(small,figcaption,[class*="text-muted"],[class*="text-zinc"],[class*="text-gray"]):not([class*="text-white"]):not([class*="text-black"]) { color: ${cardMutedColorVar} !important; }
[data-section-id="${escapedSectionId}"][data-style] .section-badge { color: ${badgeTextVar} !important; background-color: ${badgeBgVar} !important; border-color: ${badgeBorderVar} !important; }
[data-section-id="${escapedSectionId}"][data-style] [data-color-context="dark"],[data-section-id="${escapedSectionId}"][data-style] [data-color-context="dark"] [data-edit-collection],[data-section-id="${escapedSectionId}"][data-style] [data-color-context="dark"] [data-card] { --token-heading:var(--_on-dark-h); --token-on-dark-heading:var(--_on-dark-h); --token-body:var(--_on-dark-b); --token-on-dark-body:var(--_on-dark-b); --token-muted:var(--_on-dark-m); --token-on-dark-muted:var(--_on-dark-m); }
[data-section-id="${escapedSectionId}"][data-style] [data-color-context="dark"] :is(h1,h2,h3,h4,h5,h6):not([class*="text-white"]):not([class*="text-black"]) { color: var(--_on-dark-h) !important; }
[data-section-id="${escapedSectionId}"][data-style] [data-color-context="dark"] :is(p,li):not(.section-badge):not([class*="text-white"]):not([class*="text-black"]) { color: var(--_on-dark-b) !important; }
[data-section-id="${escapedSectionId}"][data-style] [data-color-context="dark"] :is(small,figcaption,[class*="text-muted"],[class*="text-zinc"],[class*="text-gray"]):not([class*="text-white"]):not([class*="text-black"]) { color: var(--_on-dark-m) !important; }
`;
  const sectionOverlayCss = buildImageOverlayCss(section);
  const sectionOverrideCss = escapeStyleElementText(
    `${sectionColorCss}${sectionOverlayCss ? `\n${sectionOverlayCss}` : ''}`.trim(),
  );
  const sectionFamily = getSectionFamily(section.type);
  const sectionClassName = `cms-section cms-section--${sectionFamily}`;
  const sectionMetadata = {
    'data-section-type': section.type,
    'data-section-family': sectionFamily,
    'data-section-state': 'ready',
  } as const;

  if (isFullBleed) {
    return (
      <SectionReveal {...sectionMetadata} disabled={SKIP_REVEAL_SECTION_TYPES.has(section.type)} id={section.anchorId ?? undefined} data-section-id={section.id} data-definition-key={resolvedDefinition?.key} data-schema-version={section.schemaVersion ?? resolvedDefinition?.schemaVersion} className={`${sectionClassName} bg-[var(--style-section-bg,transparent)]`} data-style="" style={sectionStyle}>
        {sectionOverrideCss && <style>{sectionOverrideCss}</style>}
        <SectionErrorBoundary sectionType={section.type}>
          <Component data={section.data} variant={section.variant} styleVariant={effectiveStyleVariant} />
        </SectionErrorBoundary>
      </SectionReveal>
    );
  }

  const spacingClass = SPACING_TOP[section.spacingTop] ?? SPACING_TOP.m;
  const spacingBottomClass = SPACING_BOTTOM[section.spacingBottom] ?? SPACING_BOTTOM.m;
  const containerClass = CONTAINER[section.container] ?? CONTAINER.default;

  return (
    <SectionReveal {...sectionMetadata} disabled={SKIP_REVEAL_SECTION_TYPES.has(section.type)} id={section.anchorId ?? undefined} data-section-id={section.id} data-definition-key={resolvedDefinition?.key} data-schema-version={section.schemaVersion ?? resolvedDefinition?.schemaVersion} className={`${sectionClassName} ${spacingClass} ${spacingBottomClass} bg-[var(--style-section-bg,transparent)]`} data-style="" style={sectionStyle}>
      {sectionOverrideCss && <style>{sectionOverrideCss}</style>}
      <div className={`cms-section-shell ${containerClass}`}>
        <SectionErrorBoundary sectionType={section.type}>
          <Component data={section.data} variant={section.variant} styleVariant={effectiveStyleVariant} />
        </SectionErrorBoundary>
      </div>
    </SectionReveal>
  );
}

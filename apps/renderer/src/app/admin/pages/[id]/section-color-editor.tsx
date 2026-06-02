'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Palette, ChevronDown } from 'lucide-react';

type ColorOverrides = Record<string, string>;

/* ─── All available color fields with categories ─── */
export type ColorFieldKey =
  | 'sectionBg' | 'sectionBgAlt' | 'cardBg'
  | 'headingColor' | 'subheadingColor' | 'bodyColor' | 'mutedColor'
  | 'textPrimary' | 'textSecondary'
  | 'iconColor' | 'accentColor'
  | 'styleBrand' | 'brandPrimary' | 'brandAccent' | 'colorPrimary'
  | 'btnBg' | 'btnText' | 'btnSecondaryBg' | 'btnSecondaryText'
  | 'badgeBg' | 'badgeText' | 'badgeBorder'
  | 'borderColor' | 'dividerColor' | 'cardBorder' | 'cardBorderColor'
  | 'cardRadius' | 'cardShadow' | 'buttonRadius' | 'headingWeight' | 'headingTracking';

type FieldType = 'color' | 'size';

const FIELD_DEFS: Record<ColorFieldKey, { cssVar: string; label: string; description: string; type?: FieldType }> = {
  sectionBg:        { cssVar: '--style-section-bg',       label: 'Hintergrund',            description: 'Hintergrundfarbe der Sektion' },
  sectionBgAlt:     { cssVar: '--style-section-bg-alt',   label: 'Hintergrund (Alt)',      description: 'Alternativer Hintergrund (z.B. für gerade/ungerade Sektionen)' },
  cardBg:           { cssVar: '--style-card-bg',          label: 'Karten-Hintergrund',     description: 'Hintergrund von Karten/Containern' },
  headingColor:     { cssVar: '--style-heading-color',    label: 'Headline',               description: 'Farbe der Hauptüberschrift' },
  subheadingColor:  { cssVar: '--style-subheading-color', label: 'Subheadline',            description: 'Farbe der Unterüberschrift' },
  bodyColor:        { cssVar: '--style-body-color',       label: 'Fließtext',              description: 'Farbe des Fließtexts' },
  mutedColor:       { cssVar: '--style-text-muted',       label: 'Dezenter Text',          description: 'Dezente Texte, Labels, Eyebrow' },
  textPrimary:      { cssVar: '--style-text-primary',     label: 'Primärer Text',          description: 'Primär-Textfarbe innerhalb dieser Section' },
  textSecondary:    { cssVar: '--style-text-secondary',   label: 'Sekundärer Text',        description: 'Sekundär-Textfarbe innerhalb dieser Section' },
  iconColor:        { cssVar: '--style-icon-color',       label: 'Icons',                  description: 'Farbe der Icons' },
  accentColor:      { cssVar: '--style-accent-color',     label: 'Akzentfarbe',            description: 'Akzente, Linien, Hervorhebungen' },
  styleBrand:       { cssVar: '--style-brand',            label: 'Brand-Akzent',           description: 'Section-spezifischer Markenakzent' },
  brandPrimary:     { cssVar: '--brand-primary',          label: 'Primärer Markenwert',    description: 'Primärer Markenwert innerhalb dieser Section' },
  brandAccent:      { cssVar: '--brand-accent',           label: 'Marken-Akzentwert',      description: 'Akzentwert innerhalb dieser Section' },
  colorPrimary:     { cssVar: '--color-primary',          label: 'Primärfarbe',            description: 'Primärfarbe für ältere Templates' },
  btnBg:            { cssVar: '--brand-btn-bg',           label: 'Button Hintergrund',     description: 'CTA-Button Hintergrund' },
  btnText:          { cssVar: '--brand-btn-text',         label: 'Button Text',            description: 'CTA-Button Textfarbe' },
  btnSecondaryBg:   { cssVar: '--brand-btn-secondary-bg', label: 'Sekundär-Button BG',    description: 'Sekundärer Button Hintergrund' },
  btnSecondaryText: { cssVar: '--brand-btn-secondary-text',label: 'Sekundär-Button Text', description: 'Sekundärer Button Textfarbe' },
  badgeBg:          { cssVar: '--style-badge-bg',         label: 'Badge/Eyebrow BG',       description: 'Badge/Eyebrow Hintergrund' },
  badgeText:        { cssVar: '--style-badge-text',       label: 'Badge/Eyebrow Text',     description: 'Badge/Eyebrow Textfarbe' },
  badgeBorder:      { cssVar: '--style-badge-border',     label: 'Badge/Eyebrow Rahmen',   description: 'Badge/Eyebrow Rahmenfarbe' },
  borderColor:      { cssVar: '--style-border-color',     label: 'Rahmenfarbe',            description: 'Rahmen/Border von Karten' },
  dividerColor:     { cssVar: '--style-divider-color',    label: 'Trennlinie',             description: 'Trennlinien zwischen Elementen' },
  cardBorder:       { cssVar: '--style-card-border',      label: 'Karten-Rahmen',          description: 'Kompletter Border-Wert für Karten', type: 'size' },
  cardBorderColor:  { cssVar: '--style-card-border-color',label: 'Karten-Rahmenfarbe',     description: 'Rahmenfarbe für Karten' },
  cardRadius:       { cssVar: '--style-card-radius',      label: 'Karten-Radius',          description: 'Abrundung der Kartenecken', type: 'size' },
  cardShadow:       { cssVar: '--style-card-shadow',      label: 'Karten-Schatten',        description: 'Schatten der Karten', type: 'size' },
  buttonRadius:     { cssVar: '--style-button-radius',    label: 'Button-Radius',          description: 'Abrundung der Buttons', type: 'size' },
  headingWeight:    { cssVar: '--style-heading-weight',   label: 'Headline-Stärke',        description: 'Font-Weight der Headline', type: 'size' },
  headingTracking:  { cssVar: '--style-heading-tracking', label: 'Headline-Laufweite',     description: 'Letter-Spacing der Headline', type: 'size' },
};

/* ─── Mapping: section type → relevant fields ─── */
const SECTION_FIELDS: Record<string, ColorFieldKey[]> = {
  additionalLocations: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  amenitiesGrid: ['sectionBgAlt', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  availabilityCta: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  beforeAfter: ['sectionBg', 'sectionBgAlt', 'cardBg', 'accentColor', 'cardRadius', 'cardShadow', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  beforeAfterSlider: ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  beforeAfterStoryPro: ['sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  bentoGrid: ['sectionBgAlt', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  bouquetShowcase: ['sectionBgAlt', 'cardBg', 'mutedColor', 'cardRadius', 'cardShadow', 'textPrimary', 'textSecondary', 'brandPrimary', 'cardBorder', 'headingWeight', 'headingTracking'],
  brandShowroom: ['cardBg', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'brandPrimary'],
  categoryMosaic: ['sectionBgAlt', 'cardRadius', 'textPrimary', 'textSecondary', 'styleBrand', 'brandPrimary', 'headingWeight', 'headingTracking'],
  cinematicHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  collectionHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  collectionList: ['cardBg', 'mutedColor', 'borderColor', 'textSecondary', 'styleBrand'],
  comparisonCardsPro: ['cardBg', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  comparisonTable: ['mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  consultationBooking: ['sectionBgAlt', 'cardBg', 'cardRadius', 'cardShadow', 'buttonRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  contact: ['sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary'],
  courseSchedule: ['sectionBgAlt', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  ctaBand: ['sectionBg', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary'],
  ctaLinks: ['sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  deliveryTimeline: ['textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  editorialFeatureRail: ['sectionBgAlt', 'cardBg', 'accentColor', 'borderColor', 'textPrimary', 'brandPrimary'],
  embed: ['mutedColor', 'brandPrimary'],
  eventTypes: ['sectionBgAlt', 'cardRadius', 'textPrimary', 'textSecondary', 'styleBrand', 'brandPrimary', 'headingWeight', 'headingTracking'],
  faq: ['sectionBg', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  featureShowcase: ['sectionBgAlt', 'textPrimary', 'textSecondary', 'colorPrimary'],
  fitnessHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  floorPlanOverview: ['sectionBg', 'cardBg', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  floristHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  floristMaterials: ['sectionBgAlt', 'cardBg', 'borderColor', 'cardRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  freeText: ['accentColor'],
  galleryGrid: ['sectionBg', 'sectionBgAlt', 'textPrimary'],
  galleryMoodboard: ['sectionBg', 'sectionBgAlt', 'textPrimary'],
  glowHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'accentColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  headerBanner: ['sectionBg', 'accentColor', 'textPrimary'],
  hero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  heroEcommerce: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  heroHandwerk: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  horizontalScrollShowcase: ['sectionBg', 'bodyColor', 'brandPrimary'],
  hostTeam: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  immersiveCtaBanner: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  inspirationGrid: ['sectionBg', 'sectionBgAlt', 'cardRadius', 'textPrimary', 'textSecondary', 'styleBrand', 'brandPrimary', 'headingWeight', 'headingTracking'],
  legalContent: ['accentColor', 'textPrimary'],
  locationAccess: ['sectionBgAlt', 'cardBg', 'mutedColor', 'borderColor'],
  locationHero: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  locationPackages: ['cardBg', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  logoCloud: ['textSecondary'],
  logoMarquee: ['sectionBgAlt', 'mutedColor'],
  map: ['sectionBgAlt', 'cardBg', 'mutedColor', 'borderColor'],
  materialGallery: ['sectionBgAlt', 'cardBg', 'borderColor', 'cardRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
  membershipPlans: ['cardBg', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  newsGrid: ['mutedColor', 'accentColor', 'textPrimary', 'textSecondary'],
  newsPreview: ['mutedColor', 'accentColor', 'textPrimary', 'textSecondary'],
  noticeBanner: ['brandPrimary'],
  occasionMosaic: ['sectionBgAlt', 'cardRadius', 'textPrimary', 'textSecondary', 'styleBrand', 'brandPrimary', 'headingWeight', 'headingTracking'],
  offerCampaignStrip: ['sectionBg', 'sectionBgAlt', 'cardBg', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  popup: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary', 'brandPrimary'],
  bookingWidget: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  bookingSlotPicker: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  bookingDateRange: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  availabilityCalendar: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  resourceBookingShowcase: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  bookingCtaPro: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'textSecondary'],
  portfolio: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  premiumComparison: ['cardBg', 'headingColor', 'mutedColor', 'borderColor', 'cardRadius', 'textPrimary', 'brandPrimary'],
  principlesGrid: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  processSteps: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  productShowcase: ['sectionBgAlt', 'cardBg', 'mutedColor', 'cardRadius', 'cardShadow', 'textPrimary', 'textSecondary', 'brandPrimary', 'cardBorder', 'headingWeight', 'headingTracking'],
  programGrid: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  proofWall: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'badgeBg', 'borderColor', 'brandPrimary'],
  richText: ['accentColor'],
  scrollStory: ['cardBg', 'headingColor', 'bodyColor', 'borderColor', 'cardRadius', 'textPrimary', 'textSecondary', 'brandPrimary'],
  seasonalCampaign: ['sectionBg', 'sectionBgAlt', 'cardBg', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  serviceDetail: ['sectionBg', 'sectionBgAlt', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  servicesGrid: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  shopCart: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  shopCategoryOverview: ['sectionBgAlt', 'cardBg', 'mutedColor', 'borderColor', 'textSecondary'],
  shopCheckout: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  shopFeaturedProducts: ['sectionBgAlt', 'mutedColor', 'borderColor'],
  shopProductDetail: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  shopProductGrid: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  shopThankYou: ['sectionBg', 'accentColor', 'textPrimary', 'textSecondary'],
  signatureGrid: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'iconColor', 'accentColor', 'borderColor', 'textPrimary', 'brandPrimary'],
  socialProofBar: ['sectionBg', 'cardBg', 'accentColor', 'textPrimary', 'textSecondary', 'cardBorderColor', 'colorPrimary'],
  spaceShowcase: ['sectionBgAlt', 'cardBg', 'mutedColor', 'cardRadius', 'cardShadow', 'textPrimary', 'textSecondary', 'brandPrimary', 'cardBorder', 'headingWeight', 'headingTracking'],
  spotlightCards: ['cardBg', 'headingColor', 'bodyColor', 'iconColor', 'borderColor', 'cardRadius', 'textPrimary', 'textSecondary', 'brandPrimary'],
  stats: ['sectionBg', 'cardBg', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  statsCounter: ['sectionBgAlt', 'cardBg', 'mutedColor', 'textPrimary', 'colorPrimary'],
  story: ['sectionBg', 'cardBg', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  studioAmenities: ['sectionBgAlt', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  team: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  templateAdvantage: ['sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'btnBg', 'btnText', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  testimonialMarquee: ['cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  testimonials: ['sectionBg', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  textImage: ['sectionBg', 'cardBg', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  timeline: ['sectionBgAlt', 'borderColor', 'textPrimary', 'textSecondary', 'colorPrimary'],
  trainerProfiles: ['sectionBg', 'sectionBgAlt', 'cardBg', 'mutedColor', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  transformationStories: ['sectionBgAlt', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'textPrimary', 'brandPrimary'],
  trialSessionCta: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'textPrimary', 'brandPrimary'],
  uspStrip: ['sectionBgAlt', 'cardBg', 'accentColor', 'borderColor', 'textPrimary', 'textSecondary'],
  verticalTimeline: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'dividerColor', 'textPrimary', 'textSecondary', 'brandPrimary'],
  videoEmbed: ['mutedColor'],
  weddingFloristry: ['cardBg', 'borderColor', 'cardRadius', 'buttonRadius', 'textPrimary', 'brandPrimary'],
  workshopBooking: ['sectionBgAlt', 'cardBg', 'cardRadius', 'cardShadow', 'buttonRadius', 'textPrimary', 'textSecondary', 'brandPrimary', 'headingWeight', 'headingTracking'],
};

function getFieldsForSection(sectionType: string): ColorFieldKey[] {
  return SECTION_FIELDS[sectionType] ?? [];
}


export function SectionColorEditor({ value, onChange, sectionType, resolvedVars, iframeRef, sectionId }: { value: ColorOverrides | null; onChange: (overrides: ColorOverrides | null) => void; sectionType?: string; resolvedVars?: Record<string, string>; iframeRef?: React.RefObject<HTMLIFrameElement | null>; sectionId?: string }) {
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [computedVars, setComputedVars] = useState<Record<string, string>>({});
  const probeRef = useRef<HTMLDivElement>(null);
  const overrides = value || {};
  const activeCount = Object.values(overrides).filter(Boolean).length;
  const allFields = sectionType ? getFieldsForSection(sectionType) : Object.keys(FIELD_DEFS) as ColorFieldKey[];
  
  // Split into color fields and design token fields
  const colorFields = allFields.filter(f => FIELD_DEFS[f]?.type !== 'size');
  const designFields = allFields.filter(f => FIELD_DEFS[f]?.type === 'size');

  // All CSS vars we need to read
  const allVarKeys = [
    ...allFields.map(f => FIELD_DEFS[f]?.cssVar).filter(Boolean),
    '--style-text-primary', '--style-text-secondary', '--brand-primary', '--brand-accent', '--brand-dark', '--brand-secondary',
    '--style-card-bg', '--style-section-bg', '--style-section-bg-alt', '--style-card-border', '--style-border-color',
    '--style-divider-color', '--style-text-muted', '--style-badge-bg', '--style-badge-text', '--style-badge-border',
    '--style-card-radius', '--style-card-shadow', '--style-button-radius', '--style-icon-color', '--style-accent-color',
    '--style-heading-color', '--style-subheading-color', '--style-body-color', '--brand-btn-bg', '--brand-btn-text',
    '--brand-btn-secondary-bg', '--brand-btn-secondary-text',
  ];

  const readComputedStyles = useCallback(() => {
    const result: Record<string, string> = {};

    // Strategy 1: Read from preview iframe (100% accurate)
    if (iframeRef?.current && sectionId) {
      try {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          const el = doc.querySelector(`[data-section-id="${CSS.escape(sectionId)}"]`);
          if (el) {
            const styles = getComputedStyle(el);
            for (const v of allVarKeys) {
              const val = styles.getPropertyValue(v).trim();
              if (val) result[v] = val;
            }
            if (Object.keys(result).length > 0) { setComputedVars(result); return; }
          }
        }
      } catch { /* iframe not accessible */ }
    }

    // Strategy 2: Read from local probe element (works without preview)
    if (probeRef.current) {
      const styles = getComputedStyle(probeRef.current);
      for (const v of allVarKeys) {
        const val = styles.getPropertyValue(v).trim();
        if (val) result[v] = val;
      }
    }

    setComputedVars(result);
  }, [iframeRef, sectionId, allVarKeys]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(readComputedStyles, 50);
      return () => clearTimeout(t);
    }
  }, [open, readComputedStyles]);

  // Comprehensive fallback chain for resolving display colors
  const getResolvedColor = (cssVar: string): string | undefined => {
    // 1. Computed from iframe/probe (100% accurate)
    if (computedVars[cssVar]) return computedVars[cssVar];
    // 2. From resolvedVars (style + brand combined)
    if (resolvedVars?.[cssVar]) return resolvedVars[cssVar];
    // 3. Fallback chain for vars that derive from others
    const fallbacks: Record<string, string[]> = {
      '--style-heading-color': ['--style-text-primary', '--brand-dark'],
      '--style-subheading-color': ['--style-text-secondary', '--style-text-primary'],
      '--style-body-color': ['--style-text-secondary', '--style-text-primary'],
      '--style-text-muted': ['--style-text-secondary'],
      '--style-icon-color': ['--brand-primary', '--style-accent-color', '--brand-accent'],
      '--style-accent-color': ['--brand-accent', '--brand-primary'],
      '--style-border-color': ['--style-card-border'],
      '--style-divider-color': ['--style-border-color', '--style-card-border'],
      '--brand-btn-bg': ['--brand-accent', '--brand-primary'],
      '--brand-btn-text': ['--brand-dark'],
      '--brand-btn-secondary-bg': ['--style-section-bg'],
      '--brand-btn-secondary-text': ['--brand-primary'],
      '--style-badge-bg': ['--brand-primary'],
      '--style-badge-text': ['--brand-primary'],
      '--style-badge-border': ['--brand-primary'],
      '--style-section-bg-alt': ['--style-section-bg'],
      '--style-card-bg': ['--style-section-bg'],
    };
    const chain = fallbacks[cssVar];
    if (chain) {
      for (const fb of chain) {
        const val = computedVars[fb] || resolvedVars?.[fb];
        if (val) return val;
      }
    }
    return undefined;
  };

  const handleChange = (key: string, color: string) => {
    const next = { ...overrides, [key]: color };
    // Sync related vars
    if (key === '--style-accent-color') {
      next['--brand-primary'] = color;
      next['--brand-accent'] = color;
    }
    if (key === '--style-border-color') {
      next['--style-card-border'] = `1px solid ${color}`;
    }
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  const handleClear = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    if (key === '--style-accent-color') {
      delete next['--brand-primary'];
      delete next['--brand-accent'];
    }
    if (key === '--style-border-color') {
      delete next['--style-card-border'];
    }
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  function renderColorField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar]
      || (def.cssVar === '--style-accent-color' ? overrides['--brand-primary'] : '')
      || (def.cssVar === '--style-border-color' ? (overrides['--style-card-border'] || '').replace(/^1px solid\s+/, '') : '')
      || '';
    const resolved = getResolvedColor(def.cssVar);
    const displayColor = currentOverride || resolved || '';
    return (
      <label key={fieldKey} className="block">
        <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative">
            <input
              type="color"
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
              value={displayColor || '#000000'}
              onChange={(e) => handleChange(def.cssVar, e.target.value)}
            />
            {!currentOverride && resolved && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white" style={{ background: resolved }} title={`Aktuell: ${resolved}`} />
            )}
          </div>
          <input
            type="text"
            className="admin-input flex-1 text-xs font-mono"
            placeholder={resolved || '—'}
            value={currentOverride}
            onChange={(e) => handleChange(def.cssVar, e.target.value)}
          />
          {currentOverride && (
            <button type="button" className="text-xs text-red-400 hover:text-red-600" onClick={() => handleClear(def.cssVar)}>✕</button>
          )}
        </div>
      </label>
    );
  }

  function renderDesignField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar] || '';
    const resolved = computedVars[def.cssVar] || resolvedVars?.[def.cssVar] || '';
    return (
      <label key={fieldKey} className="block">
        <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            className="admin-input flex-1 text-xs font-mono"
            placeholder={resolved || '—'}
            value={currentOverride}
            onChange={(e) => handleChange(def.cssVar, e.target.value)}
          />
          {currentOverride && (
            <button type="button" className="text-xs text-red-400 hover:text-red-600" onClick={() => handleClear(def.cssVar)}>✕</button>
          )}
        </div>
      </label>
    );
  }

  return (
    <details className="mt-4" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1">
        <Palette size={12} /> Farben anpassen
        {activeCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">{activeCount}</span>}
      </summary>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {colorFields.map(renderColorField)}
      </div>
      {designFields.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <button type="button" className="text-xs text-zinc-500 flex items-center gap-1 mb-2" onClick={() => setShowAdvanced(!showAdvanced)}>
            <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Design-Tokens (Radius, Schatten)
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {designFields.map(renderDesignField)}
            </div>
          )}
        </div>
      )}
      {activeCount > 0 && (
        <button type="button" className="mt-3 text-xs text-red-500 hover:text-red-700" onClick={() => onChange(null)}>
          Alle Farb-Overrides entfernen
        </button>
      )}
      {/* Hidden probe element to read computed CSS vars without needing the preview iframe */}
      {open && <div ref={probeRef} data-style="" style={resolvedVars as React.CSSProperties} className="hidden" aria-hidden="true" />}
    </details>
  );
}

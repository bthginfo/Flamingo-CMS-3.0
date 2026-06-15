/**
 * SECTION COLOR CONTRACTS — Explicit per-section slot declarations.
 *
 * Each section type declares exactly which color slots it uses.
 * The CMS editor only shows these slots. Templates only read these slots.
 * Build-time validation ensures contracts stay in sync with templates.
 *
 * Rules:
 * - Every section type MUST have an entry here (or uses DEFAULT_CONTRACT)
 * - Only slots from the registry (ColorSlot) are allowed
 * - If a section is added without a contract, it gets the default set
 */
import type { ColorSlot } from './registry';

/** Default contract for sections without an explicit declaration. */
export const DEFAULT_CONTRACT: ColorSlot[] = [
  'sectionBg', 'cardBg', 'heading', 'body', 'accent', 'btnBg', 'btnText',
];

/**
 * Explicit color slot contracts per section type.
 * Only these slots are editable and rendered for a given section.
 */
export const SECTION_CONTRACTS: Record<string, ColorSlot[]> = {
  // ─── Shared / Generic ──────────────────────────────────────────────────────
  hero:                ['sectionBg', 'heading', 'subheading', 'body', 'muted', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  servicesGrid:        ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'icon', 'accent', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'cardBorder'],
  processSteps:        ['sectionBg', 'cardBg', 'heading', 'body', 'accent', 'icon', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'cardBorder', 'divider'],
  textImage:           ['sectionBg', 'heading', 'subheading', 'body', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  faq:                 ['sectionBg', 'heading', 'subheading', 'body', 'accent', 'cardBorder', 'badgeBg', 'badgeText'],
  testimonials:        ['sectionBg', 'cardBg', 'heading', 'body', 'muted', 'quoteMark', 'ratingStar', 'btnBg', 'btnText', 'cardBorder', 'badgeBg', 'badgeText'],
  ctaBand:             ['sectionBg', 'heading', 'body', 'btnBg', 'btnText', 'onDarkHeading', 'onDarkBody'],
  contact:             ['sectionBg', 'cardBg', 'heading', 'body', 'icon', 'accent', 'btnBg', 'btnText', 'cardBorder'],
  additionalLocations: ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'muted', 'icon', 'accent', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'cardBorder'],
  team:                ['sectionBg', 'cardBg', 'heading', 'body', 'muted', 'accent', 'btnBg', 'btnText', 'cardBorder', 'badgeBg', 'badgeText'],
  galleryGrid:         ['sectionBg', 'heading', 'subheading', 'badgeBg', 'badgeText'],
  stats:               ['sectionBg', 'heading', 'body', 'statValue'],
  statsCounter:        ['sectionBg', 'heading', 'body', 'statValue'],
  logoCloud:           ['sectionBg', 'heading', 'muted'],
  logoMarquee:         ['sectionBg', 'heading', 'muted'],
  uspStrip:            ['sectionBg', 'heading', 'body', 'icon', 'accent'],
  newsPreview:         ['sectionBg', 'cardBg', 'heading', 'body', 'muted', 'accent', 'btnBg', 'btnText', 'cardBorder', 'badgeBg', 'badgeText'],
  newsGrid:            ['sectionBg', 'cardBg', 'heading', 'body', 'muted', 'accent', 'cardBorder'],
  portfolio:           ['sectionBg', 'cardBg', 'heading', 'body', 'accent', 'btnBg', 'btnText', 'cardBorder', 'badgeBg', 'badgeText'],
  serviceDetail:       ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'icon', 'accent', 'btnBg', 'btnText', 'cardBorder'],
  servicePackages:     ['sectionBg', 'cardBg', 'heading', 'body', 'accent', 'btnBg', 'btnText', 'cardBorder', 'badgeBg', 'badgeText'],
  comparisonTable:     ['sectionBg', 'cardBg', 'heading', 'body', 'accent', 'cardBorder'],
  socialProofBar:      ['sectionBg', 'cardBg', 'heading', 'body', 'muted', 'cardBorder'],
  timeline:            ['sectionBg', 'heading', 'body', 'accent', 'icon', 'divider'],
  bentoGrid:           ['sectionBg', 'cardBg', 'heading', 'body', 'accent', 'cardBorder'],
  testimonialMarquee:  ['sectionBg', 'cardBg', 'body', 'muted', 'quoteMark', 'ratingStar', 'cardBorder'],
  featureShowcase:     ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'icon', 'accent', 'cardBorder'],
  verticalTimeline:    ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'muted', 'accent', 'divider'],
  beforeAfterSlider:   ['sectionBg', 'heading', 'subheading', 'body', 'accent', 'badgeBg', 'badgeText'],
  horizontalScrollShowcase: ['sectionBg', 'heading', 'subheading', 'body', 'accent', 'btnBg', 'btnText'],
  productShowcase:     ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'muted', 'accent', 'badgeBg', 'badgeText', 'cardBorder'],
  categoryMosaic:      ['sectionBg', 'heading', 'subheading', 'body', 'accent', 'badgeBg', 'badgeText'],
  brandShowroom:       ['sectionBg', 'heading', 'subheading', 'body', 'accent', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  consultationBooking: ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'icon', 'accent', 'btnBg', 'btnText', 'cardBorder'],
  materialGallery:     ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'muted', 'accent', 'badgeBg', 'badgeText', 'cardBorder'],
  deliveryTimeline:    ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'icon', 'accent', 'divider'],
  inspirationGrid:     ['sectionBg', 'heading', 'subheading', 'body', 'accent', 'badgeBg', 'badgeText'],
  richText:            ['sectionBg', 'heading', 'body', 'accent'],
  freeText:            ['sectionBg', 'heading', 'body'],
  legalContent:        ['sectionBg', 'heading', 'body'],
  videoEmbed:          ['sectionBg', 'heading', 'subheading'],
  embed:               ['sectionBg'],
  noticeBanner:        ['sectionBg', 'heading', 'body', 'icon', 'btnBg', 'btnText'],
  collectionHero:      ['sectionBg', 'heading', 'subheading', 'body', 'badgeBg', 'badgeText'],
  collectionList:      ['sectionBg', 'cardBg', 'heading', 'body', 'muted', 'accent', 'cardBorder'],

  // ─── Premium Shared ────────────────────────────────────────────────────────
  principlesGrid:      ['sectionBg', 'cardBg', 'heading', 'body', 'eyebrow', 'icon', 'badgeBg', 'badgeText', 'cardBorder'],
  proofWall:           ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'muted', 'icon', 'quoteMark', 'ratingStar', 'statValue', 'cardBorder', 'badgeBg', 'badgeText'],
  cinematicHero:       ['sectionBg', 'heading', 'subheading', 'body', 'eyebrow', 'btnBg', 'btnText', 'btnSecondaryBg', 'btnSecondaryText', 'badgeBg', 'badgeText'],
  glowHero:            ['sectionBg', 'heading', 'subheading', 'body', 'eyebrow', 'statValue', 'btnBg', 'btnText', 'btnSecondaryBg', 'btnSecondaryText', 'badgeText'],
  immersiveCtaBanner:  ['sectionBg', 'heading', 'body', 'eyebrow', 'btnBg', 'btnText', 'onDarkHeading', 'onDarkBody'],
  editorialFeatureRail:['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'eyebrow', 'btnBg', 'btnText', 'cardBorder'],
  offerCampaignStrip:  ['sectionBg', 'heading', 'body', 'eyebrow', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  comparisonCardsPro:  ['sectionBg', 'cardBg', 'heading', 'body', 'muted', 'accent', 'check', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'cardBorder'],
  popup:               ['sectionBg', 'cardBg', 'heading', 'body', 'btnBg', 'btnText', 'btnSecondaryBg', 'btnSecondaryText'],
  menuCard:            ['sectionBg', 'cardBg', 'heading', 'subheading', 'body', 'muted', 'accent', 'badgeBg', 'badgeText', 'cardBorder', 'divider'],
  bookingWidget:       ['sectionBg', 'cardBg', 'heading', 'body', 'accent', 'btnBg', 'btnText', 'cardBorder'],

  // ─── Industry: Tradesman/Handwerk ──────────────────────────────────────────
  floristHero:         ['sectionBg', 'heading', 'body', 'eyebrow', 'btnBg', 'btnText'],
  fitnessHero:         ['sectionBg', 'heading', 'body', 'eyebrow', 'statValue', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  locationHero:        ['sectionBg', 'heading', 'body', 'eyebrow', 'btnBg', 'btnText'],

  // ─── Industry: Tattoo ──────────────────────────────────────────────────────
  styleGallery:        ['sectionBg', 'heading', 'body', 'accent', 'badgeBg', 'badgeText'],
  artistGrid:          ['sectionBg', 'cardBg', 'heading', 'body', 'accent', 'cardBorder'],
  artistHero:          ['sectionBg', 'heading', 'body', 'accent', 'btnBg', 'btnText'],
  tattooBookingCta:    ['sectionBg', 'heading', 'body', 'btnBg', 'btnText'],
  aftercareSteps:      ['sectionBg', 'cardBg', 'heading', 'body', 'icon', 'cardBorder'],
  pricingInfo:         ['sectionBg', 'heading', 'body', 'accent', 'cardBorder'],
  tattooBooking:       ['sectionBg', 'heading', 'body', 'btnBg', 'btnText'],
  flashDayBanner:      ['sectionBg', 'heading', 'body', 'accent', 'btnBg', 'btnText'],

  // ─── Industry: Photography ─────────────────────────────────────────────────
  photographerAbout:   ['sectionBg', 'heading', 'body', 'accent'],
  shootingProcess:     ['sectionBg', 'cardBg', 'heading', 'body', 'icon', 'cardBorder'],

  // ─── Industry: Real estate ─────────────────────────────────────────────────
  marketReport:        ['sectionBg', 'heading', 'body', 'accent', 'cardBg', 'cardBorder'],
  valuationCta:        ['sectionBg', 'heading', 'body', 'btnBg', 'btnText'],

  // ─── Industry: Wedding ─────────────────────────────────────────────────────
  eventSchedule:       ['sectionBg', 'heading', 'body', 'accent', 'divider'],
  faqGallery:          ['sectionBg', 'heading', 'body', 'accent', 'cardBorder'],
  giftRegistry:        ['sectionBg', 'cardBg', 'heading', 'body', 'btnBg', 'btnText'],
  rsvp:                ['sectionBg', 'heading', 'body', 'btnBg', 'btnText'],
  venueInfo:           ['sectionBg', 'heading', 'body', 'icon'],

  // ─── Industry: Cafe ────────────────────────────────────────────────────────
  dailySpecials:       ['sectionBg', 'cardBg', 'heading', 'body', 'accent', 'badgeBg', 'badgeText'],

  // ─── Shop ──────────────────────────────────────────────────────────────────
  shopProductDetail:   ['sectionBg', 'heading', 'body', 'muted', 'accent', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'cardBorder'],
  shopCart:            ['sectionBg', 'heading', 'body', 'btnBg', 'btnText', 'cardBorder'],
  shopCheckout:        ['sectionBg', 'heading', 'body', 'btnBg', 'btnText'],
};

/**
 * Get the color contract for a section type.
 * Returns the explicit contract if defined, otherwise the default.
 */
export function getSectionContract(sectionType: string): ColorSlot[] {
  return SECTION_CONTRACTS[sectionType] ?? DEFAULT_CONTRACT;
}

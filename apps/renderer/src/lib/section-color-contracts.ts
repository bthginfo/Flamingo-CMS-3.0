/**
 * Curated color contracts per section type.
 *
 * Single source of truth that maps a section.type to the EXACT list of color
 * fields that template actually uses. Entries here take precedence over the
 * legacy regex-codegen map (`SECTION_FIELDS` in section-color-editor.tsx).
 *
 * Why this exists:
 * The auto-generated `SECTION_FIELDS` was unreliable — it over-detected for
 * sections that import deep token modules (e.g. hero showed 25 fields, half
 * of them legacy duplicates) and under-detected for sections whose styling
 * lives in wrapper components (e.g. bookingWidget showed only btnBg+btnText
 * even though the form clearly has bg, headline, body, dividers, etc.).
 *
 * Editing rules:
 *  - List ONLY fields the template visibly honours. If the design has no
 *    visible "Eyebrow/Badge" element, do not include `badgeBg`/`badgeText`.
 *  - Prefer modern `--token-*` slots; only add legacy `--style-*` / `--brand-*`
 *    slots (textPrimary, brandPrimary, …) if the template still reads those
 *    vars and hasn't been migrated yet.
 *  - Sections WITHOUT an entry here fall back to the legacy SECTION_FIELDS
 *    map → safe rollout, no behaviour change for un-curated sections.
 */

import type { ColorFieldKey } from '@/app/admin/pages/[id]/section-color-editor';

export const SECTION_COLOR_CONTRACTS: Partial<Record<string, ColorFieldKey[]>> = {
  // ────────────────────────────────────────────────────────────────────────
  // Hero family — image/video heroes with dark overlays, headline + CTAs.
  // The "Salon-Hero" complaint that started this refactor.
  // ────────────────────────────────────────────────────────────────────────
  hero: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'onDarkHeading', 'onDarkBody', 'onDarkMuted', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor'],
  cinematicHero: ['sectionBg', 'onDarkHeading', 'onDarkBody', 'onDarkMuted', 'accentColor', 'iconColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'badgeBorder', 'borderColor'],
  glowHero: ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'accentColor', 'iconColor', 'onDarkHeading', 'onDarkBody', 'btnBg', 'btnText', 'badgeBg', 'badgeText'],
  collectionHero: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'onDarkHeading', 'onDarkBody', 'onDarkMuted', 'badgeBg', 'badgeText', 'borderColor'],

  // ────────────────────────────────────────────────────────────────────────
  // Booking family — forms / pickers / CTAs. The "Buchungsformular" complaint.
  // ────────────────────────────────────────────────────────────────────────
  bookingWidget: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'dividerColor', 'cardRadius', 'buttonRadius'],
  bookingSlotPicker: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'dividerColor', 'cardRadius', 'buttonRadius'],
  bookingDateRange: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'dividerColor', 'cardRadius', 'buttonRadius'],
  bookingStrip: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'borderColor', 'cardRadius', 'buttonRadius'],
  bookingCta: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'onDarkHeading', 'onDarkBody', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'buttonRadius'],
  bookingCtaPro: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'onDarkHeading', 'onDarkBody', 'onDarkMuted', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'badgeBorder', 'borderColor', 'cardRadius', 'buttonRadius'],

  // ────────────────────────────────────────────────────────────────────────
  // Bento / feature / comparison grids — card-heavy sections.
  // ────────────────────────────────────────────────────────────────────────
  bentoGrid: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'borderColor', 'cardRadius'],
  comparisonCardsPro: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'check', 'eyebrow', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'cardRadius'],
  comparisonTable: ['sectionBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'check', 'borderColor', 'dividerColor'],

  // ────────────────────────────────────────────────────────────────────────
  // Contact, CTA, Testimonials
  // ────────────────────────────────────────────────────────────────────────
  contact: ['sectionBg', 'cardBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'btnBg', 'btnText', 'badgeBg', 'badgeText', 'borderColor', 'dividerColor', 'cardRadius', 'buttonRadius'],
  immersiveCtaBanner: ['sectionBg', 'onDarkHeading', 'onDarkBody', 'onDarkMuted', 'accentColor', 'iconColor', 'btnBg', 'btnText'],
  testimonialCarousel: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'quoteMark', 'ratingStar', 'borderColor', 'cardRadius'],
  proofWall: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'quoteMark', 'ratingStar', 'eyebrow', 'borderColor', 'cardRadius'],

  // ────────────────────────────────────────────────────────────────────────
  // Before/After, Stats, Services
  // ────────────────────────────────────────────────────────────────────────
  beforeAfter: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'eyebrow', 'btnBg', 'badgeBg', 'borderColor'],
  beforeAfterSlider: ['sectionBg', 'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor'],
  beforeAfterStoryPro: ['sectionBg', 'cardBg', 'headingColor', 'bodyColor', 'mutedColor', 'iconColor', 'accentColor', 'eyebrow', 'btnBg', 'btnText', 'borderColor', 'cardRadius'],
};

export function getCuratedContractFields(sectionType: string): ColorFieldKey[] | null {
  return SECTION_COLOR_CONTRACTS[sectionType] ?? null;
}

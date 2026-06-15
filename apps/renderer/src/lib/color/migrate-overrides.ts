/**
 * LEGACY OVERRIDE MIGRATION — One-way load-time mapping.
 *
 * Maps legacy key formats (--style-*, raw CSS var names, old field names)
 * to the canonical ColorSlot keys from the registry.
 *
 * This is the ONLY place alias tables are allowed. They exist solely to
 * translate persisted data from older CMS versions into the new format.
 * No other module may use these maps for resolution.
 */
import { ALL_SLOTS, CSS_VAR_TO_SLOT, type ColorSlot } from './registry';

/**
 * Legacy key → canonical slot mapping.
 * Covers old CMS field names, raw CSS var names, and --style-* aliases.
 */
const LEGACY_KEY_MAP: Record<string, ColorSlot> = {
  // Old field names → new slots
  'headingColor': 'heading',
  'subheadingColor': 'subheading',
  'bodyColor': 'body',
  'mutedColor': 'muted',
  'iconColor': 'icon',
  'borderColor': 'cardBorder',
  'dividerColor': 'divider',

  // Legacy --style-* CSS var names → slots
  '--style-section-bg': 'sectionBg',
  '--style-card-bg': 'cardBg',
  '--style-heading-color': 'heading',
  '--style-body-color': 'body',
  '--style-text-primary': 'body',
  '--style-text-secondary': 'muted',
  '--style-text-muted': 'muted',
  '--style-accent-color': 'accent',
  '--style-accent': 'accent',
  '--style-icon-color': 'icon',
  '--style-badge-bg': 'badgeBg',
  '--style-badge-text': 'badgeText',
  '--style-badge-border': 'badgeBorder',
  '--style-border-color': 'cardBorder',
  '--style-divider-color': 'divider',
  '--style-brand': 'accent',

  // Raw --token-* var names (some stored as keys in styleOverrides)
  '--token-section-bg': 'sectionBg',
  '--token-card-bg': 'cardBg',
  '--token-card-border': 'cardBorder',
  '--token-heading': 'heading',
  '--token-subheading': 'subheading',
  '--token-body': 'body',
  '--token-muted': 'muted',
  '--token-eyebrow': 'eyebrow',
  '--token-icon': 'icon',
  '--token-stat-value': 'statValue',
  '--token-quote': 'quoteMark',
  '--token-rating-star': 'ratingStar',
  '--token-check': 'check',
  '--token-badge-bg': 'badgeBg',
  '--token-badge-text': 'badgeText',
  '--token-badge-border': 'badgeBorder',
  '--token-btn-bg': 'btnBg',
  '--token-btn-text': 'btnText',
  '--token-btn-secondary-bg': 'btnSecondaryBg',
  '--token-btn-secondary-text': 'btnSecondaryText',
  '--token-divider': 'divider',
  '--token-on-dark-heading': 'onDarkHeading',
  '--token-on-dark-body': 'onDarkBody',
  '--token-accent': 'accent',

  // Old slot key aliases
  'accentColor': 'accent',
  'btnPrimaryBg': 'btnBg',
  'btnPrimaryText': 'btnText',
};

/**
 * Migrate a raw styleOverrides object (as persisted in DB) to canonical slot keys.
 *
 * - Recognizes slot names directly (e.g. `eyebrow`, `heading`)
 * - Translates old field names (e.g. `headingColor` → `heading`)
 * - Translates CSS var names (e.g. `--style-accent-color` → `accent`)
 * - Filters out empty/null values
 * - Unknown keys are silently dropped
 */
export function migrateOverrides(
  raw: Record<string, unknown> | null | undefined,
): Partial<Record<ColorSlot, string>> {
  if (!raw) return {};

  const out: Partial<Record<ColorSlot, string>> = {};
  const slotSet = new Set<string>(ALL_SLOTS);

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value !== 'string' || !value.trim()) continue;

    let slot: ColorSlot | undefined;

    // Direct slot name match
    if (slotSet.has(key)) {
      slot = key as ColorSlot;
    }
    // Legacy key mapping
    else if (key in LEGACY_KEY_MAP) {
      slot = LEGACY_KEY_MAP[key];
    }
    // CSS var → slot lookup
    else if (key in CSS_VAR_TO_SLOT) {
      slot = CSS_VAR_TO_SLOT[key];
    }

    if (slot) {
      out[slot] = value.trim();
    }
  }

  return out;
}

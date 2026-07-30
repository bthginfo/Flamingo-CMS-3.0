/**
 * Generates CSS variable overrides from the design JSON object,
 * including auto-contrast text colors for custom backgrounds.
 */
import { getContrastColor } from './contrast';

/** Maps global design JSON keys to CSS custom property names. */
const DESIGN_TO_CSS_VARS: Record<string, string[]> = {
  textPrimary: ['--style-text-primary', '--token-heading'],
  headingColor: ['--style-text-primary', '--token-heading'],
  heading: ['--style-text-primary', '--token-heading'],
  subheading: ['--token-subheading'],
  subheadingColor: ['--token-subheading'],

  textSecondary: ['--style-text-secondary', '--token-body'],
  bodyColor: ['--style-text-secondary', '--token-body'],
  body: ['--style-text-secondary', '--token-body'],

  textMuted: ['--style-text-muted', '--token-muted'],
  mutedColor: ['--style-text-muted', '--token-muted'],
  muted: ['--style-text-muted', '--token-muted'],

  cardHeading: ['--token-card-heading'],
  cardHeadingColor: ['--token-card-heading'],
  cardBody: ['--token-card-body'],
  cardBodyColor: ['--token-card-body'],
  cardMuted: ['--token-card-muted'],
  cardMutedColor: ['--token-card-muted'],

  sectionBg: ['--style-section-bg', '--token-section-bg'],
  sectionBgAlt: ['--style-section-bg-alt', '--token-section-bg-alt'],
  cardBg: ['--style-card-bg', '--token-card-bg'],
  bgSubtle: ['--style-bg-subtle'],

  accentColor: ['--style-accent', '--token-accent'],
  accent: ['--style-accent', '--token-accent'],
  brand: ['--style-brand', '--token-accent'],
  iconColor: ['--token-icon'],
  icon: ['--token-icon'],
  cardIcon: ['--token-card-icon'],
  eyebrow: ['--token-eyebrow'],
  eyebrowColor: ['--token-eyebrow'],
  statValue: ['--token-stat-value'],
  quote: ['--token-quote'],
  ratingStar: ['--token-rating-star'],
  check: ['--token-check'],

  btnBg: ['--token-btn-bg', '--style-button-bg'],
  btnText: ['--token-btn-text', '--style-button-text'],
  btnSecondaryBg: ['--token-btn-secondary-bg'],
  btnSecondaryText: ['--token-btn-secondary-text'],
  btnSecondaryBorder: ['--token-btn-secondary-border'],

  badgeBg: ['--style-badge-bg', '--token-badge-bg'],
  badgeText: ['--style-badge-text', '--token-badge-text'],
  badgeBorder: ['--token-badge-border'],

  borderColor: ['--token-card-border'],
  cardBorder: ['--token-card-border'],
  borderStrong: ['--style-border-strong', '--token-card-border'],
  borderLight: ['--style-border-light'],
  dividerColor: ['--style-divider-color', '--token-divider'],

  imageOverlay: ['--token-image-overlay'],
  glowColor: ['--token-glow-color'],

  // Backwards-compatible storage aliases. New CMS/API payloads should use
  // headingColor/bodyColor/mutedColor; these only keep older tenants readable.
  onDarkHeading: ['--token-on-dark-heading'],
  onDarkBody: ['--token-on-dark-body'],
  onDarkMuted: ['--token-on-dark-muted'],
};

/**
 * Background keys and their corresponding auto-text CSS vars.
 * If a user sets a BG color but doesn't override text, we auto-compute a WCAG-AA text color.
 */
const BG_TO_TEXT_VAR: Record<string, { textVar: string; overrideKey: string }> = {
  sectionBg: { textVar: '--style-text-on-section', overrideKey: 'textOnSectionBg' },
  sectionBgAlt: { textVar: '--style-text-on-section-alt', overrideKey: 'textOnSectionBgAlt' },
  cardBg: { textVar: '--style-text-on-card', overrideKey: 'textOnCardBg' },
  bgSubtle: { textVar: '--style-text-on-subtle', overrideKey: 'textOnBgSubtle' },
};

export const EDITABLE_BACKGROUND_DESIGN_KEYS = [
  'sectionBg',
  'sectionBgAlt',
  'cardBg',
  'bgSubtle',
  'textOnSectionBg',
  'textOnSectionBgAlt',
  'textOnCardBg',
  'textOnBgSubtle',
] as const;

export function normalizeDesignStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const normalized: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    if (trimmed) normalized[key] = trimmed;
  }
  return normalized;
}

export function getDesignCssVars(designValue: Record<string, unknown>): Record<string, string> {
  const design = normalizeDesignStringRecord(designValue);
  const vars: Record<string, string> = {};

  // 1. Map design keys to CSS variables
  for (const [key, cssVars] of Object.entries(DESIGN_TO_CSS_VARS)) {
    if (!design[key]) continue;
    for (const cssVar of cssVars) {
      vars[cssVar] = design[key];
    }
  }

  // Do not mirror page-level text into the inverse/on-dark slots. Those slots
  // deliberately keep the contrast-safe defaults from brand-colors.ts. Only
  // explicit legacy onDark* input above may override them globally.

  // 2. Auto-compute text colors for custom backgrounds
  for (const [bgKey, { textVar, overrideKey }] of Object.entries(BG_TO_TEXT_VAR)) {
    const bgColor = design[bgKey];
    if (!bgColor) continue;

    // If user has set a text override, use it; otherwise auto-calculate
    const textOverride = design[overrideKey];
    vars[textVar] = textOverride || getContrastColor(bgColor);
  }

  // 3. If sectionBg is set but heading text is NOT manually set, auto-derive primary text
  if (design.sectionBg && !design.textPrimary && !design.headingColor && !design.heading) {
    vars['--style-text-primary'] = vars['--style-text-on-section'] || getContrastColor(design.sectionBg);
    vars['--token-heading'] = vars['--style-text-primary'];
  }

  // 4. If sectionBgAlt is set but body text is NOT set, derive secondary text from alt bg
  if (design.sectionBgAlt && !design.textSecondary && !design.bodyColor && !design.body) {
    const autoText = vars['--style-text-on-section-alt'] || getContrastColor(design.sectionBgAlt);
    // Secondary text is slightly muted version
    vars['--style-text-secondary'] = autoText === '#1a1a1a' ? '#4a5568' : '#cbd5e1';
    vars['--token-body'] = vars['--style-text-secondary'];
  }

  return vars;
}

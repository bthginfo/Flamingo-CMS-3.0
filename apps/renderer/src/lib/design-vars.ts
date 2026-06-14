/**
 * Generates CSS variable overrides from the design JSON object,
 * including auto-contrast text colors for custom backgrounds.
 */
import { getContrastColor } from './contrast';

/** Maps design JSON keys to CSS custom property names */
const DESIGN_TO_CSS_VAR: Record<string, string> = {
  textPrimary: '--style-text-primary',
  textSecondary: '--style-text-secondary',
  textMuted: '--style-text-muted',
  sectionBg: '--style-section-bg',
  sectionBgAlt: '--style-section-bg-alt',
  cardBg: '--style-card-bg',
  bgSubtle: '--style-bg-subtle',
  badgeBg: '--style-badge-bg',
  badgeText: '--style-badge-text',
  brand: '--style-brand',
  borderStrong: '--style-border-strong',
  borderLight: '--style-border-light',
  dividerColor: '--style-divider-color',
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

export function getDesignCssVars(design: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {};

  // 1. Map design keys to CSS variables
  for (const [key, cssVar] of Object.entries(DESIGN_TO_CSS_VAR)) {
    if (design[key]) vars[cssVar] = design[key];
  }

  // Mirror key semantic vars into token vars so token-first templates resolve
  // directly even when design payload still uses legacy keys.
  if (vars['--style-text-primary']) vars['--token-heading'] = vars['--style-text-primary'];
  if (vars['--style-text-secondary']) vars['--token-body'] = vars['--style-text-secondary'];
  if (vars['--style-text-muted']) vars['--token-muted'] = vars['--style-text-muted'];
  if (vars['--style-accent']) vars['--token-accent'] = vars['--style-accent'];

  // 2. Auto-compute text colors for custom backgrounds
  for (const [bgKey, { textVar, overrideKey }] of Object.entries(BG_TO_TEXT_VAR)) {
    const bgColor = design[bgKey];
    if (!bgColor) continue;

    // If user has set a text override, use it; otherwise auto-calculate
    const textOverride = design[overrideKey];
    vars[textVar] = textOverride || getContrastColor(bgColor);
  }

  // 3. If sectionBg is set but textPrimary is NOT manually set, auto-derive primary text
  if (design.sectionBg && !design.textPrimary) {
    vars['--style-text-primary'] = vars['--style-text-on-section'] || getContrastColor(design.sectionBg);
    vars['--token-heading'] = vars['--style-text-primary'];
  }

  // 4. If sectionBgAlt is set but textSecondary is NOT set, derive secondary text from alt bg
  if (design.sectionBgAlt && !design.textSecondary) {
    const autoText = vars['--style-text-on-section-alt'] || getContrastColor(design.sectionBgAlt);
    // Secondary text is slightly muted version
    vars['--style-text-secondary'] = autoText === '#1a1a1a' ? '#4a5568' : '#cbd5e1';
    vars['--token-body'] = vars['--style-text-secondary'];
  }

  return vars;
}

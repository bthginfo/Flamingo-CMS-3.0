import {
  compositeColors,
  getContrastRatio,
  parseCssColor,
  relativeColorLuminance,
  type RgbaColor,
} from './color-engine';
import { COLOR_FIELD_BY_CSS_VAR, FIELD_DEFS } from './section-color-fields';

/**
 * Color validation + WCAG contrast utilities for the AI-facing API.
 *
 * Used by:
 *   - PUT /api/v1/content/brand         (validate primary/accent + fg pairs)
 *   - PUT /api/v1/content/design        (validate sectionBg/cardBg vs text)
 *   - POST /api/v1/content/pages        (validate per-section styleOverrides)
 *   - POST /api/v1/content/publish      (final aggregated audit)
 *   - GET  /api/v1/content/validate     (on-demand pre-publish self-check)
 *
 * The AI is told to produce readable color combinations but historically
 * fails at this. This module gives the API a way to:
 *   - reject obviously malformed colors at write time
 *   - flag low-contrast pairs with actionable suggestions
 *   - auto-derive canonical text tokens when sectionBg is dark and they're
 *     missing (so the AI can't accidentally produce dark-on-dark sections)
 */

export type ColorIssueSeverity = 'error' | 'warning' | 'info';

export interface ColorIssue {
  severity: ColorIssueSeverity;
  code: string;
  message: string;
  hint?: string;
  location?: string;
  pair?: { fg?: string; bg?: string; ratio?: number; required?: number };
}

// ────────────────────────────────────────────────────────────────────────────
// Format parsing
// ────────────────────────────────────────────────────────────────────────────

const HEX3 = /^#[0-9a-f]{3}$/i;
const HEX6 = /^#[0-9a-f]{6}$/i;
const HEX8 = /^#[0-9a-f]{8}$/i;
const RGB  = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
const RGBA = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?)\s*\)$/i;

/** True if the string is a syntactically valid CSS color the API accepts. */
export function isValidColorString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v) return false;
  const supportedSyntax = v.toLowerCase() === 'transparent'
    || HEX3.test(v) || HEX6.test(v) || HEX8.test(v) || RGB.test(v) || RGBA.test(v);
  return supportedSyntax && parseCssColor(v) !== null;
}

type Rgba = RgbaColor;

/** Parse any supported color string into RGBA components (0–255, alpha 0–1). */
export function parseColor(value: string): Rgba | null {
  return isValidColorString(value) ? parseCssColor(value) : null;
}

// ────────────────────────────────────────────────────────────────────────────
// WCAG contrast (per WCAG 2.1)
// ────────────────────────────────────────────────────────────────────────────

/** Relative luminance per WCAG 2.1 (0 = black, 1 = white). */
export function relativeLuminance(color: Rgba): number {
  return relativeColorLuminance(color);
}

/**
 * WCAG contrast ratio between fg and bg after both are composited over canvas.
 */
export function contrastRatio(fg: string, bg: string, canvas = '#ffffff'): number | null {
  if (!isValidColorString(fg) || !isValidColorString(bg) || !isValidColorString(canvas)) return null;
  return getContrastRatio(fg, bg, canvas);
}

/** True if luminance < 0.5 → background is "dark" and needs on-dark text. */
export function isDarkColor(value: string): boolean {
  const c = parseColor(value);
  if (!c) return false;
  return relativeLuminance(compositeColors(c, { r: 255, g: 255, b: 255, a: 1 })) < 0.5;
}

// ────────────────────────────────────────────────────────────────────────────
// High-level validators
// ────────────────────────────────────────────────────────────────────────────

const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE  = 3.0;

/**
 * Validate a single color value. Returns an issue if malformed.
 * Used by brand + design endpoints to reject typos like "#gggggg" or "blue".
 */
export function validateColorField(location: string, value: unknown): ColorIssue | null {
  if (value === undefined || value === null || value === '') return null;
  if (!isValidColorString(value)) {
    return {
      severity: 'error',
      code: 'INVALID_COLOR_FORMAT',
      message: `${location}: not a valid color — got ${JSON.stringify(value)}`,
      hint: 'Use transparent, hex (#rrggbb or #rrggbbaa), rgb(r,g,b) or rgba(r,g,b,a). RGB channels must be 0-255 and alpha 0-1.',
      location,
    };
  }
  return null;
}

/**
 * Validate a foreground/background pair for WCAG AA contrast.
 * Returns null when the pair passes or one side is missing/invalid.
 */
export function validateContrastPair(
  location: string,
  fg: string | undefined,
  bg: string | undefined,
  opts: { large?: boolean; severity?: ColorIssueSeverity; canvas?: string } = {},
): ColorIssue | null {
  if (!fg || !bg || !isValidColorString(fg) || !isValidColorString(bg)) return null;
  const required = opts.large ? WCAG_AA_LARGE : WCAG_AA_NORMAL;
  const ratio = contrastRatio(fg, bg, opts.canvas || '#ffffff');
  if (ratio === null || ratio >= required) return null;
  return {
    severity: opts.severity ?? 'warning',
    code: 'LOW_CONTRAST',
    message: `${location}: contrast ${ratio.toFixed(2)}:1 is below WCAG AA minimum (${required}:1)`,
    hint: `Increase contrast between text (${fg}) and background (${bg}). Common fix: pick a darker text on light bg, or lighter text on dark bg.`,
    location,
    pair: { fg, bg, ratio, required },
  };
}

export function readableTextColorForBackground(
  bg: string | undefined,
  opts: { canvas?: string; large?: boolean; role?: 'heading' | 'body' | 'muted' | 'button' | 'badge' } = {},
): string {
  if (!bg || !isValidColorString(bg)) return opts.role === 'muted' ? '#334155' : '#0f172a';
  const canvas = opts.canvas || '#ffffff';
  const required = opts.large ? WCAG_AA_LARGE : WCAG_AA_NORMAL;
  const darkPalette = opts.role === 'muted'
    ? ['#e2e8f0', '#f8fafc', '#ffffff']
    : ['#ffffff', '#f8fafc', '#e2e8f0'];
  const lightPalette = opts.role === 'muted'
    ? ['#334155', '#1f2937', '#0f172a']
    : ['#0f172a', '#111827', '#020617'];
  const candidates = isDarkColor(bg)
    ? [...darkPalette, ...lightPalette]
    : [...lightPalette, ...darkPalette];
  let best = candidates[0];
  let bestRatio = -1;
  for (const candidate of candidates) {
    const ratio = contrastRatio(candidate, bg, canvas) ?? 0;
    if (ratio >= required) return candidate;
    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
  }
  return best;
}

function hasReadableContrast(
  fg: string | undefined,
  bg: string | undefined,
  opts: { canvas?: string; large?: boolean } = {},
): boolean {
  if (!fg || !bg || !isValidColorString(fg) || !isValidColorString(bg)) return false;
  const required = opts.large ? WCAG_AA_LARGE : WCAG_AA_NORMAL;
  const ratio = contrastRatio(fg, bg, opts.canvas || '#ffffff');
  return ratio !== null && ratio >= required;
}

// ────────────────────────────────────────────────────────────────────────────
// Brand payload validation
// ────────────────────────────────────────────────────────────────────────────

const BRAND_COLOR_FIELDS = [
  'primaryColor', 'secondaryColor', 'accentColor',
  'pageBg', 'sectionBg', 'sectionBgAlt', 'cardBg',
  'topBarColor', 'footerColor', 'footerLinkColor', 'footerTextColor',
  'navLinkColor', 'navBgColor', 'navBrandColor', 'navLogoColor',
  'headingColor', 'bodyTextColor', 'mutedTextColor', 'linkColor', 'linkHoverColor',
  'btnPrimaryBg', 'btnPrimaryText',
  'btnSecondaryBg', 'btnSecondaryText', 'btnSecondaryBorder',
  'btnOutlineBg', 'btnOutlineText', 'btnOutlineBorder',
  'badgeBg', 'badgeText', 'badgeBorder',
  'cardBorder', 'borderColor', 'dividerColor', 'iconColor',
] as const;

export function validateBrandPayload(brand: Record<string, unknown>): ColorIssue[] {
  const issues: ColorIssue[] = [];
  for (const f of BRAND_COLOR_FIELDS) {
    const v = brand[f];
    if (v !== undefined && v !== null && v !== '') {
      const err = validateColorField(`brand.${f}`, v);
      if (err) issues.push(err);
    }
  }
  // Cross-field contrast checks use the actual canvas for translucent surfaces.
  const pageCanvas = typeof brand.pageBg === 'string' ? brand.pageBg : '#ffffff';
  const sectionCanvas = typeof brand.sectionBg === 'string' ? brand.sectionBg : pageCanvas;
  const pairs: Array<[string, string, string]> = [
    ['headingColor', 'sectionBg', pageCanvas],
    ['bodyTextColor', 'sectionBg', pageCanvas],
    ['mutedTextColor', 'sectionBg', pageCanvas],
    ['headingColor', 'cardBg', sectionCanvas],
    ['bodyTextColor', 'cardBg', sectionCanvas],
    ['linkColor', 'pageBg', '#ffffff'],
    ['footerTextColor', 'footerColor', pageCanvas],
    ['footerLinkColor', 'footerColor', pageCanvas],
    ['navLinkColor', 'navBgColor', pageCanvas],
    ['navBrandColor', 'navBgColor', pageCanvas],
    ['navLogoColor', 'navBgColor', pageCanvas],
    ['btnPrimaryText', 'btnPrimaryBg', sectionCanvas],
    ['btnSecondaryText', 'btnSecondaryBg', sectionCanvas],
    ['btnOutlineText', 'btnOutlineBg', sectionCanvas],
    ['badgeText', 'badgeBg', sectionCanvas],
  ];
  for (const [fgKey, bgKey, canvas] of pairs) {
    const fg = brand[fgKey]; const bg = brand[bgKey];
    if (typeof fg === 'string' && typeof bg === 'string') {
      const issue = validateContrastPair(`brand.${fgKey}↔brand.${bgKey}`, fg, bg, { canvas });
      if (issue) issues.push(issue);
    }
  }
  return issues;
}

// ────────────────────────────────────────────────────────────────────────────
// Design payload validation
// ────────────────────────────────────────────────────────────────────────────

const DESIGN_COLOR_FIELDS = [
  'sectionBg', 'sectionBgAlt', 'cardBg', 'cardBorder',
  'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor',
  'accentColor', 'iconColor', 'borderColor',
  'heading', 'subheading', 'body', 'muted',
  'brand', 'accent', 'icon',
  'btnBg', 'btnText',
  'badgeBg', 'badgeText', 'badgeBorder',
  'dividerColor',
  'eyebrow', 'statValue', 'quote', 'quoteMark', 'ratingStar', 'check',
  'imageOverlay',
] as const;

const LEGACY_INTERNAL_DESIGN_COLOR_FIELDS = [
  'onDarkHeading', 'onDarkBody', 'onDarkMuted',
] as const;

function pickDesignValue(design: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = design[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return undefined;
}

function pickInheritedValue(
  overrides: Record<string, unknown>,
  overrideKeys: string[],
  inherited: Record<string, unknown> | undefined,
  inheritedKeys: string[],
): string | undefined {
  return pickFirst(overrides, overrideKeys) || (inherited ? pickDesignValue(inherited, inheritedKeys) : undefined);
}

export function validateDesignPayload(design: Record<string, unknown>): ColorIssue[] {
  const issues: ColorIssue[] = [];
  for (const f of [...DESIGN_COLOR_FIELDS, ...LEGACY_INTERNAL_DESIGN_COLOR_FIELDS]) {
    const v = design[f];
    if (v !== undefined && v !== null && v !== '') {
      const err = validateColorField(`design.${f}`, v);
      if (err) issues.push(err);
    }
  }
  // Cross-field contrast
  const sectionBg = pickDesignValue(design, ['sectionBg']);
  const cardBg    = pickDesignValue(design, ['cardBg']);
  const heading   = pickDesignValue(design, ['headingColor', 'heading', 'textPrimary', 'onDarkHeading']);
  const body      = pickDesignValue(design, ['bodyColor', 'body', 'textSecondary', 'onDarkBody']);
  const muted     = pickDesignValue(design, ['mutedColor', 'muted', 'textMuted', 'onDarkMuted']);
  const btnBg     = typeof design.btnBg     === 'string' ? design.btnBg     : undefined;
  const btnText   = typeof design.btnText   === 'string' ? design.btnText   : undefined;
  const badgeBg   = typeof design.badgeBg   === 'string' ? design.badgeBg   : undefined;
  const badgeText = typeof design.badgeText === 'string' ? design.badgeText : undefined;

  const sectionCanvas = '#ffffff';
  const cardCanvas = sectionBg || sectionCanvas;
  const pairs: Array<[string, string | undefined, string | undefined, { large?: boolean; canvas?: string }]> = [
    ['design.heading on design.sectionBg',   heading, sectionBg, { large: true, canvas: sectionCanvas }],
    ['design.body on design.sectionBg',      body,    sectionBg, { large: false, canvas: sectionCanvas }],
    ['design.muted on design.sectionBg',     muted,   sectionBg, { large: false, canvas: sectionCanvas }],
    ['design.heading on design.cardBg',      heading, cardBg,    { large: true, canvas: cardCanvas }],
    ['design.body on design.cardBg',         body,    cardBg,    { large: false, canvas: cardCanvas }],
    ['design.btnText on design.btnBg',       btnText, btnBg,     { large: false, canvas: cardCanvas }],
    ['design.badgeText on design.badgeBg',   badgeText, badgeBg, { large: false, canvas: cardCanvas }],
  ];
  for (const [loc, fg, bg, opts] of pairs) {
    const issue = validateContrastPair(loc, fg, bg, opts);
    if (issue) issues.push(issue);
  }

  // Critical structural check: dark sectionBg without canonical text colors.
  // Legacy onDark* values are accepted only as backwards-compatible input.
  if (sectionBg && isDarkColor(sectionBg)) {
    const missing: string[] = [];
    if (!pickDesignValue(design, ['headingColor', 'heading', 'textPrimary', 'onDarkHeading'])) missing.push('headingColor');
    if (!pickDesignValue(design, ['bodyColor', 'body', 'textSecondary', 'onDarkBody'])) missing.push('bodyColor');
    if (!pickDesignValue(design, ['mutedColor', 'muted', 'textMuted', 'onDarkMuted'])) missing.push('mutedColor');
    if (missing.length) {
      issues.push({
        severity: 'warning',
        code: 'DARK_BG_MISSING_TEXT',
        message: `design.sectionBg=${sectionBg} is dark — canonical text colors missing: ${missing.join(', ')}`,
        hint: 'Set headingColor, bodyColor and mutedColor to readable light values. Do not send onDark* fields in new payloads.',
        location: 'design',
      });
    }
  }
  return issues;
}

// ────────────────────────────────────────────────────────────────────────────
// Per-section styleOverrides validation
// ────────────────────────────────────────────────────────────────────────────

const STYLE_OVERRIDE_BG_KEYS = new Set([
  '--token-section-bg', '--style-section-bg',
  '--token-card-bg', '--style-card-bg',
]);

const STYLE_OVERRIDE_TEXT_KEYS = new Set([
  '--token-heading', '--style-heading-color',
  '--token-body', '--style-body-color',
  '--token-muted', '--style-text-muted',
]);

export function validateSectionStyleOverrides(
  sectionIdx: number, sectionType: string,
  overrides: Record<string, unknown>,
  inheritedTokens?: Record<string, unknown>,
): ColorIssue[] {
  const issues: ColorIssue[] = [];
  for (const [key, value] of Object.entries(overrides)) {
    if (typeof value !== 'string') continue;
    const field = COLOR_FIELD_BY_CSS_VAR[key];
    if (field && FIELD_DEFS[field].type === 'size') continue;
    if (!isValidColorString(value)) {
      // Skip non-color tokens (sizes, radii, weights) — they don't go through here in practice
      if (key.includes('radius') || key.includes('weight') || key.includes('tracking') || key.includes('shadow')) continue;
      issues.push({
        severity: 'error',
        code: 'INVALID_COLOR_FORMAT',
        message: `sections[${sectionIdx}] (${sectionType}): styleOverrides[${key}] is not a valid color (${value})`,
        hint: 'Use hex or rgba(). Slot enum names like "primary" are not colors.',
        location: `sections[${sectionIdx}].styleOverrides[${key}]`,
      });
    }
  }
  // Contrast: heading/body over section/card bg
  const sectionBg = pickInheritedValue(overrides, ['--token-section-bg', '--style-section-bg'], inheritedTokens, ['sectionBg', 'pageBg']);
  const cardBg    = pickInheritedValue(overrides, ['--token-card-bg', '--style-card-bg'], inheritedTokens, ['cardBg', 'sectionBg']);
  const heading   = pickInheritedValue(overrides, ['--token-heading', '--style-heading-color'], inheritedTokens, ['headingColor', 'heading', 'textPrimary', 'onDarkHeading']);
  const body      = pickInheritedValue(overrides, ['--token-body', '--style-body-color'], inheritedTokens, ['bodyColor', 'body', 'bodyTextColor', 'textSecondary', 'onDarkBody']);
  const muted     = pickInheritedValue(overrides, ['--token-muted', '--style-text-muted'], inheritedTokens, ['mutedColor', 'muted', 'mutedTextColor', 'textMuted', 'onDarkMuted']);
  const cardHeading = pickInheritedValue(overrides, ['--token-card-heading'], inheritedTokens, ['cardHeadingColor']) || heading;
  const cardBody = pickInheritedValue(overrides, ['--token-card-body'], inheritedTokens, ['cardBodyColor']) || body;
  const cardMuted = pickInheritedValue(overrides, ['--token-card-muted'], inheritedTokens, ['cardMutedColor']) || muted;
  const btnBg     = pickInheritedValue(overrides, ['--token-btn-bg', '--style-button-bg', '--brand-btn-bg'], inheritedTokens, ['btnBg', 'btnPrimaryBg']);
  const btnText   = pickInheritedValue(overrides, ['--token-btn-text', '--style-button-text', '--brand-btn-text'], inheritedTokens, ['btnText', 'btnPrimaryText']);
  const badgeBg   = pickInheritedValue(overrides, ['--token-badge-bg'], inheritedTokens, ['badgeBg']);
  const badgeText = pickInheritedValue(overrides, ['--token-badge-text'], inheritedTokens, ['badgeText']);

  const sectionCanvas = '#ffffff';
  const cardCanvas = sectionBg || sectionCanvas;
  const pairs: Array<[string, string | undefined, string | undefined, { large?: boolean; canvas?: string }]> = [
    [`sections[${sectionIdx}].heading on .sectionBg`, heading, sectionBg, { large: true, canvas: sectionCanvas }],
    [`sections[${sectionIdx}].body on .sectionBg`,    body,    sectionBg, { large: false, canvas: sectionCanvas }],
    [`sections[${sectionIdx}].muted on .sectionBg`,   muted,   sectionBg, { large: false, canvas: sectionCanvas }],
    [`sections[${sectionIdx}].cardHeading on .cardBg`, cardHeading, cardBg, { large: true, canvas: cardCanvas }],
    [`sections[${sectionIdx}].cardBody on .cardBg`, cardBody, cardBg, { large: false, canvas: cardCanvas }],
    [`sections[${sectionIdx}].cardMuted on .cardBg`, cardMuted, cardBg, { large: false, canvas: cardCanvas }],
    [`sections[${sectionIdx}].btnText on .btnBg`, btnText, btnBg, { large: false, canvas: cardCanvas }],
    [`sections[${sectionIdx}].badgeText on .badgeBg`, badgeText, badgeBg, { large: false, canvas: cardCanvas }],
  ];
  for (const [loc, fg, bg, opts] of pairs) {
    const issue = validateContrastPair(loc, fg, bg, opts);
    if (issue) issues.push(issue);
  }

  // Dark section bg without canonical text tokens.
  if (sectionBg && isDarkColor(sectionBg) && Object.keys(overrides).length > 0) {
    const hasAnyText = heading || body;
    if (!hasAnyText) {
      issues.push({
        severity: 'warning',
        code: 'DARK_BG_NO_TEXT_OVERRIDE',
        message: `sections[${sectionIdx}] (${sectionType}): section background ${sectionBg} is dark but no text color override set`,
        hint: 'Add --token-heading and --token-body in readable light values to prevent unreadable dark-on-dark text.',
        location: `sections[${sectionIdx}].styleOverrides`,
      });
    }
  }
  return issues;
}

function pickFirst(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return undefined;
}

// ────────────────────────────────────────────────────────────────────────────
// Auto-fix: derive missing canonical text tokens on dark backgrounds
// ────────────────────────────────────────────────────────────────────────────

/**
 * If backgrounds are set and canonical foreground colors are missing, fill them
 * with sensible readable defaults. Existing foreground overrides are preserved:
 * bad manual choices are reported by validation instead of being silently
 * replaced.
 * Returns the (possibly modified) design payload + a list of changes applied.
 */
export function autoFixDesignReadable(design: Record<string, unknown>): {
  design: Record<string, unknown>;
  applied: string[];
} {
  const applied: string[] = [];
  const out = { ...design };
  const sectionBg = pickDesignValue(out, ['sectionBg']);
  const cardBg = pickDesignValue(out, ['cardBg']);
  const buttonBg = pickDesignValue(out, ['btnBg', 'btnPrimaryBg']);
  const badgeBg = pickDesignValue(out, ['badgeBg']);

  if (sectionBg) {
    const heading = readableTextColorForBackground(sectionBg, { large: true, role: 'heading' });
    const body = readableTextColorForBackground(sectionBg, { role: 'body' });
    const muted = readableTextColorForBackground(sectionBg, { role: 'muted' });
    if (!pickDesignValue(out, ['headingColor', 'heading', 'textPrimary'])) {
      out.headingColor = heading;
      applied.push(`headingColor=${heading}`);
    }
    if (!pickDesignValue(out, ['bodyColor', 'body', 'textSecondary'])) {
      out.bodyColor = body;
      applied.push(`bodyColor=${body}`);
    }
    if (!pickDesignValue(out, ['mutedColor', 'muted', 'textMuted'])) {
      out.mutedColor = muted;
      applied.push(`mutedColor=${muted}`);
    }
    if (!out.onDarkHeading) out.onDarkHeading = pickDesignValue(out, ['headingColor', 'heading', 'textPrimary']);
    if (!out.onDarkBody) out.onDarkBody = pickDesignValue(out, ['bodyColor', 'body', 'textSecondary']);
    if (!out.onDarkMuted) out.onDarkMuted = pickDesignValue(out, ['mutedColor', 'muted', 'textMuted']);
  }
  if (cardBg) {
    const cardHeading = readableTextColorForBackground(cardBg, { canvas: sectionBg || '#ffffff', large: true, role: 'heading' });
    const cardBody = readableTextColorForBackground(cardBg, { canvas: sectionBg || '#ffffff', role: 'body' });
    const cardMuted = readableTextColorForBackground(cardBg, { canvas: sectionBg || '#ffffff', role: 'muted' });
    if (!pickDesignValue(out, ['cardHeadingColor'])) {
      out.cardHeadingColor = cardHeading;
      applied.push(`cardHeadingColor=${cardHeading}`);
    }
    if (!pickDesignValue(out, ['cardBodyColor'])) {
      out.cardBodyColor = cardBody;
      applied.push(`cardBodyColor=${cardBody}`);
    }
    if (!pickDesignValue(out, ['cardMutedColor'])) {
      out.cardMutedColor = cardMuted;
      applied.push(`cardMutedColor=${cardMuted}`);
    }
  }
  if (buttonBg && !pickDesignValue(out, ['btnText', 'btnPrimaryText'])) {
    const btnText = readableTextColorForBackground(buttonBg, { canvas: cardBg || sectionBg || '#ffffff', role: 'button' });
    out.btnText = btnText;
    applied.push(`btnText=${btnText}`);
  }
  if (badgeBg && !pickDesignValue(out, ['badgeText'])) {
    const badgeText = readableTextColorForBackground(badgeBg, { canvas: cardBg || sectionBg || '#ffffff', role: 'badge' });
    out.badgeText = badgeText;
    applied.push(`badgeText=${badgeText}`);
  }
  return { design: out, applied };
}

export const autoFixDesignOnDark = autoFixDesignReadable;

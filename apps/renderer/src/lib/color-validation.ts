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
 *   - auto-derive on-dark text tokens when sectionBg is dark and they're
 *     missing (so the AI can't accidentally produce white-on-white sections)
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
const RGBA = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?(?:\.\d+)?)\s*\)$/i;

/** True if the string is a syntactically valid CSS color the API accepts. */
export function isValidColorString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v) return false;
  return HEX3.test(v) || HEX6.test(v) || HEX8.test(v) || RGB.test(v) || RGBA.test(v);
}

interface Rgba { r: number; g: number; b: number; a: number; }

/** Parse any supported color string into RGBA components (0–255, alpha 0–1). */
export function parseColor(value: string): Rgba | null {
  const v = value.trim();
  if (HEX3.test(v)) {
    const r = parseInt(v[1] + v[1], 16);
    const g = parseInt(v[2] + v[2], 16);
    const b = parseInt(v[3] + v[3], 16);
    return { r, g, b, a: 1 };
  }
  if (HEX6.test(v)) {
    return { r: parseInt(v.slice(1,3),16), g: parseInt(v.slice(3,5),16), b: parseInt(v.slice(5,7),16), a: 1 };
  }
  if (HEX8.test(v)) {
    return {
      r: parseInt(v.slice(1,3),16), g: parseInt(v.slice(3,5),16), b: parseInt(v.slice(5,7),16),
      a: parseInt(v.slice(7,9),16) / 255,
    };
  }
  const rgb = v.match(RGB);
  if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a: 1 };
  const rgba = v.match(RGBA);
  if (rgba) return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: +rgba[4] };
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// WCAG contrast (per WCAG 2.1)
// ────────────────────────────────────────────────────────────────────────────

function linearChannel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** Relative luminance per WCAG 2.1 (0 = black, 1 = white). */
export function relativeLuminance(color: Rgba): number {
  return 0.2126 * linearChannel(color.r) + 0.7152 * linearChannel(color.g) + 0.0722 * linearChannel(color.b);
}

/**
 * Composite a foreground over an opaque background, returning the resulting
 * opaque color. Translucent colors are flattened against `bgFallback`.
 */
function composite(over: Rgba, under: Rgba): Rgba {
  if (over.a >= 0.999) return over;
  const a = over.a;
  return {
    r: Math.round(over.r * a + under.r * (1 - a)),
    g: Math.round(over.g * a + under.g * (1 - a)),
    b: Math.round(over.b * a + under.b * (1 - a)),
    a: 1,
  };
}

/**
 * WCAG contrast ratio between fg and bg. Translucent fg is flattened over bg
 * first so the ratio reflects what the user actually sees.
 */
export function contrastRatio(fg: string, bg: string): number | null {
  const f = parseColor(fg); const b = parseColor(bg);
  if (!f || !b) return null;
  const flat = composite(f, b);
  const Lf = relativeLuminance(flat);
  const Lb = relativeLuminance(b);
  const lighter = Math.max(Lf, Lb);
  const darker = Math.min(Lf, Lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** True if luminance < 0.5 → background is "dark" and needs on-dark text. */
export function isDarkColor(value: string): boolean {
  const c = parseColor(value);
  if (!c) return false;
  return relativeLuminance(composite(c, { r: 255, g: 255, b: 255, a: 1 })) < 0.5;
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
      hint: 'Use hex (#rrggbb or #rrggbbaa), rgb(r,g,b) or rgba(r,g,b,a). Examples: "#1a5276", "#ffffffcc", "rgba(0,0,0,0.6)".',
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
  opts: { large?: boolean; severity?: ColorIssueSeverity } = {},
): ColorIssue | null {
  if (!fg || !bg || !isValidColorString(fg) || !isValidColorString(bg)) return null;
  const required = opts.large ? WCAG_AA_LARGE : WCAG_AA_NORMAL;
  const ratio = contrastRatio(fg, bg);
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

// ────────────────────────────────────────────────────────────────────────────
// Brand payload validation
// ────────────────────────────────────────────────────────────────────────────

const BRAND_COLOR_FIELDS = [
  'primaryColor', 'secondaryColor', 'accentColor',
  'topBarColor', 'footerColor',
  'headingColor', 'bodyTextColor', 'mutedTextColor', 'linkColor',
  'btnPrimaryBg', 'btnPrimaryText', 'btnSecondaryBg', 'btnSecondaryText',
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
  // Cross-field contrast checks for known pairs
  const pairs: Array<[string, string]> = [
    ['btnPrimaryText', 'btnPrimaryBg'],
    ['btnSecondaryText', 'btnSecondaryBg'],
  ];
  for (const [fgKey, bgKey] of pairs) {
    const fg = brand[fgKey]; const bg = brand[bgKey];
    if (typeof fg === 'string' && typeof bg === 'string') {
      const issue = validateContrastPair(`brand.${fgKey}↔brand.${bgKey}`, fg, bg);
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
  'onDarkHeading', 'onDarkBody', 'onDarkMuted',
] as const;

function pickDesignValue(design: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = design[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return undefined;
}

export function validateDesignPayload(design: Record<string, unknown>): ColorIssue[] {
  const issues: ColorIssue[] = [];
  for (const f of DESIGN_COLOR_FIELDS) {
    const v = design[f];
    if (v !== undefined && v !== null && v !== '') {
      const err = validateColorField(`design.${f}`, v);
      if (err) issues.push(err);
    }
  }
  // Cross-field contrast
  const sectionBg = pickDesignValue(design, ['sectionBg']);
  const cardBg    = pickDesignValue(design, ['cardBg']);
  const heading   = pickDesignValue(design, ['headingColor', 'heading']);
  const body      = pickDesignValue(design, ['bodyColor', 'body']);
  const muted     = pickDesignValue(design, ['mutedColor', 'muted']);
  const btnBg     = typeof design.btnBg     === 'string' ? design.btnBg     : undefined;
  const btnText   = typeof design.btnText   === 'string' ? design.btnText   : undefined;
  const badgeBg   = typeof design.badgeBg   === 'string' ? design.badgeBg   : undefined;
  const badgeText = typeof design.badgeText === 'string' ? design.badgeText : undefined;

  const pairs: Array<[string, string | undefined, string | undefined, { large?: boolean }]> = [
    ['design.heading on design.sectionBg',   heading, sectionBg, { large: true  }],
    ['design.body on design.sectionBg',      body,    sectionBg, { large: false }],
    ['design.muted on design.sectionBg',     muted,   sectionBg, { large: false }],
    ['design.heading on design.cardBg',      heading, cardBg,    { large: true  }],
    ['design.body on design.cardBg',         body,    cardBg,    { large: false }],
    ['design.btnText on design.btnBg',       btnText, btnBg,     { large: false }],
    ['design.badgeText on design.badgeBg',   badgeText, badgeBg, { large: false }],
  ];
  for (const [loc, fg, bg, opts] of pairs) {
    const issue = validateContrastPair(loc, fg, bg, opts);
    if (issue) issues.push(issue);
  }

  // Critical structural check: dark sectionBg without onDark text tokens
  if (sectionBg && isDarkColor(sectionBg)) {
    const missing: string[] = [];
    if (!design.onDarkHeading) missing.push('onDarkHeading');
    if (!design.onDarkBody)    missing.push('onDarkBody');
    if (!design.onDarkMuted)   missing.push('onDarkMuted');
    if (missing.length) {
      issues.push({
        severity: 'warning',
        code: 'DARK_BG_MISSING_ONDARK',
        message: `design.sectionBg=${sectionBg} is dark — onDark text tokens missing: ${missing.join(', ')}`,
        hint: 'Set onDarkHeading (#ffffff or near-white), onDarkBody (#e5e5e5 or rgba(255,255,255,0.85)), onDarkMuted (rgba(255,255,255,0.6)) so text on dark sections stays readable.',
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
): ColorIssue[] {
  const issues: ColorIssue[] = [];
  for (const [key, value] of Object.entries(overrides)) {
    if (typeof value !== 'string') continue;
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
  const sectionBg = pickFirst(overrides, ['--token-section-bg', '--style-section-bg']);
  const cardBg    = pickFirst(overrides, ['--token-card-bg', '--style-card-bg']);
  const heading   = pickFirst(overrides, ['--token-heading', '--style-heading-color']);
  const body      = pickFirst(overrides, ['--token-body', '--style-body-color']);
  const btnBg     = pickFirst(overrides, ['--token-btn-bg', '--style-button-bg', '--brand-btn-bg']);
  const btnText   = pickFirst(overrides, ['--token-btn-text', '--style-button-text', '--brand-btn-text']);

  const pairs: Array<[string, string | undefined, string | undefined, { large?: boolean }]> = [
    [`sections[${sectionIdx}].heading on .sectionBg`, heading, sectionBg, { large: true }],
    [`sections[${sectionIdx}].body on .sectionBg`,    body,    sectionBg, { large: false }],
    [`sections[${sectionIdx}].heading on .cardBg`,    heading, cardBg,    { large: true }],
    [`sections[${sectionIdx}].body on .cardBg`,       body,    cardBg,    { large: false }],
    [`sections[${sectionIdx}].btnText on .btnBg`,     btnText, btnBg,     { large: false }],
  ];
  for (const [loc, fg, bg, opts] of pairs) {
    const issue = validateContrastPair(loc, fg, bg, opts);
    if (issue) issues.push(issue);
  }

  // Dark section bg without onDark tokens
  if (sectionBg && isDarkColor(sectionBg)) {
    const hasAnyText = heading || body || pickFirst(overrides, ['--token-on-dark-heading']);
    if (!hasAnyText) {
      issues.push({
        severity: 'warning',
        code: 'DARK_BG_NO_TEXT_OVERRIDE',
        message: `sections[${sectionIdx}] (${sectionType}): section background ${sectionBg} is dark but no text color override set`,
        hint: 'Add --token-on-dark-heading and --token-on-dark-body (or --token-heading + --token-body in light values) to prevent unreadable dark-on-dark text.',
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
// Auto-fix: derive missing onDark tokens on dark backgrounds
// ────────────────────────────────────────────────────────────────────────────

/**
 * If `design.sectionBg` is dark and the on-dark tokens are missing, fill them
 * with sensible defaults so AI-generated sites can't produce white-on-white.
 * Returns the (possibly modified) design payload + a list of changes applied.
 */
export function autoFixDesignOnDark(design: Record<string, unknown>): {
  design: Record<string, unknown>;
  applied: string[];
} {
  const applied: string[] = [];
  const out = { ...design };
  const sectionBg = pickDesignValue(out, ['sectionBg']);
  if (sectionBg && isDarkColor(sectionBg)) {
    if (!out.onDarkHeading) { out.onDarkHeading = '#ffffff';                    applied.push('onDarkHeading=#ffffff'); }
    if (!out.onDarkBody)    { out.onDarkBody    = 'rgba(255,255,255,0.85)';     applied.push('onDarkBody=rgba(255,255,255,0.85)'); }
    if (!out.onDarkMuted)   { out.onDarkMuted   = 'rgba(255,255,255,0.6)';      applied.push('onDarkMuted=rgba(255,255,255,0.6)'); }
  }
  return { design: out, applied };
}

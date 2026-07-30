import { isValidColorString, readableTextColorForBackground } from './color-validation';
import {
  COLOR_FIELD_KEYS,
  COLOR_FIELD_BY_CSS_VAR,
  FIELD_DEFS,
  canonicalColorField,
  getCssVarsForColorField,
  type ColorFieldKey,
} from './section-color-fields';
import { getFieldsForSection } from './section-color-resolver';

const STYLE_OVERRIDE_KEY_TO_FIELD = Object.fromEntries(
  COLOR_FIELD_KEYS.map((key) => [key, canonicalColorField(key)]),
) as Record<string, ColorFieldKey>;

const STYLE_OVERRIDE_CSS_VAR_TO_FIELD = Object.fromEntries(
  COLOR_FIELD_KEYS.flatMap((key) => {
    const field = canonicalColorField(key);
    return getCssVarsForColorField(field).map((cssVar) => [cssVar, field]);
  }),
) as Record<string, ColorFieldKey>;

const SAFE_VAR_RE = /^var\(--[a-z0-9-]+\)$/i;
const SAFE_GLOBAL_KEYWORD_RE = /^(?:inherit|initial|unset)$/i;
const SAFE_COLOR_KEYWORD_RE = /^(?:transparent|currentcolor)$/i;
const SAFE_DIMENSION_RE = /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw)?$/i;
const SAFE_NON_NEGATIVE_DIMENSION_RE = /^(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw)?$/i;
const SAFE_FONT_WEIGHT_RE = /^(?:[1-9]\d{0,2}|1000|normal|bold|bolder|lighter)$/i;

const SHADOW_LENGTH = String.raw`-?(?:\d+|\d*\.\d+)(?:px|rem|em)?`;
const SHADOW_COLOR = String.raw`(?:#[0-9a-f]{3}(?:[0-9a-f]{3})?(?:[0-9a-f]{2})?|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*[01]?(?:\.\d+)?)?\s*\)|var\(--[a-z0-9-]+\)|transparent|currentcolor)`;
const SAFE_BOX_SHADOW_RE = new RegExp(
  String.raw`^(?:(?:inset\s+)?${SHADOW_LENGTH}\s+${SHADOW_LENGTH}(?:\s+${SHADOW_LENGTH})?(?:\s+${SHADOW_LENGTH})?(?:\s+${SHADOW_COLOR})?)(?:\s*,\s*(?:inset\s+)?${SHADOW_LENGTH}\s+${SHADOW_LENGTH}(?:\s+${SHADOW_LENGTH})?(?:\s+${SHADOW_LENGTH})?(?:\s+${SHADOW_COLOR})?)*$`,
  'i',
);

function fieldForInputKey(key: string): ColorFieldKey | undefined {
  return key.startsWith('--')
    ? STYLE_OVERRIDE_CSS_VAR_TO_FIELD[key] || (COLOR_FIELD_BY_CSS_VAR[key]
      ? canonicalColorField(COLOR_FIELD_BY_CSS_VAR[key])
      : undefined)
    : STYLE_OVERRIDE_KEY_TO_FIELD[key];
}

function isSafeColorValue(value: string): boolean {
  return isValidColorString(value)
    || SAFE_COLOR_KEYWORD_RE.test(value)
    || SAFE_GLOBAL_KEYWORD_RE.test(value)
    || SAFE_VAR_RE.test(value);
}

/**
 * Validate a value against the actual CSS property represented by a token.
 * This is deliberately narrower than general CSS: style overrides never need
 * functions, URLs, declarations or arbitrary identifiers.
 */
export function isSafeStyleOverrideValue(field: ColorFieldKey, value: string): boolean {
  const normalized = value.trim();
  if (!normalized || normalized.length > 180) return false;
  if (/[;{}<>\\\u0000-\u001f\u007f]/.test(normalized)) return false;
  if (/(?:url\s*\(|@import|expression\s*\(|javascript:|data:|\/\*)/i.test(normalized)) return false;

  if (FIELD_DEFS[field].type !== 'size') return isSafeColorValue(normalized);
  if (SAFE_GLOBAL_KEYWORD_RE.test(normalized) || SAFE_VAR_RE.test(normalized)) return true;

  switch (field) {
    case 'cardRadius':
    case 'buttonRadius':
      return SAFE_NON_NEGATIVE_DIMENSION_RE.test(normalized);
    case 'headingTracking':
      return SAFE_DIMENSION_RE.test(normalized);
    case 'headingWeight':
      return SAFE_FONT_WEIGHT_RE.test(normalized);
    case 'cardShadow':
      return normalized === 'none' || SAFE_BOX_SHADOW_RE.test(normalized);
    default:
      return false;
  }
}

function allowedStyleOverrideKeysForSection(sectionType: string, industry?: string, definitionKey?: string | null): Set<string> {
  const allowed = new Set<string>();
  const allowedFields = new Set(getFieldsForSection(sectionType, industry, definitionKey).map(canonicalColorField));
  for (const [key, field] of Object.entries(STYLE_OVERRIDE_KEY_TO_FIELD)) {
    if (allowedFields.has(field)) allowed.add(key);
  }
  for (const [key, field] of Object.entries(STYLE_OVERRIDE_CSS_VAR_TO_FIELD)) {
    if (allowedFields.has(field)) allowed.add(key);
  }
  for (const field of allowedFields) {
    allowed.add(field);
    allowed.add(FIELD_DEFS[field].cssVar);
  }
  return allowed;
}

export interface StyleOverrideNormalizationIssue {
  location: string;
  key: string;
  value: unknown;
  reason: 'unknown_key' | 'section_key_not_allowed' | 'invalid_type' | 'unsafe_value';
  message: string;
}

export interface StyleOverrideNormalizationResult {
  styleOverrides: Record<string, string> | null;
  issues: StyleOverrideNormalizationIssue[];
}

function normalizeStyleOverridesInternal(
  styleOverrides: unknown,
  location: string,
  sectionType?: string,
  industry?: string,
  definitionKey?: string | null,
): StyleOverrideNormalizationResult {
  const issues: StyleOverrideNormalizationIssue[] = [];
  if (!styleOverrides || typeof styleOverrides !== 'object' || Array.isArray(styleOverrides)) {
    return { styleOverrides: null, issues };
  }

  const allowedFields = sectionType
    ? new Set(getFieldsForSection(sectionType, industry, definitionKey).map(canonicalColorField))
    : null;
  const normalized: Record<string, string> = {};
  const inputPriority: Partial<Record<ColorFieldKey, number>> = {};

  for (const [key, value] of Object.entries(styleOverrides)) {
    const field = fieldForInputKey(key);
    if (!field) {
      issues.push({
        location: `${location}.${key}`,
        key,
        value,
        reason: 'unknown_key',
        message: `${location}.${key} is not a supported style override key`,
      });
      continue;
    }

    if (allowedFields && !allowedFields.has(field)) {
      issues.push({
        location: `${location}.${key}`,
        key,
        value,
        reason: 'section_key_not_allowed',
        message: `${location}.${key} is not used by section type "${sectionType}"`,
      });
      continue;
    }

    if (value == null || value === '') continue;
    if (typeof value !== 'string') {
      issues.push({
        location: `${location}.${key}`,
        key,
        value,
        reason: 'invalid_type',
        message: `${location}.${key} must be a string`,
      });
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) continue;
    if (!isSafeStyleOverrideValue(field, trimmed)) {
      issues.push({
        location: `${location}.${key}`,
        key,
        value,
        reason: 'unsafe_value',
        message: `${location}.${key} has an invalid or unsafe CSS value (${JSON.stringify(value)})`,
      });
      continue;
    }

    // Canonical public inputs always win over legacy/internal aliases,
    // regardless of JSON property order. Otherwise an old
    // --token-on-dark-heading value could silently replace the editor's
    // --token-heading value during normalization.
    const canonicalCssVar = FIELD_DEFS[field].cssVar;
    const priority = key === field || key === canonicalCssVar ? 2 : 1;
    if ((inputPriority[field] ?? 0) <= priority) {
      normalized[canonicalCssVar] = trimmed;
      inputPriority[field] = priority;
    }
  }

  return { styleOverrides: Object.keys(normalized).length ? normalized : null, issues };
}

export function normalizeStyleOverridesWithIssues(
  styleOverrides: unknown,
  location = 'styleOverrides',
): StyleOverrideNormalizationResult {
  return normalizeStyleOverridesInternal(styleOverrides, location);
}

export function normalizeStyleOverrides(styleOverrides: unknown): Record<string, string> | null {
  return normalizeStyleOverridesWithIssues(styleOverrides).styleOverrides;
}

export function normalizeStyleOverridesForSectionWithIssues(
  sectionType: string,
  styleOverrides: unknown,
  industry?: string,
  location = 'styleOverrides',
  definitionKey?: string | null,
): StyleOverrideNormalizationResult {
  return normalizeStyleOverridesInternal(styleOverrides, location, sectionType, industry, definitionKey);
}

export function normalizeStyleOverridesForSection(
  sectionType: string,
  styleOverrides: unknown,
  industry?: string,
  definitionKey?: string | null,
): Record<string, string> | null {
  return normalizeStyleOverridesForSectionWithIssues(sectionType, styleOverrides, industry, 'styleOverrides', definitionKey).styleOverrides;
}

export function autoFixStyleOverridesForSectionReadability(
  sectionType: string,
  styleOverrides: Record<string, string> | null,
  industry?: string,
  definitionKey?: string | null,
): { styleOverrides: Record<string, string> | null; applied: string[] } {
  if (!styleOverrides || Object.keys(styleOverrides).length === 0) {
    return { styleOverrides, applied: [] };
  }

  const allowedFields = new Set(getFieldsForSection(sectionType, industry, definitionKey).map(canonicalColorField));
  const out = { ...styleOverrides };
  const applied: string[] = [];
  const value = (field: ColorFieldKey): string | undefined => {
    const raw = out[FIELD_DEFS[canonicalColorField(field)].cssVar];
    return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
  };
  const setIfMissing = (field: ColorFieldKey, color: string) => {
    const canonical = canonicalColorField(field);
    if (!allowedFields.has(canonical)) return;
    const cssVar = FIELD_DEFS[canonical].cssVar;
    if (out[cssVar]) return;
    out[cssVar] = color;
    applied.push(`${cssVar}=${color}`);
  };

  const sectionBg = value('sectionBg');
  const cardBg = value('cardBg');
  const btnBg = value('btnBg');
  const badgeBg = value('badgeBg');
  const sectionCanvas = '#ffffff';
  const cardCanvas = sectionBg || sectionCanvas;

  if (sectionBg) {
    setIfMissing('headingColor', readableTextColorForBackground(sectionBg, { canvas: sectionCanvas, large: true, role: 'heading' }));
    setIfMissing('bodyColor', readableTextColorForBackground(sectionBg, { canvas: sectionCanvas, role: 'body' }));
    setIfMissing('mutedColor', readableTextColorForBackground(sectionBg, { canvas: sectionCanvas, role: 'muted' }));
  }
  if (cardBg) {
    setIfMissing('cardHeadingColor', readableTextColorForBackground(cardBg, { canvas: cardCanvas, large: true, role: 'heading' }));
    setIfMissing('cardBodyColor', readableTextColorForBackground(cardBg, { canvas: cardCanvas, role: 'body' }));
    setIfMissing('cardMutedColor', readableTextColorForBackground(cardBg, { canvas: cardCanvas, role: 'muted' }));
  }
  if (btnBg) {
    setIfMissing('btnText', readableTextColorForBackground(btnBg, { canvas: cardBg || sectionBg || sectionCanvas, role: 'button' }));
  }
  if (badgeBg) {
    setIfMissing('badgeText', readableTextColorForBackground(badgeBg, { canvas: cardBg || sectionBg || sectionCanvas, role: 'badge' }));
  }

  return { styleOverrides: Object.keys(out).length ? out : null, applied };
}

export function validateStyleOverridesForApi(
  styleOverrides: unknown,
  location = 'styleOverrides',
  sectionType?: string,
  industry?: string,
  definitionKey?: string | null,
): string | null {
  if (!styleOverrides || typeof styleOverrides !== 'object' || Array.isArray(styleOverrides)) return null;
  const { issues } = sectionType
    ? normalizeStyleOverridesForSectionWithIssues(sectionType, styleOverrides, industry, location, definitionKey)
    : normalizeStyleOverridesWithIssues(styleOverrides, location);
  if (!issues.length) return null;

  const first = issues[0];
  if (first.reason === 'section_key_not_allowed' && sectionType) {
    const allowed = getFieldsForSection(sectionType, industry, definitionKey);
    const allowedKeys = allowedStyleOverrideKeysForSection(sectionType, industry, definitionKey);
    const suggestion = closestMatch(first.key, [...allowedKeys, ...allowed]);
    return `${first.message}. Allowed color fields for this section: ${allowed.join(', ')}.${suggestion ? ` Did you mean "${suggestion}"?` : ''}`;
  }
  return `${first.message}. Allowed keys are documented in /api/v1/instructions sectionStyleContracts. Use hex, rgb(), rgba(), var(--token) or a documented safe size value only.`;
}

/** Encode arbitrary text for a CSS quoted attribute selector without emitting `<`. */
export function escapeCssAttributeValue(value: string): string {
  return Array.from(value, (character) => {
    if (/^[a-z0-9_-]$/i.test(character)) return character;
    const codePoint = character.codePointAt(0);
    return codePoint === undefined ? '' : `\\${codePoint.toString(16)} `;
  }).join('');
}

/** Final defence for CSS inserted into an HTML style element. */
export function escapeStyleElementText(css: string): string {
  return css.replace(/\u0000/g, '\ufffd').replace(/</g, '\\3c ');
}

function closestMatch(input: string, candidates: string[]): string | null {
  const normalize = (value: string) => value.toLowerCase().replace(/^--token-/, '').replace(/[^a-z0-9]/g, '');
  const needle = normalize(input);
  if (!needle) return null;
  let best: { key: string; distance: number } | null = null;
  for (const candidate of candidates) {
    const haystack = normalize(candidate);
    const distance = levenshtein(needle, haystack);
    if (distance <= Math.max(2, Math.floor(haystack.length / 3)) && (!best || distance < best.distance)) {
      best = { key: candidate, distance };
    }
  }
  return best?.key ?? null;
}

function levenshtein(left: string, right: string): number {
  if (left === right) return 0;
  const previous = new Array(right.length + 1).fill(0).map((_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const prior = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
      diagonal = prior;
    }
  }
  return previous[right.length];
}

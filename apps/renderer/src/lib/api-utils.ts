import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { isValidColorString } from '@/lib/color-validation';
import { COLOR_FIELD_BY_CSS_VAR, COLOR_FIELD_CSS_VARS, FIELD_DEFS } from '@/lib/section-color-fields';
import { getFieldsForSection } from '@/lib/section-color-resolver';

type AuthResult = Awaited<ReturnType<typeof validatePat>>;

/** Ensures all JSON responses have proper UTF-8 Content-Type */
function jsonResponse(data: unknown, init?: { status?: number }): NextResponse {
  return NextResponse.json(data, {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function handleError(req: NextRequest, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[API Error] ${req.method} ${req.nextUrl.pathname}:`, message);
  if (message.includes('Unexpected token') || message.includes('JSON')) {
    return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (message.includes('unique') || message.includes('duplicate')) {
    return jsonResponse({ error: 'Duplicate entry' }, { status: 409 });
  }
  return jsonResponse({ error: message }, { status: 500 });
}

/**
 * Wraps an API handler (no dynamic params) with auth validation and try/catch.
 */
export function withApiHandler(
  handler: (req: NextRequest, auth: NonNullable<AuthResult>) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    try {
      const auth = await validatePat(req.headers.get('authorization'));
      if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return await handler(req, auth);
    } catch (err: unknown) {
      return handleError(req, err);
    }
  };
}

/**
 * Wraps an API handler (with dynamic params) with auth validation and try/catch.
 */
export function withApiHandlerParams<T extends Record<string, string>>(
  handler: (req: NextRequest, auth: NonNullable<AuthResult>, params: T) => Promise<NextResponse>,
) {
  return async (req: NextRequest, context: { params: Promise<T> }) => {
    try {
      const auth = await validatePat(req.headers.get('authorization'));
      if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const resolvedParams = await context.params;
      return await handler(req, auth, resolvedParams);
    } catch (err: unknown) {
      return handleError(req, err);
    }
  };
}

/** Strip leading slashes and normalize a slug for consistent storage. */
export function normalizeSlug(slug: string): string {
  return slug.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
}

/** Validate section array. Returns error string or null if valid. */
const DISALLOWED_API_SECTION_TYPES = new Set([
  'customhtml',
  'embedcode',
  'freehtml',
  'html',
  'htmlblock',
  'rawhtml',
  'script',
]);

export function validateSections(sections: unknown, industry?: string): string | null {
  if (!Array.isArray(sections)) return 'sections must be an array';
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (!s || typeof s !== 'object') return `sections[${i}] must be an object`;
    if (!s.type || typeof s.type !== 'string') return `sections[${i}].type is required and must be a string`;
    if (DISALLOWED_API_SECTION_TYPES.has(s.type.toLowerCase())) {
      return `sections[${i}].type "${s.type}" is not allowed through the public content API`;
    }
    if (s.data !== undefined && (typeof s.data !== 'object' || s.data === null || Array.isArray(s.data))) {
      return `sections[${i}].data must be an object`;
    }
    if (
      s.styleOverrides !== undefined
      && (typeof s.styleOverrides !== 'object' || s.styleOverrides === null || Array.isArray(s.styleOverrides))
    ) {
      return `sections[${i}].styleOverrides must be an object`;
    }
    const styleErr = validateStyleOverridesForApi(s.styleOverrides, `sections[${i}].styleOverrides`, s.type, industry);
    if (styleErr) return styleErr;
    // Section-specific validation
    const data = s.data || {};
    const err = validateSectionData(s.type, data, i);
    if (err) return err;
  }
  return null;
}

function validateSectionData(type: string, data: Record<string, unknown>, idx: number): string | null {
  switch (type) {
    case 'servicesGrid':
      if ((!Array.isArray(data.manualCards) || data.manualCards.length === 0) && (!Array.isArray(data.services) || data.services.length === 0))
        return `sections[${idx}] (servicesGrid): data.manualCards (or data.services) must be a non-empty array. Each item needs { title, text, icon?, image?, href? }`;
      for (const svc of ((data.manualCards || data.services) as any[])) {
        if (!svc.title) return `sections[${idx}] (servicesGrid): each card needs a title`;
        if (!svc.text) return `sections[${idx}] (servicesGrid): each card needs a text`;
      }
      break;
    case 'faq':
      if (!Array.isArray(data.items) || data.items.length === 0)
        return `sections[${idx}] (faq): data.items must be a non-empty array. Each item needs { question, answer }`;
      break;
    case 'testimonials':
      if (!Array.isArray(data.items) || data.items.length === 0)
        return `sections[${idx}] (testimonials): data.items must be a non-empty array. Each item needs { quote, name }`;
      break;
    case 'processSteps':
      if (!Array.isArray(data.steps) || data.steps.length === 0)
        return `sections[${idx}] (processSteps): data.steps must be a non-empty array. Each item needs { icon, title, text }`;
      break;
    case 'uspStrip':
      if (!Array.isArray(data.items) || data.items.length === 0)
        return `sections[${idx}] (uspStrip): data.items must be a non-empty array. Each item needs { icon, text }`;
      break;
    case 'team':
    case 'teamShowcase':
    case 'doctorTeam':
      if (!Array.isArray(data.members || data.doctors) || ((data.members || data.doctors) as any[]).length === 0)
        return `sections[${idx}] (${type}): data.members/doctors must be a non-empty array`;
      break;
    case 'galleryGrid':
    case 'gallery':
      if (!Array.isArray(data.images) || data.images.length === 0)
        return `sections[${idx}] (${type}): data.images must be a non-empty array`;
      break;
  }
  return null;
}

/**
 * Normalize section data to use canonical field names.
 * Fixes common AI mistakes like using "services" instead of "manualCards".
 */
export function normalizeSectionData(type: string, data: Record<string, unknown>): Record<string, unknown> {
  const d = sanitizeValue({ ...data }) as Record<string, unknown>;
  if (type === 'servicesGrid') {
    if (Array.isArray(d.services) && !Array.isArray(d.manualCards)) {
      d.manualCards = d.services;
      delete d.services;
    }
    if (!d.source) d.source = 'manual';
  }
  return d;
}

const STYLE_OVERRIDE_KEY_TO_VARS: Record<string, string[]> = Object.fromEntries(
  Object.entries(FIELD_DEFS).map(([key, def]) => [key, [def.cssVar]]),
);

const ALLOWED_RAW_STYLE_OVERRIDE_VARS = COLOR_FIELD_CSS_VARS;

const SAFE_DIMENSION_RE = /^-?\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)?$/i;
const SAFE_BORDER_RE = /^\d+(?:\.\d+)?px\s+(?:solid|dashed|dotted)\s+(.+)$/i;
// `transparent` and `currentColor` are safe, common CSS colour keywords — an AI
// agent (or a human) naturally writes them, so accept them instead of 400ing.
const SAFE_CSS_KEYWORD_RE = /^(?:none|normal|inherit|initial|unset|transparent|currentcolor)$/i;
const SAFE_VAR_RE = /^var\(--[a-z0-9-]+\)$/i;

function isSafeStyleOverrideValue(value: string): boolean {
  const v = value.trim();
  if (!v || v.length > 180) return false;
  if (/[;{}<>]/.test(v)) return false;
  if (/(?:url\s*\(|@import|expression\s*\(|javascript:|data:)/i.test(v)) return false;
  if (isValidColorString(v)) return true;
  if (SAFE_DIMENSION_RE.test(v)) return true;
  if (SAFE_CSS_KEYWORD_RE.test(v)) return true;
  if (SAFE_VAR_RE.test(v)) return true;
  const border = SAFE_BORDER_RE.exec(v);
  if (border) return isValidColorString(border[1].trim()) || SAFE_VAR_RE.test(border[1].trim());
  return false;
}

function styleOverrideKeyToField(key: string): string | undefined {
  return key.startsWith('--')
    ? COLOR_FIELD_BY_CSS_VAR[key]
    : FIELD_DEFS[key as keyof typeof FIELD_DEFS]
      ? key
      : undefined;
}

function allowedStyleOverrideKeysForSection(sectionType: string, industry?: string): Set<string> {
  const allowed = new Set<string>();
  for (const field of getFieldsForSection(sectionType, industry)) {
    allowed.add(field);
    allowed.add(FIELD_DEFS[field].cssVar);
  }
  return allowed;
}

export interface StyleOverrideNormalizationIssue {
  location: string;
  key: string;
  value: unknown;
  reason: 'unknown_key' | 'invalid_type' | 'unsafe_value';
  message: string;
}

export interface StyleOverrideNormalizationResult {
  styleOverrides: Record<string, string> | null;
  issues: StyleOverrideNormalizationIssue[];
}

export function normalizeStyleOverridesWithIssues(
  styleOverrides: unknown,
  location = 'styleOverrides',
): StyleOverrideNormalizationResult {
  const issues: StyleOverrideNormalizationIssue[] = [];
  if (!styleOverrides || typeof styleOverrides !== 'object' || Array.isArray(styleOverrides)) {
    return { styleOverrides: null, issues };
  }

  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(styleOverrides)) {
    const targetKeys = key.startsWith('--')
      ? (ALLOWED_RAW_STYLE_OVERRIDE_VARS.has(key) ? [key] : undefined)
      : STYLE_OVERRIDE_KEY_TO_VARS[key];

    if (!targetKeys?.length) {
      issues.push({
        location: `${location}.${key}`,
        key,
        value,
        reason: 'unknown_key',
        message: `${location}.${key} is not a supported style override key`,
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

    if (!isSafeStyleOverrideValue(trimmed)) {
      issues.push({
        location: `${location}.${key}`,
        key,
        value,
        reason: 'unsafe_value',
        message: `${location}.${key} has an invalid or unsafe CSS value (${JSON.stringify(value)})`,
      });
      continue;
    }

    for (const targetKey of targetKeys) normalized[targetKey] = trimmed;
  }

  return { styleOverrides: Object.keys(normalized).length ? normalized : null, issues };
}

export function normalizeStyleOverrides(styleOverrides: unknown): Record<string, string> | null {
  return normalizeStyleOverridesWithIssues(styleOverrides).styleOverrides;
}

export function normalizeStyleOverridesForSection(
  sectionType: string,
  styleOverrides: unknown,
  industry?: string,
): Record<string, string> | null {
  const normalized = normalizeStyleOverridesWithIssues(styleOverrides).styleOverrides;
  if (!normalized) return null;
  const allowedCssVars = new Set(getFieldsForSection(sectionType, industry).map((field) => FIELD_DEFS[field].cssVar));
  const filtered = Object.fromEntries(Object.entries(normalized).filter(([key]) => allowedCssVars.has(key)));
  return Object.keys(filtered).length ? filtered : null;
}

export function validateStyleOverridesForApi(
  styleOverrides: unknown,
  location = 'styleOverrides',
  sectionType?: string,
  industry?: string,
): string | null {
  if (!styleOverrides || typeof styleOverrides !== 'object' || Array.isArray(styleOverrides)) return null;
  const { issues } = normalizeStyleOverridesWithIssues(styleOverrides, location);
  if (issues.length) {
    const first = issues[0];
    return `${first.message}. Allowed keys are documented in /api/v1/instructions sectionStyleContracts. Use hex, rgb(), rgba(), var(--token) or safe border/dimension values only.`;
  }
  if (sectionType) {
    const allowedKeys = allowedStyleOverrideKeysForSection(sectionType, industry);
    for (const [key, value] of Object.entries(styleOverrides)) {
      if (value == null || value === '') continue;
      const field = styleOverrideKeyToField(key);
      if (!field || !allowedKeys.has(key)) {
        const allowed = getFieldsForSection(sectionType, industry);
        const suggestion = closestMatch(key, [...allowedKeys, ...allowed]);
        return `${location}.${key} is not used by section type "${sectionType}". Allowed color fields for this section: ${allowed.join(', ')}.${suggestion ? ` Did you mean "${suggestion}"?` : ''}`;
      }
    }
  }
  return null;
}

/** Nearest allowed key by edit distance — powers "Did you mean …?" hints. */
function closestMatch(input: string, candidates: string[]): string | null {
  const normalize = (s: string) => s.toLowerCase().replace(/^--token-/, '').replace(/[^a-z0-9]/g, '');
  const needle = normalize(input);
  if (!needle) return null;
  let best: { key: string; dist: number } | null = null;
  for (const candidate of candidates) {
    const hay = normalize(candidate);
    const dist = levenshtein(needle, hay);
    if (dist <= Math.max(2, Math.floor(hay.length / 3)) && (!best || dist < best.dist)) {
      best = { key: candidate, dist };
    }
  }
  return best?.key ?? null;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const prev = new Array(b.length + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') return /<[a-z][\s\S]*>/i.test(value) ? sanitizeHtml(value) : value;
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitizeValue(child)]));
  }
  return value;
}

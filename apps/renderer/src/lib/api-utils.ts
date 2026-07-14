import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { isSectionDefinitionKey, parseSectionDefinitionKey } from '@/lib/section-definition-registry';
import { getSectionTypesForIndustry } from '@/app/admin/pages/[id]/section-types';
import { validateStyleOverridesForApi } from '@/lib/section-style-overrides';
import { validateAdvancedSectionData } from '@/lib/advanced-section-validation';

export {
  normalizeStyleOverrides,
  normalizeStyleOverridesForSection,
  normalizeStyleOverridesForSectionWithIssues,
  normalizeStyleOverridesWithIssues,
  validateStyleOverridesForApi,
} from '@/lib/section-style-overrides';
export type {
  StyleOverrideNormalizationIssue,
  StyleOverrideNormalizationResult,
} from '@/lib/section-style-overrides';

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
  const requestId = globalThis.crypto.randomUUID();
  console.error(`[API Error] ${requestId} ${req.method} ${req.nextUrl.pathname}:`, message);
  if (message.includes('Unexpected token') || message.includes('JSON')) {
    return jsonResponse({
      success: false,
      code: 'INVALID_JSON',
      error: 'Invalid JSON body',
      hint: 'Send exactly one valid JSON object with Content-Type: application/json.',
      retryable: false,
      requestId,
    }, { status: 400 });
  }
  if (message.includes('unique') || message.includes('duplicate')) {
    return jsonResponse({
      success: false,
      code: 'DUPLICATE_ENTRY',
      error: 'Duplicate entry',
      hint: 'Fetch the existing resource and update it, or use page upsert=true.',
      retryable: false,
      requestId,
    }, { status: 409 });
  }
  return jsonResponse({
    success: false,
    code: 'INTERNAL_ERROR',
    error: 'The request could not be completed.',
    hint: 'Retry once. If it fails again, report requestId and the endpoint.',
    retryable: true,
    requestId,
  }, { status: 500 });
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
      if (!auth) return jsonResponse({
        success: false,
        code: 'UNAUTHORIZED',
        error: 'Unauthorized',
        hint: 'Send Authorization: Bearer <PAT>.',
        retryable: false,
      }, { status: 401 });
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
      if (!auth) return jsonResponse({
        success: false,
        code: 'UNAUTHORIZED',
        error: 'Unauthorized',
        hint: 'Send Authorization: Bearer <PAT>.',
        retryable: false,
      }, { status: 401 });
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

const KNOWN_API_SECTION_TYPES = new Set(
  getSectionTypesForIndustry('__all__').map((definition) => definition.type),
);
const SECTION_ADDON_REQUIREMENTS = new Map(
  getSectionTypesForIndustry('__all__')
    .filter((definition) => definition.requiresAddon)
    .map((definition) => [definition.type, definition.requiresAddon] as const),
);
const KNOWN_SECTION_DEFINITION_OWNERS = new Set([
  'shared', 'tradesman', 'verein', 'photography', 'consulting', 'wedding',
  'medical', 'salon', 'tourism', 'hotel', 'restaurant', 'bar', 'realestate',
  'cafe', 'tattoo', 'ecommerce', 'retail', 'florist', 'fitness', 'location',
]);

export function validateSections(
  sections: unknown,
  industry?: string,
  addons: { hasShop?: boolean; hasBooking?: boolean } = {},
): string | null {
  if (!Array.isArray(sections)) return 'sections must be an array';
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (!s || typeof s !== 'object') return `sections[${i}] must be an object`;
    if (!s.type || typeof s.type !== 'string') return `sections[${i}].type is required and must be a string`;
    if (DISALLOWED_API_SECTION_TYPES.has(s.type.toLowerCase())) {
      return `sections[${i}].type "${s.type}" is not allowed through the public content API`;
    }
    if (!KNOWN_API_SECTION_TYPES.has(s.type)) {
      const suggestion = closestMatch(s.type, [...KNOWN_API_SECTION_TYPES]);
      return `sections[${i}].type "${s.type}" is unknown and would not render.${suggestion ? ` Did you mean "${suggestion}"?` : ''} Use a type from GET /api/v1/instructions availableSectionTypes.`;
    }
    const requiredAddon = SECTION_ADDON_REQUIREMENTS.get(s.type);
    if (
      (requiredAddon === 'shop' && !addons.hasShop)
      || (requiredAddon === 'booking' && !addons.hasBooking)
    ) {
      return `sections[${i}].type "${s.type}" requires the active ${requiredAddon} addon. Choose an unlocked type from GET /api/v1/instructions availableSectionTypes.`;
    }
    const identityErr = validateSectionIdentity(s, `sections[${i}]`);
    if (identityErr) return identityErr;
    const definitionIdentity = typeof s.definitionKey === 'string' ? parseSectionDefinitionKey(s.definitionKey) : null;
    if (definitionIdentity && !KNOWN_SECTION_DEFINITION_OWNERS.has(definitionIdentity.owner)) {
      return `sections[${i}].definitionKey "${s.definitionKey}" is not registered. Omit definitionKey to use the tenant default, or copy an exact key from GET /api/v1/instructions.`;
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
    const styleErr = validateStyleOverridesForApi(
      s.styleOverrides,
      `sections[${i}].styleOverrides`,
      s.type,
      industry,
      typeof s.definitionKey === 'string' ? s.definitionKey : null,
    );
    if (styleErr) return styleErr;
    // Section-specific validation
    const data = s.data || {};
    const err = validateSectionData(s.type, data, i);
    if (err) return err;
  }
  return null;
}

export function validateSectionIdentity(
  section: { type?: unknown; definitionKey?: unknown; schemaVersion?: unknown },
  path = 'section',
): string | null {
  if (section.definitionKey !== undefined && section.definitionKey !== null) {
    if (!isSectionDefinitionKey(section.definitionKey)) {
      return `${path}.definitionKey must use the format "type.owner.v1"`;
    }
    const parsed = parseSectionDefinitionKey(section.definitionKey);
    if (typeof section.type === 'string' && parsed?.type !== section.type) {
      return `${path}.definitionKey type "${parsed?.type}" does not match ${path}.type "${section.type}"`;
    }
  }
  if (
    section.schemaVersion !== undefined
    && section.schemaVersion !== null
    && (!Number.isSafeInteger(section.schemaVersion) || (section.schemaVersion as number) < 1)
  ) {
    return `${path}.schemaVersion must be a positive integer`;
  }
  return null;
}

function validateSectionData(type: string, data: Record<string, unknown>, idx: number): string | null {
  const location = `sections[${idx}] (${type})`;
  const advancedIssue = validateAdvancedSectionData(type, data, 'data')[0];
  if (advancedIssue) return `${location}: ${advancedIssue.path}: ${advancedIssue.message} ${advancedIssue.instruction}`;

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

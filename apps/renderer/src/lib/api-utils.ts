import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';

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
export function validateSections(sections: unknown): string | null {
  if (!Array.isArray(sections)) return 'sections must be an array';
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (!s || typeof s !== 'object') return `sections[${i}] must be an object`;
    if (!s.type || typeof s.type !== 'string') return `sections[${i}].type is required and must be a string`;
    if (s.data !== undefined && (typeof s.data !== 'object' || s.data === null || Array.isArray(s.data))) {
      return `sections[${i}].data must be an object`;
    }
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
  const d = { ...data };
  if (type === 'servicesGrid') {
    if (Array.isArray(d.services) && !Array.isArray(d.manualCards)) {
      d.manualCards = d.services;
      delete d.services;
    }
    if (!d.source) d.source = 'manual';
  }
  return d;
}

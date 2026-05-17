import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';

type AuthResult = Awaited<ReturnType<typeof validatePat>>;

function handleError(req: NextRequest, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[API Error] ${req.method} ${req.nextUrl.pathname}:`, message);
  if (message.includes('Unexpected token') || message.includes('JSON')) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (message.includes('unique') || message.includes('duplicate')) {
    return NextResponse.json({ error: 'Duplicate entry' }, { status: 409 });
  }
  return NextResponse.json({ error: message }, { status: 500 });
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

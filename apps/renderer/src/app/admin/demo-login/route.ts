import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSessionToken, getSessionCookieName } from '@flamingo/auth';
import { resolveDemoTenant, resolveDemoTenantBySlug } from '@/lib/snapshot';
import { getDb } from '@/lib/db';
import { tenants } from '@flamingo/db';
import { eq, and, like } from 'drizzle-orm';

const DEFAULT_DEMO_TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';

// Map URL slugs to DB industry enum values
const INDUSTRY_MAP: Record<string, string> = {
  handwerk: 'tradesman',
  hotel: 'hotel',
  restaurant: 'restaurant',
  salon: 'salon',
  tourism: 'tourism',
  medical: 'medical',
  wedding: 'wedding',
  photography: 'photography',
};

export async function GET(request: NextRequest) {
  const industry = request.nextUrl.searchParams.get('industry');
  const requestedNext = request.nextUrl.searchParams.get('next');

  let tenantId = DEFAULT_DEMO_TENANT_ID;

  if (industry) {
    const dbIndustry = INDUSTRY_MAP[industry] || industry;
    try {
      // 1. Try resolving via isDemo=true flag
      let resolved = await resolveDemoTenant(dbIndustry);

      // 2. Fallback: try slug-based lookup (demo-{industry})
      if (!resolved) {
        resolved = await resolveDemoTenantBySlug(`demo-${industry}`);
      }

      // 3. Fallback: find any tenant with matching industry and slug starting with "demo"
      if (!resolved) {
        const db = getDb();
        const [tenant] = await db
          .select({ id: tenants.id })
          .from(tenants)
          .where(and(
            eq(tenants.industry, dbIndustry as typeof tenants.industry.enumValues[number]),
            like(tenants.slug, 'demo%'),
            eq(tenants.status, 'active'),
          ))
          .limit(1);
        resolved = tenant?.id ?? null;
      }

      if (!resolved) {
        return NextResponse.json({ error: `No demo tenant found for industry: ${industry}. Make sure a tenant with industry="${dbIndustry}" exists (with isDemo=true or slug starting with "demo").` }, { status: 404 });
      }
      tenantId = resolved;
    } catch (e) {
      return NextResponse.json({ error: `Failed to resolve demo tenant: ${e instanceof Error ? e.message : 'unknown'}` }, { status: 500 });
    }
  }

  const token = await createSessionToken(tenantId);
  const safeNext = requestedNext?.startsWith('/admin') && !requestedNext.startsWith('/admin/login')
    ? requestedNext
    : '/admin';
  const target = new URL(safeNext, request.nextUrl.origin);
  const response = NextResponse.redirect(target);
  response.cookies.set(getSessionCookieName(), token, {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60,
  });
  response.cookies.set('flamingo_demo', '1', {
    path: '/admin',
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60,
  });

  return response;
}

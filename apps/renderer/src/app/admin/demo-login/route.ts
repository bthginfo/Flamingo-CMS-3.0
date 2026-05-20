import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSessionToken } from '@flamingo/auth';
import { resolveDemoTenant } from '@/lib/snapshot';

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

  let tenantId = DEFAULT_DEMO_TENANT_ID;

  if (industry) {
    const dbIndustry = INDUSTRY_MAP[industry] || industry;
    const resolved = await resolveDemoTenant(dbIndustry);
    if (!resolved) {
      return NextResponse.json({ error: `No demo tenant found for industry: ${industry}` }, { status: 404 });
    }
    tenantId = resolved;
  }

  const token = await createSessionToken(tenantId);
  const target = new URL('/admin/pages', request.nextUrl.origin);
  // Pass token via URL so it works inside cross-origin iframes
  // where third-party cookies are blocked. The middleware will
  // pick up _dt, set the cookie same-origin, and redirect clean.
  target.searchParams.set('_dt', token);
  target.searchParams.set('_demo', '1');

  return NextResponse.redirect(target);
}

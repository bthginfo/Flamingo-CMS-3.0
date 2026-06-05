import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';
import { validateBrandPayload, type ColorIssue } from '@/lib/color-validation';

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  // ── Input validation: reject malformed colors hard, surface contrast
  //    warnings non-blockingly so the AI can self-correct on the next call.
  const issues = validateBrandPayload(body || {});
  const errors = issues.filter((i) => i.severity === 'error');
  if (errors.length) {
    return NextResponse.json(
      { error: 'invalid brand payload', issues: errors, warnings: issues.filter((i) => i.severity !== 'error') },
      { status: 400 },
    );
  }

  const [existing] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  const existingBrand = (existing?.brand as Record<string, unknown>) || {};
  const nextBrand = { ...body };
  if (existingBrand.localSeo && !nextBrand.localSeo) nextBrand.localSeo = existingBrand.localSeo;

  if (existing) {
    await db.update(globalSettings).set({ brand: nextBrand }).where(eq(globalSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId: auth.tenantId, brand: nextBrand });
  }

  const warnings: ColorIssue[] = issues.filter((i) => i.severity !== 'error');
  return NextResponse.json({ success: true, warnings });
});

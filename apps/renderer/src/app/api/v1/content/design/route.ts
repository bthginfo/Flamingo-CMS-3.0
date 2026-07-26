import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';
import {
  validateDesignPayload,
  autoFixDesignReadable,
  type ColorIssue,
} from '@/lib/color-validation';

export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();
  const [row] = await db.select({ design: globalSettings.design }).from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  return NextResponse.json(row?.design || {});
});

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  // ── Validate first. Hard-error on malformed colors so the AI is forced to
  //    send a corrected payload; pass low-contrast / missing-onDark warnings
  //    back in the response so the AI can react before publish.
  const initialIssues = validateDesignPayload(body || {});
  const errors = initialIssues.filter((i) => i.severity === 'error');
  if (errors.length) {
    return NextResponse.json(
      { error: 'invalid design payload', issues: errors },
      { status: 400 },
    );
  }

  // ── Auto-fix: if sectionBg is dark and onDark* tokens are missing, fill
  //    them with safe defaults. This prevents the most common AI failure
  //    mode (white text inherited onto a freshly-set dark background → all
  //    text invisible until the user notices). The fix is reported in the
  //    response so the AI knows what was changed.
  const { design: fixedBody, applied: autoFixes } = autoFixDesignReadable(body || {});
  const warnings: ColorIssue[] = initialIssues.filter((i) => i.severity !== 'error');

  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  if (existing) {
    await db.update(globalSettings).set({ design: fixedBody, updatedAt: new Date() }).where(eq(globalSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId: auth.tenantId, design: fixedBody });
  }

  return NextResponse.json({ success: true, warnings, autoFixes });
});

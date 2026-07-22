import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { billingDocuments, tenantAddons } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getWritableSession();
  if (!session) return new NextResponse('Not found', { status: 404 });
  const { id } = await params;
  const db = getDb();
  const [[addon], [document]] = await Promise.all([
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1),
    db.select({ number: billingDocuments.documentNumber, xml: billingDocuments.xmlContent }).from(billingDocuments).where(and(eq(billingDocuments.id, id), eq(billingDocuments.tenantId, session.tenantId))).limit(1),
  ]);
  if (!addon?.active || !document?.xml || !document.number) return new NextResponse('Not found', { status: 404 });
  const safeNumber = document.number.replace(/[^a-z0-9_.-]+/gi, '-');
  return new NextResponse(document.xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeNumber}-xrechnung.xml"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { billingDocuments, tenantAddons } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new NextResponse('Not found', { status: 404 });
  const { id } = await params;
  const db = getDb();
  const [[addon], [document]] = await Promise.all([
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1),
    db.select({ number: billingDocuments.documentNumber, pdfBase64: billingDocuments.pdfBase64 }).from(billingDocuments).where(and(eq(billingDocuments.id, id), eq(billingDocuments.tenantId, session.tenantId))).limit(1),
  ]);
  if (!addon?.active || !document?.pdfBase64 || !document.number) return new NextResponse('Not found', { status: 404 });
  const safeNumber = document.number.replace(/[^a-z0-9_.-]+/gi, '-');
  const disposition = new URL(request.url).searchParams.get('download') === '1' ? 'attachment' : 'inline';
  return new NextResponse(Buffer.from(document.pdfBase64, 'base64'), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="${safeNumber}.pdf"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

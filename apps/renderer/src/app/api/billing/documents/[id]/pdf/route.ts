import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { billingDocuments, tenantAddons } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';
import { billingArtifactMatchesSha256, readBillingPdfArtifact } from '@/lib/billing-artifacts';
import { z } from 'zod';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getWritableSession();
  if (!session) return new NextResponse('Not found', { status: 404 });
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return new NextResponse('Not found', { status: 404 });
  const db = getDb();
  const [[addon], [document]] = await Promise.all([
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1),
    db.select({ number: billingDocuments.documentNumber, pdfBase64: billingDocuments.pdfBase64, pdfBlobUrl: billingDocuments.pdfBlobUrl, pdfSha256: billingDocuments.pdfSha256 }).from(billingDocuments).where(and(eq(billingDocuments.id, parsedId.data), eq(billingDocuments.tenantId, session.tenantId))).limit(1),
  ]);
  if (!addon?.active || !document?.number) return new NextResponse('Not found', { status: 404 });
  const pdf = await readBillingPdfArtifact({ blobUrl: document.pdfBlobUrl, base64: document.pdfBase64 });
  if (!pdf || !billingArtifactMatchesSha256(pdf, document.pdfSha256)) return new NextResponse('Not found', { status: 404 });
  const safeNumber = document.number.replace(/[^a-z0-9_.-]+/gi, '-');
  const disposition = new URL(request.url).searchParams.get('download') === '1' ? 'attachment' : 'inline';
  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="${safeNumber}.pdf"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { billingFreeTextDocuments, tenantAddons } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';
import { readBillingPdfArtifact } from '@/lib/billing-artifacts';
import { z } from 'zod';
import { createHash } from 'node:crypto';

function artifactSha256(value: Uint8Array) { return createHash('sha256').update(value).digest('hex'); }

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getWritableSession();
  if (!session) return new NextResponse('Not found', { status: 404 });
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return new NextResponse('Not found', { status: 404 });
  const db = getDb();
  const [[addon], [document]] = await Promise.all([
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1),
    db.select({ title: billingFreeTextDocuments.title, status: billingFreeTextDocuments.status, pdfBase64: billingFreeTextDocuments.pdfBase64, pdfBlobUrl: billingFreeTextDocuments.pdfBlobUrl, pdfSha256: billingFreeTextDocuments.pdfSha256 })
      .from(billingFreeTextDocuments).where(and(eq(billingFreeTextDocuments.id, parsedId.data), eq(billingFreeTextDocuments.tenantId, session.tenantId), eq(billingFreeTextDocuments.status, 'finalized'))).limit(1),
  ]);
  if (!addon?.active || !document) return new NextResponse('Not found', { status: 404 });
  const pdf = await readBillingPdfArtifact({ blobUrl: document.pdfBlobUrl, base64: document.pdfBase64 });
  if (!pdf || !document.pdfSha256 || artifactSha256(pdf) !== document.pdfSha256) return new NextResponse('Not found', { status: 404 });
  const safeTitle = document.title.replace(/[^a-z0-9_.-]+/gi, '-').replace(/^-|-$/g, '') || 'Schreiben';
  const disposition = new URL(request.url).searchParams.get('download') === '1' ? 'attachment' : 'inline';
  return new NextResponse(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `${disposition}; filename="${safeTitle}.pdf"`, 'Cache-Control': 'private, no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' } });
}

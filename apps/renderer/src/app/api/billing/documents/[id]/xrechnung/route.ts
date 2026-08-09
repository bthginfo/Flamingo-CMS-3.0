import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { billingDocuments, tenantAddons } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';
import { billingArtifactMatchesSha256, readBillingXmlArtifact } from '@/lib/billing-artifacts';
import { z } from 'zod';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getWritableSession();
  if (!session) return new NextResponse('Not found', { status: 404 });
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return new NextResponse('Not found', { status: 404 });
  const db = getDb();
  const [[addon], [document]] = await Promise.all([
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY))).limit(1),
    db.select({ number: billingDocuments.documentNumber, xml: billingDocuments.xmlContent, xmlBlobUrl: billingDocuments.xmlBlobUrl, xmlSha256: billingDocuments.xmlSha256 }).from(billingDocuments).where(and(eq(billingDocuments.id, parsedId.data), eq(billingDocuments.tenantId, session.tenantId))).limit(1),
  ]);
  if (!addon?.active || !document?.number) return new NextResponse('Not found', { status: 404 });
  const xml = await readBillingXmlArtifact({ blobUrl: document.xmlBlobUrl, text: document.xml });
  if (!xml || !billingArtifactMatchesSha256(xml, document.xmlSha256)) return new NextResponse('Not found', { status: 404 });
  const safeNumber = document.number.replace(/[^a-z0-9_.-]+/gi, '-');
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeNumber}-xrechnung.xml"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

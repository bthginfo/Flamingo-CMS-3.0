import { and, eq, gt, isNull } from 'drizzle-orm';
import { billingDocuments, billingPortalLinks } from '@flamingo/db';
import { sha256 } from '@/lib/billing-core';
import { billingArtifactMatchesSha256, readBillingPdfArtifact } from '@/lib/billing-artifacts';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return new Response('Nicht gefunden', { status: 404 });
  const [row] = await getDb().select({ documentNumber: billingDocuments.documentNumber, pdfBase64: billingDocuments.pdfBase64, pdfBlobUrl: billingDocuments.pdfBlobUrl, pdfSha256: billingDocuments.pdfSha256, status: billingDocuments.status })
    .from(billingPortalLinks)
    .innerJoin(billingDocuments, and(eq(billingDocuments.id, billingPortalLinks.documentId), eq(billingDocuments.tenantId, billingPortalLinks.tenantId)))
    .where(and(eq(billingPortalLinks.tokenHash, sha256(token)), isNull(billingPortalLinks.revokedAt), gt(billingPortalLinks.expiresAt, new Date())))
    .limit(1);
  if (!row || row.status === 'draft') return new Response('Nicht gefunden', { status: 404 });
  const pdf = await readBillingPdfArtifact({ blobUrl: row.pdfBlobUrl, base64: row.pdfBase64 });
  if (!pdf || !billingArtifactMatchesSha256(pdf, row.pdfSha256)) return new Response('Nicht gefunden', { status: 404 });
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${(row.documentNumber || 'dokument').replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

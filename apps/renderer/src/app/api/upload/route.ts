import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDb } from '@/lib/db';
import { mediaAssets } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('__PLACEHOLDER')) {
    return NextResponse.json({ error: 'Blob storage not configured (BLOB_READ_WRITE_TOKEN missing or placeholder). Please set a valid token in Vercel project settings.' }, { status: 500 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        const session = await getSession();
        const tenantId = session?.tenantId || process.env.FIXED_TENANT_ID;
        if (!tenantId) {
          throw new Error('Unauthorized — no valid session and no FIXED_TENANT_ID');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
          addRandomSuffix: false,
          allowOverwrite: true,
          tokenPayload: JSON.stringify({ tenantId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Persist asset to media_assets so it appears in the CMS library even
        // when never referenced from a section. Replaces the previous "lazy
        // scan" approach which produced orphan blobs and never recorded size.
        try {
          const payload = tokenPayload ? JSON.parse(tokenPayload) as { tenantId?: string } : {};
          const tenantId = payload.tenantId;
          if (!tenantId) return;
          const filename = (blob.pathname.split('/').pop() || 'upload').slice(0, 255);
          const db = getDb();
          const [existing] = await db.select({ id: mediaAssets.id }).from(mediaAssets)
            .where(and(eq(mediaAssets.tenantId, tenantId), eq(mediaAssets.blobUrl, blob.url)))
            .limit(1);
          if (existing) return;
          await db.insert(mediaAssets).values({
            tenantId,
            blobUrl: blob.url,
            pathname: blob.pathname.slice(0, 500),
            filename,
            mimeType: blob.contentType || 'application/octet-stream',
            size: 0,
          });
        } catch (err) {
          // Never fail the upload because of bookkeeping — the blob is stored.
          console.error('[Upload] media_assets insert failed:', err);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = (error as Error).message;
    console.error('[Upload] Error:', message);
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 400 },
    );
  }
}

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { mediaAssets } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import {
  isTrustedRendererContactOrigin,
  readBoundedRendererContactJson,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';
import { getWritableSession } from '@/lib/session';

const UPLOAD_REQUEST_MAX_BYTES = 32 * 1024;
const MAX_OPTIMIZED_UPLOAD_BYTES = 5 * 1024 * 1024;
const CONTENT_HASHED_MEDIA_PATH = /^media\/[a-f0-9]{64}\.webp$/i;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getWritableSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized — admin session required' }, { status: 401 });
  }

  if (!isTrustedRendererContactOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
  }

  let body: HandleUploadBody;
  try {
    body = await readBoundedRendererContactJson(request, UPLOAD_REQUEST_MAX_BYTES) as HandleUploadBody;
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) {
      return NextResponse.json({ error: 'Upload request too large' }, { status: 413 });
    }
    if (error instanceof RendererContactBodyInvalidError) {
      return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
    }
    throw error;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('__PLACEHOLDER')) {
    return NextResponse.json({ error: 'Blob storage not configured (BLOB_READ_WRITE_TOKEN missing or placeholder). Please set a valid token in Vercel project settings.' }, { status: 500 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        // A valid admin session is always required. FIXED_TENANT_ID only scopes
        // single-tenant deployments and must never act as an auth fallback.
        const tenantId = session.tenantId || process.env.FIXED_TENANT_ID;
        if (!tenantId) throw new Error('Unauthorized — no tenant resolved');
        if (!CONTENT_HASHED_MEDIA_PATH.test(pathname)) throw new Error('Invalid upload pathname');

        // Random suffix + no overwrite: the blob store is shared across all
        // tenants, and clients choose the pathname. Without the suffix, two
        // tenants uploading "logo.png" could overwrite each other's assets.
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
          maximumSizeInBytes: MAX_OPTIMIZED_UPLOAD_BYTES,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({ tenantId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          const payload = tokenPayload ? JSON.parse(tokenPayload) as { tenantId?: string } : {};
          const tenantId = payload.tenantId;
          if (!tenantId) return;

          // The admin client records the upload itself via saveMediaRecord
          // right after upload() resolves. This delayed fallback only catches
          // uploads whose client never reported back.
          await new Promise((resolve) => setTimeout(resolve, 5000));
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

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import {
  isTrustedRendererContactOrigin,
  readBoundedRendererContactJson,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';
import { getWritableSession } from '@/lib/session';

const UPLOAD_REQUEST_MAX_BYTES = 32 * 1024;
const MAX_FONT_UPLOAD_BYTES = 1536 * 1024;
const FONT_PATH = /^fonts\/[a-z0-9][a-z0-9_.-]{0,120}\.(?:woff2|woff|ttf|otf)$/i;
const ALLOWED_FONT_TYPES = [
  'font/woff2',
  'font/woff',
  'font/ttf',
  'font/otf',
  'application/font-woff',
  'application/x-font-ttf',
  'application/x-font-opentype',
  'application/vnd.ms-opentype',
  'application/octet-stream',
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getWritableSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized — admin session required' }, { status: 401 });
  if (!isTrustedRendererContactOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });

  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });

  let body: HandleUploadBody;
  try {
    body = await readBoundedRendererContactJson(request, UPLOAD_REQUEST_MAX_BYTES) as HandleUploadBody;
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) return NextResponse.json({ error: 'Upload request too large' }, { status: 413 });
    if (error instanceof RendererContactBodyInvalidError) return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
    throw error;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('__PLACEHOLDER')) {
    return NextResponse.json({ error: 'Blob storage not configured' }, { status: 500 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        if (!FONT_PATH.test(pathname)) throw new Error('Invalid font upload pathname');
        return {
          allowedContentTypes: ALLOWED_FONT_TYPES,
          maximumSizeInBytes: MAX_FONT_UPLOAD_BYTES,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({ tenantId: session.tenantId }),
        };
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('[Font Upload] Error:', message);
    return NextResponse.json({ error: message }, { status: message.includes('Unauthorized') ? 401 : 400 });
  }
}

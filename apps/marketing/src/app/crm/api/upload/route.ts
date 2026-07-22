import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { verifyCrmSession } from '@/lib/session';
import {
  InvalidRequestBodyError,
  isTrustedRequestOrigin,
  readJsonRequestBody,
  RequestBodyTooLargeError,
} from '@/lib/request-security';

const CRM_UPLOAD_REQUEST_MAX_BYTES = 32 * 1024;
const MAX_OPTIMIZED_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sessionValid = await verifyCrmSession();
  if (!sessionValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
  }

  let body: HandleUploadBody;
  try {
    body = await readJsonRequestBody(request, CRM_UPLOAD_REQUEST_MAX_BYTES) as HandleUploadBody;
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: 'Upload request too large' }, { status: 413 });
    if (error instanceof InvalidRequestBodyError) return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
    throw error;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('__PLACEHOLDER')) {
    return NextResponse.json({ error: 'Blob Storage ist nicht konfiguriert.' }, { status: 500 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
          maximumSizeInBytes: MAX_OPTIMIZED_UPLOAD_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ scope: 'crm-blog' }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload fehlgeschlagen';
    return NextResponse.json({ error: message }, { status: message.includes('Unauthorized') ? 401 : 400 });
  }
}

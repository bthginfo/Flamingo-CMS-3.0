import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

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
        if (!session) throw new Error('Unauthorized — no valid session');

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ tenantId: session.tenantId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Runs on Vercel after upload completes
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = (error as Error).message;
    console.error('Upload error:', message);
    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}

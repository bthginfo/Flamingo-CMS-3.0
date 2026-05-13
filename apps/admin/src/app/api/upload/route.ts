import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Auth check
        const session = await getSession();
        if (!session) throw new Error('Unauthorized');

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
          tokenPayload: JSON.stringify({ tenantId: session.tenantId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This runs on Vercel after upload is complete
        // We handle saving the record client-side after upload
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}

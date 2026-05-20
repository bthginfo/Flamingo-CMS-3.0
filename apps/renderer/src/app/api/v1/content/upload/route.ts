import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { mediaAssets } from '@flamingo/db';
import { NextRequest } from 'next/server';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const contentType = req.headers.get('content-type') || '';

  // Handle multipart form data
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: `File type not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });

    const blob = await put(`${auth.tenantId}/${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });

    const db = getDb();
    await db.insert(mediaAssets).values({
      tenantId: auth.tenantId,
      filename: file.name,
      blobUrl: blob.url,
      pathname: blob.pathname,
      mimeType: file.type,
      size: file.size,
    });

    return NextResponse.json({ url: blob.url, filename: file.name, size: file.size });
  }

  // Handle raw binary with filename in header
  const filename = req.headers.get('x-filename') || 'upload.jpg';
  const fileType = contentType.split(';')[0].trim();
  if (!ALLOWED_TYPES.includes(fileType)) return NextResponse.json({ error: `File type not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 });

  const body = await req.arrayBuffer();
  if (body.byteLength > MAX_SIZE) return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });

  const blob = await put(`${auth.tenantId}/${filename}`, body, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: fileType,
    addRandomSuffix: true,
  });

  const db = getDb();
  await db.insert(mediaAssets).values({
    tenantId: auth.tenantId,
    filename,
    blobUrl: blob.url,
    pathname: blob.pathname,
    mimeType: fileType,
    size: body.byteLength,
  });

  return NextResponse.json({ url: blob.url, filename, size: body.byteLength });
}

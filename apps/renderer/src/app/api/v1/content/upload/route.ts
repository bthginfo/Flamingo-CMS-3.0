import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { mediaAssets } from '@flamingo/db';
import { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { and, eq } from 'drizzle-orm';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
};
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

function sha256Hex(buffer: ArrayBuffer): string {
  return createHash('sha256').update(Buffer.from(buffer)).digest('hex');
}

function resolveExtension(filename: string, mime: string): string {
  const ext = filename.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();
  if (ext && EXT_TO_MIME[ext] === mime) return ext;
  return MIME_TO_EXT[mime] || '.bin';
}

/** Infer MIME type from file.type, filename extension, or fallback. */
function resolveMime(declaredType: string | undefined, filename: string): string | null {
  // 1. Declared type if valid
  if (declaredType && ALLOWED_TYPES.includes(declaredType)) return declaredType;
  // 2. Fallback: extension-based
  const ext = filename.match(/\.[a-z]+$/i)?.[0]?.toLowerCase();
  if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext];
  // 3. Generic stream → treat as unknown
  if (declaredType === 'application/octet-stream') return null;
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('__PLACEHOLDER')) {
      return NextResponse.json({ error: 'Upload failed', details: 'Storage not configured (BLOB_READ_WRITE_TOKEN missing or placeholder)' }, { status: 500 });
    }

    const contentType = req.headers.get('content-type') || '';

    // Handle multipart form data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) return NextResponse.json({ error: 'No file provided. Use field name "file".' }, { status: 400 });

      const mime = resolveMime(file.type, file.name);
      if (!mime) return NextResponse.json({ error: `File type not allowed. Got "${file.type}" for "${file.name}". Allowed: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 });
      if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });

      const fileBytes = await file.arrayBuffer();
      const hash = sha256Hex(fileBytes);
      const extension = resolveExtension(file.name, mime);
      const pathname = `${auth.tenantId}/media/${hash}${extension}`;

      const blob = await put(pathname, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: mime,
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      const db = getDb();
      const [existing] = await db.select({ id: mediaAssets.id }).from(mediaAssets)
        .where(and(eq(mediaAssets.tenantId, auth.tenantId), eq(mediaAssets.blobUrl, blob.url)))
        .limit(1);
      if (!existing) {
        await db.insert(mediaAssets).values({
          tenantId: auth.tenantId,
          filename: file.name,
          blobUrl: blob.url,
          pathname: blob.pathname,
          mimeType: mime,
          size: file.size,
        });
      }

      return NextResponse.json({ url: blob.url, filename: file.name, size: file.size });
    }

    // Handle raw binary with filename in header
    const filename = req.headers.get('x-filename') || 'upload.jpg';
    const rawType = contentType.split(';')[0].trim();
    const mime = resolveMime(rawType, filename);
    if (!mime) return NextResponse.json({ error: `File type not allowed. Got "${rawType}" for "${filename}". Allowed: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 });

    const body = await req.arrayBuffer();
    if (body.byteLength > MAX_SIZE) return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
    if (body.byteLength === 0) return NextResponse.json({ error: 'Empty file body' }, { status: 400 });

    const hash = sha256Hex(body);
    const extension = resolveExtension(filename, mime);
    const pathname = `${auth.tenantId}/media/${hash}${extension}`;

    const blob = await put(pathname, body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: mime,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const db = getDb();
    const [existing] = await db.select({ id: mediaAssets.id }).from(mediaAssets)
      .where(and(eq(mediaAssets.tenantId, auth.tenantId), eq(mediaAssets.blobUrl, blob.url)))
      .limit(1);
    if (!existing) {
      await db.insert(mediaAssets).values({
        tenantId: auth.tenantId,
        filename,
        blobUrl: blob.url,
        pathname: blob.pathname,
        mimeType: mime,
        size: body.byteLength,
      });
    }

    return NextResponse.json({ url: blob.url, filename, size: body.byteLength });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Upload Error]', message);
    return NextResponse.json({ error: 'Upload failed', details: message }, { status: 500 });
  }
}

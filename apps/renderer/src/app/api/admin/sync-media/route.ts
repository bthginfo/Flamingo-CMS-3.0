import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pageSections, mediaAssets, tenants, globalSettings } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

const BLOB_URL_REGEX = /https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[^\s"')]+/g;

export async function GET(req: NextRequest) {
  const expected = process.env.PREVIEW_SECRET;
  const authorization = req.headers.get('authorization') || '';
  const secret = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : (req.headers.get('x-preview-secret') || '');
  const providedBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expected || '');
  const isValid = Boolean(expected)
    && providedBuffer.length === expectedBuffer.length
    && timingSafeEqual(providedBuffer, expectedBuffer);
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tenantSlug = req.nextUrl.searchParams.get('tenant');
  const db = getDb();

  // Find tenant by slug (required for multi-tenant, fallback for standalone)
  const [tenant] = tenantSlug
    ? await db.select().from(tenants).where(eq(tenants.slug, tenantSlug)).limit(1)
    : process.env.FIXED_TENANT_ID
      ? await db.select().from(tenants).where(eq(tenants.id, process.env.FIXED_TENANT_ID)).limit(1)
      : await db.select().from(tenants).limit(1);
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  // Get all sections for this tenant
  const sections = await db.select({ data: pageSections.data })
    .from(pageSections)
    .where(eq(pageSections.tenantId, tenant.id));

  // Also scan global settings (logo, OG images etc.)
  const [settings] = await db.select({ brand: globalSettings.brand, contact: globalSettings.contact })
    .from(globalSettings)
    .where(eq(globalSettings.tenantId, tenant.id));

  // Extract all blob URLs from section data + settings
  const allUrls = new Set<string>();
  const scanJson = (obj: unknown) => {
    const json = JSON.stringify(obj);
    const matches = json.match(BLOB_URL_REGEX);
    if (matches) matches.forEach(url => allUrls.add(url));
  };
  for (const section of sections) scanJson(section.data);
  if (settings) { scanJson(settings.brand); scanJson(settings.contact); }

  // Get existing media records
  const existing = await db.select({ blobUrl: mediaAssets.blobUrl })
    .from(mediaAssets)
    .where(eq(mediaAssets.tenantId, tenant.id));
  const existingUrls = new Set(existing.map(e => e.blobUrl));

  // Insert missing ones
  const missing = [...allUrls].filter(url => !existingUrls.has(url));
  let inserted = 0;

  for (const url of missing) {
    const pathname = new URL(url).pathname.slice(1); // remove leading /
    const filename = pathname.split('/').pop() || 'unknown';
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (ext === 'svg') continue;
    const mimeType = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'gif' ? 'image/gif' : ext === 'avif' ? 'image/avif' : 'image/webp';

    await db.insert(mediaAssets).values({
      tenantId: tenant.id,
      blobUrl: url,
      pathname,
      filename,
      mimeType,
      size: 0, // unknown from URL alone
    });
    inserted++;
  }

  return NextResponse.json({
    tenant: tenantSlug,
    totalBlobUrls: allUrls.size,
    alreadyInMedia: existingUrls.size,
    newlyInserted: inserted,
  });
}

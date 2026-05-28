import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pageSections, mediaAssets, tenants, globalSettings } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

const BLOB_URL_REGEX = /https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[^\s"')]+/g;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') || '';
  const validSecrets = [process.env.PREVIEW_SECRET, process.env.NEXT_PUBLIC_PREVIEW_SECRET].filter(Boolean) as string[];
  const isValid = validSecrets.some(expected => {
    if (!expected) return false;
    const bufA = Buffer.from(secret);
    const bufB = Buffer.from(expected);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  });
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
    const mimeType = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : 'image/webp';

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

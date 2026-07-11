import { NextRequest, NextResponse } from 'next/server';
import { normalizeGoogleFontFamilies } from '@/lib/font-proxy';

const CSS_CACHE = 'public, max-age=86400, stale-while-revalidate=604800';
const FONT_CACHE = 'public, max-age=31536000, immutable';
const FONT_HOST = 'fonts.gstatic.com';

function encodeAssetUrl(url: string): string {
  return Buffer.from(url, 'utf8').toString('base64url');
}

function decodeAssetUrl(value: string): URL | null {
  if (!/^[a-zA-Z0-9_-]{1,2048}$/.test(value)) return null;
  try {
    const url = new URL(Buffer.from(value, 'base64url').toString('utf8'));
    return url.protocol === 'https:' && url.hostname === FONT_HOST ? url : null;
  } catch {
    return null;
  }
}

async function proxyFontAsset(encoded: string) {
  const url = decodeAssetUrl(encoded);
  if (!url) return NextResponse.json({ error: 'Invalid font asset' }, { status: 400 });

  const upstream = await fetch(url, { next: { revalidate: 31_536_000 } });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Font asset unavailable' }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Cache-Control': FONT_CACHE,
      'Content-Type': upstream.headers.get('content-type') || 'font/woff2',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function GET(request: NextRequest) {
  const asset = request.nextUrl.searchParams.get('asset');
  if (asset) return proxyFontAsset(asset);

  const families = normalizeGoogleFontFamilies(request.nextUrl.searchParams.getAll('family'));
  if (families.length === 0) {
    return NextResponse.json({ error: 'No supported font family' }, { status: 400 });
  }

  const upstreamUrl = new URL('https://fonts.googleapis.com/css2');
  for (const family of families) upstreamUrl.searchParams.append('family', `${family}:wght@400;500;600;700;800`);
  upstreamUrl.searchParams.set('display', 'swap');

  const upstream = await fetch(upstreamUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/124 Safari/537.36' },
    next: { revalidate: 86_400 },
  });
  if (!upstream.ok) return NextResponse.json({ error: 'Font stylesheet unavailable' }, { status: 502 });

  const css = (await upstream.text()).replace(
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g,
    (_match, url: string) => `url("/api/fonts/google?asset=${encodeAssetUrl(url)}")`,
  );

  return new NextResponse(css, {
    headers: {
      'Cache-Control': CSS_CACHE,
      'Content-Type': 'text/css; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

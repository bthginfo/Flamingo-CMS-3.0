'use client';

import { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type IgPost = {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  caption: string | null;
  timestamp: string;
};

const COLUMN_CLASSES: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  6: 'grid-cols-3 md:grid-cols-6',
};

function previewImage(p: IgPost): string {
  if (p.mediaType === 'VIDEO') return p.thumbnailUrl || p.mediaUrl;
  return p.mediaUrl;
}

function trimCaption(s: string | null, n: number) {
  if (!s) return '';
  const clean = s.replace(/\s+/g, ' ').trim();
  return clean.length > n ? `${clean.slice(0, n)}...` : clean;
}

export function InstagramFeedSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const columns = (data.columns as number) || 3;
  const maxPosts = Math.min(Math.max((data.maxPosts as number) || 9, 3), 24);
  const showCaptions = data.showCaptions !== false;
  const showProfileLink = data.showProfileLink !== false;
  const ctaLabel = (data.ctaLabel as string) || 'Auf Instagram folgen';

  // IMPORTANT: SSR + first client render MUST be identical (skeleton state).
  // Anything dynamic (real posts, fetched username, hide-when-not-connected)
  // only happens AFTER mount to avoid React hydration error #418.
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<IgPost[]>([]);
  const [username, setUsername] = useState<string>('');
  const [connected, setConnected] = useState<boolean | null>(null);

  // In live-preview (admin) the global tenantId is injected. We use that as a
  // signal to ALWAYS render the section UI (including text fields) so editors
  // can author headlines/badges/CTAs even before Instagram is connected.
  const isPreview = typeof window !== 'undefined'
    && Boolean((window as unknown as { __FLAMINGO_TENANT_ID__?: string }).__FLAMINGO_TENANT_ID__);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    // Build the feed URL with the right tenant signal:
    //   - Live preview (admin) injects window.__FLAMINGO_TENANT_ID__ so we can
    //     ask for the session-gated tenantId variant.
    //   - Public shared-renderer pages use the first path segment as slug.
    //   - Custom-domain tenants need no hint (host header is enough).
    const injectedTenantId = typeof window !== 'undefined' ? (window as unknown as { __FLAMINGO_TENANT_ID__?: string }).__FLAMINGO_TENANT_ID__ : '';
    let qs = `limit=${maxPosts}`;
    if (injectedTenantId) {
      qs += `&tenantId=${encodeURIComponent(injectedTenantId)}`;
    } else if (typeof window !== 'undefined') {
      // Demo URLs look like /demo/<industry>/... - the tenant slug is
      // `demo-<industry>`, not the literal "demo" prefix. For everything else
      // the first path segment IS the tenant slug (shared-renderer style).
      const segs = window.location.pathname.split('/').filter(Boolean);
      const slug = segs[0] === 'demo' && segs[1] ? `demo-${segs[1]}` : segs[0];
      if (slug) qs += `&slug=${encodeURIComponent(slug)}`;
    }
    // Optional per-section override: borrow another demo tenant's feed.
    // The API enforces isDemo=true on the override slug.
    const sourceSlug = (data.sourceTenantSlug as string | undefined)?.trim();
    if (sourceSlug) qs += `&fromSlug=${encodeURIComponent(sourceSlug)}`;
    fetch(`/api/instagram/feed?${qs}`)
      .then(r => r.json())
      .then((d: { connected: boolean; username?: string; posts?: IgPost[] }) => {
        if (cancelled) return;
        setConnected(d.connected);
        setUsername(d.username || '');
        setPosts(d.posts || []);
      })
      .catch(() => { if (!cancelled) setConnected(false); });
    return () => { cancelled = true; };
  }, [maxPosts]);

  // After mount + fetch: if no account is connected (or no posts at all),
  // render nothing on the live site so there's no broken UI.
  // Exception: in live-preview we ALWAYS render so the editor can author texts.
  if (!isPreview && mounted && connected === false) return null;
  if (!isPreview && mounted && connected === true && posts.length === 0) return null;

  const colClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[3];
  const profileUrl = username ? `https://instagram.com/${username.replace(/^@/, '')}` : '';
  const showSkeleton = !mounted || posts.length === 0;
  const tiles: Array<IgPost | null> = showSkeleton
    ? Array.from({ length: maxPosts }, () => null)
    : posts.slice(0, maxPosts);

  // In live-preview always render the text container (even when empty) so the
  // inline edit overlays have something to attach `data-edit-path` clicks to.
  const showTextBlock = isPreview || headline || subline || badgeText;

  return (
    <div className="space-y-8">
      {showTextBlock && (
        <div className="text-center max-w-3xl mx-auto">
          {(badgeText || isPreview) && (
            <span
              className="inline-block text-xs font-semibold tracking-wider uppercase mb-3 section-badge px-3 py-1 rounded-full"
              style={{ color: 'var(--token-badge-text)', backgroundColor: 'var(--token-badge-bg)' }}
              data-edit-path="badgeText"
            >
              {badgeText || (isPreview ? 'Badge' : '')}
            </span>
          )}
          {(headline || isPreview) && (
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: 'var(--token-heading, inherit)' }}
              data-edit-path="headline"
            >
              {headline || (isPreview ? 'Überschrift' : '')}
            </h2>
          )}
          {(subline || isPreview) && (
            <p
              className="mt-3 text-base md:text-lg"
              style={{ color: 'var(--token-body, inherit)' }}
              data-edit-path="subline"
            >
              {subline || (isPreview ? 'Unterzeile' : '')}
            </p>
          )}
        </div>
      )}

      <div className={`grid gap-3 ${colClass}`}>
        {tiles.map((p, idx) => {
          if (!p) {
            return (
              <div
                key={`skeleton-${idx}`}
                className="rounded-xl bg-[color:var(--token-section-bg-alt,var(--token-card-bg))] animate-pulse"
                style={{ aspectRatio: '1 / 1' }}
              />
            );
          }
          return (
            <a
              key={p.id}
              href={p.permalink}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative overflow-hidden rounded-xl bg-[color:var(--token-section-bg-alt,var(--token-card-bg))]"
              style={{ aspectRatio: '1 / 1' }}
              title={trimCaption(p.caption, 120)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage(p)}
                alt={trimCaption(p.caption, 80) || 'Instagram-Beitrag'}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {p.mediaType === 'VIDEO' && (
                <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-[var(--token-on-dark-heading,white)]">VIDEO</span>
              )}
              {p.mediaType === 'CAROUSEL_ALBUM' && (
                <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-[var(--token-on-dark-heading,white)]">ALBUM</span>
              )}
              {showCaptions && p.caption && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="line-clamp-3 text-xs leading-snug text-[var(--token-on-dark-heading,white)]">{trimCaption(p.caption, 180)}</p>
                </div>
              )}
            </a>
          );
        })}
      </div>

      {showProfileLink && (profileUrl || isPreview) && (
        <div className="flex justify-center">
          <a
            href={profileUrl || '#'}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--token-btn-bg)',
              color: 'var(--token-btn-text)',
            }}
          >
            <Instagram className="h-4 w-4" />
            <span data-edit-path="ctaLabel">{ctaLabel}</span>{username ? ` (@${username.replace(/^@/, '')})` : ''}
          </a>
        </div>
      )}
    </div>
  );
}

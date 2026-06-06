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
  return clean.length > n ? `${clean.slice(0, n)}…` : clean;
}

export function InstagramFeedSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const layout = (data.layout as 'grid' | 'masonry') || 'grid';
  const columns = (data.columns as number) || 3;
  const maxPosts = Math.min(Math.max((data.maxPosts as number) || 9, 3), 24);
  const showCaptions = data.showCaptions !== false;
  const showProfileLink = data.showProfileLink !== false;
  const ctaLabel = (data.ctaLabel as string) || 'Auf Instagram folgen';
  // Preview data (editor live preview) — used when the renderer is rendered
  // inside the editor before any real posts exist.
  const previewPosts = (data.posts as IgPost[] | undefined) || [];

  const [posts, setPosts] = useState<IgPost[]>(previewPosts);
  const [username, setUsername] = useState<string>((data.username as string) || '');
  const [loading, setLoading] = useState(previewPosts.length === 0);
  const [connected, setConnected] = useState<boolean>(previewPosts.length > 0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/instagram/feed?limit=${maxPosts}`)
      .then(r => r.json())
      .then((d: { connected: boolean; username?: string; posts?: IgPost[] }) => {
        if (cancelled) return;
        setConnected(d.connected);
        setUsername(d.username || '');
        setPosts(d.posts || []);
      })
      .catch(() => { /* swallow — show empty state */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [maxPosts]);

  if (!loading && !connected && posts.length === 0) {
    // Render nothing on the public site if not connected — prevents broken UI.
    return null;
  }

  const colClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[3];
  const profileUrl = username ? `https://instagram.com/${username.replace(/^@/, '')}` : '';

  return (
    <div className="space-y-8">
      {(headline || subline || badgeText) && (
        <div className="text-center max-w-3xl mx-auto">
          {badgeText && (
            <span
              className="inline-block text-xs font-semibold tracking-wider uppercase mb-3 section-badge px-3 py-1 rounded-full"
              style={{ color: 'var(--style-badge-text, var(--style-accent-color, currentColor))', backgroundColor: 'var(--style-badge-bg, rgba(0,0,0,0.04))' }}
            >
              {badgeText}
            </span>
          )}
          {headline && (
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--style-heading-color, inherit)' }}>{headline}</h2>
          )}
          {subline && (
            <p className="mt-3 text-base md:text-lg" style={{ color: 'var(--style-body-color, inherit)' }}>{subline}</p>
          )}
        </div>
      )}

      <div className={`grid gap-3 ${colClass} ${layout === 'masonry' ? 'auto-rows-[200px]' : ''}`}>
        {posts.slice(0, maxPosts).map((p, idx) => {
          const tall = layout === 'masonry' && idx % 5 === 0;
          return (
            <a
              key={p.id}
              href={p.permalink}
              target="_blank"
              rel="noreferrer noopener"
              className={`group relative overflow-hidden rounded-xl bg-zinc-100 ${tall ? 'row-span-2' : ''}`}
              style={{ aspectRatio: layout === 'masonry' && !tall ? undefined : '1 / 1' }}
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
                <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">VIDEO</span>
              )}
              {p.mediaType === 'CAROUSEL_ALBUM' && (
                <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">ALBUM</span>
              )}
              {showCaptions && p.caption && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="line-clamp-3 text-xs leading-snug text-white">{trimCaption(p.caption, 180)}</p>
                </div>
              )}
            </a>
          );
        })}
      </div>

      {showProfileLink && profileUrl && (
        <div className="flex justify-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--brand-btn-bg, var(--style-button-bg, #111))',
              color: 'var(--brand-btn-text, var(--style-button-text, #fff))',
            }}
          >
            <Instagram className="h-4 w-4" />
            {ctaLabel}{username ? ` (@${username.replace(/^@/, '')})` : ''}
          </a>
        </div>
      )}
    </div>
  );
}

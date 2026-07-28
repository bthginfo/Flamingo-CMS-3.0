'use client';

import { ArrowUpRight, PlayCircle } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { visibleText } from '@/lib/visible-content';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Reel = {
  eyebrow?: string;
  title?: string;
  text?: string;
  videoSrc?: string;
  poster?: string;
  meta?: string;
  ctaLabel?: string;
  ctaHref?: string;
  autoplay?: boolean;
  autoPoster?: boolean;
};

type Props = { data: Record<string, unknown> };

const SCHUKTUEW_REFERENCE_REEL_SRC = '/media/schuktuew-reference-reel.mp4';

function safeAspectRatio(value: unknown) {
  const ratio = String(value || '9/16');
  return ['9/16', '4/5', '1/1', '16/9'].includes(ratio) ? ratio : '9/16';
}

function isSchuktuewReelShowcase(data: Record<string, unknown>, reels: Reel[]) {
  const haystack = [
    data.badge,
    data.headline,
    data.subline,
    ...(Array.isArray(data.tags) ? data.tags : []),
    ...reels.flatMap((reel) => [reel.eyebrow, reel.title, reel.text, reel.meta, reel.videoSrc, reel.poster]),
  ]
    .map((value) => visibleText(String(value || '')).toLocaleLowerCase('de-DE'))
    .join(' ');

  return (
    haystack.includes('reels & motion')
    || haystack.includes('alles aus einer hand')
    || haystack.includes('sport in bewegung')
    || haystack.includes('schuktuew')
  );
}

function normalizeSchuktuewReels(reels: Reel[]) {
  const [first, second, third, ...rest] = reels;
  const normalized: Reel[] = [];

  if (first) {
    normalized.push({
      ...first,
      eyebrow: first?.eyebrow || 'Production',
      meta: 'Produktion',
      title: 'Foto, Film und Schnitt aus einer Hand',
      text: 'Eine vertikale Referenz für Marken, die nicht nur einzelne Bilder, sondern direkt nutzbaren Content brauchen.',
      poster: '',
      autoPoster: true,
      ctaLabel: first?.ctaLabel || 'Anfragen',
      ctaHref: first?.ctaHref || '/kontakt',
    });
  }

  if (second) {
    normalized.push({
      ...second,
      eyebrow: second?.eyebrow || 'Golf',
      meta: 'Sport Reel',
      title: 'Sport als bewegte Referenz',
      text: 'Golf, Timing und Bewegung im Reel-Format – konzipiert für Social, Website und Kampagnenkontext.',
      poster: '',
      autoPoster: true,
      ctaLabel: second?.ctaLabel || 'Sport ansehen',
      ctaHref: second?.ctaHref || '/portfolio',
    });
  }

  normalized.push({
    ...third,
    eyebrow: third?.eyebrow || 'Referenz',
    meta: 'Video-Asset',
    title: third?.title || 'Bewegte Bildstrecke',
    text: third?.text || 'Ein drittes Hochformat-Beispiel für die Übersetzung von Bildsprache in kurze, verwertbare Video-Assets.',
    videoSrc: third?.videoSrc || SCHUKTUEW_REFERENCE_REEL_SRC,
    poster: '',
    autoPoster: true,
    ctaLabel: third?.ctaLabel || 'Produktion planen',
    ctaHref: third?.ctaHref || '/kontakt',
    autoplay: third?.autoplay ?? false,
  });

  return [...normalized, ...rest].slice(0, 5);
}

function ReelFrame({ reel, index, featured = false, aspectRatio }: { reel: Reel; index: number; featured?: boolean; aspectRatio: string }) {
  const videoSrc = safeContentUrl(reel.videoSrc || '');
  const explicitPoster = safeContentUrl(reel.poster || '');
  const [generatedPoster, setGeneratedPoster] = useState('');
  const poster = generatedPoster || explicitPoster;
  const href = safeContentUrl(reel.ctaHref || '');
  const ctaLabel = visibleText(reel.ctaLabel || '');
  const posterSeek = useMemo(() => 0.8 + (index % 3) * 0.35, [index]);
  const capturePoster = useCallback((video: HTMLVideoElement) => {
    if (!reel.autoPoster || generatedPoster || !video.videoWidth || !video.videoHeight) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setGeneratedPoster(canvas.toDataURL('image/jpeg', 0.86));
    } catch {
      // Some CDN video responses may block canvas extraction. The real video
      // remains visible/playable; only the generated poster is skipped.
    }
  }, [generatedPoster, reel.autoPoster]);
  return (
    <article
      className={`group relative overflow-hidden rounded-[calc(var(--token-card-radius)*1.15)] border border-[color:var(--token-card-border)] bg-[color:var(--token-card-bg)] shadow-[0_30px_90px_var(--token-shadow)] ${featured ? 'lg:translate-y-8' : ''}`}
      data-card
      data-color-context="dark"
      data-edit-collection="reels"
      data-edit-index={index}
    >
      <div className="relative bg-black" style={{ aspectRatio }}>
        {videoSrc ? (
          <video
            className="h-full w-full object-cover"
            src={videoSrc}
            poster={poster || undefined}
            controls
            playsInline
            crossOrigin="anonymous"
            muted={Boolean(reel.autoplay)}
            loop={Boolean(reel.autoplay)}
            autoPlay={Boolean(reel.autoplay)}
            preload={reel.autoPoster || featured ? 'metadata' : 'none'}
            onLoadedMetadata={(event) => {
              if (!reel.autoPoster || explicitPoster || generatedPoster) return;
              const video = event.currentTarget;
              const duration = Number.isFinite(video.duration) ? video.duration : posterSeek + 0.2;
              const target = Math.min(posterSeek, Math.max(0.1, duration - 0.1));
              try {
                if (Math.abs(video.currentTime - target) > 0.05) video.currentTime = target;
              } catch {
                capturePoster(video);
              }
            }}
            onSeeked={(event) => capturePoster(event.currentTarget)}
            onLoadedData={(event) => capturePoster(event.currentTarget)}
            data-edit-path="videoSrc"
          />
        ) : poster ? (
          <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="poster" />
        ) : (
          <EmptyVisual label="Reel hochladen" />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05)_0%,rgba(0,0,0,.06)_48%,rgba(0,0,0,.76)_100%)]" />
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-white backdrop-blur">
          <PlayCircle size={14} />
          <span data-edit-path="eyebrow">{reel.eyebrow || `Reel ${String(index + 1).padStart(2, '0')}`}</span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        {reel.meta && <p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-[color:var(--token-eyebrow)]" data-edit-path="meta">{reel.meta}</p>}
        {reel.title && <h3 className="max-w-sm text-2xl font-black leading-none tracking-[-.045em] text-[color:var(--token-on-dark-heading)]" data-edit-path="title">{reel.title}</h3>}
        {reel.text && <p className="mt-3 max-w-sm text-sm leading-6 text-[color:var(--token-on-dark-body)]" data-edit-path="text">{plain(reel.text)}</p>}
        {href && ctaLabel && (
          <a href={href} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-4 py-2 text-xs font-black text-[color:var(--token-btn-text)] shadow-lg transition hover:-translate-y-0.5" data-edit-link="ctaHref">
            <span data-edit-path="ctaLabel">{ctaLabel}</span>
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export function VerticalReelShowcaseSection({ data }: Props) {
  const rawReels = Array.isArray(data.reels) ? (data.reels as Reel[]).filter((reel) => reel && (reel.videoSrc || reel.poster || reel.title)) : [];
  if (!rawReels.length) return null;
  const isSchuktuew = isSchuktuewReelShowcase(data, rawReels);
  const reels = isSchuktuew ? normalizeSchuktuewReels(rawReels) : rawReels;
  const aspectRatio = safeAspectRatio(data.aspectRatio);
  const featured = reels[0];
  const rest = reels.slice(1, 5);
  const headline = isSchuktuew ? 'Video-Referenzen für Social, Sport und Kampagne.' : String(data.headline || '');
  const subline = isSchuktuew
    ? 'Kurze vertikale Arbeiten als direkte Referenz: Produktion aus einer Hand, Sportmoment und bewegte Bildstrecke im nativen Reel-Format.'
    : String(data.subline || '');
  return (
    <section className="relative isolate overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 text-[color:var(--token-body)] md:px-8 md:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--token-accent)_26%,transparent),transparent_35%),radial-gradient(circle_at_80%_10%,color-mix(in_srgb,var(--token-heading)_18%,transparent),transparent_38%)]" />
      <div className="mx-auto max-w-7xl">
        <AdvancedIntro
          badge={String(data.badge || '')}
          headline={headline}
          subline={subline}
          aside={<AdvancedLink cta={data.cta as AdvancedCta} className="mt-6" />}
        />
        <div className="mt-12 grid items-start gap-5 lg:grid-cols-[minmax(17rem,.62fr)_minmax(0,1.38fr)] lg:gap-8">
          <ReelFrame reel={featured} index={0} featured aspectRatio={aspectRatio} />
          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((reel, index) => <ReelFrame key={`${reel.title || reel.videoSrc}-${index}`} reel={reel} index={index + 1} aspectRatio={aspectRatio} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

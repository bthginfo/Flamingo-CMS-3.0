'use client';

import { ArrowUpRight, Play, PlayCircle } from 'lucide-react';
import { useRef, useState } from 'react';
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

const SCHUKTUEW_REELS = {
  agency: {
    src: '/seed-media/schuktuew/alexander-schuktuew-agency-reel.mp4',
    poster: '/seed-media/schuktuew/alexander-schuktuew-agency-reel-poster.jpg',
  },
  golf: {
    src: '/seed-media/schuktuew/alexander-schuktuew-golf-reel.mp4',
    poster: '/seed-media/schuktuew/alexander-schuktuew-golf-reel-poster.jpg',
  },
  reference: {
    src: '/seed-media/schuktuew/alexander-schuktuew-reference-reel.mp4',
    poster: '/seed-media/schuktuew/alexander-schuktuew-reference-reel-poster.jpg',
  },
} as const;

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
      meta: first?.meta || 'Produktion',
      title: first?.title || 'Foto, Film und Schnitt aus einer Hand',
      text: first?.text || 'Ich entwickle Foto und Film gemeinsam – vom Konzept bis zu fertigen Formaten für Website, Social Media und Kampagne.',
      videoSrc: SCHUKTUEW_REELS.agency.src,
      poster: SCHUKTUEW_REELS.agency.poster,
      autoPoster: false,
      autoplay: false,
      ctaLabel: first?.ctaLabel || 'Anfragen',
      ctaHref: first?.ctaHref || '/kontakt',
    });
  }

  if (second) {
    normalized.push({
      ...second,
      eyebrow: second?.eyebrow || 'Golf',
      meta: second?.meta || 'Sport Reel',
      title: second?.title || 'Sport in Bewegung',
      text: second?.text || 'Beim Sportfilm zählen Timing, Perspektive und Rhythmus. Daraus entsteht Bewegtbild für Social Media, Website und Kampagne.',
      videoSrc: SCHUKTUEW_REELS.golf.src,
      poster: SCHUKTUEW_REELS.golf.poster,
      autoPoster: false,
      autoplay: false,
      ctaLabel: second?.ctaLabel || 'Sport ansehen',
      ctaHref: second?.ctaHref || '/portfolio',
    });
  }

  normalized.push({
    ...third,
    eyebrow: third?.eyebrow || 'Motion',
    meta: third?.meta || 'Produktfilm',
    title: third?.title || 'Produkt im Fokus',
    text: third?.text || 'Kurze Produktfilme verdichten Licht, Bewegung und Schnitt zu einem klaren visuellen Auftritt.',
    videoSrc: SCHUKTUEW_REELS.reference.src,
    poster: SCHUKTUEW_REELS.reference.poster,
    autoPoster: false,
    ctaLabel: third?.ctaLabel || 'Produktion planen',
    ctaHref: third?.ctaHref || '/kontakt',
    autoplay: third?.autoplay ?? false,
  });

  return [...normalized, ...rest].slice(0, 5);
}

function ReelFrame({ reel, index, featured = false, aspectRatio }: { reel: Reel; index: number; featured?: boolean; aspectRatio: string }) {
  const videoSrc = safeContentUrl(reel.videoSrc || '');
  const poster = safeContentUrl(reel.poster || '');
  const href = safeContentUrl(reel.ctaHref || '');
  const ctaLabel = visibleText(reel.ctaLabel || '');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackOpen, setPlaybackOpen] = useState(Boolean(reel.autoplay));
  const [videoFailed, setVideoFailed] = useState(false);

  async function startPlayback() {
    const video = videoRef.current;
    if (!video) return;
    setPlaybackOpen(true);
    video.currentTime = 0;
    video.muted = false;
    video.loop = false;
    try {
      await video.play();
    } catch {
      setPlaybackOpen(false);
    }
  }

  return (
    <article
      className={`group relative overflow-hidden rounded-[calc(var(--token-card-radius)*1.15)] border border-[color:var(--token-card-border)] bg-[color:var(--token-card-bg)] shadow-[0_30px_90px_var(--token-shadow)] ${featured ? 'lg:translate-y-8' : ''}`}
      data-card
      data-color-context="dark"
      data-edit-collection="reels"
      data-edit-index={index}
    >
      <div className="relative bg-[var(--token-card-bg)]" style={{ aspectRatio }}>
        {videoSrc && !videoFailed ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={videoSrc}
            poster={poster || undefined}
            controls={playbackOpen}
            playsInline
            muted={Boolean(reel.autoplay)}
            loop={Boolean(reel.autoplay)}
            autoPlay={Boolean(reel.autoplay)}
            preload="metadata"
            onPlay={() => setPlaybackOpen(true)}
            onEnded={(event) => {
              event.currentTarget.currentTime = 0;
              setPlaybackOpen(false);
            }}
            onError={() => setVideoFailed(true)}
            data-edit-path="videoSrc"
          />
        ) : poster ? (
          <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="poster" />
        ) : (
          <EmptyVisual label="Reel hochladen" />
        )}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05)_0%,rgba(0,0,0,.06)_48%,rgba(0,0,0,.76)_100%)] transition-opacity duration-300 ${playbackOpen ? 'opacity-0' : 'opacity-100'}`} />
        {!playbackOpen && videoSrc && !videoFailed && (
          <button
            type="button"
            onClick={startPlayback}
            aria-label={`${reel.title || `Reel ${index + 1}`} vollständig abspielen`}
            className="absolute left-1/2 top-[42%] z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[color:color-mix(in_srgb,var(--token-on-dark-heading)_35%,transparent)] bg-[var(--token-on-dark-heading)] text-[color:var(--token-section-bg)] shadow-[0_20px_55px_rgba(0,0,0,.45)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_srgb,var(--token-on-dark-heading)_40%,transparent)] md:h-[4.5rem] md:w-[4.5rem]"
          >
            <Play className="ml-1 fill-current" size={25} aria-hidden="true" />
          </button>
        )}
        <div className={`pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_32%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_48%,transparent)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-[color:var(--token-on-dark-heading)] backdrop-blur transition-opacity duration-300 ${playbackOpen ? 'opacity-0' : 'opacity-100'}`}>
          <PlayCircle size={14} />
          <span data-edit-path="eyebrow">{reel.eyebrow || `Reel ${String(index + 1).padStart(2, '0')}`}</span>
        </div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 md:p-6 ${playbackOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
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
  const headline = String(data.headline || (isSchuktuew ? 'Bewegtbild für Social, Sport und Kampagne.' : ''));
  const subline = String(data.subline || (isSchuktuew
    ? 'Ich produziere vertikale Filme für Markenauftritte, Sportkommunikation und Social Media – von der Idee bis zum fertigen Schnitt.'
    : ''));
  return (
    <section className="relative isolate overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 text-[color:var(--token-body)] [--_quote-role:var(--token-quote)] md:px-8 md:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--token-accent)_26%,transparent),transparent_35%),radial-gradient(circle_at_80%_10%,color-mix(in_srgb,var(--token-card-bg)_18%,transparent),transparent_38%)]" />
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

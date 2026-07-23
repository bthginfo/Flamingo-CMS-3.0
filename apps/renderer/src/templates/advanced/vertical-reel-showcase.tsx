import { ArrowUpRight, Film, PlayCircle } from 'lucide-react';
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
};

type Props = { data: Record<string, unknown> };

function safeAspectRatio(value: unknown) {
  const ratio = String(value || '9/16');
  return ['9/16', '4/5', '1/1', '16/9'].includes(ratio) ? ratio : '9/16';
}

function ReelFrame({ reel, index, featured = false, aspectRatio }: { reel: Reel; index: number; featured?: boolean; aspectRatio: string }) {
  const videoSrc = safeContentUrl(reel.videoSrc || '');
  const poster = safeContentUrl(reel.poster || '');
  const href = safeContentUrl(reel.ctaHref || '');
  const ctaLabel = visibleText(reel.ctaLabel || '');
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
            muted={Boolean(reel.autoplay)}
            loop={Boolean(reel.autoplay)}
            autoPlay={Boolean(reel.autoplay)}
            preload={featured ? 'metadata' : 'none'}
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
          <a href={href} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:-translate-y-0.5" data-edit-link="ctaHref">
            <span data-edit-path="ctaLabel">{ctaLabel}</span>
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export function VerticalReelShowcaseSection({ data }: Props) {
  const reels = Array.isArray(data.reels) ? (data.reels as Reel[]).filter((reel) => reel && (reel.videoSrc || reel.poster || reel.title)) : [];
  if (!reels.length) return null;
  const aspectRatio = safeAspectRatio(data.aspectRatio);
  const featured = reels[0];
  const rest = reels.slice(1, 5);
  return (
    <section className="relative isolate overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 text-[color:var(--token-body)] md:px-8 md:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--token-accent)_26%,transparent),transparent_35%),radial-gradient(circle_at_80%_10%,color-mix(in_srgb,var(--token-heading)_18%,transparent),transparent_38%)]" />
      <div className="mx-auto max-w-7xl">
        <AdvancedIntro
          badge={String(data.badge || '')}
          headline={String(data.headline || '')}
          subline={String(data.subline || '')}
          aside={<AdvancedLink cta={data.cta as AdvancedCta} className="mt-6" />}
        />
        <div className="mt-12 grid items-start gap-5 lg:grid-cols-[minmax(17rem,.62fr)_minmax(0,1.38fr)] lg:gap-8">
          <ReelFrame reel={featured} index={0} featured aspectRatio={aspectRatio} />
          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((reel, index) => <ReelFrame key={`${reel.title || reel.videoSrc}-${index}`} reel={reel} index={index + 1} aspectRatio={aspectRatio} />)}
            {rest.length < 2 && (
              <div className="flex min-h-64 flex-col justify-between rounded-[var(--token-card-radius)] border border-dashed border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] p-6">
                <Film className="text-[color:var(--token-accent)]" />
                <p className="max-w-xs text-sm leading-6 text-[color:var(--token-muted)]">Weitere Reels können jederzeit ergänzt werden. Hochformat bleibt automatisch erhalten.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

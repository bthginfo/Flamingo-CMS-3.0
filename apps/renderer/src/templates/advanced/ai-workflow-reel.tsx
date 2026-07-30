'use client';

import { Bot, CheckCircle2, GitBranch, Play, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { visibleText } from '@/lib/visible-content';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Step = { kicker?: string; title?: string; text?: string; proof?: string };
type Props = { data: Record<string, unknown> };

const SCHUKTUEW_WORKFLOW_REEL = {
  src: '/seed-media/schuktuew/alexander-schuktuew-agency-reel.mp4',
  poster: '/seed-media/schuktuew/alexander-schuktuew-agency-reel-poster.jpg',
} as const;

function isSchuktuewWorkflow(data: Record<string, unknown>, source: string) {
  const media = (data.media && typeof data.media === 'object' ? data.media : {}) as Record<string, unknown>;
  const haystack = [
    data.badge,
    data.headline,
    data.subline,
    media.caption,
    source,
  ]
    .map((value) => visibleText(String(value || '')).toLocaleLowerCase('de-DE'))
    .join(' ');

  return (
    haystack.includes('schuktuew')
    || haystack.includes('foto, film und content')
    || haystack.includes('/schuktuew/agencyreel.mp4')
  );
}

function WorkflowVideo({ data }: { data: Record<string, unknown> }) {
  const media = (data.media && typeof data.media === 'object' ? data.media : {}) as Record<string, unknown>;
  const storedVideoSrc = String(media.videoSrc || data.videoSrc || '');
  const schuktuewWorkflow = isSchuktuewWorkflow(data, storedVideoSrc);
  const videoSrc = safeContentUrl(schuktuewWorkflow ? SCHUKTUEW_WORKFLOW_REEL.src : storedVideoSrc);
  const poster = safeContentUrl(
    schuktuewWorkflow
      ? SCHUKTUEW_WORKFLOW_REEL.poster
      : String(media.poster || data.poster || ''),
  );
  const caption = visibleText(String(media.caption || data.caption || ''));
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackOpen, setPlaybackOpen] = useState(false);
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
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
      <div className="relative overflow-hidden rounded-[calc(var(--token-card-radius)*1.4)] border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] bg-[var(--token-card-bg)] shadow-[0_42px_120px_var(--token-shadow)]" style={{ aspectRatio: '9/16' }} data-card data-color-context="dark">
        {videoSrc && !videoFailed ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={poster || undefined}
            controls={playbackOpen}
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            onPlay={() => setPlaybackOpen(true)}
            onEnded={(event) => {
              event.currentTarget.currentTime = 0;
              setPlaybackOpen(false);
            }}
            onError={() => setVideoFailed(true)}
            data-edit-path="media.videoSrc"
          />
        ) : poster ? (
          <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="media.poster" />
        ) : (
          <EmptyVisual label="Workflow Reel" />
        )}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(0,0,0,.76)_100%)] transition-opacity duration-300 ${playbackOpen ? 'opacity-0' : 'opacity-100'}`} />
        {!playbackOpen && videoSrc && !videoFailed && (
          <button
            type="button"
            onClick={startPlayback}
            aria-label="Video vollständig abspielen"
            className="absolute left-1/2 top-[44%] z-20 grid h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--token-card-border)] bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] shadow-[0_22px_60px_rgba(0,0,0,.48)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--token-accent)]"
          >
            <Play className="ml-1 fill-current" size={26} aria-hidden="true" />
          </button>
        )}
        {caption && (
          <p className={`absolute inset-x-5 bottom-5 text-sm font-bold leading-5 text-[color:var(--token-on-dark-heading)] transition-opacity duration-300 ${playbackOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}`} data-edit-path="media.caption">
            {caption}
          </p>
        )}
      </div>
      <div aria-hidden="true" className="absolute -right-8 -top-8 -z-10 h-40 w-40 rounded-full bg-[color:var(--token-accent)] opacity-30 blur-3xl" />
    </div>
  );
}

export function AiWorkflowReelSection({ data }: Props) {
  const steps = Array.isArray(data.steps) ? (data.steps as Step[]).filter((step) => step?.title || step?.text) : [];
  if (!steps.length && !data.headline) return null;
  return (
    <section className="relative isolate overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 md:px-8 md:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--token-card-bg)_94%,black)_0%,var(--token-section-bg)_58%,color-mix(in_srgb,var(--token-accent)_18%,var(--token-section-bg))_100%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:gap-16">
        <WorkflowVideo data={data} />
        <div data-color-context="dark">
          <AdvancedIntro
            compact
            badge={String(data.badge || '')}
            headline={String(data.headline || '')}
            subline={String(data.subline || '')}
          />
          <div className="mt-8 space-y-3">
            {steps.map((step, index) => (
              <article key={`${step.title}-${index}`} className="group grid gap-4 rounded-[var(--token-card-radius)] border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_7%,transparent)] p-4 backdrop-blur transition hover:bg-[color:color-mix(in_srgb,var(--token-btn-bg)_10%,var(--token-card-bg))] sm:grid-cols-[4rem_1fr]" data-card data-edit-collection="steps" data-edit-index={index}>
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--token-accent)_24%,white_8%)] text-[color:var(--token-on-dark-heading)] shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_18px_40px_rgba(0,0,0,.22)]">
                  {index === 0 ? <Bot size={24} strokeWidth={2.2} /> : index === steps.length - 1 ? <CheckCircle2 className="text-[color:var(--token-check)]" size={24} strokeWidth={2.2} /> : <GitBranch size={24} strokeWidth={2.2} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{step.kicker || `Phase ${String(index + 1).padStart(2, '0')}`}</p>
                  {step.title && <h3 className="mt-1 text-xl font-black tracking-[-.025em] text-[color:var(--token-on-dark-heading)]" data-edit-path="title">{step.title}</h3>}
                  {step.text && <p className="mt-2 text-sm leading-6 text-[color:var(--token-on-dark-body)]" data-edit-path="text">{plain(step.text)}</p>}
                  {step.proof && <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] px-3 py-1 text-[11px] font-bold text-[color:var(--token-on-dark-muted)]" data-edit-path="proof"><Sparkles size={13} />{step.proof}</p>}
                </div>
              </article>
            ))}
          </div>
          <AdvancedLink cta={data.cta as AdvancedCta} className="mt-8" />
        </div>
      </div>
    </section>
  );
}

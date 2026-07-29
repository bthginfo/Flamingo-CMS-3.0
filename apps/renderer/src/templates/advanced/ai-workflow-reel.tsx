'use client';

import { Bot, CheckCircle2, GitBranch, Sparkles } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { visibleText } from '@/lib/visible-content';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Step = { kicker?: string; title?: string; text?: string; proof?: string };
type Props = { data: Record<string, unknown> };

function WorkflowVideo({ data }: { data: Record<string, unknown> }) {
  const media = (data.media && typeof data.media === 'object' ? data.media : {}) as Record<string, unknown>;
  const videoSrc = safeContentUrl(String(media.videoSrc || data.videoSrc || ''));
  const explicitPoster = safeContentUrl(String(media.poster || data.poster || ''));
  const [generatedPoster, setGeneratedPoster] = useState('');
  const poster = generatedPoster || explicitPoster;
  const posterSeek = useMemo(() => 0.9, []);
  const caption = visibleText(String(media.caption || data.caption || ''));
  const capturePoster = useCallback((video: HTMLVideoElement) => {
    if (explicitPoster || generatedPoster || !video.videoWidth || !video.videoHeight) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setGeneratedPoster(canvas.toDataURL('image/jpeg', 0.86));
    } catch {
      // Cross-origin video frames can block canvas extraction. In that case the
      // real video remains visible/playable; only the generated poster is skipped.
    }
  }, [explicitPoster, generatedPoster]);
  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
      <div className="relative overflow-hidden rounded-[calc(var(--token-card-radius)*1.4)] border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] bg-[var(--token-card-bg)] shadow-[0_42px_120px_var(--token-shadow)]" style={{ aspectRatio: '9/16' }} data-card data-color-context="dark">
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={poster || undefined}
            controls
            playsInline
            preload={explicitPoster ? 'metadata' : 'auto'}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
            onLoadedMetadata={(event) => {
              if (explicitPoster || generatedPoster) return;
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
            data-edit-path="media.videoSrc"
          />
        ) : poster ? (
          <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="media.poster" />
        ) : (
          <EmptyVisual label="Workflow Reel" />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,.74)_100%)]" />
        {caption && <p className="absolute inset-x-5 bottom-5 text-sm font-bold leading-5 text-white" data-edit-path="media.caption">{caption}</p>}
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
              <article key={`${step.title}-${index}`} className="group grid gap-4 rounded-[var(--token-card-radius)] border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_7%,transparent)] p-4 backdrop-blur transition hover:bg-white/[.1] sm:grid-cols-[4rem_1fr]" data-card data-edit-collection="steps" data-edit-index={index}>
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

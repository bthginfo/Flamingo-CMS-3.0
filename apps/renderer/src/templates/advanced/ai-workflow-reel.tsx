import { Bot, CheckCircle2, GitBranch, Sparkles } from 'lucide-react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { visibleText } from '@/lib/visible-content';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Step = { kicker?: string; title?: string; text?: string; proof?: string };
type Props = { data: Record<string, unknown> };

function WorkflowVideo({ data }: { data: Record<string, unknown> }) {
  const media = (data.media && typeof data.media === 'object' ? data.media : {}) as Record<string, unknown>;
  const videoSrc = safeContentUrl(String(media.videoSrc || data.videoSrc || ''));
  const poster = safeContentUrl(String(media.poster || data.poster || ''));
  const caption = visibleText(String(media.caption || data.caption || ''));
  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
      <div className="relative overflow-hidden rounded-[calc(var(--token-card-radius)*1.4)] border border-white/15 bg-black shadow-[0_42px_120px_var(--token-shadow)]" style={{ aspectRatio: '9/16' }} data-card data-color-context="dark">
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={poster || undefined}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
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
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--token-heading)_94%,black)_0%,var(--token-section-bg)_58%,color-mix(in_srgb,var(--token-accent)_18%,var(--token-section-bg))_100%)]" />
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
              <article key={`${step.title}-${index}`} className="group grid gap-4 rounded-[var(--token-card-radius)] border border-white/10 bg-white/[.06] p-4 backdrop-blur transition hover:bg-white/[.1] sm:grid-cols-[3.2rem_1fr]" data-card data-edit-collection="steps" data-edit-index={index}>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-black">
                  {index === 0 ? <Bot size={20} /> : index === steps.length - 1 ? <CheckCircle2 size={20} /> : <GitBranch size={20} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{step.kicker || `Phase ${String(index + 1).padStart(2, '0')}`}</p>
                  {step.title && <h3 className="mt-1 text-xl font-black tracking-[-.025em] text-[color:var(--token-on-dark-heading)]" data-edit-path="title">{step.title}</h3>}
                  {step.text && <p className="mt-2 text-sm leading-6 text-[color:var(--token-on-dark-body)]" data-edit-path="text">{plain(step.text)}</p>}
                  {step.proof && <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[11px] font-bold text-[color:var(--token-on-dark-muted)]" data-edit-path="proof"><Sparkles size={13} />{step.proof}</p>}
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

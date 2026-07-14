'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';

type State = { kicker?: string; title: string; text?: string; image?: string; metricValue?: string; metricLabel?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TransformationSequenceSection({ data }: Props) {
  const states = Array.isArray(data.states) ? (data.states as State[]).filter((state) => state?.title) : [];
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = plain((data.subline as string) || '');
  const cta = (data.cta as { label?: string; href?: string }) || {};
  const ref = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!states.length) return;
    setActiveIndex(Math.min(states.length - 1, Math.max(0, Math.floor(value * states.length))));
  });

  if (!states.length) return null;
  const active = states[activeIndex] || states[0];

  const staticView = (
    <section className="bg-[var(--token-section-bg)] px-5 py-16 text-[color:var(--token-body)]">
      <div className="mx-auto max-w-5xl">
        {badge && <p className="section-badge mb-4 w-fit" data-edit-path="badge">{badge}</p>}
        {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{subline}</p>}
        <div className="mt-10 space-y-4">
          {states.map((state, index) => (
            <article key={`${state.title}-${index}`} className="grid gap-5 rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-4 sm:grid-cols-[8rem_1fr]" data-card data-edit-collection="states" data-edit-index={index}>
              {state.image && <img src={state.image} alt="" className="aspect-[4/3] w-full rounded-[calc(var(--token-card-radius)*.66)] object-cover" loading="lazy" data-edit-image="image" />}
              <div className="self-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{state.kicker || `Schritt ${index + 1}`}</p>
                <h3 className="mt-1 text-2xl font-black text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{state.title}</h3>
                {state.text && <p className="mt-2 leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(state.text)}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <div className="advanced-static-fallback md:hidden">{staticView}</div>
      <section ref={ref} className="advanced-motion-experience relative hidden bg-[var(--token-section-bg)] text-[color:var(--token-body)] md:block" style={{ height: `${Math.max(300, states.length * 78)}vh` }}>
        <div className="sticky top-0 grid h-[100svh] grid-cols-[1.15fr_.85fr] overflow-hidden">
          <div className="relative overflow-hidden bg-[var(--token-section-bg-alt)]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div key={activeIndex} initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }} transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
                {active.image ? <img src={active.image} alt="" className="h-full w-full object-cover" loading="lazy" data-edit-image="image" /> : <div className="h-full bg-[radial-gradient(circle_at_35%_35%,var(--token-accent),transparent_32%),linear-gradient(140deg,var(--token-section-bg-alt),var(--token-section-bg))]" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-8 bottom-8 z-10 flex items-end justify-between text-white" data-color-context="dark">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--token-on-dark-muted)]">Transformation</span>
              {active.metricValue && <div className="text-right"><strong className="block text-4xl font-black text-[color:var(--token-on-dark-heading)]">{active.metricValue}</strong><span className="text-xs text-[color:var(--token-on-dark-muted)]">{active.metricLabel}</span></div>}
            </div>
          </div>

          <div className="flex flex-col px-9 py-10 lg:px-14">
            <div>
              {badge && <p className="section-badge mb-4 w-fit" data-edit-path="badge">{badge}</p>}
              {headline && <h2 className="text-3xl font-black leading-[0.95] tracking-[-0.05em] text-[color:var(--token-heading)] lg:text-5xl" data-edit-path="headline">{headline}</h2>}
              {subline && <p className="mt-4 max-w-lg leading-7 text-[color:var(--token-muted)]" data-edit-path="subline">{subline}</p>}
            </div>

            <div className="my-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article key={activeIndex} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.38 }} data-edit-collection="states" data-edit-index={activeIndex}>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{active.kicker || `Phase ${String(activeIndex + 1).padStart(2, '0')}`}</p>
                  <h3 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-[color:var(--token-heading)] lg:text-6xl" data-edit-path="title">{active.title}</h3>
                  {active.text && <p className="mt-5 max-w-xl text-lg leading-8 text-[color:var(--token-body)]" data-edit-path="text">{plain(active.text)}</p>}
                  {cta.label && activeIndex === states.length - 1 && <a href={cta.href || '#'} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 text-sm font-bold text-[color:var(--token-btn-text)]"><span data-edit-path="cta.label">{cta.label}</span><ArrowRight size={16} /></a>}
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
              <span className="text-xs font-bold tabular-nums text-[color:var(--token-heading)]">{String(activeIndex + 1).padStart(2, '0')}</span>
              <div className="h-px bg-[var(--token-divider)]"><motion.div className="h-full origin-left bg-[var(--token-accent)]" style={{ scaleX: scrollYProgress }} /></div>
              <span className="text-xs tabular-nums text-[color:var(--token-muted)]">{String(states.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

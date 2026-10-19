'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';
import { useHydrationSafeReducedMotion } from '@/lib/use-hydration-safe-reduced-motion';
import { focusAfterCinematicStory } from '@/lib/cinematic-navigation';

type Chapter = { kicker?: string; title: string; text?: string; image?: string; imageAlt?: string; imagePosition?: string; ctaLabel?: string; ctaHref?: string };
type IndexedChapter = Chapter & { sourceIndex: number };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function ChapterCards({ chapters }: { chapters: IndexedChapter[] }) {
  return (
    <div className="space-y-5">
      {chapters.map((chapter, index) => (
        <article key={chapter.sourceIndex} className="overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)]" data-card data-edit-collection="chapters" data-edit-index={chapter.sourceIndex}>
          {chapter.image && <img src={chapter.image} alt={chapter.imageAlt || ''} className="aspect-[4/3] w-full object-cover" style={{ objectPosition: chapter.imagePosition || 'center' }} loading="lazy" data-edit-image="image" />}
          <div className="p-6">
            {chapter.kicker && <p className="text-xs font-bold text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{chapter.kicker}</p>}
            <h3 className="mt-2 text-2xl font-black text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{chapter.title}</h3>
            {chapter.text && <p className="mt-3 leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(chapter.text)}</p>}
            {chapter.ctaLabel && chapter.ctaHref && <a href={chapter.ctaHref} data-edit-link="ctaHref" className="mt-5 inline-flex min-h-12 items-center gap-3 font-semibold text-[color:var(--token-link)] underline underline-offset-4"><span data-edit-path="ctaLabel">{chapter.ctaLabel}</span><ArrowRight size={18} aria-hidden="true" /></a>}
          </div>
        </article>
      ))}
    </div>
  );
}

export function CinematicChaptersSection({ data }: Props) {
  const chapters = Array.isArray(data.chapters) ? (data.chapters as Chapter[]).map((chapter, sourceIndex) => ({ ...chapter, sourceIndex })).filter((chapter) => chapter?.title) : [];
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const intro = plain((data.intro as string) || (data.subline as string) || '');
  const transition = (data.transition as string) || 'crossfade';
  const ref = useRef<HTMLElement>(null);
  const copyId = useId();
  const reduceMotion = useHydrationSafeReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!chapters.length) return;
    setActiveIndex(Math.min(chapters.length - 1, Math.max(0, Math.floor(value * chapters.length))));
  });

  if (!chapters.length) return null;
  const active = chapters[activeIndex] || chapters[0];
  const mobile = (
    <section className="bg-[var(--token-section-bg)] px-5 py-7 text-[color:var(--token-body)] md:py-12">
      <div className="mx-auto max-w-3xl">
        {badge && <p className="section-badge mb-4 w-fit" data-edit-path="badge">{badge}</p>}
        {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
        {intro && <p className="section-subline mx-0 text-left" data-edit-path="intro">{intro}</p>}
        <div className="mt-10"><ChapterCards chapters={chapters} /></div>
      </div>
    </section>
  );

  function skipStory() {
    if (ref.current) focusAfterCinematicStory(ref.current, reduceMotion);
  }

  function selectChapter(index: number) {
    const section = ref.current;
    if (!section) return;
    setActiveIndex(index);
    const travel = Math.max(0, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top + travel * (index + 0.1) / chapters.length, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  const transitionInitial = transition === 'push' ? { opacity: 0, y: 50 } : transition === 'depth' ? { opacity: 0, scale: 1.08 } : { opacity: 0 };
  const transitionExit = transition === 'push' ? { opacity: 0, y: -40 } : transition === 'depth' ? { opacity: 0, scale: 0.94 } : { opacity: 0 };

  return (
    <>
      <div className="advanced-static-fallback md:hidden">{mobile}</div>
      <section ref={ref} className="advanced-motion-experience relative hidden bg-[var(--token-section-bg)] text-[color:var(--token-on-dark-heading)] md:block" style={{ height: `${Math.max(320, chapters.length * 86)}vh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div key={active.sourceIndex} initial={reduceMotion ? false : transitionInitial} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : transitionExit} transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0" data-edit-collection="chapters" data-edit-index={active.sourceIndex}>
              {active.image ? <img src={active.image} alt={active.imageAlt || ''} className="h-full w-full object-cover" style={{ objectPosition: active.imagePosition || 'center' }} loading={activeIndex === 0 ? 'eager' : 'lazy'} data-edit-image="image" /> : <div className="h-full bg-[radial-gradient(circle_at_70%_25%,var(--token-accent),transparent_34%),linear-gradient(135deg,var(--token-section-bg-alt),var(--token-section-bg)_70%)]" />}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.9)_0%,rgba(0,0,0,.58)_45%,rgba(0,0,0,.18)_100%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 z-10 flex flex-col px-8 py-7 lg:px-14 lg:py-10" data-color-context="dark">
            <div className="flex items-start justify-between gap-8">
              <div className="max-w-md">
                {badge && <p className="section-badge mb-3 w-fit" data-edit-path="badge">{badge}</p>}
                {headline && <h2 className="text-xl font-black tracking-[-0.025em] text-[color:var(--token-on-dark-heading)] lg:text-2xl" data-edit-path="headline">{headline}</h2>}
                {intro && <p className="mt-2 text-sm leading-6 text-[color:var(--token-on-dark-muted)]" data-edit-path="intro">{intro}</p>}
              </div>
              <button type="button" onClick={skipStory} className="inline-flex min-h-11 items-center gap-2 border border-[var(--token-card-border)] bg-[var(--token-image-overlay)] px-4 text-xs font-bold text-[color:var(--token-on-dark-heading)] transition hover:bg-[var(--token-btn-bg)] hover:text-[color:var(--token-btn-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-on-dark-heading)]"><span data-edit-path="skipLabel">{String(data.skipLabel || 'Bildgeschichte überspringen')}</span><ChevronDown size={14} aria-hidden="true" /></button>
            </div>

            <div className="mt-auto grid grid-cols-[minmax(0,46rem)_14rem] items-end gap-12 pb-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div id={copyId} key={`copy-${active.sourceIndex}`} initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -16 }} transition={{ duration: reduceMotion ? 0 : 0.45 }} data-edit-collection="chapters" data-edit-index={active.sourceIndex}>
                  {active.kicker && <p className="text-xs font-bold text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{active.kicker}</p>}
                  <h3 className="mt-4 max-w-4xl text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-[color:var(--token-on-dark-heading)]" data-edit-path="title">{active.title}</h3>
                  {active.text && <p className="mt-6 max-w-xl text-base leading-7 text-[color:var(--token-on-dark-body)] lg:text-lg" data-edit-path="text">{plain(active.text)}</p>}
                  {active.ctaLabel && <a href={active.ctaHref || '#'} data-edit-link="ctaHref" className="cms-button mt-7 inline-flex items-center gap-2 bg-[var(--token-btn-bg)] px-5 py-3 text-sm font-bold text-[color:var(--token-btn-text)]"><span data-edit-path="ctaLabel">{active.ctaLabel}</span><ArrowRight size={16} aria-hidden="true" /></a>}
                </motion.div>
              </AnimatePresence>

              <nav aria-label="Kapitel" className="space-y-1 bg-[var(--token-image-overlay)] p-4">
                {chapters.map((chapter, index) => (
                  <button type="button" key={chapter.sourceIndex} onClick={() => selectChapter(index)} aria-current={index === activeIndex ? 'step' : undefined} aria-controls={copyId} aria-label={`Kapitel ${index + 1}: ${chapter.title}`} className="grid min-h-14 w-full grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 px-1 py-2 text-left text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-on-dark-heading)]">
                    <span aria-hidden="true" className={`font-bold tabular-nums ${index === activeIndex ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-on-dark-muted)]'}`}>{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="block h-px overflow-hidden bg-[var(--token-card-border)]"><motion.span className="block h-full origin-left bg-[var(--token-accent)]" animate={{ scaleX: index < activeIndex ? 1 : index === activeIndex ? 0.72 : 0 }} /></span>
                      <span className={`mt-2 block ${index === activeIndex ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-on-dark-body)]'}`}>{chapter.kicker || chapter.title}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

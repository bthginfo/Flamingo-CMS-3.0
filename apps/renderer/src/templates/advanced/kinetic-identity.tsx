'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Statement = { prefix?: string; highlight?: string; suffix?: string; text?: string; image?: string };
type Props = { data: Record<string, unknown> };

function StatementLine({ item, compact = false }: { item: Statement; index: number; compact?: boolean }) {
  return <h3 className={`hyphens-auto [overflow-wrap:anywhere] font-black text-[color:var(--token-heading)] ${compact ? 'text-[clamp(2rem,4vw,4.6rem)] leading-[.92] tracking-[-.055em]' : 'text-[clamp(2.25rem,6vw,6.8rem)] leading-[.88] tracking-[-.065em]'}`}><span data-edit-path="prefix">{item.prefix}</span>{' '}<span className="text-[color:var(--token-accent)]" data-edit-path="highlight">{item.highlight}</span>{' '}<span data-edit-path="suffix">{item.suffix}</span></h3>;
}

export function KineticIdentitySection({ data }: Props) {
  const items = Array.isArray(data.statements) ? (data.statements as Statement[]).filter((item) => item && (item.prefix || item.highlight || item.suffix)) : [];
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const introOpacity = useTransform(scrollYProgress, [0, .1, .2], [1, .45, 0]);
  const introY = useTransform(scrollYProgress, [0, .2], [0, -18]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel));
      setActive(Math.min(items.length - 1, Math.max(0, Math.round(progress * Math.max(0, items.length - 1)))));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [items.length]);
  if (!items.length) return null;
  const current = items[active] || items[0];
  const intro = <AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />;
  return <>
    <section className="advanced-static-fallback bg-[var(--token-section-bg)] px-5 py-16 lg:hidden">
      <div className="mx-auto max-w-3xl">{intro}<div className="mt-10 space-y-12">{items.map((item, index) => <article key={index} className="border-t border-[var(--token-divider)] pt-5" data-edit-collection="statements" data-edit-index={index}><StatementLine item={item} index={index} />{item.text && <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--token-body)]" data-edit-path="text">{plain(item.text)}</p>}{item.image && <img src={item.image} alt="" loading="lazy" className="mt-5 aspect-[4/3] w-full rounded-[var(--token-card-radius)] object-cover" data-edit-image="image" />}</article>)}</div><AdvancedLink cta={data.cta as AdvancedCta} className="mt-10" /></div>
    </section>
    <section ref={sectionRef} className="advanced-motion-experience relative hidden bg-[var(--token-section-bg)] lg:block" style={{ height: `${Math.max(155, items.length * 38)}vh` }}>
      <div className="sticky top-0 grid h-[100svh] grid-rows-[auto_minmax(0,1fr)] overflow-hidden px-10 py-6 xl:px-14">
        <motion.div className="relative z-10 max-w-6xl" style={{ opacity: introOpacity, y: introY }} aria-hidden={active > 0 ? true : undefined}><AdvancedIntro compact badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} /></motion.div>
        <div className="grid min-h-0 items-end gap-8 pb-5 pt-4 lg:grid-cols-[1.08fr_.92fr] xl:gap-12">
          <motion.div className="relative z-10 min-w-0" initial={false} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : .28 }}>
            <motion.div key={active} initial={false} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: reduceMotion ? 0 : .38, ease: [0.22, 1, 0.36, 1] }} data-edit-collection="statements" data-edit-index={active}>
              <StatementLine item={current} index={active} compact />
              {current.text && <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--token-body)]" data-edit-path="text">{plain(current.text)}</p>}
              <AdvancedLink cta={data.cta as AdvancedCta} className="mt-5" />
            </motion.div>
          </motion.div>
          <motion.div key={`media-${active}`} initial={false} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: .38 }} className="relative mx-auto aspect-[4/5] max-h-[50vh] w-full max-w-lg overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_34px_100px_var(--token-shadow)]" data-card data-edit-collection="statements" data-edit-index={active}>
            {current.image ? <img src={current.image} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="image" /> : <EmptyVisual />}
            <div data-color-context="dark" className="absolute inset-x-5 bottom-5 flex items-center justify-between border-t border-[var(--token-divider)] pt-3 text-xs font-bold tracking-[.18em] text-[color:var(--token-on-dark-heading)] [text-shadow:0_1px_12px_var(--token-image-overlay)]"><span>{String(active + 1).padStart(2, '0')}</span><span>{String(items.length).padStart(2, '0')}</span></div>
          </motion.div>
        </div>
        <motion.div className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[var(--token-accent)]" style={{ scaleX: scrollYProgress }} />
      </div>
    </section>
  </>;
}

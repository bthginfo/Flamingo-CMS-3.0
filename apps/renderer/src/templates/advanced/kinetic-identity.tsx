'use client';

import { useHydrationSafeReducedMotion } from '@/lib/use-hydration-safe-reduced-motion';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Statement = { id?: string; prefix?: string; highlight?: string; suffix?: string; text?: string; image?: string };
type Props = { data: Record<string, unknown> };

function StatementLine({ item, compact = false }: { item: Statement; index: number; compact?: boolean }) {
  return <h3 className={`hyphens-auto [overflow-wrap:anywhere] font-black text-[color:var(--token-heading)] ${compact ? 'text-[clamp(2rem,4vw,4.6rem)] leading-[.92] tracking-[-.055em]' : 'text-[clamp(2.25rem,6vw,6.8rem)] leading-[.88] tracking-[-.065em]'}`}><span data-edit-path="prefix">{item.prefix}</span>{' '}<span className="text-[color:var(--token-eyebrow)]" data-edit-path="highlight">{item.highlight}</span>{' '}<span data-edit-path="suffix">{item.suffix}</span></h3>;
}

export function KineticIdentitySection({ data }: Props) {
  if (data.preset === 'editorial') return <KineticEditorial data={data} />;
  return <KineticStage data={data} />;
}

function EditorialStatement({ item, index, sourceIndex }: { item: Statement; index: number; sourceIndex: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useHydrationSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);
  const beat = index % 3;
  return <article ref={ref} className="grid items-center gap-6 border-t border-[var(--token-divider)] py-8 lg:grid-cols-12 lg:gap-12 lg:py-12" data-edit-collection="statements" data-edit-index={sourceIndex}>
    <div className={`min-w-0 ${beat === 0 ? 'lg:col-span-5' : beat === 1 ? 'lg:col-span-6 lg:col-start-7 lg:row-start-1' : 'lg:col-span-7'}`}>
      <h3 className={`font-display font-semibold leading-[1.02] tracking-[-0.035em] text-[color:var(--token-heading)] [text-wrap:balance] ${beat === 0 ? 'text-[clamp(2.8rem,5.2vw,5rem)]' : beat === 1 ? 'max-w-[16ch] text-[clamp(2.3rem,3.8vw,3.6rem)]' : 'text-[clamp(2.6rem,4.8vw,4.6rem)]'}`}><span data-edit-path="prefix">{item.prefix}</span>{' '}<span className="text-[color:var(--token-icon)]" data-edit-path="highlight">{item.highlight}</span>{' '}<span data-edit-path="suffix">{item.suffix}</span></h3>
      {item.text && <p className="mt-5 max-w-[45ch] text-base leading-8 text-[color:var(--token-body)]" data-edit-path="text">{plain(item.text)}</p>}
    </div>
    {item.image && <figure className={`m-0 overflow-hidden ${beat === 0 ? 'aspect-[16/10] lg:col-span-7' : beat === 1 ? 'aspect-[16/9] lg:col-span-5 lg:col-start-1 lg:row-start-1' : 'aspect-[16/9] lg:col-span-4 lg:col-start-9 lg:aspect-square'}`}><motion.img src={item.image} alt="" loading="lazy" data-edit-image="image" className="h-full w-full object-cover" style={reduceMotion ? undefined : { y, scale: 1.08 }} /></figure>}
  </article>;
}

function KineticEditorial({ data }: Props) {
  const items = (Array.isArray(data.statements) ? data.statements as Statement[] : []).map((item, sourceIndex) => ({ ...item, sourceIndex })).filter(item => item.prefix || item.highlight || item.suffix);
  if (!items.length) return null;
  return <section className="bg-[var(--token-section-bg)] px-6 py-8 md:px-10 md:py-12 lg:px-14" data-kinetic-preset="editorial"><div className="mx-auto max-w-[1440px]"><AdvancedIntro headline={String(data.headline || '')} subline={String(data.subline || '')} /><div className="mt-8 lg:mt-10">{items.map((item, index) => <EditorialStatement key={item.id || item.sourceIndex} item={item} index={index} sourceIndex={item.sourceIndex} />)}</div><AdvancedLink cta={data.cta as AdvancedCta} className="mt-3" /></div></section>;
}

function KineticStage({ data }: Props) {
  const items = Array.isArray(data.statements) ? (data.statements as Statement[]).filter((item) => item && (item.prefix || item.highlight || item.suffix)) : [];
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useHydrationSafeReducedMotion();
  const [active, setActive] = useState(0);
  const centeredHoldVh = 56;
  const scrollHeightVh = Math.max(155, items.length * 38) + centeredHoldVh;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const introOpacity = useTransform(scrollYProgress, [0, .2, .34], [1, .62, 0]);
  const introY = useTransform(scrollYProgress, [0, .34], [0, -18]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const holdUntilCentered = window.innerHeight * (centeredHoldVh / 100);
      const travel = Math.max(1, section.offsetHeight - window.innerHeight - holdUntilCentered);
      const progress = Math.min(1, Math.max(0, (-section.getBoundingClientRect().top - holdUntilCentered) / travel));
      setActive(Math.min(items.length - 1, Math.max(0, Math.floor(progress * items.length))));
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
    <section ref={sectionRef} className="advanced-motion-experience relative hidden bg-[var(--token-section-bg)] lg:block" style={{ height: `${scrollHeightVh}vh` }}>
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

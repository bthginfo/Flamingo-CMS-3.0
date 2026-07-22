'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';

type WaveItem = {
  label?: string;
  title?: string;
  text?: string;
  image?: string;
  href?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function getTitle(item: WaveItem) {
  return item.title || item.label || '';
}

export function DualWaveSection({ data }: Props) {
  const items = Array.isArray(data.items) ? (data.items as WaveItem[]).filter((item) => item && getTitle(item)) : [];
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = plain((data.subline as string) || '');
  const preset = (data.preset as string) || 'editorial';
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!items.length) return;
    setActiveIndex(Math.min(items.length - 1, Math.max(0, Math.round(value * (items.length - 1)))));
  });

  if (!items.length) return null;
  const active = items[activeIndex] || items[0];
  const waveStrength = preset === 'dynamic' ? 46 : preset === 'calm' ? 20 : 32;

  const mobile = (
    <section className="bg-[var(--token-section-bg)] px-5 py-16 text-[color:var(--token-body)] md:px-8">
      <div className="mx-auto max-w-3xl">
        {badge && <p className="section-badge mb-4 w-fit" data-edit-path="badge">{badge}</p>}
        {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{subline}</p>}
        <div className="mt-9 space-y-4">
          {items.map((item, index) => (
            <article key={`${getTitle(item)}-${index}`} className="grid grid-cols-[5rem_1fr] gap-4 rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-3" data-card data-edit-collection="items" data-edit-index={index}>
              <div className="aspect-[4/5] overflow-hidden rounded-[calc(var(--token-card-radius)*.66)] bg-[var(--token-section-bg-alt)]">
                {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" data-edit-image="image" />}
              </div>
              <div className="self-center py-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--token-eyebrow)]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 text-xl font-bold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{getTitle(item)}</h3>
                {item.text && <p className="mt-1 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(item.text)}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <div className="advanced-static-fallback md:hidden">{mobile}</div>
      <section ref={sectionRef} className="advanced-motion-experience relative hidden bg-[var(--token-section-bg)] text-[color:var(--token-body)] md:block" style={{ height: `${Math.max(260, items.length * 48)}vh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-8 px-8 py-8 lg:px-14">
            <div className="max-w-xl">
              {badge && <p className="section-badge mb-3 w-fit" data-edit-path="badge">{badge}</p>}
              {headline && <h2 className="text-3xl font-black leading-[0.96] tracking-[-0.045em] text-[color:var(--token-heading)] lg:text-5xl" data-edit-path="headline">{headline}</h2>}
              {subline && <p className="mt-3 max-w-lg text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="subline">{subline}</p>}
            </div>
            <div className="mt-1 text-xs font-bold tabular-nums text-[color:var(--token-muted)]">{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</div>
          </div>

          <div className="absolute inset-0 grid grid-cols-[1fr_minmax(18rem,30vw)_1fr] items-center gap-6 px-6 pt-28 lg:gap-10 lg:px-12">
            <div className="flex flex-col items-end gap-1 overflow-hidden py-24" style={{ paddingRight: waveStrength }}>
              {items.map((item, index) => {
                const distance = index - activeIndex;
                return (
                  <motion.div
                    key={`left-${getTitle(item)}-${index}`}
                    animate={{ x: Math.sin(distance * 0.82) * waveStrength, opacity: Math.abs(distance) > 3 ? 0.12 : index === activeIndex ? 1 : 0.34, scale: index === activeIndex ? 1 : 0.82 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.7 }}
                    className="whitespace-nowrap py-1 text-right text-[clamp(1.2rem,2.25vw,2.65rem)] font-black leading-none tracking-[-0.045em] text-[color:var(--token-heading)]"
                    data-edit-collection="items"
                    data-edit-index={index}
                    data-edit-path="title"
                  >
                    {getTitle(item)}
                  </motion.div>
                );
              })}
            </div>

            <div className="relative z-10">
              <motion.div key={activeIndex} initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.42 }} className="relative mx-auto aspect-[4/5] max-h-[58vh] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_30px_90px_var(--token-shadow)]" data-card data-edit-collection="items" data-edit-index={activeIndex}>
                {active.image ? <img src={active.image} alt="" className="h-full w-full object-cover" loading="lazy" data-edit-image="image" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,var(--token-accent),transparent_58%),var(--token-section-bg-alt)] opacity-70" />}
                <div className="absolute inset-x-3 bottom-3 rounded-[calc(var(--token-card-radius)*.72)] border border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_90%,transparent)] p-5 shadow-[0_20px_60px_var(--token-shadow)] backdrop-blur-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--token-card-muted,var(--token-muted))]">{String(activeIndex + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 text-2xl font-black text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{getTitle(active)}</h3>
                  {active.text && <p className="mt-2 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(active.text)}</p>}
                  {active.href && <a href={active.href} className="mt-4 inline-flex items-center gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-3.5 py-2 text-sm font-bold text-[color:var(--token-btn-text)]">Entdecken <ArrowUpRight size={15} /></a>}
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col items-start gap-1 overflow-hidden py-24" style={{ paddingLeft: waveStrength }}>
              {[...items].reverse().map((item, reversedIndex) => {
                const index = items.length - 1 - reversedIndex;
                const distance = index - activeIndex;
                return (
                  <motion.div key={`right-${getTitle(item)}-${index}`} animate={{ x: -Math.sin(distance * 0.82) * waveStrength, opacity: Math.abs(distance) > 3 ? 0.12 : index === activeIndex ? 1 : 0.34, scale: index === activeIndex ? 1 : 0.82 }} transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.7 }} className="whitespace-nowrap py-1 text-[clamp(1.2rem,2.25vw,2.65rem)] font-black leading-none tracking-[-0.045em] text-[color:var(--token-heading)]">
                    {getTitle(item)}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="absolute inset-x-8 bottom-7 h-px overflow-hidden bg-[var(--token-divider)] lg:inset-x-14">
            <motion.div className="h-full origin-left bg-[var(--token-accent)]" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </section>
    </>
  );
}

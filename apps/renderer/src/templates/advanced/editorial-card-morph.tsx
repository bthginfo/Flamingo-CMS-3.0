'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { AdvancedIntro, EmptyVisual } from './advanced-shared';

type Fact = { value?: string; label?: string };
type Item = { kicker?: string; title?: string; text?: string; image?: string; facts?: Fact[]; href?: string; ctaLabel?: string };
type Props = { data: Record<string, unknown> };

export function EditorialCardMorphSection({ data }: Props) {
  const items = Array.isArray(data.items) ? (data.items as Item[]).filter((item) => item?.title).slice(0, 8) : [];
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const detailId = useId();
  const titleId = `${detailId}-title`;
  const selected = active === null ? null : items[active];
  function restoreTriggerFocus(index: number) {
    window.setTimeout(() => document.getElementById(`${detailId}-trigger-${index}`)?.focus({ preventScroll: true }), reduceMotion ? 0 : 620);
  }
  useEffect(() => {
    if (active === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      restoreTriggerFocus(active);
      setActive(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [active]);
  if (items.length < 3) return null;
  function closeStory() {
    if (active !== null) restoreTriggerFocus(active);
    setActive(null);
  }
  return <section className="overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 md:px-8 md:py-24">
    <div className="mx-auto max-w-7xl"><AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
      <div className="relative mt-12 min-h-[34rem]">
        <AnimatePresence mode="wait">
          {selected ? <motion.article id={detailId} role="region" aria-labelledby={titleId} key={`detail-${active}`} initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(18% 12% round var(--token-card-radius))' }} animate={{ opacity: 1, clipPath: 'inset(0% 0% round var(--token-card-radius))' }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .48, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_35px_110px_var(--token-shadow)]" data-card data-edit-collection="items" data-edit-index={active ?? 0}>
            <div className="grid min-h-[36rem] lg:grid-cols-[1.1fr_.9fr]"><div className="relative min-h-[23rem] bg-[var(--token-section-bg-alt)]">{selected.image ? <img src={selected.image} alt="" className="absolute inset-0 h-full w-full object-cover" data-edit-image="image" /> : <EmptyVisual />}<div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--token-image-overlay)_72%,transparent),transparent_45%)]" /><button autoFocus type="button" onClick={closeStory} className="absolute left-4 top-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--token-button-radius)] border border-[var(--token-card-border)] bg-[var(--token-image-overlay)] px-4 text-xs font-bold text-[color:var(--token-on-dark-heading)] backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--token-on-dark-heading)]"><ArrowLeft size={15} /> Alle Projekte</button></div><div className="min-w-0 self-center p-5 sm:p-7 md:p-10 lg:p-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{selected.kicker}</p><h3 id={titleId} className="mt-4 max-w-full hyphens-auto [overflow-wrap:anywhere] text-[clamp(2.15rem,10vw,3.75rem)] font-black leading-[.96] tracking-[-.045em] text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{selected.title}</h3>{selected.text && <p className="mt-5 max-w-full text-base leading-7 text-[color:var(--token-card-body,var(--token-body))] [overflow-wrap:anywhere]" data-edit-path="text">{plain(selected.text)}</p>}{Array.isArray(selected.facts) && <dl className="mt-7 grid grid-cols-1 gap-4 border-t border-[var(--token-divider)] pt-6 min-[400px]:grid-cols-2">{selected.facts.map((fact, index) => <div key={index} className="min-w-0"><dt className="hyphens-auto [overflow-wrap:anywhere] text-2xl font-black text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="value">{fact.value}</dt><dd className="mt-1 [overflow-wrap:anywhere] text-xs text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="label">{fact.label}</dd></div>)}</dl>}{safeContentUrl(selected.href || '') && <a href={safeContentUrl(selected.href || '')} className="mt-8 inline-flex min-h-11 max-w-full items-center gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-5 text-sm font-bold text-[color:var(--token-btn-text)]"><span className="hyphens-auto [overflow-wrap:anywhere]">{selected.ctaLabel || 'Projekt ansehen'}</span><ArrowUpRight size={15} className="shrink-0" /></a>}</div></div>
          </motion.article> : <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`grid gap-3 ${data.layout === 'rail' ? 'grid-flow-col auto-cols-[82%] overflow-x-auto pb-4 sm:auto-cols-[47%] lg:auto-cols-[31%]' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {items.map((item, index) => <motion.button id={`${detailId}-trigger-${index}`} key={index} type="button" onClick={() => setActive(index)} aria-expanded={active === index} aria-controls={detailId} whileHover={reduceMotion ? undefined : { y: -8 }} className={`group relative min-h-[26rem] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-left shadow-[0_18px_55px_var(--token-shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-accent)] ${data.layout !== 'rail' && index === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-[53rem]' : ''}`} data-card data-edit-collection="items" data-edit-index={index}>
              {item.image ? <img src={item.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" data-edit-image="image" /> : <EmptyVisual />}<div className="absolute inset-0 bg-[linear-gradient(to_top,var(--token-image-overlay)_0%,color-mix(in_srgb,var(--token-image-overlay)_82%,transparent)_54%,transparent_88%)]" /><div data-color-context="dark" className="absolute inset-x-0 bottom-0 p-6 text-[color:var(--token-on-dark-heading)]"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[color:var(--token-on-dark-muted)]" data-edit-path="kicker">{item.kicker || String(index + 1).padStart(2, '0')}</p><h3 className="mt-2 hyphens-auto [overflow-wrap:anywhere] text-2xl font-black leading-tight tracking-[-.035em] text-[color:var(--token-on-dark-heading)] md:text-3xl" data-edit-path="title">{item.title}</h3><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[color:var(--token-on-dark-body)]">Geschichte öffnen <ArrowUpRight size={14} /></span></div>
            </motion.button>)}
          </motion.div>}
        </AnimatePresence>
      </div>
    </div>
  </section>;
}

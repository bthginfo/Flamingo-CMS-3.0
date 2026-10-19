'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { visibleText } from '@/lib/visible-content';
import { useHydrationSafeReducedMotion } from '@/lib/use-hydration-safe-reduced-motion';
import { ResilientNextImage } from '@/components/ui/resilient-image';
import { AdvancedIntro, AdvancedLink, type AdvancedCta } from './advanced-shared';

type AtelierItem = { id?: string; title?: string; kicker?: string; text?: string; image?: string; imageAlt?: string; imagePosition?: string; href?: string; ctaLabel?: string; meta?: string[] };
type Props = { data: Record<string, unknown> };

export function MaterialAtelierSection({ data }: Props) {
  const items = (Array.isArray(data.items) ? data.items as AtelierItem[] : []).map((item, sourceIndex) => ({ ...item, sourceIndex, title: visibleText(item?.title), text: visibleText(item?.text), image: safeContentUrl(item?.image || ''), meta: (Array.isArray(item?.meta) ? item.meta : []).map(visibleText).filter(Boolean).slice(0,5) })).filter(item => item.title && item.image).slice(0, 8);
  const [active, setActive] = useState(0);
  const reduceMotion = useHydrationSafeReducedMotion();
  const id = useId();
  const quiet = data.preset === 'quiet';
  const editorial = data.preset === 'editorial';
  useEffect(() => { if (active >= items.length) setActive(0); }, [active, items.length]);
  if (items.length < 3) return null;
  const selected = items[active] || items[0];
  const href = safeContentUrl(selected.href || '');

  return <section className="bg-[var(--token-section-bg)] px-6 py-14 md:px-10 md:py-20 lg:px-14" data-atelier-preset={quiet ? 'quiet' : editorial ? 'editorial' : 'architectural'}>
    <div className="mx-auto max-w-[1440px]">
      <AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
      <div className={`mt-10 grid gap-8 lg:mt-16 lg:gap-14 ${editorial ? 'lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]' : 'lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]'}`}>
        <div className={editorial ? 'lg:pt-8' : 'lg:col-start-2 lg:row-start-1'}>
          <div role="group" aria-label="Anwendung auswählen" className="border-t border-[var(--token-divider)]">
            {items.map((item, index) => <button key={item.id || item.sourceIndex} type="button" aria-pressed={index === active} aria-controls={id} onClick={() => setActive(index)} onFocus={() => setActive(index)} className={`group flex min-h-16 w-full items-center justify-between gap-4 border-b px-3 py-5 text-left font-display text-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)] md:text-2xl ${index === active ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]' : 'bg-transparent text-[color:var(--token-heading)] hover:bg-[var(--token-section-bg-alt)]'}`} style={{ borderColor: 'var(--token-divider)' }} data-edit-collection="items" data-edit-index={item.sourceIndex}><span data-edit-path="title">{item.title}</span><ArrowUpRight aria-hidden="true" size={22} className={`shrink-0 text-inherit transition-transform ${index === active ? 'rotate-45' : 'group-hover:-translate-y-0.5'}`} /></button>)}
          </div>
          <div className="mt-7" data-edit-collection="items" data-edit-index={selected.sourceIndex}>
            {selected.text && <p className="max-w-[54ch] text-base leading-7 text-[color:var(--token-body)]" data-edit-path="text">{selected.text}</p>}
            {selected.meta.length > 0 && <ul aria-label="Merkmale" className="mt-5 space-y-2 text-sm leading-6 text-[color:var(--token-muted)]">{selected.meta.map((entry, index) => <li key={index} data-edit-collection="meta" data-edit-index={index}>{entry}</li>)}</ul>}
            {href && <a href={href} data-edit-link="href" className="mt-6 inline-flex min-h-12 items-center gap-3 font-semibold text-[color:var(--token-link)] underline decoration-[var(--token-divider)] underline-offset-8 hover:text-[color:var(--token-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)]"><span data-edit-path="ctaLabel">{visibleText(selected.ctaLabel) || 'Beispiele ansehen'}</span><ArrowUpRight size={18} aria-hidden="true" /></a>}
          </div>
        </div>
        <div id={id} aria-live="polite" className={`min-w-0 ${editorial ? 'lg:col-start-2 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1'}`}>
          <AnimatePresence mode="wait" initial={false}><motion.figure key={selected.id || selected.sourceIndex} initial={reduceMotion ? false : { opacity: .75, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: .75 }} transition={{ duration: reduceMotion ? 0 : quiet ? .2 : .35 }} className="m-0" data-edit-collection="items" data-edit-index={selected.sourceIndex}>
            <div className={`relative overflow-hidden bg-[var(--token-section-bg-alt)] ${quiet ? 'aspect-[4/3]' : editorial ? 'aspect-[5/4] lg:aspect-[4/5]' : 'aspect-[4/3]'}`}><ResilientNextImage src={selected.image} alt={selected.imageAlt || selected.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className={quiet ? 'object-contain p-4' : 'object-cover'} style={{ objectPosition: selected.imagePosition || 'center' }} data-edit-image="image" /></div>
            <figcaption className="mt-4 border-b border-[var(--token-divider)] pb-4 text-sm text-[color:var(--token-muted)]">{selected.kicker && <><span className="text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{selected.kicker}</span>{' · '}</>}<span data-edit-path="title">{selected.title}</span></figcaption>
          </motion.figure></AnimatePresence>
        </div>
      </div>
      <AdvancedLink cta={data.cta as AdvancedCta} className="mt-10" />
    </div>
  </section>;
}

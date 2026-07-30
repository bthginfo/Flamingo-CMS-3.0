'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { visibleText } from '@/lib/visible-content';
import { ResilientImage } from '@/components/ui/resilient-image';
import { AdvancedIntro, AdvancedLink, type AdvancedCta } from './advanced-shared';

type AtelierItem = {
  id?: string;
  title?: string;
  kicker?: string;
  text?: string;
  image?: string;
  href?: string;
  meta?: string[];
};

type Props = { data: Record<string, unknown> };

function itemKey(item: AtelierItem, index: number) {
  return item.id || `${item.title || 'atelier'}-${index}`;
}

export function MaterialAtelierSection({ data }: Props) {
  const items = Array.isArray(data.items)
    ? (data.items as AtelierItem[])
      .map((item) => ({ ...item, title: visibleText(item?.title), kicker: visibleText(item?.kicker), text: visibleText(item?.text), image: safeContentUrl(item?.image || '') || '', meta: Array.isArray(item?.meta) ? item.meta.map(visibleText).filter(Boolean) : [] }))
      .filter((item) => item?.title && item.image)
      .slice(0, 8)
    : [];
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const quiet = data.preset === 'quiet';

  useEffect(() => {
    if (active >= items.length) setActive(0);
  }, [active, items.length]);

  if (items.length < 3) return null;
  const selected = items[active] || items[0];
  const selectedHref = safeContentUrl(selected.href || '');

  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 md:px-8 md:py-24"
      aria-labelledby={titleId}
      data-atelier-preset={quiet ? 'quiet' : data.preset === 'editorial' ? 'editorial' : 'architectural'}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,var(--token-divider)_1px,transparent_1px),linear-gradient(to_bottom,var(--token-divider)_1px,transparent_1px)] [background-size:4.75rem_4.75rem] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="relative mx-auto max-w-[90rem]">
        <AdvancedIntro
          badge={String(data.badge || '')}
          headline={String(data.headline || '')}
          subline={String(data.subline || '')}
          aside={<p className="mt-5 text-[10px] font-bold uppercase tracking-[.22em] text-[color:var(--token-eyebrow)] lg:text-right">{items.length} Arbeitsfelder</p>}
        />

        <div className="mt-10 hidden min-h-[36rem] grid-cols-[minmax(0,1.48fr)_minmax(24rem,.82fr)] gap-6 lg:grid">
          <div className="relative min-h-[36rem] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-divider)] bg-[var(--token-section-bg-alt)]">
            <AnimatePresence initial={false} mode="wait">
              <motion.figure
                key={itemKey(selected, active)}
                initial={reduceMotion ? false : { opacity: 0, scale: quiet ? 1 : 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : quiet ? 0.28 : 0.46, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
                data-edit-collection="items"
                data-edit-index={active}
              >
                <ResilientImage
                  src={selected.image}
                  alt={selected.title || ''}
                  className="h-full w-full object-cover"
                  loading={active === 0 ? 'eager' : 'lazy'}
                  fetchPriority={active === 0 ? 'high' : 'auto'}
                  data-edit-image="image"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--token-image-overlay)_0%,transparent_48%)]" />
                <figcaption data-color-context="dark" className="absolute inset-x-0 bottom-0 grid items-end gap-5 p-7 md:grid-cols-[1fr_auto] md:p-10">
                  <div className="min-w-0">
                    {selected.kicker && <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[color:var(--token-on-dark-muted)]" data-edit-path="kicker">{selected.kicker}</p>}
                    <h3 className="mt-2 max-w-3xl hyphens-auto text-[clamp(2rem,4vw,4.7rem)] font-black leading-[.92] tracking-[-.055em] text-[color:var(--token-on-dark-heading)]" data-edit-path="title">{selected.title}</h3>
                  </div>
                  {selectedHref && <a href={selectedHref} className="inline-flex min-h-11 items-center gap-2 justify-self-start rounded-[var(--token-button-radius)] border border-[var(--token-divider)] px-4 text-xs font-bold text-[color:var(--token-on-dark-heading)] transition hover:bg-[var(--token-btn-bg)] hover:text-[color:var(--token-btn-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-on-dark-heading)]">Entdecken <ArrowUpRight size={15} /></a>}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="min-w-0">
            <ol aria-label="Atelier-Auswahl" className="space-y-4">
              {items.map((item, index) => {
                const isActive = active === index;
                return (
                  <li key={itemKey(item, index)}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      aria-pressed={isActive}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group grid min-h-[5.45rem] w-full grid-cols-[2.75rem_minmax(0,1fr)_2rem] items-center gap-4 rounded-[calc(var(--token-button-radius)*.82)] border px-5 py-5 text-left shadow-[0_14px_42px_rgba(0,0,0,.18)] transition focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-accent)] ${isActive ? 'border-[var(--token-accent)] bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] shadow-[0_18px_54px_rgba(0,0,0,.28)]' : 'border-[var(--token-card-border)] bg-[color-mix(in_srgb,var(--token-card-bg)_92%,var(--token-section-bg-alt))] text-[color:var(--token-card-heading,var(--token-heading))] hover:-translate-y-0.5 hover:border-[var(--token-accent)] hover:bg-[color-mix(in_srgb,var(--token-btn-bg)_12%,var(--token-card-bg))]'}`}
                      data-edit-collection="items"
                      data-edit-index={index}
                    >
                      <span className="font-mono text-[10px] tracking-[.14em] opacity-70">{String(index + 1).padStart(2, '0')}</span>
                      <span className="min-w-0">
                        {item.kicker && <span className={`block text-[9px] font-black uppercase tracking-[.22em] ${isActive ? 'text-inherit opacity-65' : 'text-[color:var(--token-accent)]'}`} data-edit-path="kicker">{item.kicker}</span>}
                        <span className="mt-1 block hyphens-auto text-lg font-black leading-[1.12] text-inherit [overflow-wrap:normal]" data-edit-path="title">{item.title}</span>
                        {isActive && <span className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.13em] text-inherit opacity-75"><Check size={12} className="text-[color:var(--token-check)]" /> Ausgewählt</span>}
                      </span>
                      <ChevronRight aria-hidden="true" className={`transition ${isActive ? 'translate-x-0 text-inherit' : '-translate-x-1 text-inherit opacity-55 group-hover:translate-x-0 group-hover:opacity-90'}`} size={18} />
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 rounded-[var(--token-card-radius)] border border-[var(--token-divider)] bg-[color-mix(in_srgb,var(--token-section-bg-alt)_82%,transparent)] p-6" data-edit-collection="items" data-edit-index={active}>
              {selected.text && <p className="text-base leading-7 text-[color:var(--token-body)]" data-edit-path="text">{plain(selected.text)}</p>}
              {Array.isArray(selected.meta) && selected.meta.length > 0 && <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[.12em] text-[color:var(--token-muted)]">{selected.meta.slice(0, 5).map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ul>}
            </div>
          </div>
        </div>

        <div className="-mx-5 mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-5 lg:hidden">
          {items.map((item, index) => {
            const href = safeContentUrl(item.href || '');
            return (
              <article key={itemKey(item, index)} className="w-[86vw] max-w-[28rem] shrink-0 snap-center border-y border-[var(--token-divider)] bg-[var(--token-card-bg)]" data-card data-edit-collection="items" data-edit-index={index}>
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--token-section-bg-alt)]">
                  <ResilientImage src={item.image} alt={item.title || ''} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} className="h-full w-full object-cover" data-edit-image="image" />
                  <span className="absolute left-4 top-4 bg-[var(--token-card-bg)] px-2 py-1 font-mono text-[10px] tracking-[.15em] text-[color:var(--token-card-heading,var(--token-heading))]">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="p-5">
                  {item.kicker && <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]" data-edit-path="kicker">{item.kicker}</p>}
                  <h3 className="mt-2 hyphens-auto text-2xl font-black leading-[1.02] tracking-[-.035em] text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{item.title}</h3>
                  {item.text && <p className="mt-3 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(item.text)}</p>}
                  {Array.isArray(item.meta) && item.meta.length > 0 && (
                    <ul aria-label="Merkmale" className="mt-4 flex flex-wrap gap-2">
                      {item.meta.slice(0, 5).map((entry, metaIndex) => (
                        <li key={`${entry}-${metaIndex}`} className="rounded-[var(--token-button-radius)] border border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-[color:var(--token-card-muted,var(--token-muted))]">
                          {entry}
                        </li>
                      ))}
                    </ul>
                  )}
                  {href && <a href={href} className="mt-5 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-[color:var(--token-card-heading,var(--token-heading))] underline decoration-[var(--token-accent)] decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-accent)]">Entdecken <ArrowUpRight size={15} /></a>}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8"><AdvancedLink cta={data.cta as AdvancedCta} /></div>
      </div>
    </section>
  );
}

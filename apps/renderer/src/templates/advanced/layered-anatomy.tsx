'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers3, MapPin } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { plain } from '@/lib/strip-html';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Hotspot = { x?: number; y?: number; title?: string; text?: string; icon?: string };
type Layer = { image?: string; title?: string; text?: string; direction?: 'left' | 'right' | 'up' | 'down'; depth?: number };
type Props = { data: Record<string, unknown> };

function directionVector(direction?: string, strength = 1) {
  const distance = 18 + strength * 7;
  if (direction === 'left') return { x: -distance, y: 0 };
  if (direction === 'right') return { x: distance, y: 0 };
  if (direction === 'up') return { x: 0, y: -distance };
  return { x: 0, y: distance };
}

export function LayeredAnatomySection({ data }: Props) {
  const mode = data.mode === 'layers' ? 'layers' : 'hotspots';
  const hotspots = Array.isArray(data.hotspots) ? (data.hotspots as Hotspot[]).filter((item) => item?.title) : [];
  const layers = Array.isArray(data.layers) ? (data.layers as Layer[]).filter((item) => item?.image && item?.title) : [];
  const baseImage = String(data.baseImage || '');
  const aspectRatio = String(data.aspectRatio || '4/3');
  const [active, setActive] = useState(0);
  const [exploded, setExploded] = useState(true);
  const reduceMotion = useReducedMotion();
  const list = mode === 'layers' ? layers : hotspots;
  if (!baseImage && !layers.length) return null;
  const current = list[active];
  return <section className="overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 md:px-8 md:py-24">
    <div className="mx-auto max-w-7xl"><AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
      <div className="mt-12 grid items-center gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)] lg:gap-14">
        <div className="relative isolate overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_30px_90px_var(--token-shadow)]" style={{ aspectRatio }} data-card>
          {baseImage ? <img src={baseImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" data-edit-image="baseImage" /> : <EmptyVisual label="Basisbild ergänzen" />}
          {mode === 'hotspots' ? <div role="group" aria-label="Bilddetails">{hotspots.map((item, index) => <button key={index} type="button" onClick={() => setActive(index)} className={`absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-accent)] ${active === index ? 'scale-110 border-[var(--token-card-border)] bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]' : 'border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-accent)]'}`} style={{ left: `${Math.min(96, Math.max(4, Number(item.x ?? 50)))}%`, top: `${Math.min(96, Math.max(4, Number(item.y ?? 50)))}%` }} aria-label={`${item.title} anzeigen`} aria-pressed={active === index} aria-current={active === index ? 'true' : undefined} data-card data-edit-collection="hotspots" data-edit-index={index}><MapPin size={18} /></button>)}</div> : <>
            {layers.map((item, index) => { const vector = directionVector(item.direction, Number(item.depth || index + 1)); return <motion.img key={`${item.image}-${index}`} src={item.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain" initial={false} animate={exploded && !reduceMotion ? { x: vector.x, y: vector.y, scale: 1 + index * .008, opacity: active === index ? 1 : .72 } : { x: 0, y: 0, scale: 1, opacity: active === index ? 1 : .82 }} transition={{ type: 'spring', stiffness: 100, damping: 22 }} style={{ zIndex: index + 2 }} data-edit-collection="layers" data-edit-index={index} data-edit-image="image" />; })}
            <button type="button" onClick={() => setExploded((value) => !value)} className="absolute bottom-4 left-4 z-30 inline-flex min-h-10 items-center gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-4 text-xs font-bold text-[color:var(--token-btn-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-accent)]" aria-pressed={exploded}><Layers3 size={15} />{exploded ? 'Ebenen schließen' : 'Ebenen öffnen'}</button>
          </>}
        </div>
        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-[var(--token-divider)] pb-4"><p className="text-xs font-bold uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]">{mode === 'layers' ? 'Pro Layer' : 'Detailpunkt'} {String(active + 1).padStart(2, '0')}</p><div className="flex gap-2"><button type="button" onClick={() => setActive((value) => (value - 1 + list.length) % list.length)} className="grid h-10 w-10 place-items-center rounded-[var(--token-button-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-card-heading,var(--token-heading))] disabled:opacity-40" disabled={list.length < 2} aria-label="Vorheriges Detail"><ChevronLeft size={17} /></button><button type="button" onClick={() => setActive((value) => (value + 1) % list.length)} className="grid h-10 w-10 place-items-center rounded-[var(--token-button-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-card-heading,var(--token-heading))] disabled:opacity-40" disabled={list.length < 2} aria-label="Nächstes Detail"><ChevronRight size={17} /></button></div></div>
          <AnimatePresence mode="wait"><motion.div key={active} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-7" data-edit-collection={mode === 'layers' ? 'layers' : 'hotspots'} data-edit-index={active}><p className="text-6xl font-black tracking-[-.06em] text-[color:color-mix(in_srgb,var(--token-accent)_35%,transparent)]">{String(active + 1).padStart(2, '0')}</p><h3 className="mt-4 text-3xl font-black leading-tight tracking-[-.035em] text-[color:var(--token-heading)]" data-edit-path="title">{current?.title || 'Detail auswählen'}</h3>{current?.text && <p className="mt-4 text-base leading-7 text-[color:var(--token-body)]" data-edit-path="text">{plain(current.text)}</p>}</motion.div></AnimatePresence>
          <AdvancedLink cta={data.cta as AdvancedCta} />
        </div>
      </div>
    </div>
  </section>;
}

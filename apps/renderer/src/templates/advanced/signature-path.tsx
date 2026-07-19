'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { ResilientImage } from '@/components/ui/resilient-image';
import { AdvancedIntro, AdvancedLink, type AdvancedCta } from './advanced-shared';

type PathItem = { title?: string; text?: string; icon?: string; image?: string; href?: string };
type Props = { data: Record<string, unknown> };

function markerY(preset: string, index: number) {
  const patterns: Record<string, number[]> = {
    flow: [38, 62, 34, 58, 40, 66, 36],
    route: [64, 34, 58, 30, 54, 38, 62],
    craft: [34, 68, 30, 64, 36, 70, 40],
    pulse: [55, 25, 72, 30, 68, 28, 55],
  };
  return (patterns[preset] || patterns.flow)[index] ?? 50;
}

function buildRailPath(count: number, preset: string) {
  const points = Array.from({ length: count }, (_, index) => ({ x: index * 100 + 50, y: markerY(preset, index) }));
  if (!points.length) return '';
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    return `${path} C ${previous.x + 36} ${previous.y}, ${point.x - 36} ${point.y}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

export function SignaturePathSection({ data }: Props) {
  const items = Array.isArray(data.items) ? (data.items as PathItem[]).filter((item) => item?.title && item?.text).slice(0, 4) : [];
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const preset = String(data.pathPreset || 'flow');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .82', 'end .3'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const railPath = buildRailPath(items.length, preset);
  if (!items.length) return null;
  return <section ref={ref} className="overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 md:px-8 md:py-24">
    <div className="mx-auto max-w-7xl"><AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
      <div className="mt-12 lg:hidden">
        <div className="border-l border-[var(--token-divider)] pl-6">
          {items.map((item, index) => { const href = safeContentUrl(item.href || ''); return <article key={index} className="relative pb-9 last:pb-0" data-edit-collection="items" data-edit-index={index}>
            <span className="absolute -left-[2.05rem] top-1 grid h-4 w-4 place-items-center rounded-full bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]"><span className="h-1.5 w-1.5 rounded-full bg-current" /></span>
            <div className="overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_14px_42px_var(--token-shadow)]" data-card>
              {item.image && <div className="aspect-[16/9] overflow-hidden"><ResilientImage src={item.image} alt={item.title || ''} loading="lazy" className="h-full w-full object-cover" data-edit-image="image" /></div>}
              <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[color:var(--token-eyebrow)]">Station {String(index + 1).padStart(2, '0')}</p><h3 className="mt-2 text-xl font-black leading-tight text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{item.title}</h3>{item.text && <p className="mt-2 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(item.text)}</p>}{href && <a href={href} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--token-accent)] focus-visible:outline focus-visible:outline-2" aria-label={`${item.title} öffnen`}>Entdecken <ArrowUpRight size={13} /></a>}</div>
            </div>
          </article>; })}
        </div>
      </div>
      <div className="mt-16 hidden overflow-x-auto overscroll-x-contain pb-3 lg:block" aria-label="Verbundene Stationen">
        <div className="relative grid min-w-full snap-x snap-mandatory gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          <svg className="pointer-events-none absolute inset-x-0 top-0 h-32 w-full" viewBox={`0 0 ${items.length * 100} 100`} fill="none" preserveAspectRatio="none" aria-hidden="true"><path d={railPath} stroke="var(--token-divider)" strokeWidth="2" strokeDasharray="5 9" vectorEffect="non-scaling-stroke" /><motion.path d={railPath} stroke="var(--token-accent)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: reduceMotion ? 1 : pathLength }} /></svg>
          {items.map((item, index) => { const href = safeContentUrl(item.href || ''); const y = markerY(preset, index); return <div key={index} className="relative grid snap-start grid-rows-[8rem_1fr]">
            <div className="relative z-10" aria-hidden="true"><span className="absolute left-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[var(--token-section-bg)] bg-[var(--token-btn-bg)] text-[10px] font-black text-[color:var(--token-btn-text)] shadow-[0_8px_24px_var(--token-shadow)]" style={{ top: `${y}%` }}>{index + 1}</span><span className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-[var(--token-divider)]" style={{ top: `calc(${y}% + 1rem)` }} /></div>
            <article className="overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_16px_48px_var(--token-shadow)]" data-card data-edit-collection="items" data-edit-index={index}>
              {item.image && <div className="aspect-[16/10] overflow-hidden"><ResilientImage src={item.image} alt={item.title || ''} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105 motion-reduce:transition-none" data-edit-image="image" /></div>}
              <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[color:var(--token-eyebrow)]">Station {String(index + 1).padStart(2, '0')}</p><h3 className="mt-2 text-xl font-black leading-tight text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{item.title}</h3>{item.text && <p className="mt-2 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(item.text)}</p>}{href && <a href={href} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--token-accent)] focus-visible:outline focus-visible:outline-2" aria-label={`${item.title} öffnen`}>Entdecken <ArrowUpRight size={13} /></a>}</div>
            </article>
          </div>; })}
        </div>
      </div><AdvancedLink cta={data.cta as AdvancedCta} className="mt-10" />
    </div>
  </section>;
}

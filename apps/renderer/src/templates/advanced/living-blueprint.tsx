'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CircleDot, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { plain } from '@/lib/strip-html';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Node = { id?: string; title?: string; text?: string; icon?: string; image?: string; metric?: string };
type Props = { data: Record<string, unknown> };
const POSITIONS = {
  flow: [[8, 24], [26, 58], [47, 30], [65, 68], [84, 36], [94, 70], [76, 15], [48, 80]],
  radial: [[50, 8], [78, 20], [92, 52], [72, 82], [35, 88], [8, 58], [20, 22], [51, 50]],
  blueprint: [[8, 16], [42, 16], [76, 16], [20, 54], [57, 50], [86, 66], [42, 82], [8, 84]],
} as const;

export function LivingBlueprintSection({ data }: Props) {
  const nodes = Array.isArray(data.nodes) ? (data.nodes as Node[]).filter((node) => node?.id && node?.title).slice(0, 8) : [];
  const layout = (['flow', 'radial', 'blueprint'].includes(String(data.layout)) ? String(data.layout) : 'flow') as keyof typeof POSITIONS;
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  if (nodes.length < 3) return null;
  const current = nodes[active];
  const points = nodes.map((_, index) => {
    const [x, y] = POSITIONS[layout][index] || POSITIONS.flow[index];
    return [Math.min(90, Math.max(10, x)), Math.min(88, Math.max(12, y))] as const;
  });
  const path = points.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
  return <section className="overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 md:px-8 md:py-24">
    <div className="mx-auto max-w-7xl"><AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
      <div className="mt-12 hidden min-h-[38rem] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_28px_90px_var(--token-shadow)] lg:grid lg:grid-cols-[1fr_22rem]" data-card>
        <div className="relative overflow-hidden bg-[linear-gradient(var(--token-divider)_1px,transparent_1px),linear-gradient(90deg,var(--token-divider)_1px,transparent_1px),var(--token-section-bg-alt)] bg-[size:32px_32px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true"><motion.path d={path} stroke="var(--token-accent)" strokeWidth=".65" strokeDasharray="2 1.6" vectorEffect="non-scaling-stroke" initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} /></svg>
          <div role="group" aria-label="Bauplan-Knoten">{nodes.map((node, index) => { const [x, y] = points[index]; return <button key={node.id} type="button" onClick={() => setActive(index)} className={`absolute w-36 -translate-x-1/2 -translate-y-1/2 border p-3 text-left shadow-[0_12px_35px_var(--token-shadow)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-accent)] ${active === index ? 'z-10 border-[var(--token-accent)] bg-[var(--token-card-bg)] scale-105' : 'border-[var(--token-card-border)] bg-[var(--token-card-bg)] hover:-translate-y-[54%]'}`} style={{ left: `${x}%`, top: `${y}%` }} aria-label={`${node.title}${node.metric ? ` · ${node.metric}` : ''}`} aria-pressed={active === index} aria-current={active === index ? 'step' : undefined} data-edit-collection="nodes" data-edit-index={index}><span className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-[color:var(--token-eyebrow)]"><span>{String(index + 1).padStart(2, '0')}</span>{node.metric && <span data-edit-path="metric">{node.metric}</span>}</span><span className="mt-2 block text-sm font-black leading-tight text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{node.title}</span></button>; })}</div>
        </div>
        <aside className="border-l border-[var(--token-card-border)] p-7"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[color:var(--token-eyebrow)]"><Maximize2 size={14} /> Aktiver Knoten</p><AnimatePresence mode="wait"><motion.div key={current.id} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8" data-edit-collection="nodes" data-edit-index={active}>{current.image && <div className="mb-6 aspect-square overflow-hidden rounded-[var(--token-card-radius)] bg-[var(--token-section-bg-alt)]"><img src={current.image} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="image" /></div>}<p className="text-5xl font-black tracking-[-.06em] text-[color:color-mix(in_srgb,var(--token-accent)_38%,transparent)]">{String(active + 1).padStart(2, '0')}</p><h3 className="mt-4 text-2xl font-black leading-tight text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{current.title}</h3>{current.text && <p className="mt-3 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(current.text)}</p>}</motion.div></AnimatePresence></aside>
      </div>
      <div className="mt-10 border-l border-[var(--token-divider)] pl-6 lg:hidden">{nodes.map((node, index) => <article key={node.id} className="relative pb-10" data-edit-collection="nodes" data-edit-index={index}><span className="absolute -left-[2.05rem] top-1 grid h-4 w-4 place-items-center rounded-full bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]"><CircleDot size={10} /></span>{node.image && <div className="mb-4 aspect-[16/9] overflow-hidden rounded-[var(--token-card-radius)]"><img src={node.image} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="image" /></div>}<p className="text-xs font-bold text-[color:var(--token-eyebrow)]">{node.metric || String(index + 1).padStart(2, '0')}</p><h3 className="mt-2 text-2xl font-black text-[color:var(--token-heading)]" data-edit-path="title">{node.title}</h3>{node.text && <p className="mt-2 text-sm leading-6 text-[color:var(--token-body)]" data-edit-path="text">{plain(node.text)}</p>}</article>)}</div>
      <AdvancedLink cta={data.cta as AdvancedCta} className="mt-8" />
    </div>
  </section>;
}

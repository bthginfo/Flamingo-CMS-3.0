'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Point = { label: string; value?: string };
type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function BeforeAfterStoryProSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const problem = (data.problem as string) || '';
  const solution = (data.solution as string) || '';
  const result = (data.result as string) || '';
  const beforeImage = (data.beforeImage as string) || '';
  const afterImage = (data.afterImage as string) || '';
  const points = (data.points as Point[]) || [];
  const cta = (data.cta as Cta) || {};

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        {badge && <span className="section-badge">{badge}</span>}
        {headline && <h2 className="section-headline text-left">{headline}</h2>}
        <div className="mt-8 grid gap-3">
          {[['Ausgangslage', problem], ['Lösung', solution], ['Ergebnis', result]].filter(([, text]) => text).map(([label, text], index) => (
            <motion.div key={label} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-[var(--token-card-border,var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08))))] bg-[var(--token-card-bg,var(--token-card-bg, var(--style-card-bg,#fff)))] p-5">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--token-eyebrow,var(--style-accent-color,var(--token-icon, var(--brand-primary))))]">{label}</div>
              <p className="mt-2 text-sm leading-7 text-[var(--token-body,var(--token-body, var(--style-body-color,#3f3f46)))]">{plain(text)}</p>
            </motion.div>
          ))}
        </div>
        {cta.label && <a href={cta.href || '#'} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--token-icon, var(--brand-primary,#111)))))] px-5 py-3 text-sm font-bold text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#fff)))]">{cta.label}<ArrowRight size={16} /></a>}
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <ImagePanel label="Vorher" image={beforeImage} />
          <ImagePanel label="Nachher" image={afterImage} prominent />
        </div>
        {points.length > 0 && (
          <div className="grid gap-3 rounded-3xl border border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08))))] bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#fff)))] p-5 sm:grid-cols-3">
            {points.map((point, index) => (
              <div key={index}>
                <CheckCircle2 className="mb-2 text-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]" size={18} />
                {point.value && <div className="text-2xl font-black text-[var(--token-heading, var(--token-heading, var(--style-heading-color,#111)))]">{point.value}</div>}
                <div className="text-sm text-[var(--token-muted, var(--token-muted, var(--style-text-muted,#71717a)))]">{point.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ImagePanel({ label, image, prominent }: { label: string; image: string; prominent?: boolean }) {
  return (
    <div className={`relative min-h-[360px] overflow-hidden rounded-3xl ${prominent ? 'shadow-2xl' : 'opacity-85'}`}>
      {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <div className="h-full bg-zinc-200" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-zinc-950">{label}</div>
    </div>
  );
}

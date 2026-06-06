'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Column = { label: string };
type Row = { feature: string; values: string[] };

export function ComparisonTableSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || '';
  const columns = (data.columns as Column[]) || [];
  const rows = (data.rows as Row[]) || [];
  const highlightCol = (data.highlightCol as number) ?? -1;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (!columns.length || !rows.length) return null;

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-10">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {text && <p className="section-subline max-w-3xl mx-auto" data-edit-path="text">{plain(text)}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="rounded-[32px] bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_88%,var(--token-section-bg,#fff))] p-3 shadow-xl shadow-black/5 ring-1 ring-[color:var(--token-card-border)] md:p-4">
        <div className="overflow-x-auto pb-1">
        <table className="w-full min-w-[820px] border-separate [border-spacing:10px_14px] text-sm md:[border-spacing:16px_18px]">
          <thead>
            <tr>
              <th className="w-1/3 rounded-3xl border border-[color:var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-section-bg-alt,#f8fafc)_70%,var(--token-card-bg,#fff))] px-7 py-6 text-left text-xs font-black uppercase tracking-wider text-[color:var(--token-muted)] shadow-sm shadow-black/[0.025] md:px-8">
                Vergleich
              </th>
              {columns.map((col, i) => (
                <th key={i} className={`rounded-3xl border border-[color:var(--token-card-border)] px-7 py-6 text-center text-sm font-extrabold shadow-sm shadow-black/[0.025] md:px-8 ${i === highlightCol ? 'bg-[color:color-mix(in_srgb,var(--token-accent,#f59e0b)_16%,var(--token-card-bg,#fff))] text-[color:var(--token-accent)] ring-1 ring-[color:color-mix(in_srgb,var(--token-accent,#f59e0b)_28%,transparent)]' : 'bg-[color:var(--token-card-bg)] text-[color:var(--token-heading)]'}`} data-edit-collection="columns" data-edit-index={i}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="group transition-colors" data-edit-collection="rows" data-edit-index={ri}>
                <td className="rounded-3xl border border-[color:var(--token-card-border)] bg-[color:var(--token-card-bg)] px-7 py-6 font-bold leading-relaxed text-[color:var(--token-heading)] shadow-sm shadow-black/[0.025] transition group-hover:bg-[color:color-mix(in_srgb,var(--token-section-bg-alt,#f8fafc)_58%,var(--token-card-bg,#fff))] md:px-8">{row.feature}</td>
                {row.values.map((val, ci) => (
                  <td key={ci} className={`rounded-3xl border border-[color:var(--token-card-border)] px-7 py-6 text-center shadow-sm shadow-black/[0.025] transition md:px-8 ${ci === highlightCol ? 'bg-[color:color-mix(in_srgb,var(--token-accent,#f59e0b)_10%,var(--token-card-bg,#fff))] ring-1 ring-[color:color-mix(in_srgb,var(--token-accent,#f59e0b)_18%,transparent)]' : 'bg-[color:var(--token-card-bg)] group-hover:bg-[color:color-mix(in_srgb,var(--token-section-bg-alt,#f8fafc)_58%,var(--token-card-bg,#fff))]'}`} data-edit-collection="values" data-edit-index={ci}>
                    {val === 'true' ? <Check size={18} className="mx-auto text-[color:var(--token-check,var(--token-accent))]" /> : val === 'false' ? <X size={18} className="mx-auto text-[color:var(--token-muted)]" /> : <span className="font-semibold leading-relaxed text-[color:var(--token-body)]">{val}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </motion.div>
    </div>
  );
}

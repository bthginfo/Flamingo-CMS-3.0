'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Column = { label: string };
type Row = { feature: string; values: string[] };

export function ComparisonTableSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || (data.subline as string) || '';
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

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="overflow-hidden rounded-[28px] bg-[color:var(--token-card-bg,#fff)] shadow-xl shadow-black/5 ring-1 ring-[color:var(--token-card-border)]">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-1/3 border-b border-r border-[color:var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-section-bg-alt,#f8fafc)_72%,var(--token-card-bg,#fff))] px-7 py-6 text-left text-xs font-black uppercase tracking-wider text-[color:var(--token-muted)] md:px-8">
                Vergleich
              </th>
              {columns.map((col, i) => (
                <th key={i} className={`border-b border-r last:border-r-0 border-[color:var(--token-card-border)] px-7 py-6 text-center text-sm font-extrabold md:px-8 ${i === highlightCol ? 'bg-[color:color-mix(in_srgb,var(--token-accent)_15%,var(--token-card-bg,#fff))] text-[color:var(--token-accent)]' : 'bg-[color:var(--token-card-bg)] text-[color:var(--token-card-heading,var(--token-heading))]'}`} data-edit-collection="columns" data-edit-index={i}>
                  {col.label || `Option ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="group transition-colors" data-edit-collection="rows" data-edit-index={ri}>
                <td className="border-b border-r border-[color:var(--token-card-border)] bg-[color:var(--token-card-bg)] px-7 py-6 font-bold leading-relaxed text-[color:var(--token-card-heading,var(--token-heading))] transition group-last:border-b-0 group-hover:bg-[color:color-mix(in_srgb,var(--token-section-bg-alt,#f8fafc)_58%,var(--token-card-bg,#fff))] md:px-8">{row.feature || `Kriterium ${ri + 1}`}</td>
                {row.values.map((val, ci) => (
                  <td key={ci} className={`border-b border-r last:border-r-0 border-[color:var(--token-card-border)] px-7 py-6 text-center transition group-last:border-b-0 md:px-8 ${ci === highlightCol ? 'bg-[color:color-mix(in_srgb,var(--token-accent)_9%,var(--token-card-bg,#fff))]' : 'bg-[color:var(--token-card-bg)] group-hover:bg-[color:color-mix(in_srgb,var(--token-section-bg-alt,#f8fafc)_58%,var(--token-card-bg,#fff))]'}`} data-edit-collection="values" data-edit-index={ci}>
                    {val === 'true' ? <Check size={18} className="mx-auto text-[color:var(--token-check)]" /> : val === 'false' ? <X size={18} className="mx-auto text-[color:var(--token-card-muted,var(--token-muted))]" /> : <span className="font-semibold leading-relaxed text-[color:var(--token-card-body,var(--token-body))]">{val || '-'}</span>}
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

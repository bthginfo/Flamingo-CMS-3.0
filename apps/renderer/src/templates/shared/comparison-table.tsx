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

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="overflow-hidden rounded-2xl border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-[color-mix(in_srgb,var(--token-section-bg-alt)_55%,transparent)]">
              <th className="w-1/3 border-b border-[color:var(--token-card-border)] p-5 text-left text-xs font-bold uppercase tracking-wider text-[color:var(--token-muted)]">
                Vergleich
              </th>
              {columns.map((col, i) => (
                <th key={i} className={`border-b border-l border-[color:var(--token-card-border)] p-5 text-center text-sm font-bold ${i === highlightCol ? 'bg-[color-mix(in_srgb,var(--token-accent)_14%,transparent)] text-[var(--token-accent)]' : 'text-[color:var(--token-heading)]'}`} data-edit-collection="columns" data-edit-index={i}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="transition-colors hover:bg-[color-mix(in_srgb,var(--token-section-bg-alt)_35%,transparent)]" data-edit-collection="rows" data-edit-index={ri}>
                <td className="border-b border-[color:var(--token-card-border)] p-5 font-semibold text-[color:var(--token-heading)]">{row.feature}</td>
                {row.values.map((val, ci) => (
                  <td key={ci} className={`border-b border-l border-[color:var(--token-card-border)] p-5 text-center ${ci === highlightCol ? 'bg-[color-mix(in_srgb,var(--token-accent)_8%,transparent)]' : ''}`} data-edit-collection="values" data-edit-index={ci}>
                    {val === 'true' ? <Check size={18} className="mx-auto text-green-600" /> : val === 'false' ? <X size={18} className="mx-auto text-[color:var(--token-body)]" /> : <span className="font-medium text-[color:var(--token-body)]">{val}</span>}
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

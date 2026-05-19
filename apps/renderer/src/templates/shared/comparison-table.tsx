'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';

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
        {badge && <span className="section-badge">{badge}</span>}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {text && <p className="section-subline max-w-3xl mx-auto">{text}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left p-4 border-b border-zinc-200 font-medium text-zinc-500 w-1/3" />
              {columns.map((col, i) => (
                <th key={i} className={`p-4 border-b text-center font-semibold ${i === highlightCol ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-zinc-800'}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-zinc-100 last:border-b-0">
                <td className="p-4 font-medium text-zinc-700">{row.feature}</td>
                {row.values.map((val, ci) => (
                  <td key={ci} className={`p-4 text-center ${ci === highlightCol ? 'bg-[var(--color-primary)]/5' : ''}`}>
                    {val === 'true' ? <Check size={18} className="mx-auto text-green-600" /> : val === 'false' ? <X size={18} className="mx-auto text-zinc-300" /> : <span className="text-zinc-700">{val}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

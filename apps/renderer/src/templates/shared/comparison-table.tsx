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
        {badge && <span className="section-badge">{badge}</span>}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {text && <p className="section-subline max-w-3xl mx-auto">{plain(text)}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left p-4 border-b border-[color:var(--token-card-border,#e4e4e7)] font-medium text-[color:var(--token-muted,#71717a)] w-1/3" />
              {columns.map((col, i) => (
                <th key={i} className={`p-4 border-b text-center font-semibold ${i === highlightCol ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[color:var(--token-heading,#27272a)]'}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-[color:var(--token-card-border,#f4f4f5)] last:border-b-0">
                <td className="p-4 font-medium text-[color:var(--token-muted,#3f3f46)]">{row.feature}</td>
                {row.values.map((val, ci) => (
                  <td key={ci} className={`p-4 text-center ${ci === highlightCol ? 'bg-[var(--color-primary)]/5' : ''}`}>
                    {val === 'true' ? <Check size={18} className="mx-auto text-green-600" /> : val === 'false' ? <X size={18} className="mx-auto text-[color:var(--token-body,#d4d4d8)]" /> : <span className="text-[color:var(--token-muted,#3f3f46)]">{val}</span>}
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

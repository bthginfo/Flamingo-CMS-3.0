'use client';

import { Fragment } from 'react';
import { Check, Minus } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Column = { label: string; note?: string };
type Row = { feature: string; values: (string | boolean)[] };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function normalizeValue(value: string | boolean | undefined) {
  if (typeof value === 'string' && value.toLowerCase() === 'true') return true;
  if (typeof value === 'string' && value.toLowerCase() === 'false') return false;
  return value;
}

export function PremiumComparisonSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const columns = (data.columns as Column[]) || [];
  const rows = (data.rows as Row[]) || [];
  const highlightCol = Number(data.highlightCol ?? 1);
  if (!columns.length || !rows.length) return null;

  return (
    <div>
      <div className="mx-auto mb-12 max-w-3xl text-center">
        {badge && <span className="section-badge">{badge}</span>}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{plain(subline)}</p>}
      </div>
      <div className="overflow-x-auto rounded-[var(--style-card-radius,1rem)] border border-[var(--style-border-color,rgba(0,0,0,0.08))] bg-[var(--style-card-bg,#fff)] shadow-xl">
        <div className="grid min-w-[720px]" style={{ gridTemplateColumns: `minmax(180px,1.2fr) repeat(${columns.length}, minmax(140px,1fr))` }}>
          <div className="border-b border-[var(--style-border-color,rgba(0,0,0,0.08))] p-5" />
          {columns.map((col, i) => (
            <div key={i} className={`border-b border-l border-[var(--style-border-color,rgba(0,0,0,0.08))] p-5 text-center ${i === highlightCol ? 'bg-[var(--brand-primary)] text-white' : ''}`}>
              <div className="font-bold">{col.label}</div>
              {col.note && <div className={`mt-1 text-xs ${i === highlightCol ? 'text-white/70' : 'text-[var(--style-text-muted,#71717a)]'}`}>{col.note}</div>}
            </div>
          ))}
          {rows.map((row, ri) => (
            <Fragment key={ri}>
              <div key={`${ri}-feature`} className="border-b border-[var(--style-border-color,rgba(0,0,0,0.08))] p-5 font-medium text-[var(--style-heading-color,var(--style-text-primary,#111))]">{row.feature}</div>
              {columns.map((_, ci) => {
                const value = normalizeValue(row.values[ci]);
                return (
                  <div key={`${ri}-${ci}`} className={`flex items-center justify-center border-b border-l border-[var(--style-border-color,rgba(0,0,0,0.08))] p-5 text-center text-sm ${ci === highlightCol ? 'bg-[var(--brand-primary)]/5' : ''}`}>
                    {value === true ? <Check className="text-[var(--brand-primary)]" size={19} /> : value === false ? <Minus className="text-[var(--style-text-muted,#a1a1aa)]" size={19} /> : <span>{value}</span>}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

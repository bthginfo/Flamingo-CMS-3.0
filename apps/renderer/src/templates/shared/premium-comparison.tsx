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
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </div>
      <div className="overflow-x-auto rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-xl">
        <div className="grid min-w-[720px]" style={{ gridTemplateColumns: `minmax(180px,1.2fr) repeat(${columns.length}, minmax(140px,1fr))` }}>
          <div className="border-b border-[var(--token-card-border)] p-5" />
          {columns.map((col, i) => (
            <div key={i} className={`border-b border-l border-[var(--token-card-border)] p-5 text-center ${i === highlightCol ? 'bg-[var(--token-icon)] text-[color:var(--token-btn-text,#fff)]' : ''}`} data-edit-collection="columns" data-edit-index={i}>
              <div className="font-bold" data-edit-path="label">{col.label}</div>
              {col.note && <div className={`mt-1 text-xs ${i === highlightCol ? 'text-[color:color-mix(in_srgb,var(--token-btn-text,#fff)_70%,transparent)]' : 'text-[color:var(--token-muted)]'}`} data-edit-path="note">{col.note}</div>}
            </div>
          ))}
          {rows.map((row, ri) => (
            <Fragment key={ri} data-edit-collection="rows" data-edit-index={ri}>
              <div key={`${ri}-feature`} className="border-b border-[var(--token-card-border)] p-5 font-medium text-[color:var(--token-card-heading,var(--token-heading))]">{row.feature}</div>
              {columns.map((_, ci) => {
                const value = normalizeValue(row.values[ci]);
                return (
                  <div key={`${ri}-${ci}`} className={`flex items-center justify-center border-b border-l border-[var(--token-card-border)] p-5 text-center text-sm ${ci === highlightCol ? 'bg-[color-mix(in_srgb,var(--token-icon)_5%,transparent)]' : ''}`}>
                    {value === true ? <Check className="text-[color:var(--token-icon)]" size={19} /> : value === false ? <Minus className="text-[color:var(--token-muted)]" size={19} /> : <span data-edit-path="value">{value}</span>}
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

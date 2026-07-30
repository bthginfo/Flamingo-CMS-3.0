import { Check, X } from 'lucide-react';
import { plain } from '@/lib/strip-html';
import { PremiumSectionHeader, ResponsiveDataFrame } from './section-primitives';

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
  if (!columns.length || !rows.length) return null;

  return (
    <div>
      <PremiumSectionHeader
        eyebrow={badge}
        headline={headline}
        subline={plain(text)}
        eyebrowPath="badge"
        sublinePath="text"
        align="center"
        richSubline={false}
      />

      <ResponsiveDataFrame label={headline || 'Angebotsvergleich'}>
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <caption className="sr-only">{headline || 'Angebotsvergleich'}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-1/3 border-b border-r border-[color:var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-section-bg-alt)_72%,var(--token-card-bg))] px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-[color:var(--token-card-heading)] md:px-8">
                Vergleich
              </th>
              {columns.map((column, index) => (
                <th
                  key={`${column.label}-${index}`}
                  scope="col"
                  className={`border-b border-r border-[color:var(--token-card-border)] px-6 py-5 text-center text-sm font-extrabold last:border-r-0 md:px-8 ${index === highlightCol ? 'bg-[color:color-mix(in_srgb,var(--token-accent)_15%,var(--token-card-bg))] text-[color:var(--token-card-heading)]' : 'bg-[color:var(--token-card-bg)] text-[color:var(--token-card-heading)]'}`}
                  data-edit-collection="columns"
                  data-edit-index={index}
                  data-edit-path="label"
                  data-card-scope="table-cell"
                >
                  {column.label || `Option ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${row.feature}-${rowIndex}`} className="group" data-edit-collection="rows" data-edit-index={rowIndex}>
                <th scope="row" className="border-b border-r border-[color:var(--token-card-border)] bg-[color:var(--token-card-bg)] px-6 py-5 text-left font-bold leading-relaxed text-[color:var(--token-card-heading)] transition-colors group-last:border-b-0 group-hover:bg-[color:color-mix(in_srgb,var(--token-section-bg-alt)_58%,var(--token-card-bg))] md:px-8" data-edit-path="feature">
                  {row.feature || `Kriterium ${rowIndex + 1}`}
                </th>
                {columns.map((_, columnIndex) => {
                  const value = row.values?.[columnIndex] || '';
                  return (
                    <td
                      key={columnIndex}
                      className={`border-b border-r border-[color:var(--token-card-border)] px-6 py-5 text-center transition-colors last:border-r-0 group-last:border-b-0 md:px-8 ${columnIndex === highlightCol ? 'bg-[color:color-mix(in_srgb,var(--token-accent)_9%,var(--token-card-bg))]' : 'bg-[color:var(--token-card-bg)] group-hover:bg-[color:color-mix(in_srgb,var(--token-section-bg-alt)_58%,var(--token-card-bg))]'}`}
                      data-edit-collection="values"
                      data-edit-index={columnIndex}
                      data-card-scope="table-cell"
                    >
                      {value === 'true' ? (
                        <span className="inline-flex" aria-label="Enthalten"><Check aria-hidden="true" size={19} className="text-[color:var(--token-check)]" /></span>
                      ) : value === 'false' ? (
                        <span className="inline-flex" aria-label="Nicht enthalten"><X aria-hidden="true" size={19} className="text-[color:var(--token-card-muted)]" /></span>
                      ) : (
                        <span className="font-semibold leading-relaxed text-[color:var(--token-card-body)]">{value || '–'}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveDataFrame>
    </div>
  );
}

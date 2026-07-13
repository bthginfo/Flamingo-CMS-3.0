'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { compactStringList } from '@/lib/string-list';

type Props = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  emptyText?: string;
  maxItems?: number;
};

export function StringListField({
  label,
  value,
  onChange,
  placeholder = 'Eintrag eingeben',
  addLabel = 'Eintrag hinzufügen',
  emptyText = 'Noch keine Einträge hinzugefügt.',
  maxItems,
}: Props) {
  const canAdd = maxItems == null || value.length < maxItems;

  function update(index: number, nextValue: string) {
    onChange(value.map((entry, entryIndex) => entryIndex === index ? nextValue : entry));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function cleanEmptyDrafts() {
    const compacted = compactStringList(value);
    if (compacted.length !== value.length) onChange(compacted);
  }

  return (
    <fieldset
      className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) cleanEmptyDrafts();
      }}
    >
      <legend className="px-1 text-xs font-semibold text-zinc-700">{label}</legend>
      {value.length === 0 ? <p className="px-1 py-2 text-xs text-zinc-400">{emptyText}</p> : (
        <div className="space-y-2">
          {value.map((entry, index) => (
            <div key={index} className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap">
              <span className="w-5 shrink-0 text-center text-[10px] font-semibold text-zinc-400">{index + 1}</span>
              <input
                className="admin-input min-w-[10rem] flex-1"
                value={entry}
                onChange={(event) => update(index, event.target.value)}
                placeholder={placeholder}
                aria-label={`${label}, Eintrag ${index + 1}`}
              />
              <div className="ml-auto flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-zinc-400 hover:bg-white hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-25" aria-label={`Eintrag ${index + 1} nach oben`}><ArrowUp size={14} /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === value.length - 1} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-zinc-400 hover:bg-white hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-25" aria-label={`Eintrag ${index + 1} nach unten`}><ArrowDown size={14} /></button>
                <button type="button" onClick={() => onChange(value.filter((_, entryIndex) => entryIndex !== index))} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" aria-label={`Eintrag ${index + 1} entfernen`}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button type="button" disabled={!canAdd} onClick={() => onChange([...value, ''])} className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-blue-700 hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-zinc-400">
        <Plus size={14} /> {canAdd ? addLabel : `Maximal ${maxItems}`}
      </button>
    </fieldset>
  );
}

/** Adapter for legacy editors that still keep list drafts as newline strings. */
export function LineListField({ value, onChange, ...props }: Omit<Props, 'value' | 'onChange'> & { value: string; onChange: (value: string) => void }) {
  const items = value === '' ? [] : value.split('\n');
  return <StringListField {...props} value={items} onChange={(next) => onChange(next.join('\n'))} />;
}

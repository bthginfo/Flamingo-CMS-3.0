'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Link2, LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  backHref: string;
  kindLabel: string;
  title: string;
  onTitleChange: (title: string) => void;
  pathPrefix: string;
  slug: string;
  onSlugChange: (slug: string) => void;
  statusActive: boolean;
  statusActiveLabel: string;
  statusInactiveLabel: string;
  onStatusChange: (active: boolean) => void;
  dirty: boolean;
  saved: boolean;
  saving: boolean;
  secondaryControls?: ReactNode;
};

function SaveState({ dirty, saved, saving }: Pick<Props, 'dirty' | 'saved' | 'saving'>) {
  if (saving) {
    return <span className="inline-flex items-center gap-1.5 text-blue-700"><LoaderCircle size={13} className="animate-spin" /> Speichert</span>;
  }
  if (dirty) {
    return <span className="inline-flex items-center gap-1.5 text-amber-700"><Circle size={11} fill="currentColor" /> Noch nicht gespeichert</span>;
  }
  if (saved) {
    return <span className="inline-flex items-center gap-1.5 text-emerald-700"><CheckCircle2 size={13} /> Gespeichert</span>;
  }
  return <span className="text-zinc-500">Bereit zum Bearbeiten</span>;
}

export function EditorDocumentHeader({
  backHref,
  kindLabel,
  title,
  onTitleChange,
  pathPrefix,
  slug,
  onSlugChange,
  statusActive,
  statusActiveLabel,
  statusInactiveLabel,
  onStatusChange,
  dirty,
  saved,
  saving,
  secondaryControls,
}: Props) {
  const statusLabel = statusActive ? statusActiveLabel : statusInactiveLabel;

  return (
    <section className="admin-card mb-5 overflow-hidden" aria-label={`${kindLabel} bearbeiten`}>
      <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-start">
        <Link
          href={backHref}
          aria-label={`Zurück zu ${kindLabel}`}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center self-start rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">{kindLabel}</span>
            <span className="text-xs" aria-live="polite"><SaveState dirty={dirty} saved={saved} saving={saving} /></span>
          </div>
          <label className="block">
            <span className="sr-only">Titel</span>
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Titel eingeben"
              className="w-full border-0 bg-transparent p-0 text-2xl font-bold tracking-tight text-zinc-950 outline-none placeholder:text-zinc-300 focus:ring-0 sm:text-[1.75rem]"
            />
          </label>
          <label className="mt-3 flex min-h-10 max-w-2xl items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 transition-colors focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <Link2 size={14} className="shrink-0" aria-hidden="true" />
            <span className="min-w-0 max-w-[45%] truncate select-none sm:max-w-none" title={pathPrefix}>{pathPrefix}</span>
            <span className="sr-only">URL</span>
            <input
              value={slug}
              onChange={(event) => onSlugChange(event.target.value)}
              aria-label="URL-Pfad"
              className="min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-sm font-medium text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-0"
              placeholder="url-pfad"
              spellCheck={false}
            />
          </label>
        </div>

        <label className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 lg:min-w-48">
          <span>
            <span className="block text-sm font-semibold text-zinc-900">{statusLabel}</span>
            <span className="mt-0.5 block text-xs text-zinc-500">Status</span>
          </span>
          <input
            type="checkbox"
            className="peer sr-only"
            checked={statusActive}
            onChange={(event) => onStatusChange(event.target.checked)}
            aria-label={statusLabel}
          />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-emerald-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2" aria-hidden="true" />
        </label>
      </div>

      {secondaryControls && (
        <div className="border-t border-zinc-200 bg-zinc-50/60 px-4 py-3 sm:px-5">
          {secondaryControls}
        </div>
      )}
    </section>
  );
}

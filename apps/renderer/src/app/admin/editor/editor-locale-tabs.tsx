'use client';

import type { EditorI18nConfig } from './live-preview-data';

type Props = {
  i18n?: EditorI18nConfig;
  activeLocale: string;
  onChange: (locale: string) => void;
};

export function EditorLocaleTabs({ i18n, activeLocale, onChange }: Props) {
  if (!i18n?.enabled) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3" aria-label="Inhaltssprache">
      <span className="text-xs font-semibold text-zinc-600">Sprache</span>
      <div className="flex w-fit items-center gap-1 rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Inhaltssprache auswählen">
        {i18n.locales.map((locale) => (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={activeLocale === locale}
            onClick={() => onChange(locale)}
            className={`min-h-10 rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${activeLocale === locale ? 'bg-white text-blue-700 shadow-sm' : 'text-zinc-500 hover:bg-white/70 hover:text-zinc-800'}`}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

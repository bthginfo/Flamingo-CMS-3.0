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
    <div className="flex items-center gap-1 mb-4 p-1 bg-gray-100 rounded-lg w-fit">
      {i18n.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => onChange(locale)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeLocale === locale ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

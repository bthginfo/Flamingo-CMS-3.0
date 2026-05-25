'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LOCALE_LABELS: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  pt: 'Português',
  tr: 'Türkçe',
  ru: 'Русский',
  ar: 'العربية',
  ja: '日本語',
  zh: '中文',
};

export function LanguageSwitcher({ locales, currentLocale, defaultLocale, style = 'dropdown' }: {
  locales: string[];
  currentLocale: string;
  defaultLocale: string;
  style?: 'dropdown' | 'flags' | 'inline';
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (locales.length < 2) return null;

  // Build URL for target locale
  function getLocaleHref(locale: string) {
    // Strip current locale prefix from path
    let path = pathname;
    const localePrefix = `/${currentLocale}`;
    if (path.startsWith(localePrefix + '/') || path === localePrefix) {
      path = path.slice(localePrefix.length) || '/';
    }
    // Default locale uses bare path, others get prefix
    if (locale === defaultLocale) return path;
    return `/${locale}${path === '/' ? '' : path}`;
  }

  if (style === 'inline') {
    return (
      <div className="flex items-center gap-2 text-sm">
        {locales.map(locale => (
          <a key={locale} href={getLocaleHref(locale)} className={`px-2 py-1 rounded transition-colors ${locale === currentLocale ? 'font-semibold text-brand-primary' : 'text-gray-500 hover:text-gray-800'}`}>
            {locale.toUpperCase()}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors" aria-label="Sprache wählen">
        <Globe size={16} className="text-gray-500" />
        <span className="font-medium">{currentLocale.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px] z-50">
          {locales.map(locale => (
            <a key={locale} href={getLocaleHref(locale)} className={`block px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === currentLocale ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
              {LOCALE_LABELS[locale] || locale.toUpperCase()}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

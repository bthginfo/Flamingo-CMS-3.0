'use client';

import { useState, useTransition } from 'react';
import { Globe, Plus, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { updateI18nSettings } from './actions';

const ALL_LOCALES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pt', label: 'Português' },
  { code: 'pl', label: 'Polski' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ru', label: 'Русский' },
];

export function I18nClient({
  locales,
  defaultLocale,
  maxLanguages,
  switcherStyle,
  switcherPosition,
}: {
  locales: string[];
  defaultLocale: string;
  maxLanguages: number;
  switcherStyle: string;
  switcherPosition: string;
}) {
  const [activeLocales, setActiveLocales] = useState(locales);
  const [defLocale, setDefLocale] = useState(defaultLocale);
  const [style, setStyle] = useState(switcherStyle);
  const [position, setPosition] = useState(switcherPosition);
  const [pending, startTransition] = useTransition();

  function addLocale(code: string) {
    if (activeLocales.includes(code) || activeLocales.length >= maxLanguages) return;
    setActiveLocales([...activeLocales, code]);
  }

  function removeLocale(code: string) {
    if (code === defLocale) return;
    setActiveLocales(activeLocales.filter(l => l !== code));
  }

  function handleSave() {
    startTransition(async () => {
      await updateI18nSettings({
        locales: activeLocales,
        defaultLocale: defLocale,
        switcherStyle: style,
        switcherPosition: position,
      });
      toast.success('i18n-Einstellungen gespeichert');
    });
  }

  const availableToAdd = ALL_LOCALES.filter(l => !activeLocales.includes(l.code));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-violet-500" />
        <div>
          <h1 className="text-2xl font-bold">Mehrsprachigkeit</h1>
          <p className="text-sm text-zinc-500">Verwalten Sie die Sprachen Ihrer Website (max. {maxLanguages})</p>
        </div>
      </div>

      {/* Active Locales */}
      <div className="admin-card p-5 mb-6">
        <h2 className="font-semibold mb-3">Aktive Sprachen ({activeLocales.length}/{maxLanguages})</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {activeLocales.map(code => {
            const loc = ALL_LOCALES.find(l => l.code === code);
            return (
              <div key={code} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${code === defLocale ? 'bg-violet-100 text-violet-700 font-medium' : 'bg-zinc-100 text-zinc-700'}`}>
                <span>{loc?.label || code}</span>
                {code === defLocale && <span className="text-[10px] uppercase tracking-wide opacity-60">Standard</span>}
                {code !== defLocale && (
                  <button onClick={() => removeLocale(code)} className="text-zinc-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {activeLocales.length < maxLanguages && availableToAdd.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              className="text-sm border rounded-lg px-3 py-1.5"
              defaultValue=""
              onChange={e => { if (e.target.value) { addLocale(e.target.value); e.target.value = ''; } }}
            >
              <option value="" disabled>Sprache hinzufügen...</option>
              {availableToAdd.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <Plus size={14} className="text-zinc-400" />
          </div>
        )}
      </div>

      {/* Default Locale */}
      <div className="admin-card p-5 mb-6">
        <h2 className="font-semibold mb-3">Standardsprache</h2>
        <select
          value={defLocale}
          onChange={e => setDefLocale(e.target.value)}
          className="text-sm border rounded-lg px-3 py-2"
        >
          {activeLocales.map(code => {
            const loc = ALL_LOCALES.find(l => l.code === code);
            return <option key={code} value={code}>{loc?.label || code}</option>;
          })}
        </select>
        <p className="text-xs text-zinc-400 mt-2">Die Standardsprache wird angezeigt, wenn keine Übersetzung vorhanden ist.</p>
      </div>

      {/* Switcher Settings */}
      <div className="admin-card p-5 mb-6">
        <h2 className="font-semibold mb-3">Sprachschalter</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-zinc-500">Darstellung</label>
            <select value={style} onChange={e => setStyle(e.target.value)} className="w-full text-sm border rounded-lg px-3 py-2 mt-1">
              <option value="dropdown">Dropdown</option>
              <option value="flags">Flaggen</option>
              <option value="text">Text-Links</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500">Position</label>
            <select value={position} onChange={e => setPosition(e.target.value)} className="w-full text-sm border rounded-lg px-3 py-2 mt-1">
              <option value="nav-right">Navigation rechts</option>
              <option value="nav-left">Navigation links</option>
              <option value="footer">Nur im Footer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={pending}
        className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
      >
        <Save size={16} />
        {pending ? 'Wird gespeichert...' : 'Speichern'}
      </button>
    </div>
  );
}

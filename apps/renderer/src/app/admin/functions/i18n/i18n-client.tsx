'use client';

import { useMemo, useState, useTransition, type FormEvent } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Globe, Languages, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { updateI18nSettings } from './actions';

const ALL_LOCALES = [
  { code: 'de', label: 'Deutsch', short: 'DE', flag: '🇩🇪' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
  { code: 'es', label: 'Español', short: 'ES', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', short: 'IT', flag: '🇮🇹' },
  { code: 'nl', label: 'Nederlands', short: 'NL', flag: '🇳🇱' },
  { code: 'pt', label: 'Português', short: 'PT', flag: '🇵🇹' },
  { code: 'pl', label: 'Polski', short: 'PL', flag: '🇵🇱' },
  { code: 'tr', label: 'Türkçe', short: 'TR', flag: '🇹🇷' },
  { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
];

type SavedState = {
  locales: string[];
  defaultLocale: string;
  style: string;
  position: string;
};

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
  const initialState = useMemo<SavedState>(() => ({ locales, defaultLocale, style: switcherStyle, position: switcherPosition }), [locales, defaultLocale, switcherStyle, switcherPosition]);
  const [activeLocales, setActiveLocales] = useState(locales);
  const [defLocale, setDefLocale] = useState(defaultLocale);
  const [style, setStyle] = useState(switcherStyle);
  const [position, setPosition] = useState(switcherPosition);
  const [savedState, setSavedState] = useState(initialState);
  const [pending, startTransition] = useTransition();
  const [savedNow, setSavedNow] = useState(false);

  const currentState = useMemo<SavedState>(() => ({ locales: activeLocales, defaultLocale: defLocale, style, position }), [activeLocales, defLocale, style, position]);
  const dirty = JSON.stringify(currentState) !== JSON.stringify(savedState);
  const availableToAdd = ALL_LOCALES.filter(locale => !activeLocales.includes(locale.code));

  function markEdited() {
    setSavedNow(false);
  }

  function addLocale(code: string) {
    if (activeLocales.includes(code) || activeLocales.length >= maxLanguages) return;
    setActiveLocales(current => [...current, code]);
    markEdited();
  }

  function removeLocale(code: string) {
    if (code === defLocale) return;
    setActiveLocales(current => current.filter(locale => locale !== code));
    markEdited();
  }

  function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!dirty) return;
    startTransition(async () => {
      try {
        const result = await updateI18nSettings({
          locales: activeLocales,
          defaultLocale: defLocale,
          switcherStyle: style,
          switcherPosition: position,
        });
        if ('error' in result && result.error) {
          toast.error(result.error);
          return;
        }
        setSavedState(currentState);
        setSavedNow(true);
        toast.success('Spracheinstellungen gespeichert');
      } catch {
        toast.error('Spracheinstellungen konnten nicht gespeichert werden.');
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-5xl space-y-7">
      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100"><Globe className="size-5" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Premium-Modul</p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-950">Mehrsprachigkeit</h1>
            <p className="mt-1 text-sm text-zinc-500">Sprachen und den sichtbaren Sprachschalter Ihrer Website verwalten.</p>
          </div>
        </div>
        <div aria-live="polite" className={`inline-flex min-h-9 items-center gap-2 self-start rounded-lg px-3 text-xs font-semibold sm:self-auto ${dirty ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>
          {dirty ? <span className="size-2 rounded-full bg-amber-500" /> : <Check className="size-4" />}
          {dirty ? 'Ungespeicherte Änderungen' : savedNow ? 'Gerade gespeichert' : 'Gespeichert'}
        </div>
      </header>

      <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5" aria-labelledby="translation-workflow-heading">
        <div className="flex items-start gap-3">
          <Languages className="mt-0.5 size-5 shrink-0 text-violet-700" />
          <div>
            <h2 id="translation-workflow-heading" className="font-semibold text-violet-950">So entstehen mehrsprachige Seiten</h2>
            <p className="mt-1 text-sm leading-6 text-violet-900/70">Hier legen Sie die verfügbaren Sprachen fest. Die übersetzten Texte pflegen Sie anschließend direkt in den Seiten- und Collection-Editoren – bewusst pro Sprache und ohne automatische Übersetzung.</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-violet-800">
              <span>1. Sprache hinzufügen</span><span aria-hidden="true" className="text-violet-300">→</span><span>2. Einstellungen speichern</span><span aria-hidden="true" className="text-violet-300">→</span><span>3. Inhalte im Editor übersetzen</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/admin/pages" className="text-sm font-semibold text-violet-800 underline decoration-violet-300 underline-offset-4 hover:text-violet-950">Seiten öffnen</Link>
              <a href="mailto:hello@flamingomedia.online?subject=Professionelle%20Website-%C3%9Cbersetzung" className="text-sm font-semibold text-violet-800 underline decoration-violet-300 underline-offset-4 hover:text-violet-950">Übersetzung durch Flamingo anfragen</a>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <section className="admin-card p-5" aria-labelledby="active-languages-heading">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="active-languages-heading" className="font-semibold text-zinc-950">Aktive Sprachen</h2><p className="mt-1 text-sm text-zinc-500">{activeLocales.length} von {maxLanguages} Sprachen eingerichtet</p></div>
              <span className="text-xs font-semibold text-zinc-400">{activeLocales.length}/{maxLanguages}</span>
            </div>
            <ul className="mt-5 space-y-2">
              {activeLocales.map(code => {
                const locale = getLocale(code);
                const isDefault = code === defLocale;
                return (
                  <li key={code} className="flex min-h-14 items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2">
                    <span aria-hidden="true" className="text-xl">{locale.flag}</span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-zinc-900">{locale.label}</span><span className="block text-xs uppercase tracking-wide text-zinc-400">{locale.short}</span></span>
                    {isDefault ? <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700">Standard</span> : (
                      <button type="button" onClick={() => removeLocale(code)} aria-label={`${locale.label} entfernen`} className="grid size-11 place-items-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"><X className="size-4" /></button>
                    )}
                  </li>
                );
              })}
            </ul>
            {activeLocales.length < maxLanguages && availableToAdd.length ? (
              <label className="mt-4 block">
                <span className="admin-label">Weitere Sprache</span>
                <span className="block">
                  <select aria-label="Weitere Sprache hinzufügen" className="admin-input min-h-11 w-full" defaultValue="" onChange={event => { if (event.target.value) { addLocale(event.target.value); event.target.value = ''; } }}>
                    <option value="" disabled>Sprache auswählen …</option>
                    {availableToAdd.map(locale => <option key={locale.code} value={locale.code}>{locale.label}</option>)}
                  </select>
                </span>
              </label>
            ) : null}
          </section>

          <section className="admin-card p-5" aria-labelledby="default-language-heading">
            <h2 id="default-language-heading" className="font-semibold text-zinc-950">Standardsprache</h2>
            <p className="mt-1 text-sm text-zinc-500">Diese Sprache sehen Besucher zuerst.</p>
            <label className="mt-4 block" htmlFor="default-locale"><span className="admin-label">Standardsprache auswählen</span>
              <select id="default-locale" value={defLocale} onChange={event => { setDefLocale(event.target.value); markEdited(); }} className="admin-input min-h-11">
                {activeLocales.map(code => <option key={code} value={code}>{getLocale(code).label}</option>)}
              </select>
            </label>
            <p className="mt-2 text-xs leading-5 text-zinc-400">Fehlt ein übersetzter Text, kann an dieser Stelle der Inhalt der Standardsprache erscheinen.</p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="admin-card p-5" aria-labelledby="switcher-heading">
            <h2 id="switcher-heading" className="font-semibold text-zinc-950">Sprachschalter</h2>
            <p className="mt-1 text-sm text-zinc-500">So wechseln Besucher zwischen den Sprachen.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <label htmlFor="switcher-style"><span className="admin-label">Darstellung</span>
                <select id="switcher-style" value={style} onChange={event => { setStyle(event.target.value); markEdited(); }} className="admin-input min-h-11">
                  <option value="dropdown">Dropdown</option><option value="flags">Flaggen</option><option value="text">Text-Links</option>
                </select>
              </label>
              <label htmlFor="switcher-position"><span className="admin-label">Position</span>
                <select id="switcher-position" value={position} onChange={event => { setPosition(event.target.value); markEdited(); }} className="admin-input min-h-11">
                  <option value="nav-right">Navigation rechts</option><option value="nav-left">Navigation links</option><option value="footer">Nur im Footer</option>
                </select>
              </label>
            </div>
          </section>

          <SwitcherPreview locales={activeLocales} defaultLocale={defLocale} style={style} position={position} />
        </div>
      </div>

      <footer className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="px-2 text-xs text-zinc-500">Änderungen am Sprachschalter werden erst nach dem Speichern übernommen.</p>
        <button type="submit" disabled={pending || !dirty} className="admin-btn-primary min-h-11 shrink-0"><Save className="size-4" />{pending ? 'Wird gespeichert …' : dirty ? 'Änderungen speichern' : 'Alles gespeichert'}</button>
      </footer>
    </form>
  );
}

function SwitcherPreview({ locales, defaultLocale, style, position }: { locales: string[]; defaultLocale: string; style: string; position: string }) {
  const defaultLanguage = getLocale(defaultLocale);
  const switcher = style === 'dropdown' ? (
    <span className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 shadow-sm">{defaultLanguage.short}<ChevronDown className="size-3" /></span>
  ) : style === 'flags' ? (
    <span className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-sm">{locales.slice(0, 4).map(code => <span key={code} className={`grid size-8 place-items-center rounded-md text-base ${code === defaultLocale ? 'bg-zinc-100' : ''}`}>{getLocale(code).flag}</span>)}</span>
  ) : (
    <span className="flex min-h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold shadow-sm">{locales.slice(0, 4).map((code, index) => <span key={code} className={code === defaultLocale ? 'text-violet-700' : 'text-zinc-400'}>{index ? <span className="mr-2 text-zinc-200">/</span> : null}{getLocale(code).short}</span>)}</span>
  );
  const inFooter = position === 'footer';
  const alignRight = position === 'nav-right';
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100" aria-labelledby="preview-heading">
      <div className="border-b border-zinc-200 bg-white px-4 py-3"><h2 id="preview-heading" className="text-sm font-semibold text-zinc-800">Vorschau</h2><p className="mt-0.5 text-xs text-zinc-500">Vereinfachte Darstellung der Position</p></div>
      <div className="p-4">
        <div className="flex h-48 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex min-h-14 items-center gap-3 border-b border-zinc-100 px-3">
            <span className="grid size-7 place-items-center rounded-md bg-zinc-950 text-[9px] font-bold text-white">LOGO</span>
            {!inFooter && !alignRight ? switcher : null}
            <span className="ml-auto hidden gap-3 text-[9px] font-medium text-zinc-400 sm:flex"><span>ANGEBOT</span><span>ÜBER UNS</span><span>KONTAKT</span></span>
            {!inFooter && alignRight ? switcher : null}
          </div>
          <div className="flex-1 bg-[linear-gradient(135deg,#fafafa,#f4f4f5)] p-4"><div className="h-3 w-2/3 rounded bg-zinc-200" /><div className="mt-2 h-2 w-1/2 rounded bg-zinc-100" /></div>
          {inFooter ? <div className="flex min-h-14 items-center justify-between bg-zinc-950 px-3"><span className="text-[9px] text-zinc-500">© Website</span>{switcher}</div> : null}
        </div>
      </div>
    </section>
  );
}

function getLocale(code: string) {
  return ALL_LOCALES.find(locale => locale.code === code) || { code, label: code.toUpperCase(), short: code.toUpperCase(), flag: '🌐' };
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { saveNavigationSettings } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { NAV_SCRIPT_PROVIDERS } from '@/lib/embed-providers';

type NavItem = { label: string; href: string; type?: string };
type NavCtaState = { label: string; href: string; scriptProvider?: string; scriptConfig?: Record<string, string>; buttonColor?: string; buttonTextColor?: string };
type I18nConfig = { enabled: boolean; locales: string[]; defaultLocale: string };

export function NavigationForm({ initial, initialCta, i18n }: { initial: any; initialCta?: any; i18n?: I18nConfig }) {
  const isLocalized = initial?._localized;
  const locales = i18n?.locales || [];
  const defaultLocale = i18n?.defaultLocale || 'de';
  const [activeLocale, setActiveLocale] = useState(defaultLocale);

  function getItemsForLocale(locale: string): NavItem[] {
    if (isLocalized) {
      const res = initial[locale] || initial._default || [];
      return Array.isArray(res) ? res : [];
    }
    return Array.isArray(initial) ? initial : [];
  }
  function getCtaForLocale(locale: string): NavCtaState {
    if (initialCta?._localized) {
      const c = initialCta[locale] || initialCta._default;
      return c || { label: '', href: '' };
    }
    return initialCta || { label: 'Termin vereinbaren', href: '/kontakt' };
  }

  const [localeData, setLocaleData] = useState<Record<string, { items: NavItem[]; cta: NavCtaState }>>(() => {
    if (i18n?.enabled && locales.length > 0) {
      const data: Record<string, { items: NavItem[]; cta: NavCtaState }> = {};
      for (const loc of locales) {
        const items = getItemsForLocale(loc);
        data[loc] = { items: items.length > 0 ? items : [{ label: '', href: '/', type: 'link' }], cta: getCtaForLocale(loc) };
      }
      return data;
    }
    const items = Array.isArray(initial) ? initial : [];
    return { [defaultLocale]: { items: items.length > 0 ? items : [{ label: '', href: '/', type: 'link' }], cta: initialCta || { label: 'Termin vereinbaren', href: '/kontakt' } } };
  });

  const items = Array.isArray(localeData[activeLocale]?.items) ? localeData[activeLocale].items : [];
  const cta = localeData[activeLocale]?.cta || { label: '', href: '' };

  const setItems = (newItems: NavItem[] | ((prev: NavItem[]) => NavItem[])) => {
    setLocaleData(prev => {
      const resolved = typeof newItems === 'function' ? newItems(prev[activeLocale]?.items || []) : newItems;
      return { ...prev, [activeLocale]: { ...prev[activeLocale], items: resolved } };
    });
  };
  const setCta = (newCta: NavCtaState) => {
    setLocaleData(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], cta: newCta } }));
  };

  const [saving, setSaving] = useState(false);
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(false);
  useEffect(() => { if (mounted.current) markDirty(); else mounted.current = true; }, [localeData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (i18n?.enabled) {
        for (const loc of locales) {
          const d = localeData[loc];
          if (d) {
            await saveNavigationSettings(d.items.filter(i => i.label.trim()), d.cta.label.trim() ? d.cta : null, loc);
          }
        }
      } else {
        const d = localeData[defaultLocale];
        await saveNavigationSettings(d.items.filter(i => i.label.trim()), d.cta.label.trim() ? d.cta : null);
      }
      toast.success('Navigation gespeichert');
      markSaved();
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };
  useRegisterSave(handleSave);

  const moveItem = (from: number, to: number) => {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
  };

  const isWidgetMode = !!cta.scriptProvider;
  const selectedScriptProvider = cta.scriptProvider ? NAV_SCRIPT_PROVIDERS.find(p => p.id === cta.scriptProvider) : null;

  return (
    <div className="admin-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Hauptnavigation</h2>
        <span className="text-xs text-zinc-400">{items.length} Einträge</span>
      </div>

      {/* Locale Tabs */}
      {i18n?.enabled && locales.length > 1 && (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
          {locales.map(locale => (
            <button key={locale} onClick={() => setActiveLocale(locale)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeLocale === locale ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {locale.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <div className="flex flex-col gap-0.5">
              <button type="button" disabled={i === 0} onClick={() => moveItem(i, i - 1)} className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 text-xs leading-none">&#9650;</button>
              <button type="button" disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)} className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 text-xs leading-none">&#9660;</button>
            </div>
            <GripVertical size={14} className="text-zinc-300" />
            <input className="admin-input w-44" value={item.label} onChange={e => { const u = [...items]; u[i] = { ...u[i], label: e.target.value }; setItems(u); }} placeholder="Label" />
            <input className="admin-input flex-1" value={item.href} onChange={e => { const u = [...items]; u[i] = { ...u[i], href: e.target.value }; setItems(u); }} placeholder="/seite" />
            <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} className="admin-btn-ghost text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={() => setItems([...items, { label: '', href: '/', type: 'link' }])} className="admin-btn-secondary">
          <Plus size={16} /> Link hinzufügen
        </button>
      </div>

      <div className="border-t pt-5 mt-5 space-y-3">
        <h3 className="font-semibold text-sm">CTA-Button (in der Navigation)</h3>
        <p className="text-xs text-zinc-400">Auffälliger Button rechts in der Navigation — ideal für Terminbuchung, Reservierung oder externen Anbieter.</p>

        {/* Mode toggle */}
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => setCta({ ...cta, scriptProvider: undefined, scriptConfig: undefined })}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${!isWidgetMode ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => setCta({ ...cta, scriptProvider: 'drflex', scriptConfig: {}, href: '' })}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${isWidgetMode ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
          >
            Widget (JS)
          </button>
        </div>

        {isWidgetMode ? (
          <div className="space-y-3">
            {/* Provider selection */}
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Anbieter</label>
              <div className="flex gap-1.5">
                {NAV_SCRIPT_PROVIDERS.map(sp => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setCta({ ...cta, scriptProvider: sp.id, scriptConfig: {}, label: cta.label || sp.defaultLabel })}
                    className={`text-xs px-3 py-1.5 rounded-md transition-colors ${cta.scriptProvider === sp.id ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-700'}`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Config fields */}
            {selectedScriptProvider && (
              <div className="space-y-2">
                {selectedScriptProvider.fields.map(field => (
                  <div key={field.key}>
                    <label className="text-xs text-zinc-500 mb-1 block">{field.label}</label>
                    <input
                      className="admin-input"
                      value={cta.scriptConfig?.[field.key] || ''}
                      onChange={e => setCta({ ...cta, scriptConfig: { ...cta.scriptConfig, [field.key]: e.target.value } })}
                      placeholder={field.placeholder}
                    />
                    <p className="text-[10px] text-zinc-400 mt-0.5">{field.help}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Button label */}
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Button-Label</label>
              <input className="admin-input" value={cta.label} onChange={e => setCta({ ...cta, label: e.target.value })} placeholder={selectedScriptProvider?.defaultLabel || 'Termin buchen'} />
            </div>

            {/* Style overrides */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Button-Farbe</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cta.buttonColor || '#0ea5e9'}
                    onChange={e => setCta({ ...cta, buttonColor: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    className="admin-input flex-1"
                    value={cta.buttonColor || ''}
                    onChange={e => setCta({ ...cta, buttonColor: e.target.value })}
                    placeholder="Brand-Farbe"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Text-Farbe</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cta.buttonTextColor || '#ffffff'}
                    onChange={e => setCta({ ...cta, buttonTextColor: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    className="admin-input flex-1"
                    value={cta.buttonTextColor || ''}
                    onChange={e => setCta({ ...cta, buttonTextColor: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Link-based presets */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                { label: 'Dr. Flex', prefix: 'https://www.dr-flex.de/arzt/', placeholder: 'Online-Termin' },
                { label: 'Doctolib', prefix: 'https://www.doctolib.de/praxis/', placeholder: 'Termin buchen' },
                { label: 'Calendly', prefix: 'https://calendly.com/', placeholder: 'Termin vereinbaren' },
                { label: 'SimplyBook', prefix: 'https://', placeholder: 'Jetzt buchen' },
                { label: 'Treatwell', prefix: 'https://www.treatwell.de/salon/', placeholder: 'Termin buchen' },
                { label: 'OpenTable', prefix: 'https://www.opentable.de/r/', placeholder: 'Reservieren' },
              ].map(preset => (
                <button key={preset.label} type="button" onClick={() => { setCta({ ...cta, label: cta.label || preset.placeholder, href: preset.prefix }); }} className="text-[10px] px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Label</label>
                <input className="admin-input" value={cta.label} onChange={e => setCta({ ...cta, label: e.target.value })} placeholder="z.B. Termin vereinbaren" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Link</label>
                <input className="admin-input" value={cta.href} onChange={e => setCta({ ...cta, href: e.target.value })} placeholder="/kontakt oder https://..." />
              </div>
            </div>

            {/* Style overrides for link mode too */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Button-Farbe (optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cta.buttonColor || '#0ea5e9'}
                    onChange={e => setCta({ ...cta, buttonColor: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    className="admin-input flex-1"
                    value={cta.buttonColor || ''}
                    onChange={e => setCta({ ...cta, buttonColor: e.target.value })}
                    placeholder="Brand-Farbe"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Text-Farbe (optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cta.buttonTextColor || '#ffffff'}
                    onChange={e => setCta({ ...cta, buttonTextColor: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    className="admin-input flex-1"
                    value={cta.buttonTextColor || ''}
                    onChange={e => setCta({ ...cta, buttonTextColor: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400">Tipp: Für Dr. Flex / Doctolib den Widget-Modus verwenden — dann öffnet sich das Buchungs-Widget direkt auf der Seite, ohne Weiterleitung.</p>
          </>
        )}
      </div>
    </div>
  );
}

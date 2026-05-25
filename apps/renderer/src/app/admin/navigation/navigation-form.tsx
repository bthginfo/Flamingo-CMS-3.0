'use client';

import { useState, useEffect, useRef } from 'react';
import { saveNavigationSettings } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { Plus, Trash2, GripVertical } from 'lucide-react';

type NavItem = { label: string; href: string; type?: string };
type I18nConfig = { enabled: boolean; locales: string[]; defaultLocale: string };

export function NavigationForm({ initial, initialCta, i18n }: { initial: any; initialCta?: any; i18n?: I18nConfig }) {
  const isLocalized = initial?._localized;
  const locales = i18n?.locales || [];
  const defaultLocale = i18n?.defaultLocale || 'de';
  const [activeLocale, setActiveLocale] = useState(defaultLocale);

  // Resolve initial items/cta per locale
  function getItemsForLocale(locale: string): NavItem[] {
    if (isLocalized) {
      const res = initial[locale] || initial._default || [];
      return Array.isArray(res) ? res : [];
    }
    return Array.isArray(initial) ? initial : [];
  }
  function getCtaForLocale(locale: string): { label: string; href: string } {
    if (initialCta?._localized) {
      const c = initialCta[locale] || initialCta._default;
      return c || { label: '', href: '' };
    }
    return initialCta || { label: 'Termin vereinbaren', href: '/kontakt' };
  }

  // State per locale
  const [localeData, setLocaleData] = useState<Record<string, { items: NavItem[]; cta: { label: string; href: string } }>>(() => {
    if (i18n?.enabled && locales.length > 0) {
      const data: Record<string, { items: NavItem[]; cta: { label: string; href: string } }> = {};
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
  const setCta = (newCta: { label: string; href: string }) => {
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
        // Save each locale
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
              <button type="button" disabled={i === 0} onClick={() => moveItem(i, i - 1)} className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 text-xs leading-none">▲</button>
              <button type="button" disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)} className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 text-xs leading-none">▼</button>
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Label</label>
            <input className="admin-input" value={cta.label} onChange={e => setCta({ ...cta, label: e.target.value })} placeholder="z.B. Termin vereinbaren" />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Link</label>
            <input className="admin-input" value={cta.href} onChange={e => setCta({ ...cta, href: e.target.value })} placeholder="/kontakt" />
          </div>
        </div>
      </div>
    </div>
  );
}

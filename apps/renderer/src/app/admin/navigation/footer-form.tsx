'use client';

import { useState, useEffect, useRef } from 'react';
import { saveFooterSettings } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { Plus, Trash2 } from 'lucide-react';

type FooterColumn = { title: string; items: { text: string; href?: string }[] };
type FooterData = {
  columns: FooterColumn[];
  legalLinks: { label: string; href: string }[];
};
type I18nConfig = { enabled: boolean; locales: string[]; defaultLocale: string };

export function FooterForm({ initial, i18n }: { initial: any; i18n?: I18nConfig }) {
  const isLocalized = initial?.columns?._localized || initial?._localized;
  const locales = i18n?.locales || [];
  const defaultLocale = i18n?.defaultLocale || 'de';
  const [activeLocale, setActiveLocale] = useState(defaultLocale);

  function getColumnsForLocale(locale: string): FooterColumn[] {
    const cols = initial?.columns;
    if (cols?._localized) {
      const res = cols[locale] || cols._default || [];
      return Array.isArray(res) ? res : [];
    }
    return Array.isArray(cols) ? cols : [];
  }
  function getLegalForLocale(locale: string): { label: string; href: string }[] {
    const ll = initial?.legalLinks;
    if (ll?._localized) {
      const res = ll[locale] || ll._default || [];
      return Array.isArray(res) ? res : [];
    }
    return Array.isArray(ll) ? ll : [];
  }

  const [localeData, setLocaleData] = useState<Record<string, FooterData>>(() => {
    if (i18n?.enabled && locales.length > 0) {
      const data: Record<string, FooterData> = {};
      for (const loc of locales) {
        data[loc] = { columns: getColumnsForLocale(loc), legalLinks: getLegalForLocale(loc) };
      }
      return data;
    }
    return { [defaultLocale]: { columns: Array.isArray(initial?.columns) ? initial.columns : [], legalLinks: Array.isArray(initial?.legalLinks) ? initial.legalLinks : [] } };
  });

  const columns = Array.isArray(localeData[activeLocale]?.columns) ? localeData[activeLocale].columns : [];
  const legalLinks = Array.isArray(localeData[activeLocale]?.legalLinks) ? localeData[activeLocale].legalLinks : [];

  const setColumns = (val: FooterColumn[]) => {
    setLocaleData(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], columns: val } }));
  };
  const setLegalLinks = (val: { label: string; href: string }[]) => {
    setLocaleData(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], legalLinks: val } }));
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
            await saveFooterSettings({ columns: d.columns, legalLinks: d.legalLinks.filter(l => l.label.trim()) }, loc);
          }
        }
      } else {
        const d = localeData[defaultLocale];
        await saveFooterSettings({ columns: d.columns, legalLinks: d.legalLinks.filter(l => l.label.trim()) });
      }
      toast.success('Footer gespeichert');
      markSaved();
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };
  useRegisterSave(handleSave);

  const updateColumn = (ci: number, col: FooterColumn) => {
    const u = [...columns];
    u[ci] = col;
    setColumns(u);
  };

  return (
    <div className="admin-card p-6 space-y-6">
      <h2 className="font-semibold text-lg">Footer</h2>

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

      {/* Columns */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-zinc-600">Spalten</h3>
        {columns.map((col, ci) => (
          <div key={ci} className="bg-zinc-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input className="admin-input w-48 bg-white" value={col.title} onChange={e => updateColumn(ci, { ...col, title: e.target.value })} placeholder="Spalten-Titel" />
              <button type="button" onClick={() => setColumns(columns.filter((_, j) => j !== ci))} className="admin-btn-ghost text-red-500 text-xs">
                <Trash2 size={14} /> Spalte entfernen
              </button>
            </div>
            {(col.items || []).map((item, ii) => (
              <div key={ii} className="flex items-center gap-2">
                <input className="admin-input flex-1 bg-white" value={item.text} onChange={e => { const items = [...(col.items || [])]; items[ii] = { ...items[ii], text: e.target.value }; updateColumn(ci, { ...col, items }); }} placeholder="Text" />
                <input className="admin-input w-40 bg-white" value={item.href || ''} onChange={e => { const items = [...(col.items || [])]; items[ii] = { ...items[ii], href: e.target.value || undefined }; updateColumn(ci, { ...col, items }); }} placeholder="Link (optional)" />
                <button type="button" onClick={() => updateColumn(ci, { ...col, items: (col.items || []).filter((_, j) => j !== ii) })} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => updateColumn(ci, { ...col, items: [...col.items, { text: '' }] })} className="text-xs text-admin-accent hover:underline">
              + Eintrag hinzufügen
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setColumns([...columns, { title: '', items: [{ text: '' }] }])} className="admin-btn-secondary">
          <Plus size={16} /> Spalte hinzufügen
        </button>
      </div>

      {/* Legal links */}
      <div className="space-y-3 pt-5 border-t border-admin-border">
        <h3 className="text-sm font-medium text-zinc-600">Rechtliche Links</h3>
        {legalLinks.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className="admin-input w-40" value={link.label} onChange={e => { const u = [...legalLinks]; u[i] = { ...u[i], label: e.target.value }; setLegalLinks(u); }} placeholder="Label" />
            <input className="admin-input flex-1" value={link.href} onChange={e => { const u = [...legalLinks]; u[i] = { ...u[i], href: e.target.value }; setLegalLinks(u); }} placeholder="/impressum" />
            <button type="button" onClick={() => setLegalLinks(legalLinks.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setLegalLinks([...legalLinks, { label: '', href: '' }])} className="text-xs text-admin-accent hover:underline">
          + Rechtlichen Link hinzufügen
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { saveBrandSettings, saveFooterSettings } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { usePreview } from '@/components/admin/preview-context';
import { Check, Plus, Trash2 } from 'lucide-react';
import { getBrandCssVars } from '@/lib/brand-colors';
import { FOOTER_VARIANT_OPTIONS, normalizeFooterVariant, type FooterVariant } from '@/lib/footer-variants';

type FooterColumn = { title: string; items: { text: string; href?: string }[] };
type FooterData = {
  columns: FooterColumn[];
  legalLinks: { label: string; href: string }[];
  cta?: { label?: string; href?: string; variant?: FooterVariant } | null;
};
type I18nConfig = { enabled: boolean; locales: string[]; defaultLocale: string };
type FooterBrand = Record<string, string | undefined> & {
  footerColor?: string;
  footerTextColor?: string;
  footerLinkColor?: string;
};

function getBaseFooterCta(initial: any): { label?: string; href?: string; variant?: FooterVariant } {
  const cta = initial?.cta;
  if (!cta || typeof cta !== 'object' || Array.isArray(cta) || cta._localized) return {};
  return cta;
}

export function FooterForm({ initial, initialBrand = {}, i18n }: { initial: any; initialBrand?: FooterBrand; i18n?: I18nConfig }) {
  const isLocalized = initial?.columns?._localized || initial?._localized;
  const locales = i18n?.locales || [];
  const defaultLocale = i18n?.defaultLocale || 'de';
  const [activeLocale, setActiveLocale] = useState(defaultLocale);
  const [variant, setVariant] = useState<FooterVariant>(() => normalizeFooterVariant(initial?.cta?.variant || initial?.variant));
  const [footerColors, setFooterColors] = useState({
    footerColor: initialBrand.footerColor || '',
    footerTextColor: initialBrand.footerTextColor || '',
    footerLinkColor: initialBrand.footerLinkColor || '',
  });
  const baseCta = getBaseFooterCta(initial);

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
  const preview = usePreview();
  const mounted = useRef(false);
  useEffect(() => { if (mounted.current) markDirty(); else mounted.current = true; }, [localeData, variant, footerColors, markDirty]);

  const previewFooter = {
    columns,
    legalLinks,
    cta: { ...baseCta, variant },
  };
  const previewBrand = {
    ...initialBrand,
    ...footerColors,
  };
  const previewFooterJson = JSON.stringify(previewFooter);
  const previewBrandJson = JSON.stringify(previewBrand);

  useEffect(() => {
    if (!preview.isOpen) return;
    const brand = JSON.parse(previewBrandJson) as FooterBrand;
    const payload = {
      footer: JSON.parse(previewFooterJson),
      brand,
      cssVars: getBrandCssVars(brand),
    };
    preview.sendLiveData(payload);
    const timer = window.setTimeout(() => preview.sendLiveData(payload), 350);
    return () => window.clearTimeout(timer);
  }, [preview.isOpen, preview.sendLiveData, previewFooterJson, previewBrandJson]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cta = { ...baseCta, variant };
      await saveBrandSettings({ ...initialBrand, ...footerColors });
      if (i18n?.enabled) {
        for (const loc of locales) {
          const d = localeData[loc];
          if (d) {
            await saveFooterSettings({ columns: d.columns, legalLinks: d.legalLinks.filter(l => l.label.trim()), cta }, loc);
          }
        }
      } else {
        const d = localeData[defaultLocale];
        await saveFooterSettings({ columns: d.columns, legalLinks: d.legalLinks.filter(l => l.label.trim()), cta });
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

      {/* Variant */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-zinc-700">Footer-Art</h3>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Wähle den visuellen Aufbau. Inhalte, Farben und Links bleiben weiter über diese Seite und die Markenfarben steuerbar.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {FOOTER_VARIANT_OPTIONS.map((option) => {
            const active = variant === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setVariant(option.value)}
                aria-pressed={active}
                className={`min-h-28 rounded-2xl border p-4 text-left transition ${active ? 'border-admin-accent bg-blue-50 shadow-sm ring-2 ring-admin-accent/15' : 'border-admin-border bg-white hover:border-admin-accent/50 hover:bg-zinc-50'}`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-zinc-950">{option.label}</span>
                  {active && <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-admin-accent text-white"><Check size={13} /></span>}
                </span>
                <span className="mt-2 block text-xs leading-5 text-zinc-500">{option.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer colors */}
      <div className="space-y-3 rounded-2xl border border-admin-border bg-zinc-50 p-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-700">Footer-Farben</h3>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Diese Farben gelten fÃ¼r alle Footer-Arten. Leere Felder nutzen automatisch passende Markenfarben mit lesbarem Kontrast.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['footerColor', 'Hintergrund', '#0d2137'],
            ['footerTextColor', 'Text', '#ffffff'],
            ['footerLinkColor', 'Links', '#ffffff'],
          ].map(([key, label, fallback]) => {
            const value = footerColors[key as keyof typeof footerColors] || '';
            return (
              <label key={key} className="space-y-1.5 text-xs font-medium text-zinc-600">
                <span>{label}</span>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2">
                  <input
                    type="color"
                    value={value || fallback}
                    onChange={(event) => setFooterColors((current) => ({ ...current, [key]: event.target.value }))}
                    className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1"
                    aria-label={`${label} wÃ¤hlen`}
                  />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                    value={value}
                    onChange={(event) => setFooterColors((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder="automatisch"
                  />
                </div>
              </label>
            );
          })}
        </div>
      </div>

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

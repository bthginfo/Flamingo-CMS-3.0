'use client';

import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { getSeoItemAction, saveSeoItemAction } from '../../../seo/actions';
import { Search } from 'lucide-react';

export type ItemSeoPanelHandle = { save: () => Promise<void>; isDirty: () => boolean };

export const ItemSeoPanel = forwardRef<ItemSeoPanelHandle, { itemId: string; onDirty?: () => void }>(function ItemSeoPanel({ itemId, onDirty }, ref) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    canonical: '',
    noindex: false,
  });
  const initialData = useRef(data);
  const dirty = useRef(false);

  useEffect(() => {
    getSeoItemAction(itemId).then(row => {
      if (row) {
        const d = {
          metaTitle: row.metaTitle ?? '',
          metaDescription: row.metaDescription ?? '',
          ogImage: row.ogImage ?? '',
          canonical: row.canonical ?? '',
          noindex: row.noindex,
        };
        setData(d);
        initialData.current = d;
      }
    });
  }, [itemId]);

  function update(patch: Partial<typeof data>) {
    setData(d => {
      const next = { ...d, ...patch };
      const isDirty = JSON.stringify(next) !== JSON.stringify(initialData.current);
      if (isDirty && !dirty.current) { dirty.current = true; onDirty?.(); }
      if (!isDirty) dirty.current = false;
      return next;
    });
  }

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!dirty.current) return;
      await saveSeoItemAction(itemId, data);
      initialData.current = data;
      dirty.current = false;
    },
    isDirty: () => dirty.current,
  }));

  return (
    <div className="admin-card mb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-lg">
        <span className="flex items-center gap-2"><Search size={16} className="text-zinc-400" /> SEO-Einstellungen</span>
        <span className="text-xs text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          <div>
            <label className="admin-label">Meta-Titel</label>
            <input className="admin-input" value={data.metaTitle} onChange={e => update({ metaTitle: e.target.value })} placeholder="Titel für Suchmaschinen" maxLength={70} />
            <p className="text-xs text-zinc-400 mt-0.5 text-right">{data.metaTitle.length}/70</p>
          </div>
          <div>
            <label className="admin-label">Meta-Beschreibung</label>
            <textarea className="admin-input min-h-[60px]" value={data.metaDescription} onChange={e => update({ metaDescription: e.target.value })} placeholder="Beschreibung für Google (max. 170 Zeichen)" maxLength={170} />
            <p className="text-xs text-zinc-400 mt-0.5 text-right">{data.metaDescription.length}/170</p>
          </div>
          <div>
            <label className="admin-label">OG-Bild (URL)</label>
            <input className="admin-input" value={data.ogImage} onChange={e => update({ ogImage: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="admin-label">Canonical URL</label>
            <input className="admin-input" value={data.canonical} onChange={e => update({ canonical: e.target.value })} placeholder="Optional: abweichende kanonische URL" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.noindex} onChange={() => update({ noindex: !data.noindex })} />
            Von Suchmaschinen ausschließen (noindex)
          </label>
        </div>
      )}
    </div>
  );
});

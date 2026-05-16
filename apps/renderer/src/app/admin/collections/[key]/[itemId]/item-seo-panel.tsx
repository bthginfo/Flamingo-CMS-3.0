'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getSeoItemAction, saveSeoItemAction } from '../../seo/actions';
import { Save, Search } from 'lucide-react';

export function ItemSeoPanel({ itemId }: { itemId: string }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    canonical: '',
    noindex: false,
  });

  useEffect(() => {
    getSeoItemAction(itemId).then(row => {
      if (row) setData({
        metaTitle: row.metaTitle ?? '',
        metaDescription: row.metaDescription ?? '',
        ogImage: row.ogImage ?? '',
        canonical: row.canonical ?? '',
        noindex: row.noindex,
      });
    });
  }, [itemId]);

  function handleSave() {
    startTransition(async () => {
      await saveSeoItemAction(itemId, data);
      toast.success('SEO gespeichert');
    });
  }

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
            <input className="admin-input" value={data.metaTitle} onChange={e => setData(d => ({ ...d, metaTitle: e.target.value }))} placeholder="Titel für Suchmaschinen" maxLength={70} />
            <p className="text-xs text-zinc-400 mt-0.5 text-right">{data.metaTitle.length}/70</p>
          </div>
          <div>
            <label className="admin-label">Meta-Beschreibung</label>
            <textarea className="admin-input min-h-[60px]" value={data.metaDescription} onChange={e => setData(d => ({ ...d, metaDescription: e.target.value }))} placeholder="Beschreibung für Google (max. 170 Zeichen)" maxLength={170} />
            <p className="text-xs text-zinc-400 mt-0.5 text-right">{data.metaDescription.length}/170</p>
          </div>
          <div>
            <label className="admin-label">OG-Bild (URL)</label>
            <input className="admin-input" value={data.ogImage} onChange={e => setData(d => ({ ...d, ogImage: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <label className="admin-label">Canonical URL</label>
            <input className="admin-input" value={data.canonical} onChange={e => setData(d => ({ ...d, canonical: e.target.value }))} placeholder="Optional: abweichende kanonische URL" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.noindex} onChange={() => setData(d => ({ ...d, noindex: !d.noindex }))} />
            Von Suchmaschinen ausschließen (noindex)
          </label>
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={pending} className="admin-btn-primary flex items-center gap-2 text-sm">
              <Save size={14} /> SEO speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

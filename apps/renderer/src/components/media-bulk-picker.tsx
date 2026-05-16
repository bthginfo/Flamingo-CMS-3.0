'use client';

import { useState, useEffect } from 'react';
import { getMediaAssets, type MediaAsset } from '@/app/admin/media-actions';
import { Check, X, FolderOpen } from 'lucide-react';

/**
 * A modal-like overlay for selecting multiple images from the media library.
 * Usage: <MediaBulkPicker onSelect={(urls) => ...} onClose={() => ...} />
 */
export function MediaBulkPicker({ onSelect, onClose }: { onSelect: (images: { src: string; alt: string }[]) => void; onClose: () => void }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    getMediaAssets().then(a => { setAssets(a); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    const images = assets.filter(a => selected.has(a.id)).map(a => ({
      src: a.blobUrl,
      alt: a.filename.replace(/\.[^.]+$/, ''),
    }));
    onSelect(images);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-semibold text-sm">Aus Mediathek wählen</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">{selected.size} ausgewählt</span>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-zinc-400 text-center py-8">Laden...</p>
          ) : assets.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">Keine Bilder in der Mediathek.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {assets.map(asset => {
                const isSelected = selected.has(asset.id);
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => toggle(asset.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-zinc-200 hover:border-zinc-400'}`}
                  >
                    <img src={asset.blobUrl} alt={asset.filename} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800">Abbrechen</button>
          <button onClick={handleConfirm} disabled={selected.size === 0} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {selected.size} Bilder einfügen
          </button>
        </div>
      </div>
    </div>
  );
}

/** Simple trigger button for opening the media bulk picker */
export function MediaBulkPickerButton({ onSelect }: { onSelect: (images: { src: string; alt: string }[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
        <FolderOpen size={12} /> Mediathek
      </button>
      {open && <MediaBulkPicker onSelect={onSelect} onClose={() => setOpen(false)} />}
    </>
  );
}

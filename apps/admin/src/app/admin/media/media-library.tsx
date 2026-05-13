'use client';

import { useState, useRef, useCallback } from 'react';
import { upload } from '@vercel/blob/client';
import { saveMediaRecord, deleteMediaAsset, updateMediaAlt, type MediaAsset } from '../media-actions';
import { toast } from 'sonner';
import { Upload, Trash2, Copy, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.error('Nur Bilddateien sind erlaubt');
      return;
    }

    setUploading(true);
    try {
      for (const file of fileArray) {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });

        const record = await saveMediaRecord({
          blobUrl: blob.url,
          pathname: blob.pathname,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        });

        setAssets(prev => [{ ...record, alt: null, createdAt: new Date() }, ...prev]);
      }
      toast.success(`${fileArray.length} Bild${fileArray.length > 1 ? 'er' : ''} hochgeladen`);
    } catch (err) {
      toast.error('Upload fehlgeschlagen: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm(`"${asset.filename}" wirklich löschen?`)) return;
    try {
      await deleteMediaAsset(asset.id);
      setAssets(prev => prev.filter(a => a.id !== asset.id));
      if (selected?.id === asset.id) setSelected(null);
      toast.success('Gelöscht');
    } catch {
      toast.error('Fehler beim Löschen');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL kopiert');
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        className={`admin-card border-2 border-dashed transition-colors p-8 text-center cursor-pointer ${dragOver ? 'border-admin-accent bg-admin-accent/5' : 'border-admin-border hover:border-admin-accent/50'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && handleUpload(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-3 text-admin-accent">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-medium">Wird hochgeladen…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={32} className="text-zinc-400" />
            <p className="text-sm font-medium text-zinc-600">Bilder hierher ziehen oder klicken zum Auswählen</p>
            <p className="text-xs text-zinc-400">JPG, PNG, WebP, GIF, SVG, AVIF — max. 10 MB</p>
          </div>
        )}
      </div>

      {/* Grid */}
      {assets.length === 0 ? (
        <div className="admin-card p-16 text-center">
          <ImageIcon size={48} className="text-zinc-200 mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Noch keine Bilder hochgeladen</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map(asset => (
            <div
              key={asset.id}
              className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${selected?.id === asset.id ? 'border-admin-accent shadow-lg ring-2 ring-admin-accent/30' : 'border-transparent hover:border-zinc-200'}`}
              onClick={() => setSelected(asset)}
            >
              <Image
                src={asset.blobUrl}
                alt={asset.alt || asset.filename}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{asset.filename}</p>
                <p className="text-white/60 text-[10px]">{formatSize(asset.size)}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(asset); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="admin-card p-6">
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
              <Image src={selected.blobUrl} alt={selected.alt || ''} fill className="object-cover" sizes="128px" />
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm truncate">{selected.filename}</h3>
                <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={16} />
                </button>
              </div>
              <div className="flex gap-4 text-xs text-zinc-400">
                <span>{formatSize(selected.size)}</span>
                <span>{selected.mimeType}</span>
                {selected.width && selected.height && <span>{selected.width}×{selected.height}</span>}
              </div>
              <div>
                <label className="admin-label">Bild-URL</label>
                <div className="flex gap-2">
                  <input className="admin-input text-xs font-mono" value={selected.blobUrl} readOnly />
                  <button onClick={() => copyUrl(selected.blobUrl)} className="admin-btn-secondary shrink-0">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div>
                <label className="admin-label">Alt-Text</label>
                <input
                  className="admin-input"
                  defaultValue={selected.alt || ''}
                  placeholder="Bildbeschreibung für SEO & Barrierefreiheit"
                  onBlur={e => {
                    updateMediaAlt(selected.id, e.target.value);
                    setSelected({ ...selected, alt: e.target.value });
                    setAssets(prev => prev.map(a => a.id === selected.id ? { ...a, alt: e.target.value } : a));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

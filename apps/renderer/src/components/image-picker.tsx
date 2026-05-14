'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { saveMediaRecord, getMediaAssets, type MediaAsset } from '@/app/admin/media-actions';
import { toast } from 'sonner';
import { ImageIcon, Upload, X, Loader2, FolderOpen } from 'lucide-react';
import Image from 'next/image';

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
};

export function ImagePicker({ value, onChange, label, className }: Props) {
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Nur Bilddateien erlaubt');
      return;
    }
    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      await saveMediaRecord({
        blobUrl: blob.url,
        pathname: blob.pathname,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      });
      onChange(blob.url);
      toast.success('Bild hochgeladen');
    } catch (err) {
      toast.error('Upload fehlgeschlagen');
    } finally {
      setUploading(false);
    }
  };

  const openLibrary = async () => {
    setLoadingLib(true);
    setShowLibrary(true);
    try {
      const assets = await getMediaAssets();
      setLibraryAssets(assets);
    } catch {
      toast.error('Fehler beim Laden der Mediathek');
    } finally {
      setLoadingLib(false);
    }
  };

  return (
    <div className={className}>
      {label && <label className="admin-label">{label}</label>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-admin-border">
          <div className="relative aspect-video">
            <Image src={value} alt="" fill className="object-cover" sizes="400px" />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()} className="bg-white text-zinc-700 rounded-lg px-3 py-2 text-xs font-medium shadow hover:bg-zinc-50">
              Ändern
            </button>
            <button type="button" onClick={() => onChange('')} className="bg-red-600 text-white rounded-lg px-3 py-2 text-xs font-medium shadow hover:bg-red-700">
              Entfernen
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="admin-btn-secondary flex-1"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Hochladen…' : 'Bild hochladen'}
          </button>
          <button type="button" onClick={openLibrary} className="admin-btn-secondary">
            <FolderOpen size={16} /> Mediathek
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      {/* Url fallback input */}
      <div className="mt-2">
        <input
          className="admin-input text-xs"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Oder Bild-URL direkt eingeben…"
        />
      </div>

      {/* Library modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLibrary(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
              <h3 className="font-semibold">Bild aus Mediathek wählen</h3>
              <button onClick={() => setShowLibrary(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingLib ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-admin-accent" />
                </div>
              ) : libraryAssets.length === 0 ? (
                <p className="text-center text-zinc-400 py-12">Keine Bilder in der Mediathek</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {libraryAssets.map(asset => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => { onChange(asset.blobUrl); setShowLibrary(false); }}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-admin-accent transition-colors"
                    >
                      <Image src={asset.blobUrl} alt={asset.alt || ''} fill className="object-cover" sizes="200px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { saveMediaRecord, getMediaAssets, type MediaAsset } from '@/app/admin/media-actions';
import { toast } from 'sonner';
import { ImageIcon, Upload, X, Loader2, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import { buildDeterministicUploadPath } from '@/components/image-upload-field';

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
  const [libraryFolderFilter, setLibraryFolderFilter] = useState<string>('__all');
  const [librarySearch, setLibrarySearch] = useState('');
  const [loadingLib, setLoadingLib] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Nur Bilddateien erlaubt');
      return;
    }
    setUploading(true);
    try {
      const uploadPath = await buildDeterministicUploadPath(file);
      const blob = await upload(uploadPath, file, {
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
    setLibraryFolderFilter('__all');
    setLibrarySearch('');
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

  const libraryFolders = Array.from(new Set(
    libraryAssets
      .map((a) => (a.folder || '').trim())
      .filter((f) => f.length > 0)
  )).sort((a, b) => a.localeCompare(b, 'de'));

  const folderFilteredLibraryAssets = libraryFolderFilter === '__all'
    ? libraryAssets
    : libraryFolderFilter === '__none'
      ? libraryAssets.filter((a) => !(a.folder || '').trim())
      : libraryAssets.filter((a) => (a.folder || '').trim() === libraryFolderFilter);

  const searchQuery = librarySearch.trim().toLowerCase();
  const filteredLibraryAssets = !searchQuery
    ? folderFilteredLibraryAssets
    : folderFilteredLibraryAssets.filter((a) => {
      const filename = (a.filename || '').toLowerCase();
      const alt = (a.alt || '').toLowerCase();
      const url = (a.blobUrl || '').toLowerCase();
      return filename.includes(searchQuery) || alt.includes(searchQuery) || url.includes(searchQuery);
    });

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
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
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
                <div className="space-y-3">
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Bilder suchen (Dateiname, Alt-Text, URL)"
                    className="admin-input w-full text-sm"
                  />
                  <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 pb-3">
                    <button
                      type="button"
                      onClick={() => setLibraryFolderFilter('__all')}
                      className={`px-2 py-1 text-xs rounded-full border ${libraryFolderFilter === '__all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                    >
                      Alle ({libraryAssets.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setLibraryFolderFilter('__none')}
                      className={`px-2 py-1 text-xs rounded-full border ${libraryFolderFilter === '__none' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                    >
                      Ohne Ordner
                    </button>
                    {libraryFolders.map((folder) => (
                      <button
                        key={folder}
                        type="button"
                        onClick={() => setLibraryFolderFilter(folder)}
                        className={`px-2 py-1 text-xs rounded-full border ${libraryFolderFilter === folder ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                        title={folder}
                      >
                        {folder}
                      </button>
                    ))}
                  </div>

                  {filteredLibraryAssets.length === 0 ? (
                    <p className="text-center text-zinc-400 py-10">Keine Bilder für den aktuellen Filter gefunden</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {filteredLibraryAssets.map(asset => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => { onChange(asset.blobUrl); setShowLibrary(false); }}
                          className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-admin-accent transition-colors"
                          title={asset.folder ? `${asset.filename} (${asset.folder})` : asset.filename}
                        >
                          <Image src={asset.blobUrl} alt={asset.alt || ''} fill className="object-cover" sizes="200px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

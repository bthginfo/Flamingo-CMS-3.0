'use client';

import { useEffect, useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { ImageIcon, Upload, X, Link as LinkIcon, FolderOpen } from 'lucide-react';
import { saveMediaRecord, getMediaAssets, deleteMediaAsset, type MediaAsset } from '@/app/admin/media-actions';
import { toast } from 'sonner';
import NextImage from 'next/image';

const ALLOWED_IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/avif';

function normalizeExtension(ext: string): string {
  if (!ext) return '';
  return ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
}

function extensionFromName(name: string): string {
  const ext = name.match(/\.[^.]+$/)?.[0] ?? '';
  return normalizeExtension(ext);
}

export async function buildDeterministicUploadPath(file: File, extensionOverride?: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  const ext = normalizeExtension(extensionOverride ?? extensionFromName(file.name));
  return `media/${hash}${ext}`;
}

function isSvgFile(file: File) {
  return file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
}

function getImageQualityHint(value: string, hasPositionControl: boolean) {
  if (!value) return 'Empfohlen: WebP/JPG ab ca. 1600 px Breite, klares Motiv und keine Schrift im Bild.';
  if (value.startsWith('http://')) return 'HTTP-Bild erkannt. Bitte eine HTTPS-URL oder einen Upload nutzen, damit die Seite sicher geladen wird.';
  if (!hasPositionControl) return 'Tipp: Prüfe nach dem Speichern die Vorschau. Stark zugeschnittene Motive sollten im Bild selbst genug Rand haben.';
  return 'Tipp: Setze den Fokuspunkt auf das wichtigste Motiv, damit Zuschnitt auf Mobil und Desktop sauber wirkt.';
}

/** Resize image to maxWidth and convert to WebP. Returns original if already small. */
export async function resizeImage(file: File, maxWidth: number, quality: number): Promise<File> {
  if (file.size < 200 * 1024) return file; // Skip if under 200KB

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }));
          } else {
            resolve(file); // Keep original if resize didn't help
          }
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/** Generate a tiny blur placeholder (data URL) for LQIP. */
async function generateBlurDataUrl(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 16;
      const aspect = img.height / img.width;
      const w = size;
      const h = Math.round(size * aspect);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/webp', 0.2));
    };
    img.onerror = () => resolve(undefined);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Image field with blob upload + URL fallback.
 * Shows preview thumbnail when a URL is set.
 */
const FOCUS_POINTS = [
  ['left top', 'top', 'right top'],
  ['left center', 'center', 'right center'],
  ['left bottom', 'bottom', 'right bottom'],
] as const;

export function ImageUploadField({
  label,
  value,
  onChange,
  position,
  onPositionChange,
  loadLibrary = getMediaAssets,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  position?: string;
  onPositionChange?: (position: string) => void;
  loadLibrary?: () => Promise<MediaAsset[]>;
}) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'library'>('upload');
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [libraryFolderFilter, setLibraryFolderFilter] = useState<string>('__all');
  const [librarySearch, setLibrarySearch] = useState('');
  const [loadingLib, setLoadingLib] = useState(false);
  const [internalPosition, setInternalPosition] = useState(position || 'center');
  const [failedLibIds, setFailedLibIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const libraryDialogRef = useRef<HTMLDivElement>(null);
  const libraryCloseRef = useRef<HTMLButtonElement>(null);
  const libraryReturnFocusRef = useRef<HTMLElement | null>(null);

  // Sync external position prop
  useEffect(() => {
    if (position) setInternalPosition(position);
  }, [position]);

  useEffect(() => {
    if (mode !== 'library') return undefined;
    const dialog = libraryDialogRef.current;
    const focusTimer = window.setTimeout(() => libraryCloseRef.current?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMode('upload');
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'))
        .filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      const returnTarget = libraryReturnFocusRef.current;
      if (returnTarget?.isConnected) window.setTimeout(() => returnTarget.focus(), 0);
    };
  }, [mode]);

  function clearValue() {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
    setMode('upload');
  }

  async function handleLibraryImageError(asset: MediaAsset) {
    if (failedLibIds.has(asset.id)) return;
    setFailedLibIds(prev => new Set(prev).add(asset.id));
    setLibraryAssets(prev => prev.filter(a => a.id !== asset.id));
    try { await deleteMediaAsset(asset.id); } catch { /* ignore */ }
  }

  async function openLibrary() {
    libraryReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMode('library');
    setLibraryFolderFilter('__all');
    setLibrarySearch('');
    if (libraryAssets.length === 0) {
      setLoadingLib(true);
      try {
        const assets = await loadLibrary();
        setLibraryAssets(assets);
      } catch { /* ignore */ }
      finally { setLoadingLib(false); }
    }
  }

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

  async function handleUpload(file: File) {
    if (isSvgFile(file)) {
      toast.error('SVG-Dateien sind aus Sicherheitsgründen nicht als Upload erlaubt. Bitte PNG, WebP, JPG, GIF oder AVIF verwenden.');
      return;
    }
    setUploading(true);
    try {
      // Resize image client-side if too large (max 1920px wide, quality 0.85)
      const [optimized, blurDataUrl] = await Promise.all([
        resizeImage(file, 1920, 0.85),
        generateBlurDataUrl(file),
      ]);
      const uploadName = file.name.replace(/\.[^.]+$/, '.webp');
      const uploadPath = await buildDeterministicUploadPath(optimized, '.webp');
      const blob = await upload(uploadPath, optimized, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      // Register in media library with blur placeholder
      saveMediaRecord({
        blobUrl: blob.url,
        pathname: blob.pathname,
        filename: optimized.name,
        mimeType: optimized.type || 'image/webp',
        size: optimized.size,
        blurDataUrl,
      }).catch(() => {}); // non-blocking
      onChange(blob.url);
    } catch (e) {
      console.error('Upload failed:', e);
      toast.error('Bild-Upload fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-600 text-xs">{label}</span>
        <div className="flex flex-wrap justify-end gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
            aria-label={value ? `${label} ersetzen` : `${label} hochladen`}
          >
            <Upload size={12} aria-hidden="true" /> {value ? 'Ersetzen' : 'Hochladen'}
          </button>
          <button
            type="button"
            onClick={openLibrary}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${mode === 'library' ? 'bg-blue-100 text-blue-700' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}`}
          >
            <FolderOpen size={12} aria-hidden="true" /> Mediathek
          </button>
          {value && (
            <button
              type="button"
              onClick={clearValue}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Entfernen
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative mb-2 aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
          <img src={value} alt="" className="h-full w-full object-cover" style={{ objectPosition: internalPosition }} />
          {onPositionChange && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-3 opacity-30 transition-opacity hover:opacity-100 focus-within:opacity-100" aria-label="Fokuspunkt direkt im Bild wählen">
              {FOCUS_POINTS.flat().map((point) => (
                <button
                  key={point}
                  type="button"
                  onClick={() => { setInternalPosition(point); onPositionChange(point); }}
                  className="group flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                  aria-label={`Fokuspunkt ${point}`}
                  title={`Fokuspunkt: ${point}`}
                >
                  <span className={`h-3 w-3 rounded-full border-2 border-white shadow transition-all ${internalPosition === point ? 'scale-125 bg-blue-600 ring-2 ring-blue-600/40' : 'bg-zinc-900/40 group-hover:bg-white'}`} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={clearValue}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950/70 text-white shadow-sm hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Bild entfernen"
          >
            <X size={14} aria-hidden="true" />
          </button>
          {onPositionChange && <span className="absolute bottom-2 left-2 rounded-md bg-zinc-950/70 px-2 py-1 text-[10px] font-medium text-white">Fokuspunkt im Bild wählen</span>}
        </div>
      )}
      <p className="mt-1.5 text-[11px] leading-4 text-zinc-400">{getImageQualityHint(value, Boolean(onPositionChange))}</p>

      <details className="mt-2 text-xs text-zinc-500">
          <summary className="inline-flex cursor-pointer items-center gap-1 rounded py-1 font-medium hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <LinkIcon size={12} aria-hidden="true" /> Eigene Bild-URL verwenden
          </summary>
          <input
            aria-label={`${label}: eigene Bild-URL`}
            className="admin-input mt-1 w-full font-mono text-xs"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => {
              const url = e.target.value.trim();
              if (url && url.startsWith('http')) {
                const filename = url.split('/').pop()?.split('?')[0] || 'image';
                saveMediaRecord({ blobUrl: url, pathname: url, filename, mimeType: 'image/unknown', size: 0 }).catch(() => {});
              }
            }}
            placeholder="https://…"
          />
      </details>

      {mode === 'upload' ? (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_IMAGE_ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          {!value && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="admin-input mt-2 flex w-full cursor-pointer items-center justify-center gap-2 border-dashed py-4 text-center transition hover:bg-zinc-50"
            >
              {uploading ? <span className="text-xs text-zinc-500">Wird hochgeladen...</span> : <><ImageIcon size={15} className="text-zinc-400" aria-hidden="true" /><span className="text-xs text-zinc-600">Bild auswählen und hochladen</span></>}
            </button>
          )}
        </div>
      ) : (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setMode('upload')}>
          <div ref={libraryDialogRef} role="dialog" aria-modal="true" aria-label="Bild aus der Mediathek auswählen" tabIndex={-1} className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
              <h3 className="font-semibold text-base">Mediathek</h3>
              <button ref={libraryCloseRef} type="button" onClick={() => setMode('upload')} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label="Mediathek schließen" title="Schließen"><X size={18} aria-hidden="true" /></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {loadingLib ? (
                <p className="text-sm text-gray-400 text-center py-12">Laden...</p>
              ) : libraryAssets.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">Keine Bilder vorhanden</p>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    aria-label="Bilder in der Mediathek suchen"
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
                    <p className="text-sm text-gray-400 text-center py-10">Keine Bilder für den aktuellen Filter gefunden</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                      {filteredLibraryAssets.map((asset) => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => { onChange(asset.blobUrl); setMode('upload'); }}
                          aria-label={`${asset.filename} auswählen`}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-zinc-200 hover:border-blue-500 transition"
                          title={asset.folder ? `${asset.filename} (${asset.folder})` : asset.filename}
                        >
                          <NextImage
                            src={asset.blobUrl}
                            alt={asset.filename}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 16vw"
                            onError={() => { void handleLibraryImageError(asset); }}
                          />
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

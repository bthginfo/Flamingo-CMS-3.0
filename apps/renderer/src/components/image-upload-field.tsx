'use client';

import { useEffect, useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { ImageIcon, Upload, X, Link as LinkIcon, FolderOpen } from 'lucide-react';
import { saveMediaRecord, getMediaAssets, type MediaAsset } from '@/app/admin/media-actions';
import { toast } from 'sonner';

/** Resize image to maxWidth and convert to WebP. Returns original if SVG or already small. */
export async function resizeImage(file: File, maxWidth: number, quality: number): Promise<File> {
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) return file;
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
  if (file.type === 'image/svg+xml') return undefined;
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
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  position?: string;
  onPositionChange?: (position: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url' | 'library'>(value && !value.startsWith('blob:') ? 'url' : 'upload');
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [internalPosition, setInternalPosition] = useState(position || 'center');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external position prop
  useEffect(() => {
    if (position) setInternalPosition(position);
  }, [position]);

  useEffect(() => {
    if (!value && mode === 'library') setMode('upload');
  }, [value, mode]);

  function clearValue() {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
    setMode('url');
  }

  async function openLibrary() {
    setMode('library');
    if (libraryAssets.length === 0) {
      setLoadingLib(true);
      try {
        const assets = await getMediaAssets();
        setLibraryAssets(assets);
      } catch { /* ignore */ }
      finally { setLoadingLib(false); }
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      // Resize image client-side if too large (max 1920px wide, quality 0.85)
      const [optimized, blurDataUrl] = await Promise.all([
        resizeImage(file, 1920, 0.85),
        generateBlurDataUrl(file),
      ]);
      const isSvg = optimized.type === 'image/svg+xml' || optimized.name.toLowerCase().endsWith('.svg');
      const uploadName = isSvg ? file.name : file.name.replace(/\.[^.]+$/, '.webp');
      const blob = await upload(uploadName, optimized, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      // Register in media library with blur placeholder
      saveMediaRecord({
        blobUrl: blob.url,
        pathname: blob.pathname,
        filename: optimized.name,
        mimeType: isSvg ? 'image/svg+xml' : (optimized.type || 'image/webp'),
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
            onClick={() => setMode('upload')}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'upload' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Upload size={10} className="inline mr-0.5" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'url' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LinkIcon size={10} className="inline mr-0.5" /> URL
          </button>
          <button
            type="button"
            onClick={openLibrary}
            className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'library' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FolderOpen size={10} className="inline mr-0.5" /> Mediathek
          </button>
          {value && (
            <button
              type="button"
              onClick={clearValue}
              className="text-[10px] px-1.5 py-0.5 rounded text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              Entfernen
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative inline-block mb-2">
          <img src={value} alt="" className="w-20 h-20 object-cover rounded-lg border" style={{ objectPosition: internalPosition }} />
          <button
            type="button"
            onClick={clearValue}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
            aria-label="Bild entfernen"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {mode === 'upload' ? (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="admin-input w-full text-center py-3 border-dashed cursor-pointer hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            {uploading ? (
              <span className="text-xs text-gray-400">Wird hochgeladen...</span>
            ) : (
              <>
                <ImageIcon size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">Bild hochladen</span>
              </>
            )}
          </button>
        </div>
      ) : mode === 'url' ? (
        <input
          className="admin-input w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            const url = e.target.value.trim();
            if (url && url.startsWith('http')) {
              const filename = url.split('/').pop()?.split('?')[0] || 'image';
              saveMediaRecord({
                blobUrl: url,
                pathname: url,
                filename,
                mimeType: 'image/unknown',
                size: 0,
              }).catch(() => {});
            }
          }}
          placeholder="https://..."
        />
      ) : (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setMode('upload')}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
              <h3 className="font-semibold text-base">Mediathek</h3>
              <button type="button" onClick={() => setMode('upload')} className="text-zinc-400 hover:text-zinc-600"><X size={18} /></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {loadingLib ? (
                <p className="text-sm text-gray-400 text-center py-12">Laden...</p>
              ) : libraryAssets.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">Keine Bilder vorhanden</p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {libraryAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => { onChange(asset.blobUrl); setMode('upload'); }}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-zinc-200 hover:border-blue-500 transition"
                    >
                      <img src={asset.blobUrl} alt={asset.filename} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {value && (
        <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-zinc-600">Fokuspunkt</span>
            <span className="text-[10px] text-zinc-400">{internalPosition}</span>
          </div>
          <div className="grid w-24 grid-cols-3 gap-1">
            {FOCUS_POINTS.flat().map(point => (
              <button
                key={point}
                type="button"
                onClick={() => { setInternalPosition(point); onPositionChange?.(point); }}
                className={`h-7 rounded border transition ${(internalPosition === point) ? 'border-blue-500 bg-blue-500' : 'border-zinc-200 bg-white hover:border-blue-300'}`}
                aria-label={`Fokuspunkt ${point}`}
                title={`Fokuspunkt: ${point}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { upload } from '@vercel/blob/client';
import { resizeImage } from '@/components/image-upload-field';
import { saveMediaRecord, deleteMediaAsset, updateMediaAlt, updateMediaDimensions, type MediaAsset } from '../media-actions';
import { toast } from 'sonner';
import { Upload, Trash2, Copy, Image as ImageIcon, X, Loader2, Pencil, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const ALLOWED_IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/avif';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith('image/')) return null;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(null);
    };
    img.src = URL.createObjectURL(file);
  });
}

async function getRemoteImageDimensions(src: string): Promise<{ width: number; height: number } | null> {
  if (!src || src.startsWith('data:')) return null;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function getMediaWarnings(asset: MediaAsset) {
  const warnings: string[] = [];
  if (!asset.alt?.trim()) warnings.push('Alt-Text fehlt');
  if (asset.blobUrl.startsWith('http://')) warnings.push('Unsichere HTTP-URL');
  if (asset.size > 600 * 1024) warnings.push('Datei größer als 600 KB');
  if (asset.width && asset.width < 1200) warnings.push('Breite unter 1200 px');
  if (asset.height && asset.height < 700) warnings.push('Höhe unter 700 px');
  if (!asset.width || !asset.height) warnings.push('Bildmaße unbekannt');
  return warnings;
}

export function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [altModalAsset, setAltModalAsset] = useState<MediaAsset | null>(null);
  const [altValue, setAltValue] = useState('');
  const [selectedAltDraft, setSelectedAltDraft] = useState('');
  const missingAlt = assets.filter(asset => !asset.alt?.trim()).length;
  const largeFiles = assets.filter(asset => asset.size > 600 * 1024).length;
  const unknownDimensions = assets.filter(asset => !asset.width || !asset.height).length;
  const cleanAssets = assets.filter(asset => getMediaWarnings(asset).length === 0).length;

  const rememberDimensions = useCallback((asset: MediaAsset, dimensions: { width: number; height: number }) => {
    if (!dimensions.width || !dimensions.height) return;
    if (asset.width === dimensions.width && asset.height === dimensions.height) return;

    setAssets(prev => prev.map(item => item.id === asset.id ? { ...item, ...dimensions } : item));
    setSelected(prev => prev?.id === asset.id ? { ...prev, ...dimensions } : prev);
    setAltModalAsset(prev => prev?.id === asset.id ? { ...prev, ...dimensions } : prev);
    updateMediaDimensions(asset.id, dimensions).catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedAltDraft(selected?.alt || '');
  }, [selected?.id, selected?.alt]);

  useEffect(() => {
    let cancelled = false;
    const missing = assets.filter(asset => !asset.width || !asset.height).slice(0, 12);
    if (!missing.length) return;

    void (async () => {
      for (const asset of missing) {
        const dimensions = await getRemoteImageDimensions(asset.blobUrl);
        if (cancelled || !dimensions) continue;
        rememberDimensions(asset, dimensions);
      }
    })();

    return () => { cancelled = true; };
  }, [assets, rememberDimensions]);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const MAX_SIZE = 1 * 1024 * 1024; // 1 MB
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/') && f.type !== 'image/svg+xml' && !f.name.toLowerCase().endsWith('.svg'));
    if (fileArray.length === 0) {
      toast.error('Nur PNG, WebP, JPG, GIF oder AVIF sind erlaubt. SVG-Uploads sind aus Sicherheitsgründen deaktiviert.');
      return;
    }
    const tooLarge = fileArray.filter(f => f.size > MAX_SIZE);
    if (tooLarge.length) {
      toast.error(`${tooLarge.length} Bild${tooLarge.length > 1 ? 'er' : ''} über 1 MB — werden automatisch optimiert`);
    }

    setUploading(true);
    try {
      for (const file of fileArray) {
        const optimized = await resizeImage(file, 1920, 0.85);
        const dimensions = await getImageDimensions(optimized);
        const uploadName = file.name.replace(/\.[^.]+$/, '.webp');
        const blob = await upload(uploadName, optimized, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });

        const record = await saveMediaRecord({
          blobUrl: blob.url,
          pathname: blob.pathname,
          filename: uploadName,
          mimeType: optimized.type || 'image/webp',
          size: optimized.size,
          width: dimensions?.width,
          height: dimensions?.height,
        });

        setAssets(prev => [{ ...record, alt: null, createdAt: new Date(), width: dimensions?.width || null, height: dimensions?.height || null }, ...prev]);
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

  const setAssetAlt = (asset: MediaAsset, alt: string) => {
    setAssets(prev => prev.map(item => item.id === asset.id ? { ...item, alt } : item));
    setSelected(prev => prev?.id === asset.id ? { ...prev, alt } : prev);
    setAltModalAsset(prev => prev?.id === asset.id ? { ...prev, alt } : prev);
  };

  const saveAlt = async (asset: MediaAsset, alt: string) => {
    try {
      await updateMediaAlt(asset.id, alt);
      setAssetAlt(asset, alt);
      toast.success(alt.trim() ? 'Alt-Text gespeichert' : 'Alt-Text entfernt');
    } catch {
      toast.error('Alt-Text konnte nicht gespeichert werden');
    }
  };

  return (
    <div className="space-y-6">
      {/* Alt-text info */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="admin-card p-4">
          <p className="text-xs text-zinc-500">Bilder</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{assets.length}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs text-zinc-500">Ohne Alt-Text</p>
          <p className={`mt-1 text-2xl font-bold ${missingAlt ? 'text-amber-600' : 'text-emerald-600'}`}>{missingAlt}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs text-zinc-500">Große Dateien</p>
          <p className={`mt-1 text-2xl font-bold ${largeFiles ? 'text-amber-600' : 'text-emerald-600'}`}>{largeFiles}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs text-zinc-500">Sauber</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{cleanAssets}</p>
          {unknownDimensions > 0 && <p className="mt-1 text-[11px] text-zinc-400">{unknownDimensions} ohne Bildmaße</p>}
        </div>
      </div>

      {/* Alt-text info */}
      <div className="admin-card p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800"><strong>Tipp:</strong> Hinterlegen Sie für jedes Bild einen Alt-Text (Bildbeschreibung). Dieser wird automatisch für SEO und Barrierefreiheit verwendet, wenn das Bild auf Ihrer Website eingesetzt wird. Klicken Sie auf das <Pencil size={12} className="inline" />-Icon oder wählen Sie ein Bild aus, um den Alt-Text zu bearbeiten.</p>
      </div>

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
          accept={ALLOWED_IMAGE_ACCEPT}
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
            <p className="text-xs text-zinc-400">JPG, PNG, WebP, GIF, AVIF — SVG ist deaktiviert</p>
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
            (() => {
              const warnings = getMediaWarnings(asset);
              return (
            <div
              key={asset.id}
              className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${selected?.id === asset.id ? 'border-admin-accent shadow-lg ring-2 ring-admin-accent/30' : 'border-transparent hover:border-zinc-200'}`}
              onClick={() => setSelected(asset)}
            >
              {(asset.mimeType === 'image/svg+xml' || asset.filename?.toLowerCase().endsWith('.svg') || asset.blobUrl?.toLowerCase().includes('.svg')) ? (
                <img
                  src={asset.blobUrl}
                  alt={asset.alt || asset.filename}
                  className="absolute inset-0 w-full h-full object-cover"
                  onLoad={(event) => rememberDimensions(asset, {
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })}
                />
              ) : (
                <Image
                  src={asset.blobUrl}
                  alt={asset.alt || asset.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  onLoad={(event) => rememberDimensions(asset, {
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })}
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${warnings.length ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {warnings.length ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
                {warnings.length ? warnings.length : 'OK'}
              </div>
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
              <button
                onClick={e => { e.stopPropagation(); setAltModalAsset(asset); setAltValue(asset.alt || ''); }}
                className="absolute top-2 right-11 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
              >
                <Pencil size={14} />
              </button>
            </div>
              );
            })()
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="admin-card p-6">
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
              {(selected.mimeType === 'image/svg+xml' || selected.filename?.toLowerCase().endsWith('.svg') || selected.blobUrl?.toLowerCase().includes('.svg')) ? (
                <img
                  src={selected.blobUrl}
                  alt={selected.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                  onLoad={(event) => rememberDimensions(selected, {
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })}
                />
              ) : (
                <Image
                  src={selected.blobUrl}
                  alt={selected.alt || ''}
                  fill
                  className="object-cover"
                  sizes="128px"
                  onLoad={(event) => rememberDimensions(selected, {
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })}
                />
              )}
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
              {getMediaWarnings(selected).length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-900">Qualitätshinweise</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-amber-800">
                    {getMediaWarnings(selected).map(warning => <li key={warning}>{warning}</li>)}
                  </ul>
                </div>
              )}
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
                <div className="flex gap-2">
                  <input
                    className="admin-input flex-1"
                    value={selectedAltDraft}
                    onChange={(event) => setSelectedAltDraft(event.target.value)}
                    onBlur={() => saveAlt(selected, selectedAltDraft)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        event.currentTarget.blur();
                      }
                    }}
                    placeholder="Alt-Text eingeben..."
                  />
                  <button
                    onClick={() => { setAltModalAsset({ ...selected, alt: selectedAltDraft }); setAltValue(selectedAltDraft); }}
                    className="admin-btn-secondary shrink-0"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alt-Text Modal */}
      {altModalAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setAltModalAsset(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Alt-Text bearbeiten</h3>
                <button onClick={() => setAltModalAsset(null)} className="text-zinc-400 hover:text-zinc-600 p-1">
                  <X size={18} />
                </button>
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-100">
                <Image
                  src={altModalAsset.blobUrl}
                  alt={altModalAsset.alt || ''}
                  fill
                  className="object-contain"
                  sizes="400px"
                  onLoad={(event) => rememberDimensions(altModalAsset, {
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })}
                />
              </div>
              <p className="text-xs text-zinc-500 truncate">{altModalAsset.filename}</p>
              <div>
                <label className="admin-label">Alt-Text (Bildbeschreibung)</label>
                <textarea
                  className="admin-input w-full min-h-[80px] resize-y"
                  value={altValue}
                  onChange={e => setAltValue(e.target.value)}
                  placeholder="z.B. Handwerker bei der Arbeit an einem Dachstuhl"
                  autoFocus
                />
                <p className="text-[11px] text-zinc-400 mt-1">Beschreibe das Bild kurz und prägnant — wichtig für SEO und Barrierefreiheit.</p>
              </div>
              <div className="flex gap-2 justify-end">
                {altModalAsset.alt && (
                  <button
                    onClick={() => {
                      saveAlt(altModalAsset, '');
                      if (selected?.id === altModalAsset.id) setSelectedAltDraft('');
                      setAltModalAsset(null);
                    }}
                    className="admin-btn-secondary text-red-600 hover:bg-red-50 mr-auto"
                  >
                    <Trash2 size={14} /> Löschen
                  </button>
                )}
                <button onClick={() => setAltModalAsset(null)} className="admin-btn-secondary">
                  Abbrechen
                </button>
                <button
                  onClick={() => {
                    saveAlt(altModalAsset, altValue);
                    if (selected?.id === altModalAsset.id) setSelectedAltDraft(altValue);
                    setAltModalAsset(null);
                  }}
                  className="admin-btn-primary"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

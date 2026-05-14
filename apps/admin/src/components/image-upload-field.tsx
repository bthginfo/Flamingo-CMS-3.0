'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { ImageIcon, Upload, X, Link as LinkIcon } from 'lucide-react';

/**
 * Image field with blob upload + URL fallback.
 * Shows preview thumbnail when a URL is set.
 */
export function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>(value && !value.startsWith('blob:') ? 'url' : 'upload');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (file.size > 1024 * 1024) {
      alert('Maximale Dateigröße: 1 MB');
      return;
    }
    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      onChange(blob.url);
    } catch (e) {
      console.error('Upload failed:', e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-600 text-xs">{label}</span>
        <div className="flex gap-1">
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
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative inline-block mb-2">
          <img src={value} alt="" className="w-20 h-20 object-cover rounded-lg border" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
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
      ) : (
        <input
          className="admin-input w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      )}
    </div>
  );
}

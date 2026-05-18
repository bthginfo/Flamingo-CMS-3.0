'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Monitor, Smartphone, RefreshCw } from 'lucide-react';

type Props = {
  url: string;
  onClose: () => void;
};

export function PreviewPanel({ url, onClose }: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleRefresh() {
    setRefreshKey(k => k + 1);
  }

  // Desktop: scale 1440px into ~50% width panel
  // Mobile: scale 390px into panel
  const iframeWidth = device === 'desktop' ? 1440 : 390;
  const iframeHeight = device === 'desktop' ? 900 : 844;

  return (
    <>
      {/* Mobile: full-screen overlay */}
      <div className="fixed inset-0 z-[60] bg-white flex flex-col lg:hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50">
          <button onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            <X size={18} /> Zurück zum Editor
          </button>
          <div className="flex-1" />
          <button onClick={handleRefresh} className="p-2 hover:bg-gray-200 rounded" title="Neu laden">
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe key={refreshKey} src={url} className="w-full h-full border-0" />
        </div>
      </div>

      {/* Desktop: side panel */}
      <div className="hidden lg:flex fixed top-0 right-0 h-screen w-[50vw] z-[60] flex-col border-l border-gray-200 bg-gray-100 shadow-2xl">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b">
          <span className="text-sm font-medium text-gray-700">Vorschau</span>
          <div className="flex-1" />
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              title="Desktop"
            >
              <Monitor size={15} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              title="Mobile"
            >
              <Smartphone size={15} />
            </button>
          </div>
          <button onClick={handleRefresh} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700" title="Neu laden">
            <RefreshCw size={15} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700" title="Schließen">
            <X size={15} />
          </button>
        </div>

        {/* Iframe container with scaling */}
        <div className="flex-1 overflow-hidden flex items-start justify-center p-4">
          <div
            className="origin-top-left bg-white rounded-lg shadow-lg overflow-hidden ring-1 ring-black/5"
            style={{
              width: iframeWidth,
              height: iframeHeight,
              transform: `scale(var(--preview-scale))`,
            }}
          >
            <iframe
              key={refreshKey}
              ref={iframeRef}
              src={url}
              className="w-full h-full border-0"
              style={{ width: iframeWidth, height: iframeHeight }}
            />
          </div>
          {/* Calculate scale dynamically */}
          <style>{`
            :root { --preview-scale: calc((50vw - 3rem) / ${iframeWidth}); }
          `}</style>
        </div>
      </div>
    </>
  );
}

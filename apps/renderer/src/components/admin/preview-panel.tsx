'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';
import { X, Monitor, Smartphone, RefreshCw } from 'lucide-react';

type Props = {
  url: string;
  onClose: () => void;
  iframeRef?: RefObject<HTMLIFrameElement | null>;
};

export function PreviewPanel({ url, onClose, iframeRef: externalRef }: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const internalRef = useRef<HTMLIFrameElement>(null);
  const iframeRef = externalRef || internalRef;
  const containerRef = useRef<HTMLDivElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [scale, setScale] = useState(0.5);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Calculate scale to fit container
  useEffect(() => {
    function calcScale() {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const iframeW = device === 'desktop' ? 1440 : 390;
      const iframeH = device === 'desktop' ? 900 : 844;
      const scaleX = (rect.width - 32) / iframeW;
      const scaleY = (rect.height - 32) / iframeH;
      setScale(Math.min(scaleX, scaleY, 1));
    }
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, [device]);

  function handleRefresh() {
    setRefreshKey(k => k + 1);
  }

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
      <div className="hidden lg:flex w-[50vw] shrink-0 h-screen flex-col border-l border-gray-200 bg-gray-900 shadow-2xl">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700">
          <span className="text-sm font-medium text-gray-200">Vorschau</span>
          <div className="flex-1" />
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-0.5">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded ${device === 'desktop' ? 'bg-gray-600 shadow-sm text-white' : 'text-gray-400 hover:text-gray-200'}`}
              title="Desktop"
            >
              <Monitor size={15} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded ${device === 'mobile' ? 'bg-gray-600 shadow-sm text-white' : 'text-gray-400 hover:text-gray-200'}`}
              title="Mobile"
            >
              <Smartphone size={15} />
            </button>
          </div>
          <button onClick={handleRefresh} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200" title="Neu laden">
            <RefreshCw size={15} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200" title="Schließen">
            <X size={15} />
          </button>
        </div>

        {/* Iframe container — centered and scaled to fit */}
        <div ref={containerRef} className="flex-1 overflow-hidden flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-white/10"
            style={{
              width: iframeWidth * scale,
              height: iframeHeight * scale,
            }}
          >
            <iframe
              key={refreshKey}
              ref={iframeRef}
              src={url}
              className="border-0 origin-top-left"
              style={{
                width: iframeWidth,
                height: iframeHeight,
                transform: `scale(${scale})`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}


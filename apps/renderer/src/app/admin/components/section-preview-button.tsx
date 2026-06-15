'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, X, Monitor, Smartphone } from 'lucide-react';

interface SectionPreviewButtonProps {
  sectionType: string;
  industry: string;
  style?: string;
}

export function SectionPreviewButton({ sectionType, industry }: SectionPreviewButtonProps) {
  const [open, setOpen] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const frameShellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  const previewUrl = `/section-preview?type=${sectionType}&industry=${industry}&style=classic`;
  const frameWidth = viewport === 'desktop' ? 1440 : 390;
  const frameHeight = viewport === 'desktop' ? 900 : 844;

  useEffect(() => {
    if (!open) return;
    function updateScale() {
      const shell = frameShellRef.current;
      if (!shell) return;
      const rect = shell.getBoundingClientRect();
      const next = Math.min((rect.width - 24) / frameWidth, (rect.height - 24) / frameHeight, 1);
      setScale(Math.max(next, 0.24));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [frameHeight, frameWidth, open, viewport]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
        title="Vorschau dieser Sektion"
      >
        <Eye size={15} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-5xl h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-sm text-gray-700">Sektions-Vorschau: <span className="text-blue-600">{sectionType}</span></h3>
                <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-500">Klassisch</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={() => setViewport('desktop')}
                  title="Desktop"
                >
                  <Monitor size={16} />
                </button>
                <button
                  className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={() => setViewport('mobile')}
                  title="Mobile"
                >
                  <Smartphone size={16} />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 ml-2">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* iframe */}
            <div ref={frameShellRef} className="flex-1 flex items-center justify-center bg-gray-100 p-4 overflow-hidden rounded-b-xl">
              <div
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ring-1 ring-black/10"
                style={{ width: frameWidth * scale, height: frameHeight * scale }}
              >
                <iframe
                  src={previewUrl}
                  className="border-0 origin-top-left"
                  style={{ width: frameWidth, height: frameHeight, transform: `scale(${scale})` }}
                  title={`Preview: ${sectionType}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

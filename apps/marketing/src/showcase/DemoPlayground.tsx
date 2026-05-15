'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';

const ADMIN_URL = '';

export default function DemoPlayground() {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loaded, setLoaded] = useState(false);

  const viewportClass = viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'max-w-[768px]' : 'max-w-[375px]';

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition">
            <ArrowLeft size={16} /> Zurück
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <span className="text-sm font-medium">Flamingo CMS &mdash; Live Demo</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setViewport(v)}
                className={`p-1.5 rounded-full transition ${viewport === v ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          <a
            href={`${ADMIN_URL}/demo/admin`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition"
          >
            <ExternalLink size={12} /> In neuem Tab
          </a>
        </div>
      </div>

      {/* Info banner */}
      <div className="text-center py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs shrink-0">
        Demo-Modus: Alle Editier-Funktionen sind aktiv. Änderungen werden in deiner Session gespeichert, aber nie veröffentlicht.
      </div>

      {/* Iframe */}
      <div className="flex-1 flex items-start justify-center bg-gray-900 p-4 overflow-hidden relative">
        <div className={`${viewportClass} h-full mx-auto transition-all duration-300 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 relative`}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-white/50">Admin wird geladen...</p>
              </div>
            </div>
          )}
          <iframe
            src={`${ADMIN_URL}/demo/admin`}
            className="w-full h-full border-0"
            onLoad={() => setLoaded(true)}
            allow="clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}

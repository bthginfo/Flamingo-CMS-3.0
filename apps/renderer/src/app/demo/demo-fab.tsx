'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Palette, Settings, X } from 'lucide-react';

const INDUSTRIES = [
  { key: 'handwerk', label: 'Handwerk' },
  { key: 'hotel', label: 'Hotel' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'medical', label: 'Arztpraxis' },
  { key: 'salon', label: 'Salon & Beauty' },
  { key: 'tourism', label: 'Tourismus' },
  { key: 'wedding', label: 'Hochzeit' },
  { key: 'photography', label: 'Fotografie' },
  { key: 'consulting', label: 'Kanzlei & Beratung' },
  { key: 'realestate', label: 'Immobilien' },
  { key: 'florist', label: 'Floristik' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'location', label: 'Location' },
  { key: 'cafe', label: 'Café & Bar' },
  { key: 'tattoo', label: 'Tattoo Studio' },
  { key: 'shop', label: 'Weinhandel (Shop)' },
  { key: 'retail', label: 'Möbelhaus (Retail)' },
  { key: 'showcase', label: 'Sektionen-Demo' },
] as const;

interface DemoFabProps {
  currentIndustry: string;
}

export function DemoFab({ currentIndustry }: DemoFabProps) {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 768) setOpen(true);
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-[9999]">
      {open && (
        <div className="mb-3 w-72 rounded-2xl bg-gray-900 text-white shadow-2xl ring-1 ring-white/10 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-orange-400 text-white text-[10px] font-bold flex items-center justify-center">F</span>
              <span className="text-sm font-semibold">Flamingo Demo</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition">
              <X size={16} className="text-white/50" />
            </button>
          </div>

          <div className="px-5 pb-3">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Branche</p>
            <div className="grid grid-cols-2 gap-1.5">
              {INDUSTRIES.map((industry) => (
                <a
                  key={industry.key}
                  href={`/demo/${industry.key}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    industry.key === currentIndustry
                      ? 'bg-white/15 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {industry.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 px-5 py-3 space-y-1.5">
            <a
              href={`/admin/demo-login?industry=${encodeURIComponent(currentIndustry)}&next=${encodeURIComponent('/admin')}&public=1`}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition py-1"
            >
              <Settings size={14} />
              Admin-Demo öffnen
            </a>
            <a
              href="https://www.flamingomedia.online"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition py-1"
            >
              <ExternalLink size={14} />
              Zurück zu Flamingo
            </a>
          </div>

          <div className="border-t border-white/10 px-5 py-3">
            <p className="text-[10px] leading-relaxed text-white/35">
              Dies ist eine Demo. Farben, Schriften, Inhalte und Layouts können im Admin individuell angepasst werden.
            </p>
          </div>
        </div>
      )}

      {!open && showTooltip && (
        <div className="absolute bottom-16 right-0 md:hidden bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-bottom-1">
          Branche wechseln
          <div className="absolute -bottom-1 right-5 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
      <button
        onClick={() => { setOpen((value) => !value); setShowTooltip(false); }}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Demo-Optionen"
      >
        <Palette size={22} />
      </button>
    </div>
  );
}

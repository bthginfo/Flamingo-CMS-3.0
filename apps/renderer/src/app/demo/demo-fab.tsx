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
  { key: 'eishockey', label: 'Verein & Sport' },
  { key: 'showcase', label: 'Section Showroom' },
] as const;

interface DemoFabProps {
  currentIndustry: string;
}

export function DemoFab({ currentIndustry }: DemoFabProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed z-[9999]"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
        right: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      {open && (
        <div
          id="demo-switcher"
          role="dialog"
          aria-label="Flamingo Demo wechseln"
          className="mb-3 max-h-[min(72vh,42rem)] w-[min(23rem,calc(100vw-2rem))] overflow-y-auto border border-white/10 bg-zinc-950 text-stone-50 shadow-2xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-zinc-950 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center bg-[var(--token-accent)] text-xs font-black text-[color:var(--token-btn-text)]" aria-hidden="true">F</span>
              <div className="min-w-0">
                <p className="text-sm font-bold">Flamingo Demos</p>
                <p className="truncate text-xs text-white/55">Branchenkontext wechseln</p>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-11 w-11 shrink-0 place-items-center border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
              aria-label="Demo-Auswahl schließen"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <nav aria-label="Demo-Tenants" className="grid grid-cols-2 gap-px bg-white/10 p-px">
            {INDUSTRIES.map(industry => {
              const active = industry.key === currentIndustry;
              return (
                <a
                  key={industry.key}
                  href={`/demo/${industry.key}`}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center px-3 py-2.5 text-xs font-semibold leading-4 transition-colors ${industry.key === 'showcase' ? 'col-span-2' : ''} ${active ? 'bg-stone-50 text-zinc-950' : 'bg-zinc-950 text-white/65 hover:bg-zinc-900 hover:text-white'}`}
                >
                  {industry.label}
                </a>
              );
            })}
          </nav>

          <div className="grid gap-px border-t border-white/10 bg-white/10">
            <a
              href={`/admin/demo-login?industry=${encodeURIComponent(currentIndustry)}&next=${encodeURIComponent('/admin')}&public=1`}
              className="flex min-h-11 items-center gap-3 bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white/65 transition hover:bg-zinc-900 hover:text-white"
            >
              <Settings aria-hidden="true" size={16} />
              Admin-Demo öffnen
            </a>
            <a
              href="https://www.flamingomedia.online"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white/65 transition hover:bg-zinc-900 hover:text-white"
            >
              <ExternalLink aria-hidden="true" size={16} />
              Zu Flamingo Media
            </a>
          </div>

          <p className="border-t border-white/10 px-4 py-3 text-[11px] leading-5 text-white/45">
            Jede Demo nutzt dieselbe CMS-Basis mit eigenem Inhalt, Design-Rezept und Funktionsumfang.
          </p>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(value => !value)}
        className="ml-auto grid h-12 w-12 place-items-center border border-white/15 bg-zinc-950 text-stone-50 shadow-xl transition hover:-translate-y-0.5 hover:bg-zinc-900"
        aria-label={open ? 'Demo-Auswahl schließen' : 'Demo-Auswahl öffnen'}
        aria-expanded={open}
        aria-controls="demo-switcher"
        aria-haspopup="dialog"
      >
        <Palette aria-hidden="true" size={20} />
      </button>
    </div>
  );
}

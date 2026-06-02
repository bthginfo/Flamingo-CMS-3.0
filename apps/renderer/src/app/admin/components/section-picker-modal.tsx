'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, FileText, Megaphone, Star, Image, Mail, Users, Wrench, MoreHorizontal, Layers, Lock, CalendarDays } from 'lucide-react';
import type { SectionTypeDefinition } from '../pages/[id]/section-types';
import { SectionPreviewButton } from './section-preview-button';

const CATEGORY_META: Record<string, { icon: typeof FileText; color: string; description: string }> = {
  'Inhalt': { icon: FileText, color: 'text-blue-600 bg-blue-50', description: 'Texte, Bilder & eingebettete Inhalte' },
  'Marketing': { icon: Megaphone, color: 'text-orange-600 bg-orange-50', description: 'CTAs, USPs & Conversion-Elemente' },
  'Social Proof': { icon: Star, color: 'text-yellow-600 bg-yellow-50', description: 'Bewertungen, Logos & Vertrauen' },
  'Medien': { icon: Image, color: 'text-purple-600 bg-purple-50', description: 'Galerien, Videos & Portfolios' },
  'Kontakt': { icon: Mail, color: 'text-green-600 bg-green-50', description: 'Formulare & Karten' },
  'Team & Personen': { icon: Users, color: 'text-indigo-600 bg-indigo-50', description: 'Team-Mitglieder & Personen' },
  'Leistungen': { icon: Wrench, color: 'text-red-600 bg-red-50', description: 'Services, Preise & Prozesse' },
  'Branchenspezifisch': { icon: MoreHorizontal, color: 'text-gray-600 bg-gray-50', description: 'Sektionen passend zur aktuellen Branche' },
  'Premium': { icon: Star, color: 'text-fuchsia-600 bg-fuchsia-50', description: 'Visuell starke Premium-Sektionen' },
  'Booking': { icon: CalendarDays, color: 'text-emerald-600 bg-emerald-50', description: 'Buchung, Verfügbarkeit & Ressourcen' },
  'Shop': { icon: Layers, color: 'text-cyan-600 bg-cyan-50', description: 'Produkte, Warenkorb & Checkout' },
};

function getCategoryMeta(cat: string) {
  if (CATEGORY_META[cat]) return CATEGORY_META[cat];
  if (cat.startsWith('Andere:')) {
    return { icon: Layers, color: 'text-teal-600 bg-teal-50', description: 'Sektionen aus anderen Branchen' };
  }
  return { icon: Layers, color: 'text-gray-600 bg-gray-50', description: 'Weitere Sektionen' };
}

const CATEGORY_ORDER = [
  'Branchenspezifisch',
  'Premium',
  'Booking',
  'Inhalt',
  'Marketing',
  'Leistungen',
  'Medien',
  'Social Proof',
  'Kontakt',
  'Team & Personen',
  'Shop',
];

export function SectionPickerModal({ sectionTypes, onSelect, onClose, industry, styleVariant }: { sectionTypes: SectionTypeDefinition[]; onSelect: (type: string) => void; onClose: () => void; industry?: string; styleVariant?: string }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const grouped = useMemo(() => {
    const g: Record<string, SectionTypeDefinition[]> = {};
    for (const st of sectionTypes) {
      const cat = st.category || 'Branchenspezifisch';
      (g[cat] ??= []).push(st);
    }
    return Object.entries(g).sort(([a], [b]) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return a.localeCompare(b, 'de');
    });
  }, [sectionTypes]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return grouped.map(([cat, items]) => {
      if (activeCategory && cat !== activeCategory) return null;
      const f = q ? items.filter(i => i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)) : items;
      if (f.length === 0) return null;
      return [cat, f] as [string, SectionTypeDefinition[]];
    }).filter(Boolean) as [string, SectionTypeDefinition[]][];
  }, [grouped, search, activeCategory]);

  const categories = grouped.map(([cat]) => cat);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Sektion suchen…"
            className="flex-1 text-sm outline-none bg-transparent"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Category tabs on mobile */}
        <div className="flex gap-1.5 px-5 py-2.5 border-b overflow-x-auto sm:hidden">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!activeCategory ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Alle
          </button>
          {categories.map(cat => {
            const meta = getCategoryMeta(cat);
            const Icon = meta.icon;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${activeCategory === cat ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Icon size={12} />
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-64 shrink-0 border-r bg-zinc-50/70 p-3 sm:block">
            <button
              onClick={() => setActiveCategory(null)}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${!activeCategory ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-white'}`}
            >
              Alle Sektionen
              <span className="text-[10px] text-current/60">{sectionTypes.length}</span>
            </button>
            {categories.map(cat => {
              const meta = getCategoryMeta(cat);
              const Icon = meta.icon;
              const count = grouped.find(([groupCat]) => groupCat === cat)?.[1].length || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-white'}`}
                >
                  <Icon size={13} />
                  <span className="min-w-0 flex-1 truncate">{cat}</span>
                  <span className="text-[10px] text-current/50">{count}</span>
                </button>
              );
            })}
          </aside>

          {/* Section list */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">Keine Sektionen gefunden.</div>
            )}
            {filtered.map(([cat, items]) => {
              const meta = getCategoryMeta(cat);
              const Icon = meta.icon;
              return (
                <div key={cat} className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1 rounded ${meta.color}`}><Icon size={12} /></span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{cat}</span>
                    <span className="text-[10px] text-gray-300 ml-1">{meta.description}</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {items.map(st => (
                      <div key={st.type} className={[
                        'relative flex items-stretch rounded-lg border transition-all group',
                        st.locked ? 'border-gray-100 bg-gray-50/80 opacity-80' : 'border-gray-100 hover:border-blue-300 hover:bg-blue-50/50',
                      ].join(' ')}>
                        <button
                          onClick={() => { if (!st.locked) onSelect(st.type); }}
                          disabled={st.locked}
                          className="text-left p-3 flex-1 min-w-0 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-2 font-medium text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                            {st.label}
                            {st.locked ? <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600"><Lock size={10} /> Gesperrt</span> : null}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{st.description}</div>
                          {st.locked && st.lockReason ? <div className="mt-1 text-[11px] font-medium text-gray-500">{st.lockReason}</div> : null}
                        </button>
                        {industry && (
                          <div className="flex items-center pr-2">
                            <SectionPreviewButton sectionType={st.type} industry={industry} style={styleVariant || 'classic'} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

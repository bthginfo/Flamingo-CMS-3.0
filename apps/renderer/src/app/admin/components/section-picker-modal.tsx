'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, FileText, Megaphone, Star, Image, Mail, Users, Wrench, MoreHorizontal, Layers } from 'lucide-react';
import type { SectionTypeDefinition } from '../pages/[id]/section-types';

const CATEGORY_META: Record<string, { icon: typeof FileText; color: string; description: string }> = {
  'Inhalt': { icon: FileText, color: 'text-blue-600 bg-blue-50', description: 'Texte, Bilder & eingebettete Inhalte' },
  'Marketing': { icon: Megaphone, color: 'text-orange-600 bg-orange-50', description: 'CTAs, USPs & Conversion-Elemente' },
  'Social Proof': { icon: Star, color: 'text-yellow-600 bg-yellow-50', description: 'Bewertungen, Logos & Vertrauen' },
  'Medien': { icon: Image, color: 'text-purple-600 bg-purple-50', description: 'Galerien, Videos & Portfolios' },
  'Kontakt': { icon: Mail, color: 'text-green-600 bg-green-50', description: 'Formulare & Karten' },
  'Team & Personen': { icon: Users, color: 'text-indigo-600 bg-indigo-50', description: 'Team-Mitglieder & Personen' },
  'Leistungen': { icon: Wrench, color: 'text-red-600 bg-red-50', description: 'Services, Preise & Prozesse' },
  'Sonstiges': { icon: MoreHorizontal, color: 'text-gray-600 bg-gray-50', description: 'Branchenspezifische Sektionen' },
};

function getCategoryMeta(cat: string) {
  if (CATEGORY_META[cat]) return CATEGORY_META[cat];
  // For "Andere: X" categories
  return { icon: Layers, color: 'text-teal-600 bg-teal-50', description: 'Sektionen aus anderen Branchen' };
}

export function SectionPickerModal({ sectionTypes, onSelect, onClose }: { sectionTypes: SectionTypeDefinition[]; onSelect: (type: string) => void; onClose: () => void }) {
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
      const cat = st.category || 'Sonstiges';
      (g[cat] ??= []).push(st);
    }
    return Object.entries(g);
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
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
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

        {/* Category tabs - horizontal scroll on mobile */}
        <div className="flex gap-1.5 px-5 py-2.5 border-b overflow-x-auto scrollbar-hide">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map(st => (
                    <button
                      key={st.type}
                      onClick={() => onSelect(st.type)}
                      className="text-left p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="font-medium text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{st.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{st.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

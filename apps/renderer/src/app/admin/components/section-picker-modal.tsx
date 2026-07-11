'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, FileText, Megaphone, Star, Image, Mail, Users, Wrench, MoreHorizontal, Layers, Lock, CalendarDays, Sparkles } from 'lucide-react';
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

type CopySourcePage = {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  sections: { id: string; type: string; titleInternal: string | null }[];
};

const RECOMMENDED_BY_INDUSTRY: Record<string, string[]> = {
  tradesman: ['hero', 'servicesGrid', 'proofWall', 'portfolio', 'faqContactSplit', 'ctaBand'],
  handwerk: ['hero', 'servicesGrid', 'proofWall', 'portfolio', 'faqContactSplit', 'ctaBand'],
  hotel: ['hero', 'roomShowcase', 'proofWall', 'bookingDateRange', 'contactLocation', 'immersiveCtaBanner'],
  restaurant: ['hero', 'signatureDishes', 'menuCard', 'reservation', 'proofWall', 'faqContactSplit'],
  medical: ['hero', 'serviceOverview', 'doctorTeam', 'proofWall', 'bookingSlotPicker', 'faqContactSplit'],
  salon: ['hero', 'expertiseGrid', 'serviceMenu', 'beforeAfterStoryPro', 'bookingSlotPicker', 'proofWall'],
  fitness: ['fitnessHero', 'programGrid', 'membershipPlans', 'transformationStories', 'bookingSlotPicker', 'proofWall'],
  florist: ['floristHero', 'bouquetShowcase', 'occasionMosaic', 'weddingFloristry', 'proofWall', 'faqContactSplit'],
  location: ['locationHero', 'spaceShowcase', 'locationPackages', 'availabilityCta', 'proofWall', 'galleryPro'],
  ecommerce: ['hero', 'shopFeaturedProducts', 'categoryMosaic', 'testimonialMarquee', 'faq', 'offerCampaignStrip'],
};

const UNIVERSAL_RECOMMENDATIONS = ['smartInquiry', 'cinematicHero', 'editorialHero', 'glowHero', 'proofWall', 'serviceTabs', 'faqContactSplit'];

export function SectionPickerModal({ sectionTypes, onSelect, onClose, industry, styleVariant, onCopySection, copySources, copySourcesLoading }: { sectionTypes: SectionTypeDefinition[]; onSelect: (type: string) => void; onClose: () => void; industry?: string; styleVariant?: string; onCopySection?: (sourceSectionId: string) => void; copySources?: CopySourcePage[]; copySourcesLoading?: boolean }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copyMode, setCopyMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const recommended = useMemo(() => {
    const preferred = RECOMMENDED_BY_INDUSTRY[(industry || '').toLowerCase()] || UNIVERSAL_RECOMMENDATIONS;
    const candidates = [preferred[0], 'smartInquiry', ...preferred.slice(1), ...UNIVERSAL_RECOMMENDATIONS];
    return [...new Set(candidates)]
      .map((type) => sectionTypes.find((section) => section.type === type))
      .filter((section): section is SectionTypeDefinition => Boolean(section && !section.locked))
      .slice(0, 6);
  }, [industry, sectionTypes]);

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

  const filteredCopySources = useMemo(() => {
    const q = search.toLowerCase().trim();
    const pages = copySources || [];
    if (!q) return pages;
    return pages
      .map((p) => ({
        ...p,
        sections: p.sections.filter((s) => {
          const title = (s.titleInternal || '').toLowerCase();
          return (
            title.includes(q) ||
            s.type.toLowerCase().includes(q) ||
            p.pageTitle.toLowerCase().includes(q) ||
            p.pageSlug.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((p) => p.sections.length > 0);
  }, [copySources, search]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="section-picker-title" className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <h2 id="section-picker-title" className="sr-only">Sektion auswählen</h2>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Sektion suchen"
            placeholder="Sektion suchen…"
            className="flex-1 text-sm outline-none bg-transparent"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={onClose} aria-label="Sektionsauswahl schließen" className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {onCopySection && (
          <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b bg-zinc-50">
            <span className="text-xs text-zinc-500">Modus</span>
            <label className="inline-flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none">
              <span>Sektion kopieren</span>
              <button
                type="button"
                onClick={() => setCopyMode((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${copyMode ? 'bg-blue-600' : 'bg-zinc-300'}`}
                aria-label="Kopiermodus umschalten"
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${copyMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>
        )}

        {/* Category tabs on mobile */}
        {!copyMode && <div className="flex gap-1.5 px-5 py-2.5 border-b overflow-x-auto sm:hidden">
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
        </div>}

        <div className="flex min-h-0 flex-1">
          {!copyMode && <aside className="hidden w-64 shrink-0 border-r bg-zinc-50/70 p-3 sm:block">
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
          </aside>}

          {/* Section list */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {!copyMode && !search && !activeCategory && recommended.length > 0 && (
              <section className="mb-6 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/80 via-white to-blue-50/70 p-4" aria-labelledby="recommended-sections-title">
                <div className="mb-3 flex items-start gap-2">
                  <span className="rounded-lg bg-fuchsia-100 p-1.5 text-fuchsia-700"><Sparkles size={15} /></span>
                  <div>
                    <h3 id="recommended-sections-title" className="text-sm font-semibold text-zinc-900">Empfohlen für diese Website</h3>
                    <p className="text-xs text-zinc-500">Starke Einstiege, Proof und klare nächste Schritte — passend kuratiert.</p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {recommended.map((section) => (
                    <div key={section.type} className="flex items-center rounded-xl border border-white bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-200 hover:shadow-md">
                      <button type="button" onClick={() => onSelect(section.type)} className="min-w-0 flex-1 p-3 text-left">
                        <span className="block truncate text-sm font-semibold text-zinc-900">{section.label}</span>
                        <span className="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-zinc-500">{section.description}</span>
                      </button>
                      {industry && <div className="pr-2"><SectionPreviewButton sectionType={section.type} industry={industry} style={styleVariant || 'classic'} /></div>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {!copyMode && filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">Keine Sektionen gefunden.</div>
            )}
            {!copyMode && filtered.map(([cat, items]) => {
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

            {copyMode && (
              <div className="space-y-4">
                {copySourcesLoading ? (
                  <div className="text-center py-12 text-gray-400 text-sm">Lade vorhandene Sektionen…</div>
                ) : (filteredCopySources.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">Keine passenden Sektionen zum Kopieren gefunden.</div>
                ) : (
                  filteredCopySources.map((page) => (
                    <div key={page.pageId} className="rounded-lg border border-zinc-200 overflow-hidden">
                      <div className="px-3 py-2 bg-zinc-50 border-b border-zinc-200">
                        <div className="text-sm font-semibold text-zinc-800">{page.pageTitle}</div>
                        <div className="text-[11px] text-zinc-500">/{page.pageSlug || ''}</div>
                      </div>
                      <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {page.sections.map((section) => (
                          <button
                            key={section.id}
                            type="button"
                            onClick={() => onCopySection?.(section.id)}
                            className="text-left rounded-lg border border-zinc-200 hover:border-blue-300 hover:bg-blue-50/40 transition p-3"
                          >
                            <div className="text-sm font-medium text-zinc-900">{section.titleInternal || section.type}</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5">Typ: {section.type}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

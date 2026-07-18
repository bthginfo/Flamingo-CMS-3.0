'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Copy,
  FileText,
  Image,
  Layers,
  List,
  LoaderCircle,
  Lock,
  Mail,
  Megaphone,
  MoreHorizontal,
  Palette,
  Search,
  Sparkles,
  Star,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import type { SectionTypeDefinition } from '../pages/[id]/section-types';
import { SectionPreviewButton } from './section-preview-button';
import {
  ART_DIRECTIONS,
  buildComposerPlan,
  canOverrideComposerStepCandidate,
  COMPOSER_STAGES,
  COMPOSER_GOALS,
  EXPERIENCE_FAMILIES,
  getArtDirection,
  getExperienceFamily,
  inferArtDirection,
  inferExperienceFamily,
  type ArtDirectionId,
  type ComposerGoalId,
  type ComposerStageId,
  type ExperienceFamilyId,
} from './page-composer-recipes';
import { evaluatePageRhythm } from './page-composer-rhythm';
import { didSectionPickerActionSucceed } from './section-picker-actions';

const CATEGORY_META: Record<string, { icon: typeof FileText; color: string; description: string }> = {
  Inhalt: { icon: FileText, color: 'text-blue-600 bg-blue-50', description: 'Texte, Bilder & eingebettete Inhalte' },
  Marketing: { icon: Megaphone, color: 'text-orange-600 bg-orange-50', description: 'CTAs, USPs & Conversion-Elemente' },
  'Social Proof': { icon: Star, color: 'text-yellow-700 bg-yellow-50', description: 'Bewertungen, Logos & Vertrauen' },
  Medien: { icon: Image, color: 'text-purple-600 bg-purple-50', description: 'Galerien, Videos & Portfolios' },
  Kontakt: { icon: Mail, color: 'text-green-700 bg-green-50', description: 'Formulare & Karten' },
  'Team & Personen': { icon: Users, color: 'text-indigo-600 bg-indigo-50', description: 'Team-Mitglieder & Personen' },
  Leistungen: { icon: Wrench, color: 'text-red-600 bg-red-50', description: 'Services, Preise & Prozesse' },
  Branchenspezifisch: { icon: MoreHorizontal, color: 'text-teal-700 bg-teal-50', description: 'Kuratierte Startideen – frei anpassbar und nicht auf eine Branche beschränkt' },
  Premium: { icon: Star, color: 'text-fuchsia-700 bg-fuchsia-50', description: 'Visuell starke Premium-Sektionen' },
  Advanced: { icon: Sparkles, color: 'text-violet-700 bg-violet-50', description: 'Geführte Erlebnis-Sektionen mit besonderen Medienanforderungen' },
  Booking: { icon: CalendarDays, color: 'text-emerald-700 bg-emerald-50', description: 'Buchung, Verfügbarkeit & Ressourcen' },
  Shop: { icon: Layers, color: 'text-cyan-700 bg-cyan-50', description: 'Produkte, Warenkorb & Checkout' },
};

function getCategoryMeta(category: string) {
  if (CATEGORY_META[category]) return CATEGORY_META[category];
  if (category.startsWith('Andere:')) {
    return { icon: Layers, color: 'text-teal-700 bg-teal-50', description: 'Optionale Inspiration aus einer anderen Vorlage – vollständig nutzbar' };
  }
  return { icon: Layers, color: 'text-gray-600 bg-gray-100', description: 'Weitere Sektionen' };
}

function getCategoryLabel(category: string) {
  if (category === 'Branchenspezifisch') return 'Branchen-Empfehlungen';
  if (category.startsWith('Andere:')) return `Inspiration: ${category.slice('Andere:'.length).trim()}`;
  return category;
}

const CATEGORY_ORDER = [
  'Branchenspezifisch',
  'Advanced',
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

type PickerMode = 'guided' | 'catalog' | 'copy';

type Props = {
  sectionTypes: SectionTypeDefinition[];
  existingSectionTypes?: string[];
  onSelect: (type: string) => void | boolean | Promise<void | boolean>;
  onClose: () => void;
  industry?: string;
  styleVariant?: string;
  onCopySection?: (sourceSectionId: string) => void | boolean | Promise<void | boolean>;
  copySources?: CopySourcePage[];
  copySourcesLoading?: boolean;
  initialMode?: PickerMode;
  initialGoal?: ComposerGoalId;
  initialFamily?: ExperienceFamilyId;
  initialArtDirection?: ArtDirectionId;
};

const MODE_META: Record<PickerMode, { label: string; icon: typeof Compass }> = {
  guided: { label: 'Nach Ziel', icon: Compass },
  catalog: { label: 'Alle Sektionen', icon: List },
  copy: { label: 'Vorhandene kopieren', icon: Copy },
};

export function SectionPickerModal({
  sectionTypes,
  existingSectionTypes = [],
  onSelect,
  onClose,
  industry,
  styleVariant,
  onCopySection,
  copySources,
  copySourcesLoading,
  initialMode,
  initialGoal = 'enquiries',
  initialFamily,
  initialArtDirection,
}: Props) {
  const copyAvailable = Boolean(onCopySection);
  const inferredInitialMode = initialMode || (existingSectionTypes.length === 0 ? 'guided' : 'catalog');
  const [mode, setMode] = useState<PickerMode>(inferredInitialMode === 'copy' && !copyAvailable ? 'catalog' : inferredInitialMode);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const resolvedInitialFamily = initialFamily || inferExperienceFamily(industry);
  const [goal, setGoal] = useState<ComposerGoalId>(initialGoal);
  const [family, setFamily] = useState<ExperienceFamilyId>(resolvedInitialFamily);
  const [artDirection, setArtDirection] = useState<ArtDirectionId>(initialArtDirection || inferArtDirection(resolvedInitialFamily));
  const [candidateOverrides, setCandidateOverrides] = useState<Partial<Record<ComposerStageId, string>>>({});
  const [addingType, setAddingType] = useState<string | null>(null);
  const [catalogPendingType, setCatalogPendingType] = useState<string | null>(null);
  const [copyPendingId, setCopyPendingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const modeButtonRefs = useRef<Partial<Record<PickerMode, HTMLButtonElement | null>>>({});
  onCloseRef.current = onClose;

  const availableModes = useMemo<PickerMode[]>(
    () => copyAvailable ? ['guided', 'catalog', 'copy'] : ['guided', 'catalog'],
    [copyAvailable],
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => modeButtonRefs.current[mode]?.focus(), 0);
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
    // Focus capture and restoration intentionally run only for the dialog lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, SectionTypeDefinition[]> = {};
    for (const section of sectionTypes) {
      const category = section.category || 'Branchenspezifisch';
      (groups[category] ??= []).push(section);
    }
    return Object.entries(groups).sort(([a], [b]) => {
      const aIndex = CATEGORY_ORDER.indexOf(a);
      const bIndex = CATEGORY_ORDER.indexOf(b);
      if (aIndex !== -1 || bIndex !== -1) return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      return a.localeCompare(b, 'de');
    });
  }, [sectionTypes]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return grouped.map(([category, items]) => {
      if (activeCategory && category !== activeCategory) return null;
      const matches = query
        ? items.filter((item) => item.label.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.type.toLowerCase().includes(query))
        : items;
      if (matches.length === 0) return null;
      return [category, matches] as [string, SectionTypeDefinition[]];
    }).filter(Boolean) as [string, SectionTypeDefinition[]][];
  }, [grouped, search, activeCategory]);

  const filteredCopySources = useMemo(() => {
    const query = search.toLowerCase().trim();
    const pages = copySources || [];
    if (!query) return pages;
    return pages
      .map((page) => ({
        ...page,
        sections: page.sections.filter((section) => {
          const title = (section.titleInternal || '').toLowerCase();
          return title.includes(query)
            || section.type.toLowerCase().includes(query)
            || page.pageTitle.toLowerCase().includes(query)
            || page.pageSlug.toLowerCase().includes(query);
        }),
      }))
      .filter((page) => page.sections.length > 0);
  }, [copySources, search]);

  const plan = useMemo(() => buildComposerPlan({
    goal,
    family,
    artDirection,
    sectionTypes,
    existingSectionTypes,
    candidateOverrides,
  }), [artDirection, candidateOverrides, existingSectionTypes, family, goal, sectionTypes]);

  const completedSteps = plan.filter((step) => step.status === 'existing').length;
  const familyMeta = getExperienceFamily(family);
  const artDirectionMeta = getArtDirection(artDirection);
  const rhythm = useMemo(() => evaluatePageRhythm(plan), [plan]);
  const planByStage = useMemo(() => new Map(plan.map((step) => [step.stage, step])), [plan]);
  const categories = grouped.map(([category]) => category);

  function changeMode(nextMode: PickerMode, focusPanel = true) {
    setMode(nextMode);
    setSearch('');
    setActiveCategory(null);
    if (focusPanel && nextMode !== 'guided') window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleModeKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, currentMode: PickerMode) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = availableModes.indexOf(currentMode);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? availableModes.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + availableModes.length) % availableModes.length;
    const nextMode = availableModes[nextIndex];
    changeMode(nextMode, false);
    window.setTimeout(() => modeButtonRefs.current[nextMode]?.focus(), 0);
  }

  async function handleCatalogSelect(type: string) {
    if (catalogPendingType) return;
    setCatalogPendingType(type);
    try {
      if (await didSectionPickerActionSucceed(() => onSelect(type))) onClose();
    } finally {
      setCatalogPendingType(null);
    }
  }

  async function handleCopySelect(sourceSectionId: string) {
    if (!onCopySection || copyPendingId) return;
    setCopyPendingId(sourceSectionId);
    try {
      if (await didSectionPickerActionSucceed(() => onCopySection(sourceSectionId))) onClose();
    } finally {
      setCopyPendingId(null);
    }
  }

  async function handleGuidedSelect(type: string) {
    if (addingType) return;
    setAddingType(type);
    try {
      await onSelect(type);
    } finally {
      setAddingType(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-5" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="section-picker-title"
        aria-describedby="section-picker-description"
        className="flex h-full w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[min(90vh,860px)] sm:max-w-6xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h2 id="section-picker-title" className="text-lg font-semibold tracking-tight text-zinc-950">Seite weiterbauen</h2>
              <p id="section-picker-description" className="mt-0.5 text-xs leading-5 text-zinc-600">Nach Ziel planen, frei auswählen oder eine vorhandene Sektion übernehmen.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Sektionsauswahl schließen" className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900">
              <X size={19} />
            </button>
          </div>

          <div role="tablist" aria-label="Auswahlmodus" className="mt-4 flex max-w-max gap-1 rounded-xl bg-zinc-100 p-1">
            {availableModes.map((itemMode) => {
              const meta = MODE_META[itemMode];
              const Icon = meta.icon;
              const selected = mode === itemMode;
              return (
                <button
                  key={itemMode}
                  ref={(node) => { modeButtonRefs.current[itemMode] = node; }}
                  id={`section-picker-tab-${itemMode}`}
                  type="button"
                  role="tab"
                  aria-label={meta.label}
                  aria-selected={selected}
                  aria-controls={`section-picker-panel-${itemMode}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => changeMode(itemMode)}
                  onKeyDown={(event) => handleModeKeyDown(event, itemMode)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition sm:px-4 ${selected ? 'bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200' : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'}`}
                >
                  <Icon aria-hidden="true" size={15} />
                  <span className={itemMode === 'copy' ? 'hidden sm:inline' : ''}>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {mode !== 'guided' && (
            <div className="mt-3 flex min-h-11 items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <Search size={17} className="shrink-0 text-zinc-400" />
              <input
                ref={inputRef}
                type="search"
                aria-label={mode === 'copy' ? 'Vorhandene Sektion suchen' : 'Sektion suchen'}
                placeholder={mode === 'copy' ? 'Seite, Titel oder Typ suchen …' : 'Name, Zweck oder Typ suchen …'}
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && <button type="button" onClick={() => setSearch('')} aria-label="Suche leeren" className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"><X size={15} /></button>}
            </div>
          )}
        </header>

        {mode === 'guided' && (
          <div id="section-picker-panel-guided" role="tabpanel" aria-labelledby="section-picker-tab-guided" className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid min-h-full lg:grid-cols-[20rem_minmax(0,1fr)]">
              <aside className="border-b border-zinc-200 bg-[#fbfaf7] p-5 lg:border-b-0 lg:border-r lg:p-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800">01 · Ziel</p>
                  <h3 className="mt-2 text-base font-semibold text-zinc-950">Was soll diese Seite leisten?</h3>
                  <div className="mt-3 grid grid-cols-2 gap-1.5 lg:grid-cols-1" role="radiogroup" aria-label="Seitenziel">
                    {COMPOSER_GOALS.map((item) => {
                      const selected = item.id === goal;
                      return (
                        <label key={item.id} className="cursor-pointer">
                          <input
                            type="radio"
                            name="page-composer-goal"
                            value={item.id}
                            checked={selected}
                            onChange={() => { setGoal(item.id); setCandidateOverrides({}); }}
                            className="peer sr-only"
                          />
                          <span className={`block min-h-11 border-l-2 px-3 py-2 text-left transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 ${selected ? 'border-amber-700 bg-white text-zinc-950 shadow-sm' : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-white/70 hover:text-zinc-900'}`}>
                            <span className="block text-sm font-semibold">{item.label}</span>
                            <span className={`mt-0.5 hidden text-[11px] leading-4 sm:block lg:block ${selected ? 'text-zinc-600' : 'text-zinc-500'}`}>{item.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-7 border-t border-zinc-200 pt-6">
                  <label htmlFor="experience-family" className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800">02 · Experience-Familie</label>
                  <select
                    id="experience-family"
                    value={family}
                    onChange={(event) => {
                      const nextFamily = event.target.value as ExperienceFamilyId;
                      setFamily(nextFamily);
                      setArtDirection(inferArtDirection(nextFamily));
                      setCandidateOverrides({});
                    }}
                    className="mt-3 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {EXPERIENCE_FAMILIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                  <p className="mt-2 text-xs leading-5 text-zinc-600">{familyMeta.description}</p>
                  <p className="mt-3 border-l-2 border-zinc-300 pl-3 text-[11px] leading-4 text-zinc-500">Die Auswahl kuratiert nur den Aufbau. Branche und Tenant-Daten bleiben unverändert.</p>
                </div>

                <div className="mt-7 border-t border-zinc-200 pt-6">
                  <p id="art-direction-label" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800">
                    <Palette aria-hidden="true" size={14} /> 03 · Art Direction
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-1.5" role="radiogroup" aria-labelledby="art-direction-label">
                    {ART_DIRECTIONS.map((direction, index) => {
                      const selected = artDirection === direction.id;
                      return (
                        <label key={direction.id} className={`cursor-pointer ${index === ART_DIRECTIONS.length - 1 ? 'col-span-2' : ''}`}>
                          <input
                            type="radio"
                            name="page-composer-art-direction"
                            value={direction.id}
                            checked={selected}
                            onChange={() => { setArtDirection(direction.id); setCandidateOverrides({}); }}
                            className="peer sr-only"
                          />
                          <span className={`flex min-h-11 items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-xs font-semibold transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 ${selected ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'}`}>
                            {direction.label}
                            <span className="flex overflow-hidden rounded-full border border-white/30" aria-hidden="true">
                              {direction.swatches.map((swatch) => <span key={swatch} className="h-3 w-3" style={{ backgroundColor: swatch }} />)}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-zinc-600">{artDirectionMeta.description}</p>
                </div>
              </aside>

              <section className="p-5 sm:p-7 lg:p-8" aria-labelledby="composer-plan-title">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">04 · Seitendramaturgie</p>
                    <h3 id="composer-plan-title" className="mt-2 text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">Vom Einstieg zur Entscheidung</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600">Jede Station hat eine Aufgabe. Ergänzen Sie die Seite Schritt für Schritt oder tauschen Sie einen Vorschlag aus.</p>
                  </div>
                  {plan.length > 0 && <div className="text-right"><span className="block text-xl font-semibold tabular-nums text-zinc-950">{completedSteps}/{plan.length}</span><span className="text-[11px] text-zinc-500">Stationen vorhanden</span></div>}
                </div>

                <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2" aria-live="polite">
                    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ${rhythm.status === 'balanced' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${rhythm.status === 'balanced' ? 'bg-emerald-600' : 'bg-amber-600'}`} aria-hidden="true" />
                      {rhythm.label} · {rhythm.score}/100
                    </span>
                    <p className="max-w-2xl text-[11px] leading-4 text-zinc-600">{rhythm.summary}</p>
                  </div>

                  <div className="mt-3 overflow-x-auto pb-1">
                    <ol className="grid min-w-[36rem] grid-cols-5 gap-1.5" aria-label="Fünfstufige Seiten-Silhouette">
                      {COMPOSER_STAGES.map((stage, index) => {
                        const step = planByStage.get(stage.id);
                        const isExisting = step?.status === 'existing';
                        const isBlocked = step?.status === 'blocked' || step?.status === 'blockedExisting';
                        return (
                          <li key={stage.id} className={`relative min-w-0 rounded-lg border px-2.5 py-2.5 ${isExisting ? 'border-emerald-200 bg-emerald-50' : isBlocked ? 'border-amber-200 bg-amber-50' : step ? 'border-blue-200 bg-white' : 'border-dashed border-zinc-300 bg-white'}`}>
                            {index < COMPOSER_STAGES.length - 1 && <span className="absolute -right-2 top-5 z-10 h-px w-2 bg-zinc-300" aria-hidden="true" />}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">{String(index + 1).padStart(2, '0')} · {stage.label}</span>
                              {isExisting && <Check aria-label="Vorhanden" className="text-emerald-700" size={12} />}
                              {isBlocked && <Lock aria-label="Gesperrt" className="text-amber-700" size={11} />}
                            </div>
                            <p className="mt-1 truncate text-xs font-semibold text-zinc-900" title={step?.label}>{step?.label || 'Noch offen'}</p>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>

                {plan.length === 0 ? (
                  <div className="mt-8 border-l-2 border-amber-600 bg-amber-50 p-5">
                    <h4 className="text-sm font-semibold text-amber-950">Für diese Fähigkeiten ist noch kein Plan verfügbar.</h4>
                    <p className="mt-1 text-sm leading-6 text-amber-900">Öffnen Sie „Alle Sektionen“ oder aktivieren Sie die benötigten Add-ons.</p>
                    <button type="button" onClick={() => changeMode('catalog')} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">Zum Katalog <ArrowRight size={16} /></button>
                  </div>
                ) : (
                  <ol className="relative mt-6 space-y-0 before:absolute before:bottom-7 before:left-[1.05rem] before:top-7 before:w-px before:bg-zinc-300 sm:before:left-[1.3rem]">
                    {plan.map((step) => {
                      const isAdding = addingType === step.type;
                      const unavailable = Boolean(addingType) || step.status !== 'available';
                      const isBlocked = step.status === 'blocked' || step.status === 'blockedExisting';
                      const isBlockedExisting = step.status === 'blockedExisting';
                      const alternativesEnabled = canOverrideComposerStepCandidate(step);
                      return (
                        <li key={step.stage} className="relative grid grid-cols-[2.15rem_minmax(0,1fr)] gap-3 pb-6 sm:grid-cols-[2.65rem_minmax(0,1fr)] sm:gap-4">
                          <div className={`relative z-10 mt-0.5 flex h-[2.15rem] w-[2.15rem] items-center justify-center rounded-full border text-xs font-bold tabular-nums sm:h-[2.65rem] sm:w-[2.65rem] ${step.status === 'existing' ? 'border-emerald-600 bg-emerald-600 text-white' : isBlocked ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-blue-700 bg-white text-blue-800'}`}>
                            {step.status === 'existing' ? <Check size={16} /> : step.stageNumber}
                          </div>

                          <article className={`min-w-0 border-b pb-6 ${step.status === 'existing' ? 'border-emerald-200' : 'border-zinc-200'}`}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-zinc-500">{step.stageLabel}</span>
                                  {step.status === 'existing' && <span className="text-[11px] font-semibold text-emerald-700">Bereits vorhanden</span>}
                                  {isBlocked && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800"><Lock size={11} /> {isBlockedExisting ? 'Vorhanden, Add-on fehlt' : 'Nicht verfügbar'}</span>}
                                </div>
                                <h4 className="mt-1 text-base font-semibold text-zinc-950">{step.label}</h4>
                                <p className="mt-1 max-w-2xl text-sm leading-5 text-zinc-600">{step.rationale}</p>
                                {isBlocked && <p className="mt-2 text-xs font-medium text-amber-800">{step.lockReason || 'Für diese Sektion fehlt eine benötigte Fähigkeit.'}</p>}
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                {industry && <SectionPreviewButton sectionType={step.type} industry={industry} style={styleVariant || 'classic'} />}
                                <button
                                  type="button"
                                  disabled={unavailable}
                                  onClick={() => handleGuidedSelect(step.type)}
                                  className={`inline-flex min-h-11 min-w-[7.5rem] items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${step.status === 'existing' ? 'cursor-default bg-emerald-50 text-emerald-800' : isBlocked ? 'cursor-not-allowed bg-amber-50 text-amber-800' : 'bg-blue-700 text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60'}`}
                                >
                                  {isAdding ? <LoaderCircle className="animate-spin" size={15} /> : step.status === 'existing' ? <Check size={15} /> : isBlocked ? <Lock size={14} /> : <ArrowRight size={15} />}
                                  {isAdding ? 'Wird ergänzt' : step.status === 'existing' ? 'Vorhanden' : isBlockedExisting ? 'Prüfen' : isBlocked ? 'Gesperrt' : 'Hinzufügen'}
                                </button>
                              </div>
                            </div>

                            {step.candidates.length > 1 && (
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <label htmlFor={`candidate-${step.stage}`} className="text-[11px] font-medium text-zinc-500">Alternative</label>
                                <select
                                  id={`candidate-${step.stage}`}
                                  value={step.type}
                                  disabled={Boolean(addingType) || !alternativesEnabled}
                                  onChange={(event) => setCandidateOverrides((current) => ({ ...current, [step.stage]: event.target.value }))}
                                  className="min-h-11 max-w-full rounded-lg border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                  {step.candidates.map((candidate) => (
                                    <option key={candidate.type} value={candidate.type}>{candidate.label}{candidate.locked ? ' · Add-on erforderlich' : ''}</option>
                                  ))}
                                </select>
                                {!alternativesEnabled && (
                                  <span className="text-[11px] leading-4 text-zinc-500">Zum Wechseln zuerst den vorhandenen Einstieg entfernen.</span>
                                )}
                              </div>
                            )}
                          </article>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>
            </div>
          </div>
        )}

        {mode === 'catalog' && (
          <div id="section-picker-panel-catalog" role="tabpanel" aria-labelledby="section-picker-tab-catalog" className="flex min-h-0 flex-1 flex-col">
            <div className="flex gap-1.5 overflow-x-auto border-b px-4 py-2.5 sm:hidden">
              <button type="button" onClick={() => setActiveCategory(null)} className={`min-h-11 shrink-0 rounded-lg px-3 text-xs font-semibold ${!activeCategory ? 'bg-blue-100 text-blue-800' : 'text-zinc-600 hover:bg-zinc-100'}`}>Alle</button>
              {categories.map((category) => (
                <button key={category} type="button" onClick={() => setActiveCategory(activeCategory === category ? null : category)} className={`min-h-11 shrink-0 rounded-lg px-3 text-xs font-semibold ${activeCategory === category ? 'bg-blue-100 text-blue-800' : 'text-zinc-600 hover:bg-zinc-100'}`}>{getCategoryLabel(category)}</button>
              ))}
            </div>

            <div className="flex min-h-0 flex-1">
              <aside className="hidden w-64 shrink-0 overflow-y-auto border-r bg-zinc-50/80 p-3 sm:block">
                <button type="button" onClick={() => setActiveCategory(null)} className={`mb-1 flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-xs font-semibold transition ${!activeCategory ? 'bg-blue-100 text-blue-800' : 'text-zinc-700 hover:bg-white'}`}>
                  Alle Sektionen <span className="text-[10px] text-current/60">{sectionTypes.length}</span>
                </button>
                {categories.map((category) => {
                  const meta = getCategoryMeta(category);
                  const Icon = meta.icon;
                  const count = grouped.find(([groupCategory]) => groupCategory === category)?.[1].length || 0;
                  return (
                    <button key={category} type="button" onClick={() => setActiveCategory(activeCategory === category ? null : category)} className={`mb-1 flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-xs font-medium transition ${activeCategory === category ? 'bg-blue-100 text-blue-800' : 'text-zinc-700 hover:bg-white'}`}>
                      <Icon size={14} /><span className="min-w-0 flex-1 truncate">{getCategoryLabel(category)}</span><span className="text-[10px] text-current/50">{count}</span>
                    </button>
                  );
                })}
              </aside>

              <div className="min-w-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                <div className="mb-5 rounded-lg border border-teal-200 bg-teal-50/70 px-4 py-3 text-xs leading-5 text-teal-900">
                  <strong className="font-semibold">Deine Branche sortiert nur Empfehlungen.</strong> Du kannst jede nicht gesperrte Sektion verwenden und frei anpassen. Nur Shop- und Booking-Funktionen benötigen das passende Add-on.
                </div>
                {filtered.length === 0 && <div className="py-14 text-center text-sm text-zinc-500">Keine Sektionen gefunden. Versuchen Sie einen anderen Begriff.</div>}
                {filtered.map(([category, items]) => {
                  const meta = getCategoryMeta(category);
                  const Icon = meta.icon;
                  return (
                    <section key={category} className="mb-7" aria-labelledby={`category-${category.replace(/\W/g, '-')}`}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`rounded-md p-1.5 ${meta.color}`}><Icon size={13} /></span>
                        <div><h3 id={`category-${category.replace(/\W/g, '-')}`} className="text-xs font-bold uppercase tracking-wide text-zinc-700">{getCategoryLabel(category)}</h3><p className="text-[10px] text-zinc-500">{meta.description}</p></div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                        {items.map((section) => (
                          <div key={section.type} className={`group relative flex min-h-[4.75rem] items-stretch rounded-xl border transition ${section.locked ? 'border-zinc-200 bg-zinc-50' : category === 'Advanced' ? 'border-violet-200 bg-gradient-to-br from-white to-violet-50/60 hover:border-violet-400 hover:shadow-md' : 'border-zinc-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'}`}>
                            <button type="button" onClick={() => { if (!section.locked) void handleCatalogSelect(section.type); }} disabled={section.locked || Boolean(catalogPendingType)} aria-busy={catalogPendingType === section.type} className="min-w-0 flex-1 p-3 text-left disabled:cursor-not-allowed disabled:opacity-60">
                              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 transition group-hover:text-blue-800">
                                {catalogPendingType === section.type && <LoaderCircle aria-hidden="true" className="animate-spin" size={14} />}
                                {catalogPendingType === section.type ? 'Wird hinzugefügt …' : section.label}
                                {category === 'Advanced' && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-700">Advanced</span>}
                                {section.locked && <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500"><Lock size={10} /> Gesperrt</span>}
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-zinc-500">{section.description}</p>
                              {section.setupHint && <p className="mt-1.5 text-[10px] leading-4 text-violet-700"><span className="font-bold">{section.setupLevel === 'specialist' ? 'Spezial-Assets:' : 'Einrichtung:'}</span> {section.setupHint}</p>}
                              {section.serviceAvailable && <p className="mt-1 text-[10px] font-semibold text-zinc-500">Auf Wunsch von Flamingo befüllbar · Preis auf Anfrage</p>}
                              {section.locked && section.lockReason && <p className="mt-1 text-[11px] font-medium text-amber-800">{section.lockReason}</p>}
                            </button>
                            {industry && <div className="flex items-center pr-2"><SectionPreviewButton sectionType={section.type} industry={industry} style={styleVariant || 'classic'} /></div>}
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {mode === 'copy' && (
          <div id="section-picker-panel-copy" role="tabpanel" aria-labelledby="section-picker-tab-copy" className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            {copySourcesLoading ? (
              <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-zinc-500"><LoaderCircle className="animate-spin" size={17} /> Vorhandene Sektionen werden geladen …</div>
            ) : filteredCopySources.length === 0 ? (
              <div className="mx-auto max-w-lg border-l-2 border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-600">Keine passenden Sektionen zum Kopieren gefunden.</div>
            ) : (
              <div className="mx-auto max-w-4xl space-y-5">
                {filteredCopySources.map((page) => (
                  <section key={page.pageId} className="overflow-hidden rounded-xl border border-zinc-200" aria-labelledby={`copy-page-${page.pageId}`}>
                    <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                      <h3 id={`copy-page-${page.pageId}`} className="text-sm font-semibold text-zinc-900">{page.pageTitle}</h3>
                      <p className="mt-0.5 text-[11px] text-zinc-500">/{page.pageSlug || ''}</p>
                    </div>
                    <div className="grid gap-2 p-3 md:grid-cols-2">
                      {page.sections.map((section) => (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => void handleCopySelect(section.id)}
                          disabled={Boolean(copyPendingId)}
                          aria-busy={copyPendingId === section.id}
                          className="min-h-14 rounded-lg border border-zinc-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/40 disabled:cursor-wait disabled:opacity-60"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                            {copyPendingId === section.id && <LoaderCircle aria-hidden="true" className="animate-spin" size={14} />}
                            {copyPendingId === section.id ? 'Wird kopiert …' : section.titleInternal || section.type}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-zinc-500">Typ: {section.type}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

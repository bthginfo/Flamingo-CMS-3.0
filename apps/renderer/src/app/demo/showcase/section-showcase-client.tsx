'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ExternalLink,
  FlaskConical,
  Layers3,
  Menu,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  Tablet,
  X,
} from 'lucide-react';

export type ShowcaseContext = {
  industry: string;
  label: string;
};

export type ShowcaseSection = {
  id: string;
  type: string;
  label: string;
  description: string;
  category: string;
  contexts: ShowcaseContext[];
  contextLabel: string;
  defaultIndustry: string;
  isCurated: boolean;
  curatedRank: number;
  outcome: string;
};

type ShowcaseMode = 'showroom' | 'lab';
type ViewportKey = 'desktop' | 'tablet' | 'mobile';

const VIEWPORTS = {
  desktop: { label: 'Desktop', width: 1280, height: 800, icon: Monitor },
  tablet: { label: 'Tablet', width: 768, height: 1024, icon: Tablet },
  mobile: { label: 'Mobile', width: 390, height: 844, icon: Smartphone },
} satisfies Record<ViewportKey, { label: string; width: number; height: number; icon: typeof Monitor }>;

function previewUrl(section: ShowcaseSection, industry: string, style: string) {
  const params = new URLSearchParams({ type: section.type, industry, style });
  return `/section-preview?${params.toString()}`;
}

function modeLabel(mode: ShowcaseMode) {
  return mode === 'showroom' ? 'Showroom' : 'Section Lab';
}

export function SectionShowcaseClient({
  sections,
  categories,
  industries,
}: {
  sections: ShowcaseSection[];
  categories: string[];
  industries: ShowcaseContext[];
}) {
  const curatedSections = useMemo(() => sections.filter(section => section.isCurated), [sections]);
  const firstSection = curatedSections[0] || sections[0];
  const [mode, setMode] = useState<ShowcaseMode>('showroom');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Alle');
  const [industryFilter, setIndustryFilter] = useState('Alle');
  const [selectedId, setSelectedId] = useState(firstSection?.id || '');
  const [selectedIndustry, setSelectedIndustry] = useState(firstSection?.defaultIndustry || 'tradesman');
  const [style, setStyle] = useState('classic');
  const [viewport, setViewport] = useState<ViewportKey>('desktop');
  const [catalogOpen, setCatalogOpen] = useState(false);
  const catalogTriggerRef = useRef<HTMLButtonElement>(null);
  const catalogCloseRef = useRef<HTMLButtonElement>(null);

  const selected = sections.find(section => section.id === selectedId) || firstSection;
  const activeViewport = VIEWPORTS[viewport];
  const activeUrl = selected ? previewUrl(selected, selectedIndustry, style) : '';

  useEffect(() => {
    if (window.innerWidth < 640) setViewport('mobile');
    else if (window.innerWidth < 1024) setViewport('tablet');
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('de');
    const source = mode === 'showroom' ? curatedSections : sections;
    return source.filter(section => {
      const matchesCategory = category === 'Alle' || section.category === category;
      const matchesIndustry = industryFilter === 'Alle'
        || section.contexts.some(context => context.industry === industryFilter);
      const haystack = [
        section.type,
        section.label,
        section.description,
        section.category,
        section.contextLabel,
        ...section.contexts.map(context => context.label),
      ].join(' ').toLocaleLowerCase('de');
      return matchesCategory && matchesIndustry && (!needle || haystack.includes(needle));
    });
  }, [category, curatedSections, industryFilter, mode, query, sections]);

  useEffect(() => {
    if (!catalogOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    catalogCloseRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setCatalogOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = document.getElementById('section-catalog');
      const focusable = Array.from(dialog?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || []).filter(element => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      catalogTriggerRef.current?.focus();
    };
  }, [catalogOpen]);

  function selectSection(section: ShowcaseSection) {
    setSelectedId(section.id);
    setSelectedIndustry(section.defaultIndustry);
    setCatalogOpen(false);
  }

  function selectMode(nextMode: ShowcaseMode) {
    setMode(nextMode);
    const currentAllowed = nextMode === 'lab' || Boolean(selected?.isCurated);
    if (!currentAllowed && firstSection) selectSection(firstSection);
  }

  return (
    <main className="min-h-screen bg-[var(--token-section-bg-alt)] text-[color:var(--token-heading)]">
      <header className="border-b border-[var(--token-divider)] bg-[var(--token-section-bg)]">
        <div className="mx-auto flex max-w-[1700px] flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-7 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-9">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--token-eyebrow)]">
              <span aria-hidden="true" className="h-px w-8 bg-[var(--token-accent)]" />
              Flamingo CMS
            </p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2rem,9vw,4.75rem)] font-black leading-[0.96] tracking-[-0.045em]">
              Sections als echte Oberfläche.
            </h1>
            <p className="mt-4 hidden max-w-2xl text-base leading-7 text-[color:var(--token-body)] sm:block sm:text-lg">
              Der Showroom zeigt kuratierte Conversion-Momente. Das Section Lab enthält jede eigenständige Renderer-Definition und ihre verfügbaren Branchenkontexte.
            </p>
            <p className="mt-3 text-sm leading-6 text-[color:var(--token-body)] sm:hidden">
              Kuratierte Premium-Sections und das vollständige Renderer-Lab.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex min-h-12 border border-[var(--token-divider)] bg-[var(--token-section-bg-alt)] p-1" role="group" aria-label="Showcase-Modus">
              {(['showroom', 'lab'] as const).map(item => {
                const active = mode === item;
                const Icon = item === 'showroom' ? Sparkles : FlaskConical;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectMode(item)}
                    aria-pressed={active}
                    className={`inline-flex min-h-10 items-center gap-2 px-4 text-sm font-bold transition-colors ${active ? 'bg-[var(--token-heading)] text-[color:var(--token-section-bg)]' : 'text-[color:var(--token-body)] hover:text-[color:var(--token-heading)]'}`}
                  >
                    <Icon aria-hidden="true" size={16} />
                    {item === 'lab' ? <><span className="hidden sm:inline">Section </span>Lab</> : modeLabel(item)}
                  </button>
                );
              })}
            </div>
            <button
              ref={catalogTriggerRef}
              type="button"
              onClick={() => setCatalogOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={catalogOpen}
              aria-controls="section-catalog"
              className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap border border-[var(--token-heading)] bg-[var(--token-heading)] px-5 text-sm font-bold text-[color:var(--token-section-bg)] transition hover:opacity-90"
            >
              <Menu aria-hidden="true" size={18} />
              Katalog öffnen
              <span className="text-xs opacity-65">{mode === 'showroom' ? curatedSections.length : sections.length}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7" aria-live="polite">
        {selected ? (
          <div className="border border-[var(--token-divider)] bg-[var(--token-section-bg)] shadow-[0_24px_80px_var(--token-shadow)]">
            <div className="grid gap-5 border-b border-[var(--token-divider)] p-4 sm:p-5 xl:grid-cols-[minmax(18rem,1fr)_auto] xl:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--token-muted)]">
                  <span>{selected.category}</span>
                  <span aria-hidden="true">/</span>
                  <span>{selected.type}</span>
                  <span aria-hidden="true">/</span>
                  <span>{selected.contextLabel}</span>
                </div>
                <h2 className="mt-2 text-[clamp(1.5rem,3vw,2.5rem)] font-black leading-tight tracking-[-0.03em]">{selected.label}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--token-body)] sm:text-base">
                  <strong className="font-bold text-[color:var(--token-heading)]">Ziel:</strong> {selected.outcome}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:min-w-[30rem]">
                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--token-muted)]">
                  Vorschau-Kontext
                  <select
                    value={selectedIndustry}
                    onChange={event => setSelectedIndustry(event.target.value)}
                    className="min-h-12 border border-[var(--token-divider)] bg-[var(--token-section-bg)] px-3 text-sm font-semibold normal-case tracking-normal text-[color:var(--token-heading)] outline-none focus:border-[var(--token-accent)]"
                  >
                    {selected.contexts.map(context => (
                      <option key={context.industry} value={context.industry}>{context.label}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--token-muted)]">
                  Design-Rezept
                  <select
                    value={style}
                    onChange={event => setStyle(event.target.value)}
                    className="min-h-12 border border-[var(--token-divider)] bg-[var(--token-section-bg)] px-3 text-sm font-semibold normal-case tracking-normal text-[color:var(--token-heading)] outline-none focus:border-[var(--token-accent)]"
                  >
                    <option value="classic">Classic</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-[var(--token-divider)] bg-[var(--token-section-bg-alt)] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="inline-flex min-h-12 self-start border border-[var(--token-divider)] bg-[var(--token-section-bg)] p-1" role="group" aria-label="Vorschaugröße">
                {(Object.keys(VIEWPORTS) as ViewportKey[]).map(key => {
                  const option = VIEWPORTS[key];
                  const Icon = option.icon;
                  const active = viewport === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setViewport(key)}
                      aria-pressed={active}
                      aria-label={`${option.label}-Vorschau, ${option.width} mal ${option.height} Pixel`}
                      className={`inline-flex min-h-10 items-center gap-2 px-3 text-sm font-bold transition-colors ${active ? 'bg-[var(--token-heading)] text-[color:var(--token-section-bg)]' : 'text-[color:var(--token-body)] hover:text-[color:var(--token-heading)]'}`}
                    >
                      <Icon aria-hidden="true" size={17} />
                      <span className="hidden sm:inline">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs font-semibold tabular-nums text-[color:var(--token-muted)]">
                  {activeViewport.width} × {activeViewport.height}px
                </span>
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--token-divider)] bg-[var(--token-section-bg)] px-4 text-sm font-bold text-[color:var(--token-heading)] transition hover:border-[var(--token-heading)]"
                >
                  Vollansicht
                  <ExternalLink aria-hidden="true" size={15} />
                </a>
              </div>
            </div>

            <div className="h-[clamp(34rem,72vh,58rem)] overflow-auto overscroll-contain bg-[color:color-mix(in_srgb,var(--token-section-bg-alt)_72%,var(--token-divider))] p-3 sm:p-6">
              <div
                key={`${selected.id}-${selectedIndustry}-${style}-${viewport}`}
                className="mx-auto overflow-hidden border border-[var(--token-divider)] bg-[var(--token-section-bg)] shadow-[0_20px_70px_var(--token-shadow)] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
                style={{ width: activeViewport.width }}
              >
                <div className="flex h-9 items-center gap-2 border-b border-[var(--token-divider)] bg-[var(--token-section-bg-alt)] px-3" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-[var(--token-divider)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--token-divider)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--token-accent)]" />
                  <span className="ml-2 truncate text-[11px] font-semibold text-[color:var(--token-muted)]">
                    {selectedIndustry} / {selected.type}
                  </span>
                </div>
                <iframe
                  title={`${selected.label} – ${activeViewport.label}-Vorschau`}
                  src={activeUrl}
                  width={activeViewport.width}
                  height={activeViewport.height}
                  className="block border-0 bg-[var(--token-section-bg)]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-[32rem] place-items-center border border-[var(--token-divider)] bg-[var(--token-section-bg)] p-8 text-center text-[color:var(--token-muted)]">
            Keine Section verfügbar.
          </div>
        )}
      </section>

      {catalogOpen && (
        <div className="fixed inset-0 z-[10000]">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-[color:color-mix(in_srgb,var(--token-heading)_64%,transparent)]"
            aria-label="Section-Katalog schließen"
            onClick={() => setCatalogOpen(false)}
          />
          <aside
            id="section-catalog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="section-catalog-title"
            className="relative h-full w-full max-w-[32rem] overflow-y-auto border-r border-[var(--token-divider)] bg-[var(--token-section-bg)] shadow-[0_0_80px_var(--token-shadow)]"
          >
            <div className="sticky top-0 z-10 border-b border-[var(--token-divider)] bg-[var(--token-section-bg)] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--token-eyebrow)]">{modeLabel(mode)}</p>
                  <h2 id="section-catalog-title" className="mt-1 text-2xl font-black tracking-[-0.03em]">Section-Katalog</h2>
                  <p className="mt-1 text-sm leading-5 text-[color:var(--token-body)]">
                    {mode === 'showroom' ? 'Kuratierte Beispiele nach Conversion-Aufgabe.' : 'Alle eigenständigen Renderer-Definitionen und Kontexte.'}
                  </p>
                </div>
                <button
                  ref={catalogCloseRef}
                  type="button"
                  onClick={() => setCatalogOpen(false)}
                  className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--token-divider)] text-[color:var(--token-heading)] transition hover:border-[var(--token-heading)]"
                  aria-label="Section-Katalog schließen"
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                <label className="relative block">
                  <span className="sr-only">Sections durchsuchen</span>
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--token-muted)]" size={17} />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Name, Typ oder Aufgabe suchen"
                    className="min-h-12 w-full border border-[var(--token-divider)] bg-[var(--token-section-bg-alt)] pl-10 pr-3 text-sm text-[color:var(--token-heading)] outline-none placeholder:text-[color:var(--token-muted)] focus:border-[var(--token-accent)]"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1 text-xs font-bold text-[color:var(--token-muted)]">
                    Kategorie
                    <select
                      value={category}
                      onChange={event => setCategory(event.target.value)}
                      className="min-h-11 min-w-0 border border-[var(--token-divider)] bg-[var(--token-section-bg)] px-2 text-sm font-semibold text-[color:var(--token-heading)] outline-none focus:border-[var(--token-accent)]"
                    >
                      <option value="Alle">Alle</option>
                      {categories.map(item => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1 text-xs font-bold text-[color:var(--token-muted)]">
                    Kontext
                    <select
                      value={industryFilter}
                      onChange={event => setIndustryFilter(event.target.value)}
                      className="min-h-11 min-w-0 border border-[var(--token-divider)] bg-[var(--token-section-bg)] px-2 text-sm font-semibold text-[color:var(--token-heading)] outline-none focus:border-[var(--token-accent)]"
                    >
                      <option value="Alle">Alle</option>
                      {industries.map(item => <option key={item.industry} value={item.industry}>{item.label}</option>)}
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-[color:var(--token-muted)]">
                <span>{filtered.length} Treffer</span>
                <button
                  type="button"
                  onClick={() => { setQuery(''); setCategory('Alle'); setIndustryFilter('Alle'); }}
                  className="min-h-9 px-2 underline decoration-[var(--token-divider)] underline-offset-4 hover:decoration-[var(--token-heading)]"
                >
                  Filter zurücksetzen
                </button>
              </div>
            </div>

            <div className="divide-y divide-[var(--token-divider)]">
              {filtered.map(section => {
                const active = selected?.id === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => selectSection(section)}
                    aria-current={active ? 'true' : undefined}
                    className={`group w-full px-4 py-5 text-left transition-colors sm:px-5 ${active ? 'bg-[var(--token-section-bg-alt)]' : 'hover:bg-[var(--token-section-bg-alt)]'}`}
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className="min-w-0">
                        <span className="block text-base font-black leading-snug text-[color:var(--token-heading)]">{section.label}</span>
                        <span className="mt-1 block text-xs font-semibold text-[color:var(--token-muted)]">{section.type} · {section.contextLabel}</span>
                      </span>
                      <span className={`grid h-9 w-9 shrink-0 place-items-center border transition ${active ? 'border-[var(--token-heading)] bg-[var(--token-heading)] text-[color:var(--token-section-bg)]' : 'border-[var(--token-divider)] text-[color:var(--token-muted)] group-hover:border-[var(--token-heading)] group-hover:text-[color:var(--token-heading)]'}`}>
                        <Layers3 aria-hidden="true" size={16} />
                      </span>
                    </span>
                    <span className="mt-3 block text-sm leading-6 text-[color:var(--token-body)]">{section.description}</span>
                    <span className="mt-3 block border-l-2 border-[var(--token-accent)] pl-3 text-sm font-semibold leading-5 text-[color:var(--token-heading)]">{section.outcome}</span>
                  </button>
                );
              })}
              {!filtered.length && (
                <div className="px-5 py-16 text-center">
                  <Search aria-hidden="true" className="mx-auto text-[color:var(--token-muted)]" size={28} />
                  <p className="mt-3 font-bold">Keine passende Section</p>
                  <p className="mt-1 text-sm text-[color:var(--token-body)]">Suche oder Filter zurücksetzen.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

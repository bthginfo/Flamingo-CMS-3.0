'use client';

import { useState, useEffect, useCallback, useId, useMemo, useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Eye,
  Palette,
  RotateCcw,
} from 'lucide-react';
import { FIELD_DEFS, sortColorFields, type ColorFieldKey } from '@/lib/section-color-fields';
import {
  ALPHA_CAPABLE_FIELDS,
  composeColorWithAlpha,
  evaluateContrastPairs,
  groupEditorFields,
  parseColorWithAlpha,
} from '@/lib/section-color-editor-utils';
import { resolveColorContractForSection } from '@/lib/section-color-resolver';
import { scanSectionTokens } from '@/lib/scan-section-tokens';
export { FIELD_DEFS, sortColorFields };
export { composeColorWithAlpha, parseColorWithAlpha } from '@/lib/section-color-editor-utils';
export type { ColorFieldKey };

type ColorOverrides = Record<string, string>;

/* ─── All available color fields with categories ───
 *
 * Legacy field keys (textPrimary, textSecondary, brandPrimary, brandAccent,
 * colorPrimary, styleBrand, imageTextColor, cardBorderColor, cardBorder,
 * cardShadow, headingWeight, headingTracking, imageOverlay, btnSecondary*)
 * were removed in Phase 3. Stored overrides referencing those keys are
 * collapsed at load time via migrateLegacyOverrides() so existing tenant
 * data continues to render correctly.
 */
// Mapping of every legacy key the editor used to expose to its modern
// equivalent. Used by migrateLegacyOverrides() to clean up stored
// styleOverrides objects on load so the editor never shows orphaned values.
// Keys cover BOTH field-name aliases (textPrimary) AND legacy CSS var names
// (--style-text-primary, --brand-primary) because stored overrides use the
// CSS var form while contract slots use the field-name form.
export const LEGACY_FIELD_ALIASES: Record<string, ColorFieldKey | null> = {
  // Field-name aliases
  textPrimary:     'bodyColor',
  textSecondary:   'bodyColor',
  brandPrimary:    'accentColor',
  brandAccent:     'accentColor',
  colorPrimary:    'accentColor',
  styleBrand:      'accentColor',
  imageTextColor:  'onDarkHeading',
  imageBodyColor:  'onDarkBody',
  imageMutedColor: 'onDarkMuted',
  cardBorderColor: 'borderColor',
  imageOverlay:    'imageOverlay',
  cardBorder:      null,
  cardShadow:      'cardShadow',
  headingWeight:   'headingWeight',
  headingTracking: 'headingTracking',
  btnSecondaryBg:  'btnSecondaryBg',
  btnSecondaryText:'btnSecondaryText',
};

// Legacy CSS-var name → modern CSS-var name (used at load time only).
const LEGACY_CSS_VAR_ALIASES: Record<string, string | null> = {
  '--style-text-primary':      '--token-body',
  '--style-text-secondary':    '--token-muted',
  '--style-heading-color':     '--token-heading',
  '--style-subheading-color':  '--token-subheading',
  '--style-body-color':        '--token-body',
  '--style-text-muted':        '--token-muted',
  '--style-section-bg':        '--token-section-bg',
  '--style-section-bg-alt':    '--token-section-bg-alt',
  '--style-card-bg':           '--token-card-bg',
  '--style-card-border':       '--token-card-border',
  '--style-border-color':      '--token-card-border',
  '--style-divider-color':     '--token-divider',
  '--style-icon-color':        '--token-icon',
  '--style-accent-color':      '--token-accent',
  '--style-badge-bg':          '--token-badge-bg',
  '--style-badge-text':        '--token-badge-text',
  '--style-badge-border':      '--token-badge-border',
  '--style-card-radius':       '--token-card-radius',
  '--style-button-radius':     '--token-button-radius',
  '--style-image-text-color':  '--token-on-dark-heading',
  '--style-image-body-color':  '--token-on-dark-body',
  '--style-image-muted-color': '--token-on-dark-muted',
  '--brand-primary':           '--token-accent',
  '--brand-accent':            '--token-accent',
  '--brand-btn-secondary-bg':  null,
  '--brand-btn-secondary-text':null,
  '--style-card-border-color': '--token-card-border',
  '--style-image-overlay':     '--token-image-overlay',
  '--style-card-shadow':       '--token-card-shadow',
  '--style-heading-weight':    '--token-heading-weight',
  '--style-heading-tracking':  '--token-heading-tracking',
  '--style-brand':             '--token-accent',
  '--color-primary':           '--token-accent',
};

export function migrateLegacyOverrides<T extends Record<string, unknown>>(raw: T | null | undefined): T {
  if (!raw) return {} as T;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    // Skip empty values entirely.
    if (value == null || value === '') continue;
    // CSS-var form (e.g. "--style-text-primary")
    if (key.startsWith('--') && key in LEGACY_CSS_VAR_ALIASES) {
      const target = LEGACY_CSS_VAR_ALIASES[key];
      if (target && !(target in out)) out[target] = value;
      continue;
    }
    // Field-key alias form (rare — only contract slots use this shape).
    if (key in LEGACY_FIELD_ALIASES) {
      const fieldKey = LEGACY_FIELD_ALIASES[key];
      if (fieldKey) {
        const cssVar = FIELD_DEFS[fieldKey]?.cssVar;
        if (cssVar && !(cssVar in out)) out[cssVar] = value;
      }
      continue;
    }
    out[key] = value;
  }
  return out as T;
}

type PreviewScanState = 'idle' | 'checking' | 'ready' | 'unavailable';

const RESOLVED_COLOR_FALLBACKS: Record<string, string[]> = {
  '--token-heading': ['--brand-heading', '--brand-dark', '--style-text-primary'],
  '--token-subheading': ['--token-heading', '--brand-body-text', '--style-text-secondary', '--style-text-primary'],
  '--token-body': ['--brand-body-text', '--style-text-secondary', '--style-text-primary'],
  '--token-muted': ['--brand-muted-text', '--style-text-secondary'],
  '--token-icon': ['--token-accent', '--brand-primary', '--style-accent-color', '--brand-accent'],
  '--token-accent': ['--brand-accent', '--brand-primary', '--style-accent-color'],
  '--token-card-border': ['--style-card-border'],
  '--token-divider': ['--style-border-color', '--style-card-border'],
  '--token-btn-bg': ['--brand-accent', '--brand-primary'],
  '--token-btn-text': ['--brand-dark'],
  '--token-badge-bg': ['--brand-primary'],
  '--token-badge-text': ['--brand-primary'],
  '--token-badge-border': ['--brand-primary'],
  '--token-section-bg-alt': ['--style-section-bg'],
};

interface SectionColorEditorProps {
  value: ColorOverrides | null;
  onChange: (overrides: ColorOverrides | null) => void;
  sectionType?: string;
  industry?: string;
  resolvedVars?: Record<string, string>;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  sectionId?: string;
}

export function SectionColorEditor({
  value,
  onChange,
  sectionType,
  industry,
  resolvedVars,
  iframeRef,
  sectionId,
}: SectionColorEditorProps) {
  const probeRef = useRef<HTMLDivElement>(null);
  const editorId = useId();
  const overrides = useMemo(() => migrateLegacyOverrides<ColorOverrides>(value), [value]);
  const contractInfo = useMemo(
    () => (sectionType ? resolveColorContractForSection(sectionType, industry) : null),
    [industry, sectionType],
  );
  const allFields = useMemo(
    () => sortColorFields(contractInfo?.fields ?? (['sectionBg'] as ColorFieldKey[])),
    [contractInfo],
  );
  const relevantCssVars = useMemo(
    () => new Set(allFields.map((field) => FIELD_DEFS[field]?.cssVar).filter(Boolean)),
    [allFields],
  );
  const activeCount = useMemo(
    () => Object.entries(overrides).filter(([key, color]) => relevantCssVars.has(key) && color).length,
    [overrides, relevantCssVars],
  );

  const [open, setOpen] = useState(false);
  const [showCoreOverflow, setShowCoreOverflow] = useState(false);
  const [showSpecial, setShowSpecial] = useState(false);
  const [showDesign, setShowDesign] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [computedVars, setComputedVars] = useState<Record<string, string>>({});
  const [usedTokens, setUsedTokens] = useState<Set<string> | null>(null);
  const [scanState, setScanState] = useState<PreviewScanState>('idle');
  const allVarKeys = useMemo(
    () => allFields.map((field) => FIELD_DEFS[field]?.cssVar).filter(Boolean),
    [allFields],
  );

  useEffect(() => {
    setComputedVars({});
    setUsedTokens(null);
    setScanState(open ? 'checking' : 'idle');
    setShowCoreOverflow(false);
    setShowInactive(false);
  }, [industry, open, sectionId, sectionType]);

  const readComputedStyles = useCallback((markUnavailable = false) => {
    const result: Record<string, string> = {};
    let foundPreviewSection = false;

    if (iframeRef?.current && sectionId) {
      try {
        const document = iframeRef.current.contentDocument;
        const section = document?.querySelector(`[data-section-id="${CSS.escape(sectionId)}"]`);
        if (section) {
          foundPreviewSection = true;
          setUsedTokens(scanSectionTokens(section));
          setScanState('ready');
          const styles = getComputedStyle(section);
          for (const cssVar of allVarKeys) {
            const computed = styles.getPropertyValue(cssVar).trim();
            if (computed) result[cssVar] = computed;
          }
        }
      } catch {
        // Cross-origin and not-yet-loaded previews fall back to resolvedVars.
      }
    }

    if (!foundPreviewSection && probeRef.current) {
      const styles = getComputedStyle(probeRef.current);
      for (const cssVar of allVarKeys) {
        const computed = styles.getPropertyValue(cssVar).trim();
        if (computed) result[cssVar] = computed;
      }
    }

    setComputedVars(result);
    if (!foundPreviewSection && markUnavailable) setScanState('unavailable');
  }, [allVarKeys, iframeRef, sectionId]);

  useEffect(() => {
    if (!open) return undefined;
    setScanState('checking');
    const timers = [
      window.setTimeout(() => readComputedStyles(false), 60),
      window.setTimeout(() => readComputedStyles(false), 300),
      window.setTimeout(() => readComputedStyles(true), 900),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [open, readComputedStyles]);

  const getResolvedColor = useCallback((cssVar: string): string | undefined => {
    if (computedVars[cssVar]) return computedVars[cssVar];
    if (resolvedVars?.[cssVar]) return resolvedVars[cssVar];
    const fallbackChain = RESOLVED_COLOR_FALLBACKS[cssVar];
    if (!fallbackChain) return undefined;
    for (const fallback of fallbackChain) {
      const value = computedVars[fallback] || resolvedVars?.[fallback];
      if (value) return value;
    }
    return undefined;
  }, [computedVars, resolvedVars]);

  const fieldGroups = useMemo(
    () => groupEditorFields(allFields, usedTokens, overrides),
    [allFields, overrides, usedTokens],
  );
  const inactiveGroups = useMemo(() => ({
    core: fieldGroups.inactive.filter((field) => FIELD_DEFS[field]?.type !== 'size' && FIELD_DEFS[field]?.group === 'core'),
    special: fieldGroups.inactive.filter((field) => FIELD_DEFS[field]?.type !== 'size' && FIELD_DEFS[field]?.group !== 'core'),
    design: fieldGroups.inactive.filter((field) => FIELD_DEFS[field]?.type === 'size'),
  }), [fieldGroups.inactive]);

  const contrastResults = useMemo(() => {
    const fieldSet = new Set(allFields);
    return evaluateContrastPairs(fieldSet, (field) => {
      const cssVar = FIELD_DEFS[field]?.cssVar;
      return cssVar ? overrides[cssVar] || getResolvedColor(cssVar) : undefined;
    });
  }, [allFields, getResolvedColor, overrides]);
  const contrastWarnings = contrastResults.filter((result) => !result.passesAA);

  const handleChange = (key: string, color: string) => {
    const next: Record<string, string> = { ...overrides, [key]: color.trim() };
    Object.keys(next).forEach((candidate) => { if (!next[candidate]) delete next[candidate]; });
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  const handleClear = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  function renderUsageBadge(fieldKey: ColorFieldKey) {
    const cssVar = FIELD_DEFS[fieldKey]?.cssVar;
    const isSet = Boolean(cssVar && overrides[cssVar]);
    const isRendered = fieldKey === 'sectionBg' || Boolean(cssVar && usedTokens?.has(cssVar));
    if (isRendered) {
      return (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
          <Eye size={11} aria-hidden="true" />
          {isSet ? 'Angepasst · live' : 'In Vorschau verwendet'}
        </span>
      );
    }
    if (isSet) {
      return (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
          Angepasst · nicht erkannt
        </span>
      );
    }
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-500">
        Nicht in Vorschau erkannt
      </span>
    );
  }

  function renderColorField(fieldKey: ColorFieldKey) {
    const definition = FIELD_DEFS[fieldKey];
    if (!definition) return null;
    const currentOverride = overrides[definition.cssVar] || '';
    const resolved = getResolvedColor(definition.cssVar);
    const displayColor = currentOverride || resolved || '';
    const parsedDisplay = parseColorWithAlpha(displayColor);
    const overrideAlpha = parseColorWithAlpha(currentOverride).alpha;
    const effectiveAlpha = overrideAlpha ?? parsedDisplay.alpha ?? 1;
    const supportsAlpha = ALPHA_CAPABLE_FIELDS.has(fieldKey);
    const inputId = `${editorId}-${fieldKey}`;
    const descriptionId = `${inputId}-description`;
    const alphaId = `${inputId}-alpha`;

    return (
      <div key={fieldKey} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-950/[0.02]">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-800">
              {definition.label}
            </label>
            <p id={descriptionId} className="mt-0.5 text-[11px] leading-4 text-zinc-500">
              {definition.description}
            </p>
          </div>
          {renderUsageBadge(fieldKey)}
        </div>

        <div className="mt-3 grid grid-cols-[2.75rem_minmax(0,1fr)_2.5rem] items-center gap-2">
          <input
            type="color"
            aria-label={`${definition.label}: Farbe wählen`}
            className="h-11 w-11 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            value={parsedDisplay.hex || '#000000'}
            onChange={(event) => handleChange(
              definition.cssVar,
              composeColorWithAlpha(event.target.value, supportsAlpha ? effectiveAlpha : 1),
            )}
          />
          <input
            id={inputId}
            type="text"
            spellCheck={false}
            autoComplete="off"
            className="admin-input min-w-0 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            placeholder={resolved || 'Geerbter Wert'}
            value={currentOverride}
            aria-describedby={descriptionId}
            onChange={(event) => handleChange(definition.cssVar, event.target.value)}
          />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!currentOverride}
            aria-label={`${definition.label} auf geerbten Wert zurücksetzen`}
            title="Auf geerbten Wert zurücksetzen"
            onClick={() => handleClear(definition.cssVar)}
          >
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        </div>

        {supportsAlpha && (
          <div className="mt-3 flex items-center gap-3 border-t border-zinc-100 pt-3">
            <label htmlFor={alphaId} className="shrink-0 text-[11px] font-medium text-zinc-600">
              Deckkraft
            </label>
            <input
              id={alphaId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(effectiveAlpha * 100)}
              disabled={!parsedDisplay.hex}
              aria-valuetext={`${Math.round(effectiveAlpha * 100)} Prozent`}
              onChange={(event) => handleChange(
                definition.cssVar,
                composeColorWithAlpha(parsedDisplay.hex, Number(event.target.value) / 100),
              )}
              className="h-1.5 min-w-0 flex-1 cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            />
            <output htmlFor={alphaId} className="w-10 text-right font-mono text-[11px] text-zinc-500">
              {Math.round(effectiveAlpha * 100)}%
            </output>
          </div>
        )}

        <p className="mt-2 truncate text-[10px] text-zinc-400" title={currentOverride || resolved || undefined}>
          {currentOverride ? 'Eigener Wert' : resolved ? `Geerbt: ${resolved}` : 'Kein auflösbarer Farbwert'}
        </p>
      </div>
    );
  }

  function renderDesignField(fieldKey: ColorFieldKey) {
    const definition = FIELD_DEFS[fieldKey];
    if (!definition) return null;
    const currentOverride = overrides[definition.cssVar] || '';
    const resolved = computedVars[definition.cssVar] || resolvedVars?.[definition.cssVar] || '';
    const inputId = `${editorId}-${fieldKey}`;
    const descriptionId = `${inputId}-description`;
    return (
      <div key={fieldKey} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-950/[0.02]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-800">{definition.label}</label>
            <p id={descriptionId} className="mt-0.5 text-[11px] leading-4 text-zinc-500">{definition.description}</p>
          </div>
          {renderUsageBadge(fieldKey)}
        </div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-2">
          <input
            id={inputId}
            type="text"
            spellCheck={false}
            autoComplete="off"
            className="admin-input min-w-0 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            placeholder={resolved || 'Geerbter Wert'}
            value={currentOverride}
            aria-describedby={descriptionId}
            onChange={(event) => handleChange(definition.cssVar, event.target.value)}
          />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!currentOverride}
            aria-label={`${definition.label} auf geerbten Wert zurücksetzen`}
            title="Auf geerbten Wert zurücksetzen"
            onClick={() => handleClear(definition.cssVar)}
          >
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  const disclosureButtonClass = 'flex w-full items-center gap-2 rounded-lg px-1 py-2 text-left text-xs font-semibold text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';

  return (
    <details
      className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/70 shadow-sm shadow-zinc-950/[0.03]"
      open={open}
      onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
    >
      <summary className="group flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-blue-600 shadow-sm">
          <Palette size={16} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block">Section-Farben</span>
          <span className="block text-[11px] font-normal text-zinc-500">Live-Rollen gezielt überschreiben</span>
        </span>
        {activeCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
            {activeCount} angepasst
          </span>
        )}
        <ChevronDown size={16} aria-hidden="true" className="text-zinc-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-zinc-200 bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-xs leading-5 text-zinc-600">
            Direkt sichtbar sind nur Farben, die diese Vorschau rendert oder die bereits individuell gesetzt wurden.
          </p>
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${scanState === 'ready' ? 'bg-emerald-50 text-emerald-700' : scanState === 'unavailable' ? 'bg-amber-50 text-amber-700' : 'bg-zinc-100 text-zinc-600'}`}>
            {scanState === 'ready' ? <CheckCircle2 size={12} aria-hidden="true" /> : scanState === 'unavailable' ? <AlertTriangle size={12} aria-hidden="true" /> : <Eye size={12} aria-hidden="true" />}
            {scanState === 'ready' ? 'Mit Vorschau synchronisiert' : scanState === 'unavailable' ? 'Vorschau nicht lesbar' : 'Vorschau wird geprüft'}
          </span>
        </div>

        {sectionType && contractInfo?.source === 'none' && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            Kein Farbvertrag für <strong>{sectionType}</strong>. Bis zur Regenerierung ist nur der Sektionshintergrund verfügbar.
          </div>
        )}
        {scanState === 'unavailable' && contractInfo?.source !== 'none' && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            Ohne lesbare Vorschau bleiben nur Hintergrund und bereits gesetzte Werte offen. Weitere Contract-Rollen findest du klar gekennzeichnet unter „Contract-Reserve“.
          </div>
        )}

        <section className="mt-5" aria-labelledby={`${editorId}-core-title`}>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h3 id={`${editorId}-core-title`} className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">Kernfarben</h3>
              <p className="mt-1 text-[11px] text-zinc-500">Die wichtigsten Flächen, Texte und Conversion-Rollen.</p>
            </div>
            <span className="text-[10px] font-medium text-zinc-400">{fieldGroups.core.length} live</span>
          </div>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {fieldGroups.core.map(renderColorField)}
          </div>
        </section>

        {fieldGroups.coreOverflow.length > 0 && (
          <section className="mt-4 border-t border-zinc-100 pt-2">
            <button
              type="button"
              className={disclosureButtonClass}
              aria-expanded={showCoreOverflow}
              aria-controls={`${editorId}-core-overflow`}
              onClick={() => setShowCoreOverflow((current) => !current)}
            >
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${showCoreOverflow ? 'rotate-180' : ''}`} />
              Weitere live Kernfarben
              <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">{fieldGroups.coreOverflow.length}</span>
            </button>
            {showCoreOverflow && (
              <div id={`${editorId}-core-overflow`} className="mt-2 grid grid-cols-1 gap-3 xl:grid-cols-2">
                {fieldGroups.coreOverflow.map(renderColorField)}
              </div>
            )}
          </section>
        )}

        {fieldGroups.special.length > 0 && (
          <section className="mt-3 border-t border-zinc-100 pt-2">
            <button
              type="button"
              className={disclosureButtonClass}
              aria-expanded={showSpecial}
              aria-controls={`${editorId}-special`}
              onClick={() => setShowSpecial((current) => !current)}
            >
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${showSpecial ? 'rotate-180' : ''}`} />
              Spezialfarben
              <span className="font-normal text-zinc-400">section-spezifische Akzente</span>
              <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">{fieldGroups.special.length}</span>
            </button>
            {showSpecial && (
              <div id={`${editorId}-special`} className="mt-2 grid grid-cols-1 gap-3 xl:grid-cols-2">
                {fieldGroups.special.map(renderColorField)}
              </div>
            )}
          </section>
        )}

        {fieldGroups.design.length > 0 && (
          <section className="mt-3 border-t border-zinc-100 pt-2">
            <button
              type="button"
              className={disclosureButtonClass}
              aria-expanded={showDesign}
              aria-controls={`${editorId}-design`}
              onClick={() => setShowDesign((current) => !current)}
            >
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${showDesign ? 'rotate-180' : ''}`} />
              Design-Tokens
              <span className="font-normal text-zinc-400">Radius, Schatten, Typografie</span>
              <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">{fieldGroups.design.length}</span>
            </button>
            {showDesign && (
              <div id={`${editorId}-design`} className="mt-2 grid grid-cols-1 gap-3 xl:grid-cols-2">
                {fieldGroups.design.map(renderDesignField)}
              </div>
            )}
          </section>
        )}

        {contrastResults.length > 0 && (
          <section className={`mt-5 rounded-xl border px-3.5 py-3 ${contrastWarnings.length > 0 ? 'border-amber-200 bg-amber-50/70' : 'border-emerald-200 bg-emerald-50/70'}`} aria-live="polite">
            <div className="flex items-start gap-2.5">
              {contrastWarnings.length > 0
                ? <AlertTriangle size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-700" />
                : <CheckCircle2 size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-700" />}
              <div className="min-w-0 flex-1">
                <h3 className={`text-xs font-semibold ${contrastWarnings.length > 0 ? 'text-amber-900' : 'text-emerald-900'}`}>
                  {contrastWarnings.length > 0 ? `${contrastWarnings.length} Kontrasthinweis${contrastWarnings.length === 1 ? '' : 'e'}` : 'WCAG-AA-Kontrast erfüllt'}
                </h3>
                {contrastWarnings.length > 0 ? (
                  <>
                    <ul className="mt-2 space-y-1.5">
                      {contrastWarnings.map((warning) => (
                        <li key={warning.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[11px] text-amber-900">
                          <span>{warning.label}</span>
                          <strong className="font-mono">{warning.ratio.toFixed(2).replace('.', ',')}:1 · AA nicht erfüllt</strong>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[10px] leading-4 text-amber-700">Nur ein Hinweis: Farben werden nicht automatisch verändert.</p>
                  </>
                ) : (
                  <p className="mt-1 text-[11px] leading-4 text-emerald-700">Alle {contrastResults.length} erkennbaren Text-/Flächenpaare erreichen mindestens 4,5:1.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {fieldGroups.inactive.length > 0 && (
          <section className="mt-4 border-t border-zinc-200 pt-2">
            <button
              type="button"
              className={disclosureButtonClass}
              aria-expanded={showInactive}
              aria-controls={`${editorId}-inactive`}
              onClick={() => setShowInactive((current) => !current)}
            >
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${showInactive ? 'rotate-180' : ''}`} />
              Contract-Reserve
              <span className="font-normal text-zinc-400">nicht in dieser Vorschau erkannt</span>
              <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">{fieldGroups.inactive.length}</span>
            </button>
            {showInactive && (
              <div id={`${editorId}-inactive`} className="mt-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3">
                <p className="mb-4 text-[11px] leading-4 text-zinc-600">
                  Diese Rollen gehören zum Section-Contract, wurden im aktuellen DOM aber nicht gefunden. Änderungen können ohne sichtbaren Effekt bleiben.
                </p>
                {inactiveGroups.core.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Kernrollen</h4>
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">{inactiveGroups.core.map(renderColorField)}</div>
                  </div>
                )}
                {inactiveGroups.special.length > 0 && (
                  <div className={inactiveGroups.core.length > 0 ? 'mt-5' : ''}>
                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Spezialfarben</h4>
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">{inactiveGroups.special.map(renderColorField)}</div>
                  </div>
                )}
                {inactiveGroups.design.length > 0 && (
                  <div className={inactiveGroups.core.length > 0 || inactiveGroups.special.length > 0 ? 'mt-5' : ''}>
                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Design-Tokens</h4>
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">{inactiveGroups.design.map(renderDesignField)}</div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeCount > 0 && (
          <div className="mt-5 flex flex-col gap-2 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-zinc-500">Setzt alle Section-Werte auf das aktive Designrezept zurück.</p>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              onClick={() => onChange(null)}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Alle zurücksetzen
            </button>
          </div>
        )}

        {open && (
          <div
            ref={probeRef}
            data-style=""
            style={resolvedVars as React.CSSProperties}
            className="hidden"
            aria-hidden="true"
          />
        )}
      </div>
    </details>
  );
}

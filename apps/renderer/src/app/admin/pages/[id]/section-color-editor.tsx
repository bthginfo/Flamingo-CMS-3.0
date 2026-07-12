'use client';

import { useState, useEffect, useCallback, useId, useMemo, useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  Eye,
  Palette,
  PencilLine,
  RotateCcw,
  WandSparkles,
} from 'lucide-react';
import { FIELD_DEFS, sortColorFields, type ColorFieldKey } from '@/lib/section-color-fields';
import {
  ALPHA_CAPABLE_FIELDS,
  composeColorWithAlpha,
  evaluateContrastPairs,
  getCtaStateCoverage,
  groupEditorFields,
  parseColorWithAlpha,
  reconcileEditorColorRoles,
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
  definitionKey?: string | null;
  resolvedVars?: Record<string, string>;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  sectionId?: string;
}

export function SectionColorEditor({
  value,
  onChange,
  sectionType,
  industry,
  definitionKey,
  resolvedVars,
  iframeRef,
  sectionId,
}: SectionColorEditorProps) {
  const probeRef = useRef<HTMLDivElement>(null);
  const editorId = useId();
  const overrides = useMemo(() => migrateLegacyOverrides<ColorOverrides>(value), [value]);
  const contractInfo = useMemo(
    () => (sectionType ? resolveColorContractForSection(sectionType, industry, definitionKey) : null),
    [definitionKey, industry, sectionType],
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
  const [showSurfaces, setShowSurfaces] = useState(false);
  const [showStates, setShowStates] = useState(false);
  const [showDesign, setShowDesign] = useState(false);
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
    setShowSurfaces(false);
    setShowStates(false);
  }, [definitionKey, industry, open, sectionId, sectionType]);

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
    () => groupEditorFields(allFields),
    [allFields],
  );
  const roleDiscovery = useMemo(
    () => reconcileEditorColorRoles(allFields, usedTokens, overrides),
    [allFields, overrides, usedTokens],
  );
  const roleDiscoveryByField = useMemo(
    () => new Map(roleDiscovery.map((role) => [role.field, role])),
    [roleDiscovery],
  );
  const previewVisibleCount = roleDiscovery.filter((role) => role.visibleInPreview).length;
  const overriddenRoleCount = roleDiscovery.filter((role) => role.overridden).length;
  const ctaCoverage = useMemo(() => getCtaStateCoverage(allFields), [allFields]);

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

  function renderRoleBadges(fieldKey: ColorFieldKey) {
    const role = roleDiscoveryByField.get(fieldKey);
    return (
      <div className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Verfügbarkeit dieser Farbrolle">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500"
          aria-label="In dieser Section verfügbar"
          title="In dieser Section verfügbar"
        >
          <CircleCheck size={10} aria-hidden="true" />
          Verfügbar
        </span>
        {role?.visibleInPreview && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <Eye size={10} aria-hidden="true" />
            In Vorschau sichtbar
          </span>
        )}
        {role?.overridden && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            <PencilLine size={10} aria-hidden="true" />
            Individuell gesetzt
          </span>
        )}
      </div>
    );
  }

  function renderGroupCoverage(fields: ColorFieldKey[], label: string) {
    const roles = fields.map((field) => roleDiscoveryByField.get(field)).filter(Boolean);
    const visible = roles.filter((role) => role?.visibleInPreview).length;
    const edited = roles.filter((role) => role?.overridden).length;
    return (
      <span className="section-color-editor__group-coverage" aria-label={`${label}: ${fields.length} verfügbar, ${visible} sichtbar, ${edited} individuell gesetzt`}>
        <span title={`${fields.length} in dieser Section verfügbar`}><CircleCheck size={11} aria-hidden="true" />{fields.length}</span>
        <span className={visible ? 'text-emerald-700' : ''} title={`${visible} in der Vorschau sichtbar`}><Eye size={11} aria-hidden="true" />{visible}</span>
        <span className={edited ? 'text-blue-700' : ''} title={`${edited} individuell gesetzt`}><PencilLine size={11} aria-hidden="true" />{edited}</span>
      </span>
    );
  }

  function renderCtaCoverageMap() {
    if (ctaCoverage.length === 0) return null;
    const scopes = [
      { key: 'primary' as const, label: 'Primär' },
      { key: 'secondary' as const, label: 'Sekundär' },
    ];
    return (
      <aside className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3" aria-labelledby={`${editorId}-cta-coverage-title`}>
        <div className="flex items-start gap-2">
          <WandSparkles size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" />
          <div>
            <h4 id={`${editorId}-cta-coverage-title`} className="text-[11px] font-semibold text-zinc-800">Interaktionen vollständig abgedeckt</h4>
            <p className="mt-0.5 text-[11px] leading-4 text-zinc-500">Editierbare Farben und automatisch berechnete Zustände auf einen Blick.</p>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {scopes.map((scope) => {
            const items = ctaCoverage.filter((item) => item.scope === scope.key);
            if (items.length === 0) return null;
            return (
              <div key={scope.key} className="section-color-editor__cta-row">
                <span className="pt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">{scope.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item.id}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold ${item.mode === 'editable' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-dashed border-zinc-300 bg-white text-zinc-600'}`}
                      title={item.description}
                      aria-label={`${scope.label} ${item.label}: ${item.mode === 'editable' ? 'editierbar' : 'automatisch'}. ${item.description}`}
                    >
                      {item.mode === 'editable' ? <PencilLine size={10} aria-hidden="true" /> : <WandSparkles size={10} aria-hidden="true" />}
                      {item.label} · {item.mode === 'editable' ? 'editierbar' : 'automatisch'}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
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
        <div className="min-w-0">
          <div className="min-w-0">
            <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-800">
              {definition.label}
            </label>
            <p id={descriptionId} className="mt-0.5 text-xs leading-4 text-zinc-500">
              {definition.description}
            </p>
          </div>
          {renderRoleBadges(fieldKey)}
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

        <p className="mt-2 truncate text-[11px] text-zinc-400" title={currentOverride || resolved || undefined}>
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
        <div>
          <div>
            <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-800">{definition.label}</label>
            <p id={descriptionId} className="mt-0.5 text-xs leading-4 text-zinc-500">{definition.description}</p>
          </div>
          {renderRoleBadges(fieldKey)}
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
      className="section-color-editor mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/70 shadow-sm shadow-zinc-950/[0.03]"
      style={{ containerType: 'inline-size', fontFamily: 'Inter, system-ui, sans-serif' }}
      open={open}
      onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
    >
      <summary className="group flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-blue-600 shadow-sm">
          <Palette size={16} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block">Section-Farben</span>
          <span className="block text-[11px] font-normal text-zinc-500">Automatisch aus der Section-Definition erkannt</span>
        </span>
        {activeCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
            {activeCount} angepasst
          </span>
        )}
        <ChevronDown size={16} aria-hidden="true" className="text-zinc-400 transition-transform group-open:rotate-180" />
      </summary>
      <style>{`
        .section-color-editor__intro {
          display: grid;
          grid-template-columns: minmax(15rem, 1fr) auto;
          align-items: start;
          gap: .75rem;
        }
        .section-color-editor__coverage-map {
          display: grid;
          grid-template-columns: repeat(3, minmax(5.25rem, 1fr));
          overflow: hidden;
          border: 1px solid rgb(228 228 231);
          border-radius: .75rem;
          background: rgb(250 250 250);
        }
        .section-color-editor__coverage-map > span {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          column-gap: .35rem;
          min-width: 0;
          padding: .5rem .65rem;
          color: rgb(82 82 91);
        }
        .section-color-editor__coverage-map > span + span { border-left: 1px solid rgb(228 228 231); }
        .section-color-editor__coverage-map strong { font-size: .75rem; line-height: 1rem; color: rgb(39 39 42); }
        .section-color-editor__coverage-map small {
          grid-column: 1 / -1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: .625rem;
          line-height: .875rem;
        }
        .section-color-editor__role-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
          gap: .75rem;
        }
        .section-color-editor__group-heading {
          display: flex;
          flex-wrap: wrap;
          align-items: end;
          justify-content: space-between;
          gap: .5rem .75rem;
        }
        .section-color-editor__group-coverage {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          gap: .25rem;
          color: rgb(161 161 170);
          font-size: .625rem;
          font-weight: 600;
        }
        .section-color-editor__group-coverage > span {
          display: inline-flex;
          align-items: center;
          gap: .2rem;
          border-radius: .375rem;
          background: rgb(244 244 245);
          padding: .2rem .35rem;
        }
        .section-color-editor__cta-row {
          display: grid;
          grid-template-columns: 4.5rem minmax(0, 1fr);
          align-items: start;
          gap: .375rem;
        }
        .section-color-editor__reset-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: .5rem;
        }
        @container (max-width: 36rem) {
          .section-color-editor__intro { grid-template-columns: minmax(0, 1fr); }
          .section-color-editor__coverage-map { width: 100%; }
        }
        @container (max-width: 30rem) {
          .section-color-editor__role-grid { grid-template-columns: minmax(0, 1fr); }
          .section-color-editor__cta-row { grid-template-columns: minmax(0, 1fr); }
          .section-color-editor__reset-row { align-items: stretch; flex-direction: column; }
          .section-color-editor__disclosure-description { display: none; }
        }
        @container (max-width: 22rem) {
          .section-color-editor__coverage-map { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .section-color-editor__coverage-map > span { padding: .45rem .5rem; }
        }
      `}</style>
      <div className="border-t border-zinc-200 bg-white px-4 py-4 sm:px-5">
        <div className="section-color-editor__intro">
          <p className="min-w-0 text-xs leading-5 text-zinc-600">
            Wir prüfen die Section automatisch. Die Vorschau bestätigt zusätzlich, welche Rollen im aktuellen Inhalt sichtbar sind.
          </p>
          <div className="section-color-editor__coverage-map" role="group" aria-label="Abdeckung der Farbrollen">
            <span aria-label={`${allFields.length} in dieser Section verfügbar`} title="In dieser Section verfügbar">
              <CircleCheck size={13} aria-hidden="true" />
              <strong>{allFields.length}</strong>
              <small>Verfügbar</small>
            </span>
            <span className={scanState === 'ready' ? '!text-emerald-700' : ''} aria-label={scanState === 'ready' ? `${previewVisibleCount} in der Vorschau sichtbar` : 'Vorschau optional'} title={scanState === 'ready' ? 'In Vorschau sichtbar' : 'Vorschau optional'}>
              <Eye size={13} aria-hidden="true" />
              <strong>{scanState === 'ready' ? previewVisibleCount : '–'}</strong>
              <small>{scanState === 'checking' ? 'Prüft…' : 'Vorschau'}</small>
            </span>
            <span className={overriddenRoleCount ? '!text-blue-700' : ''} aria-label={`${overriddenRoleCount} individuell gesetzt`} title="Individuell gesetzt">
              <PencilLine size={13} aria-hidden="true" />
              <strong>{overriddenRoleCount}</strong>
              <small>Angepasst</small>
            </span>
          </div>
        </div>

        {sectionType && contractInfo?.source === 'none' && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            Kein Farbvertrag für <strong>{sectionType}</strong>. Bis zur Regenerierung ist nur der Sektionshintergrund verfügbar.
          </div>
        )}
        <section className="mt-5" aria-labelledby={`${editorId}-core-title`}>
          <div className="section-color-editor__group-heading mb-3">
            <div>
              <h3 id={`${editorId}-core-title`} className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">Kernfarben</h3>
              <p className="mt-1 text-[11px] text-zinc-500">Grundfläche, Überschriften und lesbarer Inhalt.</p>
            </div>
            {renderGroupCoverage(fieldGroups.core, 'Kernfarben')}
          </div>
          <div className="section-color-editor__role-grid">
            {fieldGroups.core.map(renderColorField)}
          </div>
        </section>

        {fieldGroups.actions.length > 0 && (
          <section className="mt-5 border-t border-zinc-100 pt-5" aria-labelledby={`${editorId}-actions-title`}>
            <div className="section-color-editor__group-heading mb-3">
              <div>
                <h3 id={`${editorId}-actions-title`} className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">Buttons &amp; Links</h3>
                <p className="mt-1 text-[11px] text-zinc-500">Primäre und ergänzende Handlungsaufforderungen.</p>
              </div>
              {renderGroupCoverage(fieldGroups.actions, 'Buttons und Links')}
            </div>
            <div className="section-color-editor__role-grid">
              {fieldGroups.actions.map(renderColorField)}
            </div>
            {renderCtaCoverageMap()}
          </section>
        )}

        {fieldGroups.surfaces.length > 0 && (
          <section className="mt-4 border-t border-zinc-100 pt-2">
            <button
              type="button"
              className={disclosureButtonClass}
              aria-expanded={showSurfaces}
              aria-controls={`${editorId}-surfaces`}
              onClick={() => setShowSurfaces((current) => !current)}
            >
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${showSurfaces ? 'rotate-180' : ''}`} />
              Karten, Flächen &amp; Medien
              <span className="section-color-editor__disclosure-description font-normal text-zinc-400">sekundäre Oberflächen und Details</span>
              <span className="ml-auto">{renderGroupCoverage(fieldGroups.surfaces, 'Karten, Flächen und Medien')}</span>
            </button>
            {showSurfaces && (
              <div id={`${editorId}-surfaces`} className="section-color-editor__role-grid mt-2">
                {fieldGroups.surfaces.map(renderColorField)}
              </div>
            )}
          </section>
        )}

        {fieldGroups.states.length > 0 && (
          <section className="mt-3 border-t border-zinc-100 pt-2">
            <button
              type="button"
              className={disclosureButtonClass}
              aria-expanded={showStates}
              aria-controls={`${editorId}-states`}
              onClick={() => setShowStates((current) => !current)}
            >
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${showStates ? 'rotate-180' : ''}`} />
              Zustände &amp; Spezialrollen
              <span className="section-color-editor__disclosure-description font-normal text-zinc-400">Hover, Status, Preise und Akzente</span>
              <span className="ml-auto">{renderGroupCoverage(fieldGroups.states, 'Zustände und Spezialrollen')}</span>
            </button>
            {showStates && (
              <div id={`${editorId}-states`} className="section-color-editor__role-grid mt-2">
                {fieldGroups.states.map(renderColorField)}
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
              Form &amp; Typografie
              <span className="section-color-editor__disclosure-description font-normal text-zinc-400">Radius, Schatten, Typografie</span>
              <span className="ml-auto">{renderGroupCoverage(fieldGroups.design, 'Form und Typografie')}</span>
            </button>
            {showDesign && (
              <div id={`${editorId}-design`} className="section-color-editor__role-grid mt-2">
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

        {activeCount > 0 && (
          <div className="section-color-editor__reset-row mt-5 border-t border-zinc-200 pt-4">
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

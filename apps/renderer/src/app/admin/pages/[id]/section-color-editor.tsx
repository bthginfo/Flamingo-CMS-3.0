'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { FIELD_DEFS, sortColorFields, type ColorFieldKey } from '@/lib/section-color-fields';
import { resolveColorContractForSection } from '@/lib/section-color-resolver';
export { FIELD_DEFS, sortColorFields };
export type { ColorFieldKey };

type ColorOverrides = Record<string, string>;

/* ─── Color helpers: rgba ⇆ hex parsing with alpha channel (Phase 4b) ─── */
function clamp01(n: number): number { return Math.max(0, Math.min(1, n)); }
function toHex2(n: number): string { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0'); }

export function parseColorWithAlpha(value: string | undefined): { hex: string; alpha: number | undefined } {
  if (!value) return { hex: '', alpha: undefined };
  const v = value.trim();
  // rgba(r,g,b,a) / rgb(r,g,b)
  const rgba = v.match(/^rgba?\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*(-?\d+(?:\.\d+)?)\s*)?\)$/i);
  if (rgba) {
    const r = Number(rgba[1]); const g = Number(rgba[2]); const b = Number(rgba[3]);
    const a = rgba[4] !== undefined ? clamp01(Number(rgba[4])) : 1;
    return { hex: `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`, alpha: a };
  }
  // #rgb / #rgba / #rrggbb / #rrggbbaa
  const hex = v.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 4) h = h.split('').map((c) => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { hex: `#${h.slice(0, 6).toLowerCase()}`, alpha: a };
  }
  return { hex: '', alpha: undefined };
}

export function composeColorWithAlpha(hex: string, alpha: number | undefined): string {
  const a = alpha === undefined ? 1 : clamp01(alpha);
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  if (clean.length !== 6) return hex;
  if (a >= 0.999) return `#${clean.toLowerCase()}`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

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

export function SectionColorEditor({ value, onChange, sectionType, industry, resolvedVars, iframeRef, sectionId }: { value: ColorOverrides | null; onChange: (overrides: ColorOverrides | null) => void; sectionType?: string; industry?: string; resolvedVars?: Record<string, string>; iframeRef?: React.RefObject<HTMLIFrameElement | null>; sectionId?: string }) {
  const probeRef = useRef<HTMLDivElement>(null);
  const overrides = migrateLegacyOverrides<ColorOverrides>(value);
  const contractInfo = sectionType ? resolveColorContractForSection(sectionType, industry) : null;
  const rawFields = contractInfo?.fields ?? (['sectionBg'] as ColorFieldKey[]);
  // Only count overrides that are actually used by this section (filter out legacy/copied values)
  const relevantCSSVars = new Set(rawFields.map(f => FIELD_DEFS[f]?.cssVar).filter(Boolean));
  const activeCount = Object.entries(overrides).filter(([k, v]) => relevantCSSVars.has(k as string) && v).length;

  // Keep color editor collapsed by default; open only on user interaction.
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showUnused, setShowUnused] = useState(false);
  const [computedVars, setComputedVars] = useState<Record<string, string>>({});
  // Tokens literally present in the rendered section DOM (inline styles AND
  // Tailwind arbitrary-value classes both keep the literal "var(--token-X)"
  // string in outerHTML). Empty when no preview iframe is reachable, in which
  // case we cannot filter and fall back to showing every contract field.
  const [usedTokens, setUsedTokens] = useState<Set<string>>(new Set());
  const allFields = rawFields;
  
  // Split into color fields and design token fields
  const colorFields = sortColorFields(allFields.filter(f => FIELD_DEFS[f]?.type !== 'size'));
  const designFields = allFields.filter(f => FIELD_DEFS[f]?.type === 'size');
  // No grouping — show all color fields flat in one grid.

  // Partition color fields by what the rendered DOM actually paints. When the
  // preview iframe isn't reachable (usedTokens empty) we cannot tell, so we
  // treat every field as active — never hide a control we can't prove is unused.
  const canFilterByDom = usedTokens.size > 0;
  const isFieldLive = (f: ColorFieldKey): boolean => {
    if (!canFilterByDom) return true;
    if (f === 'sectionBg') return true; // background is always meaningful
    const v = FIELD_DEFS[f]?.cssVar;
    if (!v) return false;
    if (overrides[v]) return true; // the user already set it → keep visible
    return usedTokens.has(v);
  };
  const liveColorFields = colorFields.filter(isFieldLive);
  const inactiveColorFields = colorFields.filter(f => !isFieldLive(f));
  const visibleColorFields = showUnused ? colorFields : liveColorFields;

  // All CSS vars we need to read (token-only after Phase 3 cleanup)
  const allVarKeys = allFields.map(f => FIELD_DEFS[f]?.cssVar).filter(Boolean);

  const readComputedStyles = useCallback(() => {
    const result: Record<string, string> = {};

    // Strategy 1: Read from preview iframe (100% accurate)
    if (iframeRef?.current && sectionId) {
      try {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          const el = doc.querySelector(`[data-section-id="${CSS.escape(sectionId)}"]`);
          if (el) {
            // Which tokens does this section ACTUALLY paint? Scan the rendered
            // markup so the editor can hide fields the template never reads.
            const found = new Set<string>();
            const re = /var\(\s*(--token-[\w-]+)\s*(?:,[^)]*)?\)/g;
            let m: RegExpExecArray | null;
            const html = (el as HTMLElement).outerHTML;
            while ((m = re.exec(html)) !== null) found.add(m[1]);
            setUsedTokens(found);

            const styles = getComputedStyle(el);
            for (const v of allVarKeys) {
              const val = styles.getPropertyValue(v).trim();
              if (val) result[v] = val;
            }
            if (Object.keys(result).length > 0) { setComputedVars(result); return; }
          }
        }
      } catch { /* iframe not accessible */ }
    }

    // Strategy 2: Read from local probe element (works without preview)
    if (probeRef.current) {
      const styles = getComputedStyle(probeRef.current);
      for (const v of allVarKeys) {
        const val = styles.getPropertyValue(v).trim();
        if (val) result[v] = val;
      }
    }

    setComputedVars(result);
  }, [iframeRef, sectionId, allVarKeys]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(readComputedStyles, 50);
      return () => clearTimeout(t);
    }
  }, [open, readComputedStyles]);

  // Comprehensive fallback chain for resolving display colors
  const getResolvedColor = (cssVar: string): string | undefined => {
    // 1. Computed from iframe/probe (100% accurate)
    if (computedVars[cssVar]) return computedVars[cssVar];
    // 2. From resolvedVars (style + brand combined)
    if (resolvedVars?.[cssVar]) return resolvedVars[cssVar];
    // 3. Fallback chain for vars that derive from others
    const fallbacks: Record<string, string[]> = {
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
      // --brand-btn-secondary-* intentionally no fallback: no shared template
      // reads these from another var, so showing a borrowed swatch is misleading.
      '--token-badge-bg': ['--brand-primary'],
      '--token-badge-text': ['--brand-primary'],
      '--token-badge-border': ['--brand-primary'],
      '--token-section-bg-alt': ['--style-section-bg'],
      // --style-card-bg intentionally no fallback to section-bg: they are
      // independent in every shared template; suggesting otherwise was confusing.
    };
    const chain = fallbacks[cssVar];
    if (chain) {
      for (const fb of chain) {
        const val = computedVars[fb] || resolvedVars?.[fb];
        if (val) return val;
      }
    }
    return undefined;
  };

  const handleChange = (key: string, color: string) => {
    const next: Record<string, string> = { ...overrides, [key]: color };
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  const handleClear = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    onChange(Object.keys(next).length > 0 ? next : null);
  };

  function renderColorField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar] || '';
    const resolved = getResolvedColor(def.cssVar);
    const displayColor = currentOverride || resolved || '';
    const { hex, alpha } = parseColorWithAlpha(displayColor);
    const overrideAlpha = parseColorWithAlpha(currentOverride).alpha;
    return (
      <label key={fieldKey} className="block">
        <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative">
            <input
              type="color"
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
              value={hex || '#000000'}
              onChange={(e) => handleChange(def.cssVar, composeColorWithAlpha(e.target.value, overrideAlpha ?? alpha))}
            />
            {!currentOverride && resolved && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white" style={{ background: resolved }} title={`Aktuell: ${resolved}`} />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              className="admin-input w-full text-xs font-mono"
              placeholder={resolved || '—'}
              value={currentOverride}
              onChange={(e) => handleChange(def.cssVar, e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(((overrideAlpha ?? alpha) ?? 1) * 100)}
                onChange={(e) => {
                  const a = Number(e.target.value) / 100;
                  const base = hex || '#000000';
                  handleChange(def.cssVar, composeColorWithAlpha(base, a));
                }}
                className="flex-1 h-1 accent-[var(--brand-primary,#0ea5e9)]"
                title="Transparenz (Alpha)"
              />
              <span className="w-10 text-right text-[10px] font-mono text-zinc-500">{Math.round(((overrideAlpha ?? alpha) ?? 1) * 100)}%</span>
            </div>
          </div>
          {currentOverride && (
            <button type="button" className="text-xs text-red-400 hover:text-red-600" onClick={() => handleClear(def.cssVar)}>✕</button>
          )}
        </div>
      </label>
    );
  }

  function renderDesignField(fieldKey: ColorFieldKey) {
    const def = FIELD_DEFS[fieldKey];
    if (!def) return null;
    const currentOverride = overrides[def.cssVar] || '';
    const resolved = computedVars[def.cssVar] || resolvedVars?.[def.cssVar] || '';
    return (
      <label key={fieldKey} className="block">
        <span className="text-gray-600 text-xs" title={def.description}>{def.label}</span>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            className="admin-input flex-1 text-xs font-mono"
            placeholder={resolved || '—'}
            value={currentOverride}
            onChange={(e) => handleChange(def.cssVar, e.target.value)}
          />
          {currentOverride && (
            <button type="button" className="text-xs text-red-400 hover:text-red-600" onClick={() => handleClear(def.cssVar)}>✕</button>
          )}
        </div>
      </label>
    );
  }

  return (
    <details className="mt-4 rounded-lg border border-blue-100 bg-blue-50/30 p-3" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="text-xs font-semibold text-gray-700 cursor-pointer flex items-center gap-2 hover:text-gray-900 transition-colors">
        <Palette size={14} className="text-blue-600" /> 
        <span>Farben anpassen</span>
        {activeCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded-full text-[10px] font-bold">{activeCount} Farben</span>}
      </summary>
      {sectionType && contractInfo?.source === 'none' && (
        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Kein Farbvertrag fuer <strong>{sectionType}</strong> gefunden. Es ist nur Hintergrund aktiv, bis die Section-Contracts regeneriert wurden.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-100">
        {visibleColorFields.map(renderColorField)}
      </div>
      {inactiveColorFields.length > 0 && (
        <button
          type="button"
          className="mt-3 text-xs font-medium text-zinc-500 hover:text-zinc-800 underline"
          onClick={() => setShowUnused(v => !v)}
        >
          {showUnused
            ? 'Nur genutzte Felder zeigen'
            : `Erweitert: ${inactiveColorFields.length} ungenutzte Slots anzeigen`}
        </button>
      )}
      {designFields.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <button type="button" className="text-xs font-medium text-zinc-600 flex items-center gap-1 mb-2 hover:text-zinc-900 transition-colors" onClick={() => setShowAdvanced(!showAdvanced)}>
            <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Design-Tokens (Radius, Schatten)
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {designFields.map(renderDesignField)}
            </div>
          )}
        </div>
      )}
      {activeCount > 0 && (
        <button type="button" className="mt-3 text-xs font-medium text-red-500 hover:text-red-700" onClick={() => onChange(null)}>
          ✕ Alle Farb-Overrides entfernen
        </button>
      )}
      {/* Hidden probe element to read computed CSS vars without needing the preview iframe */}
      {open && <div ref={probeRef} data-style="" style={resolvedVars as React.CSSProperties} className="hidden" aria-hidden="true" />}
    </details>
  );
}

import type { TemplateKey, TenantCustomTheme } from './types.js';

export type ThemePreset = {
  id: string;
  label: string;
  primary: string;
  primaryFg: string;
  accent: string;
  /** Foreground color used on accent-colored buttons. Falls back to primaryFg. */
  accentFg?: string;
  surface: string;
  /** body background */
  bg: string;
  /** body text */
  text: string;
};

export const PRESETS: Record<TemplateKey, ThemePreset[]> = {
  restaurant: [
    { id: 'terracotta', label: 'Terracotta',     primary: '#9a3412', primaryFg: '#fff7ed', accent: '#fb923c', surface: '#fffaf5', bg: '#ffffff', text: '#1c1917' },
    { id: 'olive',      label: 'Olive & Cream',  primary: '#3f6212', primaryFg: '#f7fee7', accent: '#a3e635', surface: '#fafaf3', bg: '#ffffff', text: '#1c1c14' },
    { id: 'wine',       label: 'Wine',           primary: '#7f1d1d', primaryFg: '#fef2f2', accent: '#f87171', surface: '#fdf6f6', bg: '#ffffff', text: '#1f1313' },
    { id: 'espresso',   label: 'Espresso',       primary: '#3e2723', primaryFg: '#fdf6e3', accent: '#c89f6b', surface: '#faf5ee', bg: '#ffffff', text: '#1f1714' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'midnight',   label: 'Midnight',       primary: '#fbbf24', primaryFg: '#0c0a09', accent: '#fbbf24', surface: '#1c1917', bg: '#0c0a09', text: '#f5f5f4' },
  ],
  salon: [
    { id: 'rose',       label: 'Rosé',           primary: '#be185d', primaryFg: '#fff1f5', accent: '#ec4899', surface: '#fff1f5', bg: '#ffffff', text: '#1f1521' },
    { id: 'lavender',   label: 'Lavender',       primary: '#6d28d9', primaryFg: '#f5f3ff', accent: '#a78bfa', surface: '#f7f5ff', bg: '#ffffff', text: '#1c1525' },
    { id: 'champagne',  label: 'Champagne',      primary: '#92400e', primaryFg: '#fffbeb', accent: '#d4a373', surface: '#fdf8f1', bg: '#ffffff', text: '#1f1812' },
    { id: 'mint',       label: 'Mint',           primary: '#0d9488', primaryFg: '#f0fdfa', accent: '#5eead4', surface: '#f0fdfa', bg: '#ffffff', text: '#0c1c1a' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'noir',       label: 'Noir',           primary: '#f5d0fe', primaryFg: '#18181b', accent: '#f5d0fe', surface: '#27272a', bg: '#18181b', text: '#fafafa' },
  ],
  tradesman: [
    { id: 'royal',      label: 'Royal Blue',     primary: '#1d4ed8', primaryFg: '#eff6ff', accent: '#fbbf24', surface: '#f1f5f9', bg: '#ffffff', text: '#0f172a' },
    { id: 'forest',     label: 'Forest',         primary: '#166534', primaryFg: '#f0fdf4', accent: '#84cc16', surface: '#f1f5f0', bg: '#ffffff', text: '#0f1f12' },
    { id: 'industrial', label: 'Industrial',     primary: '#ea580c', primaryFg: '#fff7ed', accent: '#facc15', surface: '#f5f5f4', bg: '#ffffff', text: '#1c1917' },
    { id: 'steel',      label: 'Steel',          primary: '#475569', primaryFg: '#f8fafc', accent: '#fbbf24', surface: '#f1f5f9', bg: '#ffffff', text: '#0f172a' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'slate',      label: 'Slate Pro',      primary: '#0ea5e9', primaryFg: '#f0f9ff', accent: '#0ea5e9', surface: '#1e293b', bg: '#0f172a', text: '#f1f5f9' },
  ],
  hotel: [
    { id: 'goldsand',   label: 'Gold & Sand',    primary: '#92400e', primaryFg: '#fffbeb', accent: '#d4a373', surface: '#faf6ef', bg: '#fffdf8', text: '#1c1812' },
    { id: 'alpine',     label: 'Alpine Slate',   primary: '#1f2937', primaryFg: '#f8fafc', accent: '#cbd5e1', surface: '#f1f5f9', bg: '#ffffff', text: '#0f172a' },
    { id: 'lakeside',   label: 'Lakeside',       primary: '#0c4a6e', primaryFg: '#f0f9ff', accent: '#7dd3fc', surface: '#f0f9ff', bg: '#ffffff', text: '#0c1f2e' },
    { id: 'velvet',     label: 'Velvet',         primary: '#3f1d38', primaryFg: '#fdf4ff', accent: '#c084fc', surface: '#fdf6fb', bg: '#ffffff', text: '#1c0f1a' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'midnight',   label: 'Midnight Suite', primary: '#facc15', primaryFg: '#1c1917', accent: '#facc15', surface: '#1c1917', bg: '#0c0a09', text: '#fafaf9' },
  ],
  tourism: [
    { id: 'horizon',    label: 'Horizon',        primary: '#0369a1', primaryFg: '#f0f9ff', accent: '#fbbf24', surface: '#f0f9ff', bg: '#ffffff', text: '#0c1f2e' },
    { id: 'meadow',     label: 'Meadow',         primary: '#15803d', primaryFg: '#f0fdf4', accent: '#facc15', surface: '#f0fdf4', bg: '#ffffff', text: '#0c1f12' },
    { id: 'sunset',     label: 'Sunset',         primary: '#c2410c', primaryFg: '#fff7ed', accent: '#fde047', surface: '#fff7ed', bg: '#ffffff', text: '#1c0f06' },
    { id: 'glacier',    label: 'Glacier',        primary: '#0e7490', primaryFg: '#ecfeff', accent: '#a5f3fc', surface: '#ecfeff', bg: '#ffffff', text: '#0c1f24' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'aurora',     label: 'Aurora',         primary: '#5eead4', primaryFg: '#0c1c1a', accent: '#5eead4', surface: '#134e4a', bg: '#042f2e', text: '#ecfdf5' },
  ],
  consulting: [
    { id: 'navy',       label: 'Navy',           primary: '#1e3a8a', primaryFg: '#eff6ff', accent: '#60a5fa', surface: '#f1f5f9', bg: '#ffffff', text: '#0f172a' },
    { id: 'graphite',   label: 'Graphite',       primary: '#1f2937', primaryFg: '#f9fafb', accent: '#fbbf24', surface: '#f3f4f6', bg: '#ffffff', text: '#111827' },
    { id: 'sand',       label: 'Sand',           primary: '#78716c', primaryFg: '#fafaf9', accent: '#d4a373', surface: '#fafaf9', bg: '#ffffff', text: '#1c1917' },
    { id: 'burgundy',   label: 'Burgundy',       primary: '#7f1d1d', primaryFg: '#fef2f2', accent: '#d4a373', surface: '#faf5f1', bg: '#ffffff', text: '#1f1313' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'mid-blue',   label: 'Midnight Blue',  primary: '#60a5fa', primaryFg: '#0c1322', accent: '#60a5fa', surface: '#1e293b', bg: '#0f172a', text: '#e2e8f0' },
  ],
  medical: [
    { id: 'cyan',       label: 'Cyan Calm',      primary: '#0e7490', primaryFg: '#ecfeff', accent: '#22d3ee', surface: '#f0fdff', bg: '#ffffff', text: '#0c1f24' },
    { id: 'teal',       label: 'Teal Soft',      primary: '#0f766e', primaryFg: '#f0fdfa', accent: '#5eead4', surface: '#f0fdfa', bg: '#ffffff', text: '#0c1c1a' },
    { id: 'sage',       label: 'Sage',           primary: '#4d7c0f', primaryFg: '#f7fee7', accent: '#a3e635', surface: '#f7fee7', bg: '#ffffff', text: '#1a2010' },
    { id: 'coral',      label: 'Coral',          primary: '#be123c', primaryFg: '#fff1f2', accent: '#fda4af', surface: '#fff5f5', bg: '#ffffff', text: '#1f1314' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'cocoon',     label: 'Cocoon',         primary: '#a5f3fc', primaryFg: '#0c1f24', accent: '#a5f3fc', surface: '#0e7490', bg: '#083344', text: '#ecfeff' },
  ],
  fitness: [
    { id: 'violet',     label: 'Violet',         primary: '#9333ea', primaryFg: '#faf5ff', accent: '#c084fc', surface: '#faf5ff', bg: '#ffffff', text: '#1c1126' },
    { id: 'sunset',     label: 'Sunset',         primary: '#ea580c', primaryFg: '#fff7ed', accent: '#fb923c', surface: '#fff7ed', bg: '#ffffff', text: '#1c0f06' },
    { id: 'lime',       label: 'Lime Energy',    primary: '#365314', primaryFg: '#f7fee7', accent: '#a3e635', surface: '#f7fee7', bg: '#ffffff', text: '#0f1605' },
    { id: 'electric',   label: 'Electric',       primary: '#0ea5e9', primaryFg: '#f0f9ff', accent: '#22d3ee', surface: '#f0f9ff', bg: '#ffffff', text: '#0c1422' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'noir-vio',   label: 'Noir Violet',    primary: '#c084fc', primaryFg: '#1c1126', accent: '#c084fc', surface: '#27272a', bg: '#18181b', text: '#fafafa' },
  ],
  wedding: [
    { id: 'blush',      label: 'Blush & Gold',   primary: '#9f7a5a', primaryFg: '#fdf8f4', accent: '#d4a373', surface: '#fdf8f4', bg: '#fffdfb', text: '#2c2218' },
    { id: 'sage',       label: 'Sage Garden',    primary: '#4d7c5a', primaryFg: '#f0fdf4', accent: '#86efac', surface: '#f3faf5', bg: '#ffffff', text: '#1a2e20' },
    { id: 'lavender',   label: 'Lavender Dream', primary: '#7c5cbf', primaryFg: '#f5f3ff', accent: '#c4b5fd', surface: '#f7f5ff', bg: '#ffffff', text: '#1c1530' },
    { id: 'dusty-rose', label: 'Dusty Rose',     primary: '#b05a6e', primaryFg: '#fdf2f5', accent: '#f9a8c9', surface: '#fdf5f7', bg: '#ffffff', text: '#2c1520' },
    { id: 'mono',       label: 'Mono',           primary: '#111111', primaryFg: '#ffffff', accent: '#111111', surface: '#f5f5f5', bg: '#ffffff', text: '#0a0a0a' },
    { id: 'midnight',   label: 'Midnight Rose',  primary: '#e8b4c8', primaryFg: '#1c1520', accent: '#e8b4c8', surface: '#2c1f28', bg: '#1a1218', text: '#f5eff2' },
  ],
};

export function applyTheme(p: ThemePreset) {
  const r = document.documentElement.style;
  r.setProperty('--brand-color', p.primary);
  r.setProperty('--brand-fg', p.primaryFg);
  // If accent equals primary (e.g. "mono" preset), splitting them on dark
  // surfaces breaks (text-accent invisible on bg-brand). Force a readable
  // accent-on-dark fallback so .bg-brand .text-accent stays visible.
  r.setProperty('--accent-color', p.accent);
  // accent-fg: explicit override, else auto-pick contrasting color from accent luminance
  const accentFg = p.accentFg ?? autoContrastFg(p.accent);
  r.setProperty('--accent-fg', accentFg);
  r.setProperty('--surface-color', p.surface);
  r.setProperty('--bg-color', p.bg);
  r.setProperty('--text-color', p.text);
  // Derive muted + line tokens from the body text color so dark presets
  // (light text on dark bg) get readable secondary text and visible borders
  // automatically, without each component needing to know the theme.
  const textIsLight = autoContrastFg(p.bg) === '#ffffff';
  if (textIsLight) {
    r.setProperty('--muted-color', 'rgba(255,255,255,0.72)');
    r.setProperty('--line-color', 'rgba(255,255,255,0.18)');
  } else {
    r.setProperty('--muted-color', '#6b6b76');
    r.setProperty('--line-color', 'rgba(11,11,16,0.10)');
  }
  // body color sync (Tailwind uses utility classes; we set CSS vars and consume them via body)
  document.body.style.backgroundColor = p.bg;
  document.body.style.color = p.text;
}

/** Prefix for `brand.themePresetId` when the active palette comes from `brand.customThemes`. */
export const CUSTOM_THEME_PREFIX = 'custom:';

/** Returns the custom theme id when `themePresetId` is `custom:<id>`, else null. */
export function parseCustomThemeRef(themePresetId: string | undefined | null): string | null {
  if (!themePresetId?.startsWith(CUSTOM_THEME_PREFIX)) return null;
  const id = themePresetId.slice(CUSTOM_THEME_PREFIX.length);
  return id.length ? id : null;
}

/** Find a preset by id within a template's preset list. Returns null when not found. */
export function getPreset(template: TemplateKey, id: string | undefined | null): ThemePreset | null {
  if (!id || parseCustomThemeRef(id)) return null;
  const list = PRESETS[template];
  if (!list) return null;
  return list.find((p) => p.id === id) ?? null;
}

export function customThemeToPreset(ct: TenantCustomTheme): ThemePreset {
  return {
    id: ct.id,
    label: ct.name,
    primary: ct.primary,
    primaryFg: ct.primaryFg,
    accent: ct.accent,
    accentFg: ct.accentFg,
    surface: ct.surface,
    bg: ct.bg,
    text: ct.text,
  };
}

/**
 * Resolves the active `ThemePreset` from built-in presets or tenant `customThemes`.
 */
export function resolveThemePreset(
  template: TemplateKey,
  themePresetId: string | undefined | null,
  customThemes: readonly TenantCustomTheme[] | undefined,
): ThemePreset | null {
  const customId = parseCustomThemeRef(themePresetId);
  if (customId) {
    const ct = (customThemes ?? []).find((t) => t.id === customId);
    return ct ? customThemeToPreset(ct) : null;
  }
  return getPreset(template, themePresetId);
}

/** Pick black or white as foreground based on hex color luminance. */
function autoContrastFg(hex: string): string {
  const m = hex.replace('#', '');
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  // relative luminance approximation (sRGB)
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.5 ? '#0a0a0a' : '#ffffff';
}

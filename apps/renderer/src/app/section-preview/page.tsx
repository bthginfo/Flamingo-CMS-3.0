import { notFound } from 'next/navigation';
import { getIndustryTemplates } from '@/templates';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { SECTION_EDITOR_FIELD_DEFAULTS } from '@/lib/section-editor-field-defaults';
import { getStyleCssVars } from '@/lib/styles';
import { SectionRenderer } from '@/components/section-renderer';
import {
  PUBLIC_COLOR_FIELD_CSS_VARS,
  PUBLIC_COLOR_FIELD_KEYS,
  getCssVarsForColorField,
} from '@/lib/section-color-fields';

const HERO_PREVIEW_TYPE_BY_INDUSTRY: Record<string, string> = {
  tradesman: 'heroHandwerk',
  restaurant: 'heroRestaurant',
  hotel: 'heroHotel',
  tourism: 'heroTourism',
  salon: 'heroSalon',
  medical: 'heroMedical',
  wedding: 'heroWedding',
  consulting: 'heroConsulting',
  realestate: 'heroRealestate',
  cafe: 'heroCafe',
  tattoo: 'heroTattoo',
  ecommerce: 'heroEcommerce',
};

const AUDIT_STYLE_OVERRIDE_VARS = new Set<string>([
  ...PUBLIC_COLOR_FIELD_CSS_VARS,
  ...PUBLIC_COLOR_FIELD_KEYS.flatMap(getCssVarsForColorField),
]);

function isSafeAuditColorValue(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return /^#[0-9a-f]{6}$/i.test(trimmed) || /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.test(trimmed);
}

function decodeAuditStyleOverrides(raw?: string): Record<string, string> | null {
  if (!raw) return null;
  try {
    const normalized = raw.replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(normalized, 'base64').toString('utf8');
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

    const overrides: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!AUDIT_STYLE_OVERRIDE_VARS.has(key)) continue;
      if (!isSafeAuditColorValue(value)) continue;
      overrides[key] = value.trim();
    }
    return Object.keys(overrides).length ? overrides : null;
  } catch {
    return null;
  }
}

export default async function SectionPreviewPage({ searchParams }: { searchParams: Promise<{ type?: string; industry?: string; style?: string; styleOverrides?: string }> }) {
  const params = await searchParams;
  const { type, industry = 'tradesman' } = params;
  const style = 'classic';
  if (!type) return notFound();

  const templates = getIndustryTemplates(industry);
  const Component = templates[type];
  if (!Component) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--token-section-bg-alt)] px-6 text-center text-sm text-[color:var(--token-muted)]">
        <p>Keine Vorschau für &ldquo;{type}&rdquo; in Branche &ldquo;{industry}&rdquo; verfügbar.</p>
      </main>
    );
  }

  const previewType = type === 'hero' ? HERO_PREVIEW_TYPE_BY_INDUSTRY[industry] || type : type;
  const data = {
    ...(SECTION_EDITOR_FIELD_DEFAULTS[type] || {}),
    ...(SECTION_EDITOR_FIELD_DEFAULTS[previewType] || {}),
    ...(SECTION_PREVIEW_DATA[type] || {}),
    ...(SECTION_PREVIEW_DATA[previewType] || {}),
  };
  const styleCssVars = getStyleCssVars(industry, style);
  const previewSection = {
    id: `preview-${type}`,
    type,
    variant: null,
    visible: true,
    locked: false,
    container: 'default',
    spacingTop: 'm',
    spacingBottom: 'm',
    anchorId: null,
    styleOverrides: decodeAuditStyleOverrides(params.styleOverrides),
    data,
    sortOrder: 0,
  };

  return (
    <div data-style={style} className="min-h-screen bg-[var(--token-page-bg)]" style={styleCssVars as React.CSSProperties}>
      <main>
        {type === 'uspStrip' && <div className="h-24" />}
        <SectionRenderer section={previewSection} styleVariant={style} industry={industry} />
      </main>
    </div>
  );
}

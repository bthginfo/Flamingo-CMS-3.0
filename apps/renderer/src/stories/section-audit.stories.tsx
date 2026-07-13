'use client';

import { useEffect, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionRenderer } from '@/components/section-renderer';
import { DEFAULT_CONTACT_FORM_FIELDS } from '@/lib/contact-form';
import { getSectionSchemas } from '@/lib/section-data-schemas';
import { SECTION_EDITOR_FIELD_DEFAULTS } from '@/lib/section-editor-field-defaults';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { getStyleCssVars } from '@/lib/styles';
import { listSectionDefinitions } from '@/templates';

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

const LIGHT_AUDIT_TOKENS: CSSProperties = {
  '--token-page-bg': '#f8fafc',
  '--token-section-bg': '#ffffff',
  '--token-section-bg-alt': '#f1f5f9',
  '--token-card-bg': '#ffffff',
  '--token-card-border': '#cbd5e1',
  '--token-heading': '#0f172a',
  '--token-body': '#334155',
  '--token-muted': '#64748b',
  '--token-divider': '#cbd5e1',
  '--token-btn-bg': '#0f172a',
  '--token-btn-text': '#ffffff',
  '--token-btn-secondary-bg': '#ffffff',
  '--token-btn-secondary-text': '#0f172a',
  '--token-btn-secondary-border': '#64748b',
} as CSSProperties;

const DARK_AUDIT_TOKENS: CSSProperties = {
  '--token-page-bg': '#020617',
  '--token-section-bg': '#0f172a',
  '--token-section-bg-alt': '#111827',
  '--token-card-bg': '#1e293b',
  '--token-card-border': '#475569',
  '--token-heading': '#f8fafc',
  '--token-body': '#e2e8f0',
  '--token-muted': '#cbd5e1',
  '--token-divider': '#475569',
  '--token-btn-bg': '#f59e0b',
  '--token-btn-text': '#111827',
  '--token-btn-secondary-bg': '#1e293b',
  '--token-btn-secondary-text': '#f8fafc',
  '--token-btn-secondary-border': '#94a3b8',
} as CSSProperties;

const PORTRAIT_IMAGE = svgDataUrl(480, 800, '#1d4ed8', '#dbeafe', 'Portrait 3:5');
const LANDSCAPE_IMAGE = svgDataUrl(1200, 450, '#7c3aed', '#ede9fe', 'Landscape 8:3');
const LOW_QUALITY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

type AuditContentState =
  | 'default'
  | 'minimal'
  | 'twoPortrait'
  | 'oddLandscapeExpanded'
  | 'manyLowQuality'
  | 'missingMedia'
  | 'light'
  | 'dark';

type AuditTarget = {
  definitionKey: string;
  type: string;
  owner: string;
  componentName: string;
};

type SectionAuditProps = {
  targetIndex: number;
  contentState: AuditContentState;
};

declare global {
  interface Window {
    __FLAMINGO_SECTION_AUDIT_TARGETS__?: AuditTarget[];
  }
}

function svgDataUrl(width: number, height: number, background: string, foreground: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${background}"/><circle cx="${Math.round(width * 0.2)}" cy="${Math.round(height * 0.25)}" r="${Math.round(Math.min(width, height) * 0.12)}" fill="${foreground}"/><path d="M0 ${Math.round(height * 0.82)} L${Math.round(width * 0.35)} ${Math.round(height * 0.48)} L${Math.round(width * 0.58)} ${Math.round(height * 0.7)} L${width} ${Math.round(height * 0.35)} V${height} H0Z" fill="${foreground}"/><text x="50%" y="94%" text-anchor="middle" font-family="Arial" font-size="${Math.max(18, Math.round(width / 28))}" font-weight="700" fill="#ffffff">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function meaningfulTargets(): AuditTarget[] {
  const representatives: Array<(typeof definitions)[number]> = [];
  for (const definition of definitions) {
    if (representatives.some((candidate) => candidate.type === definition.type && candidate.component === definition.component)) continue;
    representatives.push(definition);
  }
  return representatives.map((definition) => ({
    definitionKey: definition.key,
    type: definition.type,
    owner: definition.owner,
    componentName: definition.component.displayName || definition.component.name || 'AnonymousSection',
  }));
}

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isTopLevelOptional(descriptor: unknown) {
  if (typeof descriptor !== 'string') return false;
  let round = 0;
  let square = 0;
  let curly = 0;
  for (const character of descriptor) {
    if (character === '(') round += 1;
    else if (character === ')' && round > 0) round -= 1;
    else if (character === '[') square += 1;
    else if (character === ']' && square > 0) square -= 1;
    else if (character === '{') curly += 1;
    else if (character === '}' && curly > 0) curly -= 1;
    else if (character === '?' && round === 0 && square === 0 && curly === 0) return true;
  }
  return false;
}

function schemaFields(owner: string, type: string): Record<string, string> {
  const industry = owner === 'shared' ? 'tradesman' : owner;
  const schema = getSectionSchemas(industry)[type] as { fields?: Record<string, string> } | undefined;
  return schema?.fields || {};
}

function removeOptionalTopLevel(data: Record<string, unknown>, owner: string, type: string) {
  const next = cloneData(data);
  const fields = schemaFields(owner, type);
  for (const [key, descriptor] of Object.entries(fields)) {
    if (isTopLevelOptional(descriptor)) delete next[key];
  }
  return next;
}

function withCloneSuffix(value: unknown, cloneIndex: number): unknown {
  if (Array.isArray(value)) return value.map((item) => withCloneSuffix(item, cloneIndex));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => {
    if (typeof child === 'string' && /^(id|name|title|label|question)$/i.test(key)) {
      return [key, `${child} ${cloneIndex + 1}`];
    }
    return [key, withCloneSuffix(child, cloneIndex)];
  }));
}

function resizeArrays(value: unknown, count: number, arrayDepth = 0): unknown {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    const targetCount = arrayDepth === 0 ? count : Math.min(count, 5);
    return Array.from({ length: targetCount }, (_, index) => {
      const source = value[index % value.length];
      return resizeArrays(withCloneSuffix(cloneData(source), index), count, arrayDepth + 1);
    });
  }
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resizeArrays(child, count, arrayDepth)]));
}

function isTextField(key: string, value: string) {
  if (/^(https?:|mailto:|tel:|data:image)/i.test(value)) return false;
  return /(headline|heading|title|subline|description|text|quote|answer|question|label|name|bio|intro|content|excerpt|note|summary)/i.test(key);
}

function expandText(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(expandText);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => {
    if (typeof child === 'string' && isTextField(key, child)) {
      const longWord = 'Qualitätssicherungsverantwortungsübertragungsdokumentation';
      return [key, `${child} – ${longWord}. Diese bewusst erweiterte deutsche Fassung prüft Übersetzungen, mehrere Sinnabschnitte und realistische lokale Details.\n\nEin zweiter Absatz erzwingt belastbare Zeilenlängen, Kartenhöhen und visuelle Rhythmen, ohne nur Blindtext zu verwenden.`];
    }
    return [key, expandText(child)];
  }));
}

function isMediaKey(key: string) {
  const normalized = key.toLowerCase();
  if (/(alt|position|effect|type|caption|label|width|height|ratio|focal)/.test(normalized)) return false;
  return normalized === 'src'
    || normalized === 'poster'
    || normalized === 'thumbnail'
    || /(image|photo|logo|avatar|backgroundmedia|mediaurl)/.test(normalized);
}

function transformMedia(value: unknown, replacement: string | null): unknown {
  if (Array.isArray(value)) return value.map((item) => transformMedia(item, replacement));
  if (!value || typeof value !== 'object') return value;
  const entries: Array<[string, unknown]> = [];
  for (const [key, child] of Object.entries(value)) {
    if (isMediaKey(key) && typeof child === 'string') {
      if (replacement !== null) entries.push([key, replacement]);
      continue;
    }
    entries.push([key, transformMedia(child, replacement)]);
  }
  return Object.fromEntries(entries);
}

function dataForState(baseData: Record<string, unknown>, target: AuditTarget, contentState: AuditContentState) {
  if (contentState === 'minimal') {
    return resizeArrays(removeOptionalTopLevel(baseData, target.owner, target.type), 1) as Record<string, unknown>;
  }
  if (contentState === 'twoPortrait') {
    return transformMedia(resizeArrays(baseData, 2), PORTRAIT_IMAGE) as Record<string, unknown>;
  }
  if (contentState === 'oddLandscapeExpanded') {
    return transformMedia(expandText(resizeArrays(baseData, 3)), LANDSCAPE_IMAGE) as Record<string, unknown>;
  }
  if (contentState === 'manyLowQuality') {
    return transformMedia(expandText(resizeArrays(baseData, 9)), LOW_QUALITY_IMAGE) as Record<string, unknown>;
  }
  if (contentState === 'missingMedia') {
    return transformMedia(baseData, null) as Record<string, unknown>;
  }
  return cloneData(baseData);
}

const definitions = listSectionDefinitions();
const targets = meaningfulTargets();
function SectionAudit({ targetIndex, contentState }: SectionAuditProps) {
  useEffect(() => {
    window.__FLAMINGO_SECTION_AUDIT_TARGETS__ = targets;
  }, []);

  const target = targets[Number.isInteger(targetIndex) && targetIndex >= 0 && targetIndex < targets.length ? targetIndex : 0];
  const ownerIndustry = target.owner === 'shared' ? 'tradesman' : target.owner;
  const previewType = target.type === 'hero'
    ? HERO_PREVIEW_TYPE_BY_INDUSTRY[ownerIndustry] || target.type
    : target.type;
  const baseData = {
    ...(SECTION_EDITOR_FIELD_DEFAULTS[target.type] || {}),
    ...(SECTION_EDITOR_FIELD_DEFAULTS[previewType] || {}),
    ...(SECTION_PREVIEW_DATA[target.type] || {}),
    ...(SECTION_PREVIEW_DATA[previewType] || {}),
  } as Record<string, unknown>;
  const data = dataForState(baseData, target, contentState);
  const baseStyle = getStyleCssVars(ownerIndustry, 'classic') as CSSProperties;
  const auditStyle = contentState === 'dark'
    ? DARK_AUDIT_TOKENS
    : contentState === 'light'
      ? LIGHT_AUDIT_TOKENS
      : {};
  const readyKey = `${target.definitionKey}|${contentState}`;

  return (
    <div
      data-audit-ready={readyKey}
      data-audit-definition={target.definitionKey}
      data-audit-type={target.type}
      data-audit-owner={target.owner}
      data-audit-state={contentState}
      data-style="classic"
      className="min-h-screen bg-[var(--token-page-bg)]"
      style={{ ...baseStyle, ...auditStyle }}
    >
      <main>
        <SectionRenderer
          industry={ownerIndustry}
          styleVariant="classic"
          globalFormFields={DEFAULT_CONTACT_FORM_FIELDS}
          section={{
            id: `audit-${target.definitionKey}`,
            type: target.type,
            definitionKey: target.definitionKey,
            schemaVersion: 1,
            variant: null,
            visible: true,
            locked: false,
            container: 'default',
            spacingTop: target.type === 'hero' || target.type.endsWith('Hero') ? 'none' : 'm',
            spacingBottom: target.type === 'hero' || target.type.endsWith('Hero') ? 'none' : 'm',
            anchorId: null,
            styleOverrides: null,
            data,
          }}
        />
      </main>
    </div>
  );
}

const meta = {
  title: 'Section Audit/Catalog',
  component: SectionAudit,
  args: {
    targetIndex: 0,
    contentState: 'default',
  },
  argTypes: {
    targetIndex: { control: 'select', options: targets.map((_target, index) => index) },
    contentState: {
      control: 'select',
      options: ['default', 'minimal', 'twoPortrait', 'oddLandscapeExpanded', 'manyLowQuality', 'missingMedia', 'light', 'dark'],
    },
  },
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SectionAudit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

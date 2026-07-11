'use client';

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionRenderer } from '@/components/section-renderer';
import { getSectionTypesForIndustry } from '@/app/admin/pages/[id]/section-types';
import { SECTION_EDITOR_FIELD_DEFAULTS } from '@/lib/section-editor-field-defaults';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { getStyleCssVars } from '@/lib/styles';
import { DEFAULT_CONTACT_FORM_FIELDS } from '@/lib/contact-form';

const INDUSTRIES = [
  'tradesman',
  'restaurant',
  'hotel',
  'tourism',
  'salon',
  'medical',
  'wedding',
  'photography',
  'consulting',
  'realestate',
  'cafe',
  'tattoo',
  'ecommerce',
  'retail',
  'florist',
  'fitness',
  'location',
  'verein',
] as const;

const SECTION_TYPES = getSectionTypesForIndustry('tradesman', { hasShop: true, hasBooking: true })
  .map((section) => section.type)
  .sort((a, b) => a.localeCompare(b));

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

type SectionLabProps = {
  type: string;
  industry: string;
  contentState: 'default' | 'long-copy' | 'minimal';
};

function stressContent(data: Record<string, unknown>): Record<string, unknown> {
  const next = { ...data };
  const suffix = ' – mit einer bewusst langen Formulierung, die Zeilenumbrüche, Kartenhöhen und mobile Layouts zuverlässig prüft.';
  for (const key of ['headline', 'heading', 'title', 'subline', 'description', 'text']) {
    if (typeof next[key] === 'string' && next[key]) next[key] = `${next[key]}${suffix}`;
  }
  return next;
}

function minimalContent(data: Record<string, unknown>): Record<string, unknown> {
  const next = { ...data };
  for (const key of Object.keys(next)) {
    if (Array.isArray(next[key])) next[key] = (next[key] as unknown[]).slice(0, 1);
  }
  return next;
}

function SectionLab({ type, industry, contentState }: SectionLabProps) {
  const previewType = type === 'hero' ? HERO_PREVIEW_TYPE_BY_INDUSTRY[industry] || type : type;
  const baseData = {
    ...(SECTION_EDITOR_FIELD_DEFAULTS[type] || {}),
    ...(SECTION_EDITOR_FIELD_DEFAULTS[previewType] || {}),
    ...(SECTION_PREVIEW_DATA[type] || {}),
    ...(SECTION_PREVIEW_DATA[previewType] || {}),
  } as Record<string, unknown>;
  const data = contentState === 'long-copy'
    ? stressContent(baseData)
    : contentState === 'minimal'
      ? minimalContent(baseData)
      : baseData;
  const style = getStyleCssVars(industry, 'classic') as CSSProperties;

  return (
    <div data-style="classic" className="min-h-screen bg-[var(--token-page-bg)]" style={style}>
      <main>
        <SectionRenderer
          industry={industry}
          styleVariant="classic"
          globalFormFields={DEFAULT_CONTACT_FORM_FIELDS}
          section={{
            id: `storybook-${type}`,
            type,
            variant: null,
            visible: true,
            locked: false,
            container: 'default',
            spacingTop: type === 'hero' || type.endsWith('Hero') ? 'none' : 'm',
            spacingBottom: type === 'hero' || type.endsWith('Hero') ? 'none' : 'm',
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
  title: 'Section Lab/Catalog',
  component: SectionLab,
  args: {
    type: 'cinematicHero',
    industry: 'tradesman',
    contentState: 'default',
  },
  argTypes: {
    type: { control: 'select', options: SECTION_TYPES },
    industry: { control: 'select', options: INDUSTRIES },
    contentState: { control: 'inline-radio', options: ['default', 'long-copy', 'minimal'] },
  },
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SectionLab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const LongCopy: Story = {
  args: { contentState: 'long-copy' },
};

export const MinimalData: Story = {
  args: { contentState: 'minimal' },
};

export const Booking: Story = {
  args: { type: 'bookingWidget', industry: 'hotel' },
};

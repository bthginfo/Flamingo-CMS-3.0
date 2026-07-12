'use client';

import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionColorEditor } from '@/app/admin/pages/[id]/section-color-editor';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getStyleCssVars } from '@/lib/styles';

type ColorEditorPreviewProps = {
  withPreview: boolean;
  viewport: 'wide' | 'narrow';
};

function ColorEditorPreview({ withPreview, viewport }: ColorEditorPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [value, setValue] = useState<Record<string, string> | null>(null);
  const styleVars = getStyleCssVars('salon', 'classic');
  const resolvedVars = { ...styleVars, ...getBrandCssVars({}, styleVars) };

  return (
    <main className="min-h-screen bg-zinc-100 p-4 sm:p-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className={`mx-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ${viewport === 'narrow' ? 'w-[22.5rem] max-w-full' : 'max-w-4xl'}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Hero · Salon</p>
        <h1 className="mt-1 text-lg font-semibold text-zinc-900">Farben der Section</h1>
        <SectionColorEditor
          value={value}
          onChange={setValue}
          sectionType="hero"
          industry="salon"
          definitionKey="hero.salon.v1"
          resolvedVars={resolvedVars}
          iframeRef={withPreview ? iframeRef : undefined}
          sectionId="color-story-hero"
        />
      </div>
      {withPreview && (
        <iframe
          ref={iframeRef}
          title="Testvorschau"
          className="sr-only"
          srcDoc={`<!doctype html><html><body><section data-section-id="color-story-hero" style="--token-section-bg:#ffffff;--token-heading:#0f172a;--token-body:#475569;--token-btn-bg:#0284c7;--token-btn-text:#ffffff;--token-btn-secondary-border:#94a3b8"><h1 style="color:var(--token-heading)">Headline</h1><p style="color:var(--token-body)">Text</p><a class="bg-blue-600" style="background:var(--token-btn-bg);color:var(--token-btn-text)">Termin</a><a style="border:1px solid var(--token-btn-secondary-border)">Mehr</a></section></body></html>`}
        />
      )}
    </main>
  );
}

const meta = {
  title: 'Admin/Section Color Editor',
  component: ColorEditorPreview,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
  args: {
    withPreview: false,
    viewport: 'wide',
  },
  argTypes: {
    viewport: { control: 'inline-radio', options: ['wide', 'narrow'] },
  },
} satisfies Meta<typeof ColorEditorPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PreviewClosed: Story = {};

export const PreviewConnected: Story = {
  args: { withPreview: true },
};

export const NarrowEditor: Story = {
  args: { viewport: 'narrow' },
};

'use client';

import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionColorEditor } from '@/app/admin/pages/[id]/section-color-editor';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getStyleCssVars } from '@/lib/styles';

type ColorEditorPreviewProps = {
  withPreview: boolean;
  viewport: 'wide' | 'narrow';
  derivedRecipe: boolean;
};

function ColorEditorPreview({ withPreview, viewport, derivedRecipe }: ColorEditorPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [value, setValue] = useState<Record<string, string> | null>(null);
  const styleVars = getStyleCssVars('salon', 'classic');
  const resolvedVars = {
    ...styleVars,
    ...getBrandCssVars({}, styleVars),
    ...(derivedRecipe
      ? { '--token-btn-secondary-border': 'color-mix(in srgb, var(--token-accent) 22%, transparent)' }
      : {}),
  };

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
    derivedRecipe: false,
  },
  argTypes: {
    viewport: { control: 'inline-radio', options: ['wide', 'narrow'] },
    derivedRecipe: { control: 'boolean' },
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

export const NarrowDerivedRecipe: Story = {
  args: { viewport: 'narrow', derivedRecipe: true },
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector<HTMLDetailsElement>('details.section-color-editor');
    const editorSummary = editor?.querySelector<HTMLElement>(':scope > summary');
    if (!editor || !editorSummary) throw new Error('Der Color Editor wurde nicht gerendert.');
    editorSummary.click();
    await new Promise((resolve) => window.setTimeout(resolve, 100));

    const compactMatrix = editor.querySelector<HTMLDetailsElement>('.section-color-editor__cta-compact');
    const expandedMatrix = editor.querySelector<HTMLElement>('.section-color-editor__cta-expanded');
    if (!compactMatrix || !expandedMatrix) throw new Error('Die CTA-Interaktionsmatrix fehlt.');
    if (getComputedStyle(compactMatrix).display === 'none') throw new Error('Die kompakte CTA-Matrix ist im schmalen Container nicht sichtbar.');
    if (getComputedStyle(expandedMatrix).display !== 'none') throw new Error('Die breite CTA-Matrix bleibt im schmalen Container sichtbar.');
    if (compactMatrix.open) throw new Error('Die kompakte CTA-Matrix muss zunächst geschlossen sein.');

    const friendlyDerivedLabel = Array.from(editor.querySelectorAll('p')).find((element) =>
      element.textContent?.includes('Automatisch aus der Akzentfarbe abgeleitet'),
    );
    if (!friendlyDerivedLabel) throw new Error('Die verständliche Herkunft der abgeleiteten Farbe fehlt.');

    const technicalDisclosure = Array.from(editor.querySelectorAll<HTMLDetailsElement>('details')).find((element) =>
      element.querySelector('summary')?.textContent?.includes('Technischen Farbwert anzeigen'),
    );
    if (!technicalDisclosure) throw new Error('Das zugängliche technische Farbdetail fehlt.');
    technicalDisclosure.querySelector<HTMLElement>('summary')?.click();
    const technicalValue = technicalDisclosure.querySelector('code')?.textContent?.trim();
    if (technicalValue !== 'color-mix(in srgb, var(--token-accent) 22%, transparent)') {
      throw new Error('Der exakte technische Farbwert wurde nicht bewahrt.');
    }

    compactMatrix.querySelector<HTMLElement>(':scope > summary')?.click();
    if (!compactMatrix.open) throw new Error('Die kompakte CTA-Matrix lässt sich nicht öffnen.');
  },
};

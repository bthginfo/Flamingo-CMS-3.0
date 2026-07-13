import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionRenderer } from '@/components/section-renderer';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { getStyleCssVars } from '@/lib/styles';

function OfferMatcherStory({ data }: { data: Record<string, unknown> }) {
  return (
    <div data-style="classic" className="min-h-screen bg-[var(--token-page-bg)] py-6" style={getStyleCssVars('tradesman', 'classic') as CSSProperties}>
      <SectionRenderer
        industry="tradesman"
        styleVariant="classic"
        section={{
          id: 'storybook-offer-matcher',
          type: 'offerMatcher',
          variant: null,
          visible: true,
          locked: false,
          container: 'default',
          spacingTop: 'm',
          spacingBottom: 'm',
          anchorId: null,
          styleOverrides: null,
          data,
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Section Lab/Offer Matcher',
  component: OfferMatcherStory,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof OfferMatcherStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: SECTION_PREVIEW_DATA.offerMatcher },
};

export const Mobile: Story = {
  args: { data: SECTION_PREVIEW_DATA.offerMatcher },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const MalformedDataRecovery: Story = {
  args: {
    data: {
      ...SECTION_PREVIEW_DATA.offerMatcher,
      questions: [
        null,
        { label: 'Diese unvollstaendige Frage wird ignoriert', options: [{ label: 'Nur eine Antwort' }] },
        ...(SECTION_PREVIEW_DATA.offerMatcher.questions as unknown[]),
        'invalid row',
      ],
      offers: [
        { title: '' },
        ...(SECTION_PREVIEW_DATA.offerMatcher.offers as unknown[]),
        42,
      ],
    },
  },
};

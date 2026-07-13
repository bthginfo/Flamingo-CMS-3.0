import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionRenderer } from '@/components/section-renderer';
import { getStyleCssVars } from '@/lib/styles';

const section = {
  id: 'mobile-action-dock-story',
  type: 'mobileActionDock',
  variant: null,
  visible: true,
  locked: false,
  container: 'default' as const,
  spacingTop: 'none' as const,
  spacingBottom: 'none' as const,
  anchorId: null,
  styleOverrides: null,
  data: {
    compactLabel: 'Wie können wir helfen?',
    revealAfterScroll: false,
    desktopMode: 'inline',
    actions: [
      { kind: 'call', label: 'Anrufen', href: 'tel:+49891234567', icon: 'Phone' },
      { kind: 'route', label: 'Route', href: 'https://www.google.com/maps', icon: 'MapPin' },
      { kind: 'booking', label: 'Termin', href: '#termin', icon: 'CalendarCheck' },
    ],
  },
};

function Preview() {
  return (
    <main className="min-h-[110vh] bg-[var(--token-page-bg)] pt-12" style={getStyleCssVars('tradesman', 'classic') as CSSProperties}>
      <div className="mx-auto max-w-3xl px-6 pb-20">
        <p className="text-sm text-zinc-500">Auf Mobilgeräten bleibt die Leiste sicher über der Safe Area. Desktop zeigt die optionale Inline-Variante.</p>
      </div>
      <SectionRenderer industry="tradesman" styleVariant="classic" section={section} />
    </main>
  );
}

const meta = {
  title: 'Section Lab/Mobile Action Dock',
  component: Preview,
  parameters: { layout: 'fullscreen', a11y: { test: 'error' } },
} satisfies Meta<typeof Preview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {};

export const NarrowMobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

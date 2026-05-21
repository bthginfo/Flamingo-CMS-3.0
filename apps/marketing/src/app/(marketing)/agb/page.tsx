import type { Metadata } from 'next';
import { AgbPage } from './agb-client';

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Allgemeine Geschäftsbedingungen von FlamingoMedia.',
  alternates: { canonical: '/agb' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <AgbPage />;
}

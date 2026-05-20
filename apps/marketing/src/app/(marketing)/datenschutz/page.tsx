import type { Metadata } from 'next';
import { DatenschutzPage } from './datenschutz-client';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung gemäß DSGVO für FlamingoMedia.',
  alternates: { canonical: '/datenschutz' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <DatenschutzPage />;
}

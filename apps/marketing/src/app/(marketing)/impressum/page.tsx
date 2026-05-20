import type { Metadata } from 'next';
import { ImpressumPage } from './impressum-client';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und Angaben gemäß § 5 TMG / § 25 MedienG für FlamingoMedia.',
  alternates: { canonical: '/impressum' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ImpressumPage />;
}

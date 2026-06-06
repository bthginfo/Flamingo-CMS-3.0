import type { Metadata } from 'next';
import { NutzungsbedingungenPage } from './nutzungsbedingungen-client';

export const metadata: Metadata = {
  title: 'Nutzungsbedingungen FlamingoMedia-Plattform',
  description:
    'Nutzungsbedingungen für die FlamingoMedia-CMS-Plattform und ihre Integrationen (Instagram, Google, Stripe u. a.).',
  alternates: { canonical: '/nutzungsbedingungen' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <NutzungsbedingungenPage />;
}

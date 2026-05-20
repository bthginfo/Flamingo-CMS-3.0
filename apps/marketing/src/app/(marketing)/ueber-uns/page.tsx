import type { Metadata } from 'next';
import { UeberUnsPage } from './ueber-uns-client';

export const metadata: Metadata = {
  title: 'Über uns – Studio für lokale Marken',
  description:
    'FlamingoMedia ist ein Studio für Websites, Fotografie und Video in Innsbruck. Zwei Menschen, ein klarer Anspruch: handwerkliche Qualität für inhabergeführte Betriebe in der DACH-Region.',
  alternates: { canonical: '/ueber-uns' },
  openGraph: {
    title: 'Über uns · FlamingoMedia',
    description: 'Studio für lokale Marken in der DACH-Region. Wer wir sind, wie wir arbeiten.',
  },
};

export default function Page() {
  return <UeberUnsPage />;
}

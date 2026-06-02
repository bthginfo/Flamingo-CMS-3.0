import type { Metadata } from 'next';
import { BookingPage } from './booking-client';

export const metadata: Metadata = {
  title: 'Booking-Addon – Reservierungen und Termine direkt auf Deiner Website · FlamingoMedia',
  description:
    'Mit dem Flamingo Booking-Addon verwaltest Du Anfragen, direkte Buchungen, Ressourcen, Tagespläne, Sperrzeiten und automatische E-Mails direkt im CMS.',
  alternates: { canonical: '/booking' },
  openGraph: {
    title: 'Booking-Addon · FlamingoMedia',
    description:
      'Reservierungen, Termine, Ressourcen und Kalender als Add-on für Deine Flamingo-Website. Direkt im CMS steuerbar.',
  },
};

export default function Page() {
  return <BookingPage />;
}

import type { Metadata } from 'next';
import { ShopPage } from './shop-client';

export const metadata: Metadata = {
  title: 'Shop-Addon – Online-Shop direkt in Deiner Website · FlamingoMedia',
  description:
    'Verkaufe Produkte direkt auf Deiner Flamingo-Website. Stripe, PayPal, Versand, Rechnungen und mehr — ohne externes Shopsystem.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop-Addon · FlamingoMedia',
    description:
      'Vollwertiger Online-Shop als Add-on für Deine Flamingo-Website. Produkte, Checkout, Zahlung und Versand — nahtlos integriert.',
  },
};

export default function Page() {
  return <ShopPage />;
}

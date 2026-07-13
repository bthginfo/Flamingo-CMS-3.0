import type { Metadata } from 'next';
import { ShopPage } from './shop-client';

export const metadata: Metadata = {
  title: 'Shop-Addon – Online-Shop direkt in Deiner Website',
  description:
    'Verkaufe Produkte direkt auf Deiner Flamingo-Website. Online-Shop mit Produkten, Kategorien, Warenkorb, Stripe, PayPal, Versand, Rechnungen und CMS-Admin.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop-Addon · FlamingoMedia',
    description:
      'Vollwertiger Online-Shop als Add-on: Produkte, Checkout, Zahlung, Versand und Rechnungen nahtlos in Deiner Website.',
  },
};

export default function Page() {
  return <ShopPage />;
}

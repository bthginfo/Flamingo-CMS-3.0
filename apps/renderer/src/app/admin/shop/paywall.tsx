'use client';

import { ShoppingBag, Check } from 'lucide-react';
import { activateShopAddon } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ShopPaywall() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleActivate() {
    setLoading(true);
    await activateShopAddon();
    router.refresh();
  }

  const features = [
    'Unbegrenzte Produkte & Kategorien',
    'Varianten (Größe, Farbe, etc.)',
    'Stripe, PayPal, Vorkasse, Abholung',
    'Bestellverwaltung & Statusverlauf',
    'Automatische Rechnungen (PDF)',
    'Coupons & Aktions-Rabatte',
    'Versandzonen & Methoden',
    'E-Mail-Benachrichtigungen',
    'Warenwirtschaft & Low-Stock-Alerts',
    'Digitale Produkte (Download)',
  ];

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="text-white" size={32} />
      </div>
      <h1 className="text-3xl font-bold mb-3">Shop-Modul</h1>
      <p className="text-zinc-500 mb-8 text-lg">
        Erweitere deine Website um einen vollwertigen Online-Shop.
      </p>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 md:p-8 text-left mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2">
              <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-700">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold">999€</p>
            <p className="text-xs text-zinc-500">einmalig / Self-Service</p>
          </div>
          <div className="hidden sm:block w-px bg-zinc-200" />
          <div className="text-center">
            <p className="text-2xl font-bold">1.450€</p>
            <p className="text-xs text-zinc-500">einmalig / inkl. Einrichtung</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleActivate}
        disabled={loading}
        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Wird aktiviert…' : 'Shop-Modul aktivieren'}
      </button>

      <p className="text-xs text-zinc-400 mt-4">
        Braucht ihr Hilfe?{' '}
        <a href="mailto:hello@flamingomedia.online?subject=Shop-Einrichtung%20Anfrage" className="underline hover:text-zinc-600">
          Flamingo Media kontaktieren →
        </a>
      </p>
    </div>
  );
}

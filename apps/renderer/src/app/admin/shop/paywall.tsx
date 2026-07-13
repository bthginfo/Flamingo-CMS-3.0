'use client';

import { ShoppingBag, Check, Send } from 'lucide-react';
import { requestShopAddon } from './actions';
import { useState } from 'react';

export function ShopPaywall() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await requestShopAddon(message);
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Die Anfrage konnte nicht gesendet werden.');
    } finally {
      setLoading(false);
    }
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

      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <Check size={32} className="text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800">Anfrage gesendet!</p>
          <p className="text-sm text-green-700 mt-1">
            Wir melden uns in Kürze bei dir. Du wirst benachrichtigt, sobald das Shop-Modul für dich freigeschaltet ist.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
              {error}
            </div>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optionale Nachricht (z.B. gewünschter Umfang, Fragen, Zeitrahmen…)"
            className="w-full border border-zinc-200 rounded-xl p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-pink-300"
            maxLength={2000}
            aria-label="Optionale Nachricht zur Shop-Anfrage"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            <Send size={18} />
            {loading ? 'Wird gesendet…' : 'Anfrage absenden'}
          </button>
          <p className="text-xs text-zinc-400">
            Das Shop-Modul wird nach Freigabe durch unser Team aktiviert.
          </p>
        </form>
      )}
    </div>
  );
}

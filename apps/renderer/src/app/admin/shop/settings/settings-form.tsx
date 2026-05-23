'use client';

import { useState } from 'react';
import { saveShopSettings } from '../actions';
import { useRouter } from 'next/navigation';
import { Save, Info } from 'lucide-react';

type Settings = {
  currency: string;
  currencySymbol: string;
  paymentMethods: string[];
  bankDetails: { iban: string; bic: string; bankName: string; accountHolder: string } | null;
  pickupEnabled: boolean;
  pickupInstructions: string | null;
  stripePublicKey: string | null;
  stripeSecretKey: string | null;
  stripeWebhookSecret: string | null;
  paypalClientId: string | null;
  paypalSecret: string | null;
  paypalMode: string;
  orderPrefix: string;
  invoicePrefix: string;
  notificationEmail: string | null;
  lowStockThreshold: number;
};

export function ShopSettingsForm({ initial }: { initial: Settings | null | undefined }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Settings>({
    currency: initial?.currency || 'EUR',
    currencySymbol: initial?.currencySymbol || '€',
    paymentMethods: initial?.paymentMethods || [],
    bankDetails: initial?.bankDetails || null,
    pickupEnabled: initial?.pickupEnabled || false,
    pickupInstructions: initial?.pickupInstructions || null,
    stripePublicKey: initial?.stripePublicKey || null,
    stripeSecretKey: initial?.stripeSecretKey || null,
    stripeWebhookSecret: initial?.stripeWebhookSecret || null,
    paypalClientId: initial?.paypalClientId || null,
    paypalSecret: initial?.paypalSecret || null,
    paypalMode: initial?.paypalMode || 'sandbox',
    orderPrefix: initial?.orderPrefix || 'FM',
    invoicePrefix: initial?.invoicePrefix || 'RE',
    notificationEmail: initial?.notificationEmail || null,
    lowStockThreshold: initial?.lowStockThreshold || 5,
  });

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  function togglePayment(method: string) {
    const arr = data.paymentMethods.includes(method)
      ? data.paymentMethods.filter(m => m !== method)
      : [...data.paymentMethods, method];
    set('paymentMethods', arr);
  }

  async function handleSave() {
    setSaving(true);
    await saveShopSettings(data);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Help banner */}
      <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={18} className="text-pink-500 mt-0.5 shrink-0" />
        <div className="text-sm text-zinc-700">
          <strong>Braucht ihr Hilfe bei der Shop-Einrichtung?</strong><br />
          Unser Team übernimmt die komplette Konfiguration —{' '}
          <a href="mailto:hello@flamingomedia.online?subject=Shop-Einrichtung%20Anfrage" className="text-pink-600 underline">Anfrage senden →</a>
        </div>
      </div>

      {/* General */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Allgemein</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Währung</label>
            <input value={data.currency} onChange={e => set('currency', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Symbol</label>
            <input value={data.currencySymbol} onChange={e => set('currencySymbol', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Bestellnr.-Prefix</label>
            <input value={data.orderPrefix} onChange={e => set('orderPrefix', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Rechnungs-Prefix</label>
            <input value={data.invoicePrefix} onChange={e => set('invoicePrefix', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
            <p className="text-xs text-zinc-400 mt-1">Format: {data.invoicePrefix}-{new Date().getFullYear()}-0001</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Benachrichtigungs-E-Mail</label>
            <input value={data.notificationEmail || ''} onChange={e => set('notificationEmail', e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="shop@example.de" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Low-Stock Schwellwert</label>
            <input type="number" min="0" value={data.lowStockThreshold} onChange={e => set('lowStockThreshold', parseInt(e.target.value || '5'))} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Zahlungsarten</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['stripe', 'paypal', 'prepayment', 'pickup'].map(m => (
            <label key={m} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${data.paymentMethods.includes(m) ? 'border-pink-300 bg-pink-50' : 'border-zinc-200'}`}>
              <input type="checkbox" checked={data.paymentMethods.includes(m)} onChange={() => togglePayment(m)} className="rounded" />
              <span className="text-sm font-medium capitalize">{m === 'prepayment' ? 'Vorkasse' : m === 'pickup' ? 'Abholung' : m === 'stripe' ? 'Stripe (Karte)' : 'PayPal'}</span>
            </label>
          ))}
        </div>

        {/* Stripe config */}
        {data.paymentMethods.includes('stripe') && (
          <div className="border-t border-zinc-100 pt-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase">Stripe-Konfiguration</h3>
            <p className="text-xs text-zinc-400">Erstelle ein Konto auf stripe.com → Developers → API Keys</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Publishable Key</label>
                <input value={data.stripePublicKey || ''} onChange={e => set('stripePublicKey', e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" placeholder="pk_live_..." />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Secret Key</label>
                <input type="password" value={data.stripeSecretKey || ''} onChange={e => set('stripeSecretKey', e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" placeholder="sk_live_..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-zinc-500 mb-1">Webhook Secret</label>
                <input type="password" value={data.stripeWebhookSecret || ''} onChange={e => set('stripeWebhookSecret', e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" placeholder="whsec_..." />
              </div>
            </div>
          </div>
        )}

        {/* PayPal config */}
        {data.paymentMethods.includes('paypal') && (
          <div className="border-t border-zinc-100 pt-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase">PayPal-Konfiguration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Client ID</label>
                <input value={data.paypalClientId || ''} onChange={e => set('paypalClientId', e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Secret</label>
                <input type="password" value={data.paypalSecret || ''} onChange={e => set('paypalSecret', e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Modus</label>
              <select value={data.paypalMode} onChange={e => set('paypalMode', e.target.value)} className="px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white">
                <option value="sandbox">Sandbox (Test)</option>
                <option value="live">Live</option>
              </select>
            </div>
          </div>
        )}

        {/* Bank transfer */}
        {data.paymentMethods.includes('prepayment') && (
          <div className="border-t border-zinc-100 pt-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase">Vorkasse / Banküberweisung</h3>
            <p className="text-xs text-zinc-400">Käufer erhalten eine E-Mail mit deinen Bankdaten nach Bestellung.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Kontoinhaber</label>
                <input value={data.bankDetails?.accountHolder || ''} onChange={e => set('bankDetails', { ...(data.bankDetails || { iban: '', bic: '', bankName: '', accountHolder: '' }), accountHolder: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">IBAN</label>
                <input value={data.bankDetails?.iban || ''} onChange={e => set('bankDetails', { ...(data.bankDetails || { iban: '', bic: '', bankName: '', accountHolder: '' }), iban: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" placeholder="DE89..." />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">BIC</label>
                <input value={data.bankDetails?.bic || ''} onChange={e => set('bankDetails', { ...(data.bankDetails || { iban: '', bic: '', bankName: '', accountHolder: '' }), bic: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Bankname</label>
                <input value={data.bankDetails?.bankName || ''} onChange={e => set('bankDetails', { ...(data.bankDetails || { iban: '', bic: '', bankName: '', accountHolder: '' }), bankName: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Pickup */}
        {data.paymentMethods.includes('pickup') && (
          <div className="border-t border-zinc-100 pt-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase">Abholung</h3>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={data.pickupEnabled} onChange={e => set('pickupEnabled', e.target.checked)} className="rounded" />
              Abholung aktivieren
            </label>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Abholanweisungen</label>
              <textarea value={data.pickupInstructions || ''} onChange={e => set('pickupInstructions', e.target.value || null)} rows={3} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm resize-y" placeholder="Adresse, Öffnungszeiten, Hinweise..." />
            </div>
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition disabled:opacity-50"
      >
        <Save size={16} /> {saving ? 'Speichern…' : 'Einstellungen speichern'}
      </button>
    </div>
  );
}

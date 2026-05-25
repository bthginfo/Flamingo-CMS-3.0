'use client';

import { useState } from 'react';
import { saveShopSettings } from '../actions';
import { useRouter } from 'next/navigation';
import { Save, Info } from 'lucide-react';
import { toast } from 'sonner';

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
  sumupApiKey: string | null;
  sumupMerchantCode: string | null;
  sumupMode: string;
  orderPrefix: string;
  invoicePrefix: string;
  notificationEmail: string | null;
  lowStockThreshold: number;
  companyInfo: { name: string; street: string; zip: string; city: string; country: string; email?: string; phone?: string; taxId?: string; vatId?: string; registerCourt?: string; registerNumber?: string; ceo?: string } | null;
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
    sumupApiKey: initial?.sumupApiKey || null,
    sumupMerchantCode: initial?.sumupMerchantCode || null,
    sumupMode: initial?.sumupMode || 'sandbox',
    orderPrefix: initial?.orderPrefix || 'FM',
    invoicePrefix: initial?.invoicePrefix || 'RE',
    notificationEmail: initial?.notificationEmail || null,
    lowStockThreshold: initial?.lowStockThreshold || 5,
    companyInfo: initial?.companyInfo || null,
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
    try {
      await saveShopSettings(data);
      toast.success('Einstellungen gespeichert');
    } catch {
      toast.error('Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
      router.refresh();
    }
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
            <p className="text-xs text-zinc-400 mt-1">Format: {data.invoicePrefix}-2025-0001</p>
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
        <h2 className="font-semibold text-sm text-zinc-700">Firmendaten (Rechnungspflichtangaben)</h2>
        <p className="text-xs text-zinc-400">Diese Daten erscheinen auf jeder Rechnung als Absender.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Firmenname *</label>
            <input value={data.companyInfo?.name || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="Meine Firma GmbH" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Geschäftsführer / Inhaber</label>
            <input value={data.companyInfo?.ceo || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), ceo: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="Max Mustermann" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Straße *</label>
            <input value={data.companyInfo?.street || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), street: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="Musterstraße 1" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">PLZ *</label>
              <input value={data.companyInfo?.zip || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), zip: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-zinc-500 mb-1">Ort *</label>
              <input value={data.companyInfo?.city || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), city: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">E-Mail</label>
            <input value={data.companyInfo?.email || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="rechnung@firma.de" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Telefon</label>
            <input value={data.companyInfo?.phone || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Steuernummer</label>
            <input value={data.companyInfo?.taxId || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), taxId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="123/456/78901" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">USt-IdNr.</label>
            <input value={data.companyInfo?.vatId || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), vatId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="DE123456789" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Registergericht</label>
            <input value={data.companyInfo?.registerCourt || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), registerCourt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="Amtsgericht München" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Registernummer</label>
            <input value={data.companyInfo?.registerNumber || ''} onChange={e => set('companyInfo', { ...(data.companyInfo || { name: '', street: '', zip: '', city: '', country: 'DE' }), registerNumber: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="HRB 12345" />
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Zahlungsarten</h2>

        {/* Payment info accordion */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800 font-medium">Welche Zahlungsart ist die richtige für mich?</p>
          </div>
          <details className="text-sm text-blue-800 ml-6">
            <summary className="cursor-pointer font-medium hover:underline">Stripe (Kreditkarte, Apple Pay, Google Pay)</summary>
            <div className="mt-2 space-y-1 text-blue-700 text-xs leading-relaxed">
              <p><strong>Empfohlen für:</strong> Alle Shops die Kartenzahlung akzeptieren möchten.</p>
              <p><strong>Gebühren:</strong> 1,5% + 0,25€ pro Transaktion (EU-Karten). Keine monatliche Grundgebühr.</p>
              <p><strong>Einrichtung:</strong></p>
              <ol className="list-decimal ml-4 space-y-0.5">
                <li>Erstelle ein Konto auf <a href="https://dashboard.stripe.com/register" target="_blank" className="underline">stripe.com</a></li>
                <li>Verifiziere dein Unternehmen (Ausweisdokument + Handelsregistereintrag)</li>
                <li>Gehe zu Developers → API Keys</li>
                <li>Kopiere den Publishable Key (pk_live_...) und Secret Key (sk_live_...)</li>
                <li>Für Webhooks: Developers → Webhooks → Add Endpoint → URL: <code className="bg-blue-100 px-1 rounded">deine-domain.de/api/shop/stripe-webhook</code></li>
                <li>Kopiere den Webhook Signing Secret (whsec_...)</li>
              </ol>
              <p className="mt-1"><strong>Tipp:</strong> Teste erst im Test-Modus (tk_test_ / sk_test_), bevor du live gehst.</p>
            </div>
          </details>
          <details className="text-sm text-blue-800 ml-6">
            <summary className="cursor-pointer font-medium hover:underline">PayPal</summary>
            <div className="mt-2 space-y-1 text-blue-700 text-xs leading-relaxed">
              <p><strong>Empfohlen für:</strong> Shops mit Kunden die PayPal bevorzugen (sehr verbreitet in DE).</p>
              <p><strong>Gebühren:</strong> 2,49% + 0,35€ pro Transaktion (im Inland).</p>
              <p><strong>Einrichtung:</strong></p>
              <ol className="list-decimal ml-4 space-y-0.5">
                <li>Erstelle ein PayPal Business-Konto auf <a href="https://www.paypal.com/de/business" target="_blank" className="underline">paypal.com/business</a></li>
                <li>Gehe zum <a href="https://developer.paypal.com/dashboard/applications" target="_blank" className="underline">Developer Dashboard</a></li>
                <li>Erstelle eine neue App unter &quot;Apps &amp; Credentials&quot;</li>
                <li>Kopiere Client ID und Secret</li>
                <li>Wechsle auf &quot;Live&quot; wenn du bereit bist (oben rechts im Developer Dashboard)</li>
              </ol>
              <p className="mt-1"><strong>Tipp:</strong> Starte mit Sandbox zum Testen. Die Credentials sind unterschiedlich für Sandbox/Live!</p>
            </div>
          </details>
          <details className="text-sm text-blue-800 ml-6">
            <summary className="cursor-pointer font-medium hover:underline">SumUp (Online-Zahlung)</summary>
            <div className="mt-2 space-y-1 text-blue-700 text-xs leading-relaxed">
              <p><strong>Empfohlen für:</strong> Shops die bereits SumUp für Kartenzahlung nutzen (z.B. im Geschäft).</p>
              <p><strong>Gebühren:</strong> 2,5% pro Online-Transaktion. Keine monatliche Gebühr.</p>
              <p><strong>Einrichtung:</strong></p>
              <ol className="list-decimal ml-4 space-y-0.5">
                <li>Melde dich auf <a href="https://me.sumup.com/settings/developer" target="_blank" className="underline">me.sumup.com</a> an</li>
                <li>Gehe zu Developer Settings → API Keys</li>
                <li>Erstelle einen neuen API Key (Typ: Secret Key)</li>
                <li>Notiere deinen Merchant Code (unter Account → Profil)</li>
              </ol>
              <p className="mt-1"><strong>Tipp:</strong> Nutze einen Sandbox-Account zum Testen. Erstelle ihn unter Developer Settings → Sandboxes.</p>
            </div>
          </details>
          <details className="text-sm text-blue-800 ml-6">
            <summary className="cursor-pointer font-medium hover:underline">Vorkasse (Banküberweisung)</summary>
            <div className="mt-2 space-y-1 text-blue-700 text-xs leading-relaxed">
              <p><strong>Empfohlen für:</strong> Shops die keine Gebühren zahlen möchten oder hochpreisige Artikel verkaufen.</p>
              <p><strong>Gebühren:</strong> Keine (nur normale Kontoführungsgebühren deiner Bank).</p>
              <p><strong>So funktioniert es:</strong> Der Kunde bestellt → erhält eine E-Mail mit deinen Bankdaten → überweist den Betrag → du bestätigst den Zahlungseingang manuell → Bestellung wird versendet.</p>
              <p><strong>Nachteil:</strong> Der Bestellprozess dauert länger, da du den Zahlungseingang manuell prüfen musst.</p>
            </div>
          </details>
          <details className="text-sm text-blue-800 ml-6">
            <summary className="cursor-pointer font-medium hover:underline">Abholung (Barzahlung vor Ort)</summary>
            <div className="mt-2 space-y-1 text-blue-700 text-xs leading-relaxed">
              <p><strong>Empfohlen für:</strong> Lokale Geschäfte mit Laufkundschaft (Bäckerei, Vinothek, etc.).</p>
              <p><strong>Gebühren:</strong> Keine.</p>
              <p><strong>So funktioniert es:</strong> Der Kunde bestellt online → kommt zu dir ins Geschäft → bezahlt dort bar oder mit Karte. Du kannst Abholanweisungen (Adresse, Öffnungszeiten) hinterlegen.</p>
            </div>
          </details>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['stripe', 'paypal', 'sumup', 'prepayment', 'pickup'].map(m => (
            <label key={m} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${data.paymentMethods.includes(m) ? 'border-pink-300 bg-pink-50' : 'border-zinc-200'}`}>
              <input type="checkbox" checked={data.paymentMethods.includes(m)} onChange={() => togglePayment(m)} className="rounded" />
              <span className="text-sm font-medium capitalize">{m === 'prepayment' ? 'Vorkasse' : m === 'pickup' ? 'Abholung' : m === 'stripe' ? 'Stripe (Karte)' : m === 'sumup' ? 'SumUp' : 'PayPal'}</span>
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

        {/* SumUp config */}
        {data.paymentMethods.includes('sumup') && (
          <div className="border-t border-zinc-100 pt-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase">SumUp-Konfiguration</h3>
            <p className="text-xs text-zinc-400">Erstelle einen API Key auf <a href="https://me.sumup.com/settings/developer" target="_blank" className="underline">developer.sumup.com</a> → Developer Settings → API Keys</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">API Key</label>
                <input type="password" value={data.sumupApiKey || ''} onChange={e => set('sumupApiKey', e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" placeholder="sup_sk_..." />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Merchant Code</label>
                <input value={data.sumupMerchantCode || ''} onChange={e => set('sumupMerchantCode', e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono" placeholder="MXXXXXXXXX" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Modus</label>
              <select value={data.sumupMode} onChange={e => set('sumupMode', e.target.value)} className="px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white">
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

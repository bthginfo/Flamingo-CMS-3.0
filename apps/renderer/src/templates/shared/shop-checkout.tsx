'use client';

import { useState } from 'react';
import { useCart } from '@/components/shop/cart-context';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

type CheckoutData = {
  email: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  company: string;
  shippingMethod: string;
  paymentMethod: string;
  customerNotes: string;
  couponCode: string;
};

const STEPS = ['Kontakt', 'Versand', 'Zahlung', 'Bestätigung'];

export function ShopCheckoutSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kasse';
  const router = useRouter();
  const { items, totalCents, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CheckoutData>({
    email: '', name: '', phone: '', street: '', city: '', zip: '', country: 'DE', company: '', shippingMethod: 'standard', paymentMethod: 'prepayment', customerNotes: '', couponCode: '',
  });

  function set(key: keyof CheckoutData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: items.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })) }),
      });
      if (res.ok) {
        clearCart();
        router.push('/bestellung-abgeschlossen');
      }
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="py-16 text-center">
        <p className="text-zinc-500">Dein Warenkorb ist leer.</p>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <h2 className="text-2xl font-bold mb-8">{headline}</h2>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i <= step ? 'font-medium' : 'text-zinc-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-zinc-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0: Contact */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm" placeholder="Max Mustermann" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">E-Mail *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm" placeholder="max@example.de" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Telefon</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm" placeholder="+49 ..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Firma</label>
                  <input value={form.company} onChange={e => set('company', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm" />
                </div>
              </div>
              <button onClick={() => setStep(1)} disabled={!form.name || !form.email} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition disabled:opacity-50">
                Weiter zu Versand
              </button>
            </div>
          )}

          {/* Step 1: Shipping address */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Straße & Hausnr. *</label>
                  <input value={form.street} onChange={e => set('street', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">PLZ *</label>
                  <input value={form.zip} onChange={e => set('zip', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Stadt *</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Land</label>
                  <select value={form.country} onChange={e => set('country', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm bg-white">
                    <option value="DE">Deutschland</option>
                    <option value="AT">Österreich</option>
                    <option value="CH">Schweiz</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="px-6 py-3 border border-zinc-200 rounded-xl text-sm">Zurück</button>
                <button onClick={() => setStep(2)} disabled={!form.street || !form.zip || !form.city} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition disabled:opacity-50">
                  Weiter zu Zahlung
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {['prepayment', 'stripe', 'paypal', 'pickup'].map(method => (
                  <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${form.paymentMethod === method ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200'}`}>
                    <input type="radio" name="payment" value={method} checked={form.paymentMethod === method} onChange={e => set('paymentMethod', e.target.value)} className="accent-zinc-900" />
                    <div>
                      <p className="text-sm font-medium">
                        {method === 'prepayment' ? 'Vorkasse / Überweisung' : method === 'stripe' ? 'Kreditkarte (Stripe)' : method === 'paypal' ? 'PayPal' : 'Abholung & Barzahlung'}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {method === 'prepayment' ? 'Bankdaten werden nach Bestellung angezeigt' : method === 'stripe' ? 'Sichere Zahlung via Stripe' : method === 'paypal' ? 'Weiterleitung zu PayPal' : 'Bezahlung bei Abholung'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Bemerkungen (optional)</label>
                <textarea value={form.customerNotes} onChange={e => set('customerNotes', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm resize-y" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-zinc-200 rounded-xl text-sm">Zurück</button>
                <button onClick={() => setStep(3)} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition">
                  Bestellung prüfen
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-zinc-50 rounded-xl p-5 space-y-2 text-sm">
                <p><strong>Name:</strong> {form.name}</p>
                <p><strong>E-Mail:</strong> {form.email}</p>
                <p><strong>Adresse:</strong> {form.street}, {form.zip} {form.city}, {form.country}</p>
                <p><strong>Zahlung:</strong> {form.paymentMethod === 'prepayment' ? 'Vorkasse' : form.paymentMethod === 'stripe' ? 'Kreditkarte' : form.paymentMethod === 'paypal' ? 'PayPal' : 'Abholung'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 border border-zinc-200 rounded-xl text-sm">Zurück</button>
                <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition disabled:opacity-50 flex items-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Bestellung wird aufgegeben…</> : 'Kostenpflichtig bestellen'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="bg-zinc-50 rounded-2xl p-6 h-fit sticky top-4">
          <h3 className="font-semibold mb-4">Deine Bestellung</h3>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={`${item.productId}-${item.variantId || ''}`} className="flex justify-between text-sm">
                <span className="truncate flex-1">{item.title} × {item.quantity}</span>
                <span className="font-medium ml-2">{formatPrice(item.priceCents * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Gesamt</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/shop/cart-context';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Tag, X } from 'lucide-react';
import { computeShippingCents } from '@/lib/shop-totals';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

type ShippingMethod = { id: string; name: string; priceCents: number; freeAboveCents: number | null; estimatedDays: string | null };
type CouponResult = { valid: boolean; code: string; type: string; discountCents: number; freeShipping: boolean; label: string };

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
  const tenantId = (data.tenantId as string) || '';
  const router = useRouter();
  const { items, totalCents, clearCart } = useCart();
  const isDemo = ((data.basePath as string) || '').startsWith('/demo/');

  // Demo mode: show notice instead of checkout
  if (isDemo) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-4" data-edit-path="headline">{headline}</h2>
        <p className="text-[color:var(--token-muted)] mb-2">Der Checkout ist in der Demo nicht verfügbar.</p>
        <p className="text-sm text-[color:var(--token-body)]">In einem echten Shop können Kunden hier ihre Bestellung abschließen — mit Stripe, PayPal, SumUp oder Vorkasse.</p>
      </section>
    );
  }
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CheckoutData>({
    email: '', name: '', phone: '', street: '', city: '', zip: '', country: 'DE', company: '', shippingMethod: '', paymentMethod: 'prepayment', customerNotes: '', couponCode: '',
  });
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [availablePayments, setAvailablePayments] = useState<string[]>(['prepayment']);
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Fetch shipping methods and payment methods when country changes
  useEffect(() => {
    const params = new URLSearchParams({ country: form.country });
    if (tenantId) params.set('tenantId', tenantId);
    fetch(`/api/shop/shipping?${params.toString()}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(d => {
        setShippingMethods(d.methods || []);
        if (d.methods?.length && !form.shippingMethod) {
          setForm(f => ({ ...f, shippingMethod: d.methods[0].id }));
        }
        if (d.paymentMethods?.length) {
          setAvailablePayments(d.paymentMethods);
          if (!d.paymentMethods.includes(form.paymentMethod)) {
            setForm(f => ({ ...f, paymentMethod: d.paymentMethods[0] }));
          }
        }
      })
      .catch(() => setShippingMethods([]));
  }, [form.country, tenantId]);

  // Calculate shipping cost — same helper the checkout charge uses, so the
  // displayed total can never diverge from what the customer is charged.
  const selectedShipping = shippingMethods.find(m => m.id === form.shippingMethod);
  const shippingCents = computeShippingCents(selectedShipping, totalCents, coupon?.freeShipping);
  const discountCents = coupon?.discountCents || 0;
  const grandTotal = totalCents + shippingCents - discountCents;

  async function applyCoupon() {
    setCouponError('');
    if (!couponInput.trim()) return;
    try {
      const res = await fetch('/api/shop/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotalCents: totalCents, tenantId }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCoupon(data);
        setForm(f => ({ ...f, couponCode: data.code }));
      } else {
        setCouponError(data.error || 'Ungültiger Code');
      }
    } catch {
      setCouponError('Code konnte nicht geprüft werden. Bitte erneut versuchen.');
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponInput('');
    setForm(f => ({ ...f, couponCode: '' }));
  }

  function set(key: keyof CheckoutData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tenantId,
          idempotencyKey,
          shippingCents,
          discountCents,
          items: items.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Bestellung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        return;
      }
      if (data.success) {
        // Stripe redirect
        if (data.stripeUrl) {
          clearCart();
          window.location.href = data.stripeUrl;
          return;
        }
        // PayPal redirect
        if (data.paypalUrl) {
          clearCart();
          window.location.href = data.paypalUrl;
          return;
        }
        // SumUp redirect
        if (data.sumupUrl) {
          clearCart();
          window.location.href = data.sumupUrl;
          return;
        }
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
        <p className="text-[color:var(--token-card-muted,var(--token-muted))]">Dein Warenkorb ist leer.</p>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <h2 className="text-2xl font-bold mb-8" data-edit-path="headline">{headline}</h2>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2" data-edit-collection="STEPS" data-edit-index={i}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-[var(--token-icon)] text-[color:var(--token-on-dark-heading)]' : 'bg-[var(--token-section-bg-alt)] text-[color:var(--token-card-body,var(--token-body))]'}`}>
              {i < step ? <Check className="text-[color:var(--token-check)]" size={14} /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i <= step ? 'font-medium' : 'text-[color:var(--token-card-body,var(--token-body))]'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-[var(--token-section-bg-alt,theme(colors.zinc.200))]" />}
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
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm" placeholder="Max Mustermann" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">E-Mail *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm" placeholder="max@example.de" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">Telefon</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm" placeholder="+49 ..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">Firma</label>
                  <input value={form.company} onChange={e => set('company', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm" />
                </div>
              </div>
              <button onClick={() => setStep(1)} disabled={!form.name || !form.email} className="px-6 py-3 bg-[var(--token-icon)] text-[color:var(--token-on-dark-heading)] rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50">
                Weiter zu Versand
              </button>
            </div>
          )}

          {/* Step 1: Shipping address */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">Straße & Hausnr. *</label>
                  <input value={form.street} onChange={e => set('street', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">PLZ *</label>
                  <input value={form.zip} onChange={e => set('zip', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">Stadt *</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">Land</label>
                  <select value={form.country} onChange={e => set('country', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm bg-[var(--token-input-bg)]">
                    <option value="DE">Deutschland</option>
                    <option value="AT">Österreich</option>
                    <option value="CH">Schweiz</option>
                  </select>
                </div>
              </div>

              {/* Shipping method selection */}
              {shippingMethods.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">Versandart</label>
                  {shippingMethods.map(method => {
                    const isFree = method.freeAboveCents && totalCents >= method.freeAboveCents;
                    return (
                      <label key={method.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${form.shippingMethod === method.id ? 'border-[var(--token-icon)] bg-[color-mix(in_srgb,var(--token-icon)_5%,transparent)]' : 'border-[color:var(--token-card-border)]'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="shipping" value={method.id} checked={form.shippingMethod === method.id} onChange={e => set('shippingMethod', e.target.value)} className="accent-[var(--token-icon)]" />
                          <div>
                            <p className="text-sm font-medium" data-edit-path="name">{method.name}</p>
                            {method.estimatedDays && <p className="text-xs text-[color:var(--token-card-body,var(--token-body))]">{method.estimatedDays}</p>}
                          </div>
                        </div>
                        <span className="text-sm font-medium">{isFree ? <span className="text-[color:var(--token-success)]">Kostenlos</span> : formatPrice(method.priceCents)}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="px-6 py-3 border border-[color:var(--token-card-border)] rounded-xl text-sm">Zurück</button>
                <button onClick={() => setStep(2)} disabled={!form.street || !form.zip || !form.city} className="px-6 py-3 bg-[var(--token-icon)] text-[color:var(--token-on-dark-heading)] rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50">
                  Weiter zu Zahlung
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {availablePayments.map(method => (
                  <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${form.paymentMethod === method ? 'border-[var(--token-icon)] bg-[color-mix(in_srgb,var(--token-icon)_5%,transparent)]' : 'border-[color:var(--token-card-border)]'}`}>
                    <input type="radio" name="payment" value={method} checked={form.paymentMethod === method} onChange={e => set('paymentMethod', e.target.value)} className="accent-[var(--token-icon)]" />
                    <div>
                      <p className="text-sm font-medium">
                        {method === 'prepayment' ? 'Vorkasse / Überweisung' : method === 'stripe' ? 'Kreditkarte (Stripe)' : method === 'paypal' ? 'PayPal' : method === 'sumup' ? 'Kartenzahlung (SumUp)' : method === 'pickup' ? 'Abholung & Barzahlung' : method}
                      </p>
                      <p className="text-xs text-[color:var(--token-card-body,var(--token-body))]">
                        {method === 'prepayment' ? 'Bankdaten werden nach Bestellung angezeigt' : method === 'stripe' ? 'Sichere Zahlung via Stripe' : method === 'paypal' ? 'Weiterleitung zu PayPal' : method === 'sumup' ? 'Kartenzahlung über SumUp' : method === 'pickup' ? 'Bezahlung bei Abholung' : ''}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-[color:var(--token-label)] mb-1">Bemerkungen (optional)</label>
                <textarea value={form.customerNotes} onChange={e => set('customerNotes', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-[color:var(--token-input-border)] text-sm resize-y" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-[color:var(--token-card-border)] rounded-xl text-sm">Zurück</button>
                <button onClick={() => setStep(3)} className="px-6 py-3 bg-[var(--token-icon)] text-[color:var(--token-on-dark-heading)] rounded-xl font-medium hover:opacity-90 transition">
                  Bestellung prüfen
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[var(--token-section-bg-alt)] rounded-xl p-5 space-y-2 text-sm">
                <p><strong>Name:</strong> <span data-edit-path="name">{form.name}</span></p>
                <p><strong>E-Mail:</strong> <span data-edit-path="email">{form.email}</span></p>
                <p><strong>Adresse:</strong> {form.street}, {form.zip} {form.city}, {form.country}</p>
                <p><strong>Zahlung:</strong> {form.paymentMethod === 'prepayment' ? 'Vorkasse' : form.paymentMethod === 'stripe' ? 'Kreditkarte' : form.paymentMethod === 'paypal' ? 'PayPal' : 'Abholung'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 border border-[color:var(--token-card-border)] rounded-xl text-sm">Zurück</button>
                <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-[var(--token-icon)] text-[color:var(--token-on-dark-heading)] rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Bestellung wird aufgegeben…</> : 'Kostenpflichtig bestellen'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="bg-[var(--token-section-bg-alt)] rounded-2xl p-6 h-fit sticky top-4">
          <h3 className="font-semibold mb-4">Deine Bestellung</h3>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={`${item.productId}-${item.variantId || ''}`} className="flex justify-between text-sm">
                <span className="truncate flex-1"><span data-edit-path="title">{item.title}</span> × {item.quantity}</span>
                <span className="font-medium ml-2">{formatPrice(item.priceCents * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Zwischensumme</span><span>{formatPrice(totalCents)}</span></div>
            {shippingCents > 0 && <div className="flex justify-between"><span>Versand</span><span>{formatPrice(shippingCents)}</span></div>}
            {shippingCents === 0 && selectedShipping && <div className="flex justify-between text-[color:var(--token-success)]"><span>Versand</span><span>Kostenlos</span></div>}
            {discountCents > 0 && <div className="flex justify-between text-[color:var(--token-success)]"><span>Rabatt (<span data-edit-path="label">{coupon?.label}</span>)</span><span>-{formatPrice(discountCents)}</span></div>}
            <div className="flex justify-between font-bold text-base pt-1 border-t">
              <span>Gesamt</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Coupon code */}
          <div className="mt-4 pt-4 border-t">
            {coupon ? (
              <div className="flex items-center justify-between bg-[color:var(--token-success-bg)] rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-[color:var(--token-success)]" />
                  <span className="text-sm font-medium text-[color:var(--token-success)]">{coupon.code} (<span data-edit-path="label">{coupon.label}</span>)</span>
                </div>
                <button onClick={removeCoupon} className="text-[color:var(--token-success)] hover:text-[color:var(--token-success)]"><X size={14} /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={couponInput} onChange={e => { setCouponInput(e.target.value); setCouponError(''); }} placeholder="Gutscheincode" className="flex-1 text-sm border border-[color:var(--token-input-border)] rounded-lg px-3 py-2" />
                <button onClick={applyCoupon} className="text-sm px-3 py-2 bg-[var(--token-section-bg-alt,theme(colors.zinc.200))] rounded-lg hover:bg-[var(--token-section-bg,theme(colors.zinc.300))] font-medium">Einlösen</button>
              </div>
            )}
            {couponError && <p className="text-xs text-[var(--token-danger)] mt-1">{couponError}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

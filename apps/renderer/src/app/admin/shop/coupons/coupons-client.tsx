'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Percent, Truck as TruckIcon } from 'lucide-react';
import { createCoupon, updateCoupon, deleteCoupon, getProducts } from '../actions';
import { useRouter } from 'next/navigation';

type Coupon = {
  id: string; code: string; type: string; value: number;
  minOrderCents: number | null; maxUses: number | null; usedCount: number;
  maxUsesPerCustomer: number | null; active: boolean;
  validFrom: Date | null; validUntil: Date | null; createdAt: Date;
};

const TYPE_LABELS: Record<string, { label: string; icon: typeof Tag }> = {
  percent: { label: 'Prozent', icon: Percent },
  fixed_amount: { label: 'Festbetrag', icon: Tag },
  free_shipping: { label: 'Kostenloser Versand', icon: TruckIcon },
};

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export function CouponsClient({ coupons: initial }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percent' as string, value: '', minOrderCents: '', maxUses: '', validFrom: '', validUntil: '', appliesTo: 'all' as string, appliesToIds: [] as string[] });
  const [allProducts, setAllProducts] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => { setCoupons(initial); }, [initial]);
  useEffect(() => { if (showForm) getProducts().then(p => setAllProducts(p.map((x: any) => ({ id: x.id, title: x.title })))); }, [showForm]);

  async function handleCreate() {
    if (!form.code || !form.value) return;
    await createCoupon({
      code: form.code,
      type: form.type as 'percent' | 'fixed_amount' | 'free_shipping',
      value: form.type === 'fixed_amount' ? Math.round(parseFloat(form.value) * 100) : parseInt(form.value, 10),
      minOrderCents: form.minOrderCents ? Math.round(parseFloat(form.minOrderCents) * 100) : undefined,
      maxUses: form.maxUses ? parseInt(form.maxUses, 10) : undefined,
      validFrom: form.validFrom || undefined,
      validUntil: form.validUntil || undefined,
      appliesTo: form.appliesTo as 'all' | 'specific_products',
      appliesToIds: form.appliesTo === 'specific_products' ? form.appliesToIds : undefined,
    });
    setForm({ code: '', type: 'percent', value: '', minOrderCents: '', maxUses: '', validFrom: '', validUntil: '', appliesTo: 'all', appliesToIds: [] });
    setShowForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {coupons.length === 0 && !showForm && (
        <div className="text-center py-16 text-zinc-400">
          <Tag size={40} className="mx-auto mb-3 opacity-50" />
          <p>Noch keine Gutscheine angelegt.</p>
        </div>
      )}

      {coupons.map(coupon => {
        const cfg = TYPE_LABELS[coupon.type] || TYPE_LABELS.percent;
        const Icon = cfg.icon;
        const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();

        return (
          <div key={coupon.id} className="bg-white rounded-xl border border-zinc-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
              <Icon size={18} className="text-zinc-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm">{coupon.code}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${coupon.active && !isExpired ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                  {isExpired ? 'Abgelaufen' : coupon.active ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {coupon.type === 'percent' && `${coupon.value}% Rabatt`}
                {coupon.type === 'fixed_amount' && `${formatPrice(coupon.value)} Rabatt`}
                {coupon.type === 'free_shipping' && 'Kostenloser Versand'}
                {coupon.minOrderCents && ` · ab ${formatPrice(coupon.minOrderCents)}`}
                {coupon.maxUses && ` · ${coupon.usedCount}/${coupon.maxUses} genutzt`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCoupon(coupon.id, { active: !coupon.active })}
                className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50"
              >
                {coupon.active ? 'Deaktivieren' : 'Aktivieren'}
              </button>
              <button onClick={() => deleteCoupon(coupon.id)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}

      {showForm ? (
        <div className="bg-white rounded-xl border border-zinc-100 p-4 space-y-3">
          <h3 className="font-semibold">Neuer Gutschein</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="Code (z.B. SOMMER20)" className="text-sm border border-zinc-200 rounded-lg px-3 py-2 font-mono uppercase" />
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="text-sm border border-zinc-200 rounded-lg px-3 py-2">
              <option value="percent">Prozent (%)</option>
              <option value="fixed_amount">Festbetrag (€)</option>
              <option value="free_shipping">Kostenloser Versand</option>
            </select>
            <input value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'percent' ? 'Wert (z.B. 10)' : 'Betrag in € (z.B. 5.00)'} type="number" className="text-sm border border-zinc-200 rounded-lg px-3 py-2" />
            <input value={form.minOrderCents} onChange={e => setForm(f => ({ ...f, minOrderCents: e.target.value }))} placeholder="Mindestbestellwert (€, optional)" type="number" step="0.01" className="text-sm border border-zinc-200 rounded-lg px-3 py-2" />
            <input value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="Max. Nutzungen (optional)" type="number" className="text-sm border border-zinc-200 rounded-lg px-3 py-2" />
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Gültig ab (optional)</label>
              <input value={form.validFrom} onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))} type="date" className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Gültig bis (optional)</label>
              <input value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} type="date" className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2" />
            </div>
          </div>

          {/* Applies to */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-500">Gilt für</label>
            <select value={form.appliesTo} onChange={e => setForm(f => ({ ...f, appliesTo: e.target.value, appliesToIds: [] }))} className="text-sm border border-zinc-200 rounded-lg px-3 py-2">
              <option value="all">Alle Produkte</option>
              <option value="specific_products">Bestimmte Produkte</option>
            </select>
            {form.appliesTo === 'specific_products' && allProducts.length > 0 && (
              <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded-lg p-2 space-y-1">
                {allProducts.map(p => (
                  <label key={p.id} className="flex items-center gap-2 text-sm py-0.5">
                    <input type="checkbox" checked={form.appliesToIds.includes(p.id)} onChange={e => setForm(f => ({ ...f, appliesToIds: e.target.checked ? [...f.appliesToIds, p.id] : f.appliesToIds.filter(x => x !== p.id) }))} className="rounded" />
                    {p.title}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="text-sm px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800">Erstellen</button>
            <button onClick={() => setShowForm(false)} className="text-sm px-3 py-2 text-zinc-500 hover:text-zinc-700">Abbrechen</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-3 border border-dashed border-zinc-200 rounded-xl w-full justify-center hover:border-zinc-400 transition">
          <Plus size={16} /> Neuer Gutschein
        </button>
      )}
    </div>
  );
}

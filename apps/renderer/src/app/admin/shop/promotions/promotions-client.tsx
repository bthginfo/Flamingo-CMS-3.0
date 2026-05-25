'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Zap, Truck, ShoppingBag, Package, Star, Gift } from 'lucide-react';
import { createPromotion, updatePromotion, deletePromotion, getProducts, getCategories } from '../actions';
import { useRouter } from 'next/navigation';

type Promotion = {
  id: string;
  name: string;
  type: string;
  conditions: Record<string, unknown> | null;
  discountValue: number;
  discountType: string;
  active: boolean;
  validFrom: Date | string | null;
  validUntil: Date | string | null;
  stackable: boolean;
};

const PROMO_TYPES = [
  { value: 'spend_x_save_y', label: 'Ab Bestellwert X → Rabatt', description: 'z.B. Ab 50€ Bestellwert 10% Rabatt', icon: Zap },
  { value: 'free_shipping_above', label: 'Kostenloser Versand ab X', description: 'z.B. Ab 75€ kostenloser Versand', icon: Truck },
  { value: 'quantity_discount', label: 'Mengenrabatt', description: 'z.B. Ab 3 Stück 10% auf das Produkt', icon: Package },
  { value: 'buy_x_get_discount', label: 'Kauf X, bekomme Y günstiger', description: 'z.B. Kauf 4, das 5. gibt es 50% günstiger', icon: Gift },
  { value: 'bundle_discount', label: 'Bundle-Rabatt', description: 'z.B. Produkt A + B zusammen 15% günstiger', icon: ShoppingBag },
  { value: 'first_order_discount', label: 'Erstbesteller-Rabatt', description: 'Rabatt nur bei der ersten Bestellung', icon: Star },
] as const;

function typeLabel(type: string) {
  return PROMO_TYPES.find(t => t.value === type)?.label || type;
}

export function PromotionsClient({ promotions: initial }: { promotions: Promotion[] }) {
  const router = useRouter();
  const [promotions, setPromotions] = useState(initial);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setPromotions(initial); }, [initial]);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('spend_x_save_y');
  const [discountValue, setDiscountValue] = useState(10);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [minAmount, setMinAmount] = useState(50);
  const [minQuantity, setMinQuantity] = useState(3);
  const [stackable, setStackable] = useState(false);
  const [appliesTo, setAppliesTo] = useState<'all' | 'products' | 'categories'>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<{ id: string; title: string }[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (showForm) {
      getProducts().then(p => setAllProducts(p.map((x: any) => ({ id: x.id, title: x.title }))));
      getCategories().then(c => setAllCategories(c.map((x: any) => ({ id: x.id, name: x.name }))));
    }
  }, [showForm]);

  function buildConditions() {
    const base: Record<string, unknown> = {};
    switch (type) {
      case 'spend_x_save_y':
      case 'free_shipping_above':
        base.minAmountCents = minAmount * 100; break;
      case 'quantity_discount':
      case 'buy_x_get_discount':
        base.minQuantity = minQuantity; break;
      case 'bundle_discount':
        base.minItems = minQuantity; break;
    }
    if (appliesTo === 'products' && selectedProductIds.length > 0) base.productIds = selectedProductIds;
    if (appliesTo === 'categories' && selectedCategoryIds.length > 0) base.categoryIds = selectedCategoryIds;
    return base;
  }

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    await createPromotion({
      name: name.trim(),
      type: type as any,
      conditions: buildConditions(),
      discountValue: type === 'free_shipping_above' ? 0 : (discountType === 'fixed' ? discountValue * 100 : discountValue),
      discountType,
      stackable,
    });
    setShowForm(false);
    setName('');
    setSaving(false);
    router.refresh();
  }

  async function handleToggle(id: string, active: boolean) {
    await updatePromotion(id, { active: !active });
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !active } : p));
  }

  async function handleDelete(id: string) {
    if (!confirm('Rabattaktion wirklich löschen?')) return;
    await deletePromotion(id);
    setPromotions(prev => prev.filter(p => p.id !== id));
  }

  function formatDiscount(p: Promotion) {
    if (p.type === 'free_shipping_above') return 'Kostenloser Versand';
    if (p.discountType === 'percent') return `${p.discountValue}%`;
    return `${(p.discountValue / 100).toFixed(2).replace('.', ',')}€`;
  }

  function formatCondition(p: Promotion) {
    const c = p.conditions as Record<string, number>;
    if (c.minAmountCents) return `ab ${(c.minAmountCents / 100).toFixed(0)}€ Bestellwert`;
    if (c.minQuantity) return `ab ${c.minQuantity} Stück`;
    if (c.minItems) return `ab ${c.minItems} Produkten`;
    if (p.type === 'first_order_discount') return 'Erstbestellung';
    return '';
  }

  return (
    <div className="space-y-6">
      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-medium mb-1">💡 Was ist der Unterschied zu Gutscheinen?</p>
        <p className="text-xs text-amber-700">
          <strong>Gutscheine</strong> (unter &quot;Rabatte &amp; Coupons&quot;) erfordern einen Code, den der Kunde eingeben muss.<br />
          <strong>Rabattaktionen</strong> hier werden <em>automatisch</em> angewendet, wenn die Bedingung erfüllt ist — ohne Code.
        </p>
      </div>

      {/* Existing promotions */}
      {promotions.length > 0 && (
        <div className="space-y-3">
          {promotions.map(p => (
            <div key={p.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between gap-4 ${p.active ? 'border-zinc-200' : 'border-zinc-100 opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${p.active ? 'bg-green-500' : 'bg-zinc-300'}`} />
                  <span className="font-medium text-sm truncate">{p.name}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {typeLabel(p.type)} · {formatDiscount(p)} {formatCondition(p) && `· ${formatCondition(p)}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleToggle(p.id, p.active)} className={`px-3 py-1 text-xs rounded-lg border ${p.active ? 'border-green-200 text-green-700 bg-green-50' : 'border-zinc-200 text-zinc-500'}`}>
                  {p.active ? 'Aktiv' : 'Inaktiv'}
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create form */}
      {showForm ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
          <h3 className="font-semibold text-sm">Neue Rabattaktion erstellen</h3>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm" placeholder="z.B. Sommeraktion 10%" />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Typ</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROMO_TYPES.map(pt => (
                <label key={pt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${type === pt.value ? 'border-pink-300 bg-pink-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                  <input type="radio" name="promo-type" checked={type === pt.value} onChange={() => setType(pt.value)} className="mt-0.5" />
                  <div>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <pt.icon size={14} className="text-zinc-500" /> {pt.label}
                    </span>
                    <span className="text-xs text-zinc-500">{pt.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Conditions based on type */}
          {(type === 'spend_x_save_y' || type === 'free_shipping_above') && (
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Mindestbestellwert (€)</label>
              <input type="number" min="0" step="1" value={minAmount} onChange={e => setMinAmount(Number(e.target.value))} className="w-40 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
            </div>
          )}

          {(type === 'quantity_discount' || type === 'buy_x_get_discount' || type === 'bundle_discount') && (
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">{type === 'bundle_discount' ? 'Mindest-Produkte im Warenkorb' : 'Mindestmenge'}</label>
              <input type="number" min="1" value={minQuantity} onChange={e => setMinQuantity(Number(e.target.value))} className="w-40 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
            </div>
          )}

          {/* Discount value */}
          {type !== 'free_shipping_above' && (
            <div className="flex items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Rabatt</label>
                <input type="number" min="0" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} className="w-28 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
              </div>
              <div>
                <select value={discountType} onChange={e => setDiscountType(e.target.value as 'percent' | 'fixed')} className="px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white">
                  <option value="percent">Prozent (%)</option>
                  <option value="fixed">Fester Betrag (€)</option>
                </select>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={stackable} onChange={e => setStackable(e.target.checked)} className="rounded" />
            Mit anderen Aktionen kombinierbar
          </label>

          {/* Product/Category targeting */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-500">Gilt für</label>
            <select value={appliesTo} onChange={e => { setAppliesTo(e.target.value as any); setSelectedProductIds([]); setSelectedCategoryIds([]); }} className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white">
              <option value="all">Alle Produkte</option>
              <option value="products">Bestimmte Produkte</option>
              <option value="categories">Bestimmte Kategorien</option>
            </select>
            {appliesTo === 'products' && allProducts.length > 0 && (
              <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded-lg p-2 space-y-1">
                {allProducts.map(p => (
                  <label key={p.id} className="flex items-center gap-2 text-sm py-0.5">
                    <input type="checkbox" checked={selectedProductIds.includes(p.id)} onChange={e => setSelectedProductIds(e.target.checked ? [...selectedProductIds, p.id] : selectedProductIds.filter(x => x !== p.id))} className="rounded" />
                    {p.title}
                  </label>
                ))}
              </div>
            )}
            {appliesTo === 'categories' && allCategories.length > 0 && (
              <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded-lg p-2 space-y-1">
                {allCategories.map(c => (
                  <label key={c.id} className="flex items-center gap-2 text-sm py-0.5">
                    <input type="checkbox" checked={selectedCategoryIds.includes(c.id)} onChange={e => setSelectedCategoryIds(e.target.checked ? [...selectedCategoryIds, c.id] : selectedCategoryIds.filter(x => x !== c.id))} className="rounded" />
                    {c.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleCreate} disabled={saving || !name.trim()} className="px-5 py-2 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition disabled:opacity-50">
              {saving ? 'Erstellen…' : 'Erstellen'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition">
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition">
          <Plus size={16} /> Neue Rabattaktion
        </button>
      )}
    </div>
  );
}

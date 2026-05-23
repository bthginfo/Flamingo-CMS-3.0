'use client';

import { useCart } from '@/components/shop/cart-context';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export function ShopCartSection({ data }: Props) {
  const headline = (data.headline as string) || 'Dein Warenkorb';
  const emptyText = (data.emptyText as string) || 'Dein Warenkorb ist leer.';
  const continueLabel = (data.continueShoppingLabel as string) || 'Weiter einkaufen';
  const checkoutLabel = (data.checkoutLabel as string) || 'Zur Kasse';
  const basePath = (data.basePath as string) || '';

  const { items, totalCents, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <section className="py-16 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4 text-zinc-300" />
        <h2 className="text-2xl font-bold mb-2">{headline}</h2>
        <p className="text-zinc-500 mb-6">{emptyText}</p>
        <Link href={`${basePath}/shop`} className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition">
          {continueLabel}
        </Link>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <h2 className="text-2xl font-bold mb-8">{headline}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.variantId || ''}`} className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-100">
              <div className="w-20 h-20 rounded-lg bg-zinc-50 shrink-0 overflow-hidden">
                {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`${basePath}/shop/${item.slug}`} className="font-medium text-sm hover:underline">{item.title}</Link>
                {item.variantName && <p className="text-xs text-zinc-400">{item.variantName}</p>}
                <p className="font-semibold mt-1">{formatPrice(item.priceCents)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => removeItem(item.productId, item.variantId)} className="p-1 text-zinc-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="p-1.5 hover:bg-zinc-50"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="p-1.5 hover:bg-zinc-50"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-zinc-50 rounded-2xl p-6 h-fit sticky top-4">
          <h3 className="font-semibold mb-4">Zusammenfassung</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Zwischensumme</span>
              <span>{formatPrice(totalCents)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Versand</span>
              <span>wird im Checkout berechnet</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Gesamt</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
          <Link href={`${basePath}/checkout`} className="block w-full text-center py-3 mt-4 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition">
            {checkoutLabel}
          </Link>
          <Link href={`${basePath}/shop`} className="block w-full text-center py-2 mt-2 text-sm text-zinc-500 hover:text-zinc-700">
            {continueLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

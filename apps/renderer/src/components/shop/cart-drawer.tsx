'use client';

import { useCart, type CartItem } from './cart-context';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export function CartDrawer() {
  const { items, totalItems, totalCents, isOpen, setIsOpen, updateQuantity, removeItem } = useCart();
  const pathname = usePathname();
  const isDemo = pathname.startsWith('/demo/');

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={() => setIsOpen(false)} />
      <div data-cart-drawer className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[9999] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <span className="font-semibold">Warenkorb ({totalItems})</span>
          </div>
          <button aria-label="Warenkorb schließen" onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-zinc-400 py-12">Dein Warenkorb ist leer.</p>
          ) : items.map((item) => (
            <CartItemRow key={`${item.productId}-${item.variantId || ''}`} item={item} onUpdate={updateQuantity} onRemove={removeItem} />
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-5 space-y-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Gesamt</span>
              <span>{formatPrice(totalCents)}</span>
            </div>
            {isDemo ? (
              <div className="text-center">
                <span className="block w-full py-3 bg-zinc-200 text-zinc-500 font-medium rounded-xl cursor-not-allowed">Zur Kasse</span>
                <p className="text-xs text-zinc-400 mt-1">Checkout ist in der Demo nicht verfügbar</p>
              </div>
            ) : (
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition"
              >
                Zur Kasse
              </Link>
            )}
            <Link
              href="/warenkorb"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2 text-sm text-zinc-500 hover:text-zinc-700"
            >
              Warenkorb anzeigen
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function CartItemRow({ item, onUpdate, onRemove }: { item: CartItem; onUpdate: (pid: string, vid: string | undefined, q: number) => void; onRemove: (pid: string, vid?: string) => void }) {
  return (
    <div className="flex gap-3">
      <div className="w-16 h-16 rounded-lg bg-zinc-100 shrink-0 overflow-hidden">
        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.variantName && <p className="text-xs text-zinc-400">{item.variantName}</p>}
        <p className="text-sm font-semibold mt-1">{formatPrice(item.priceCents)}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <button aria-label="Artikel entfernen" onClick={() => onRemove(item.productId, item.variantId)} className="p-1 text-zinc-400 hover:text-red-500">
          <Trash2 size={14} />
        </button>
        <div className="flex items-center gap-1 border rounded-lg">
          <button aria-label="Menge verringern" onClick={() => onUpdate(item.productId, item.variantId, item.quantity - 1)} className="p-1 hover:bg-zinc-100"><Minus size={12} /></button>
          <span className="text-xs w-5 text-center" aria-live="polite">{item.quantity}</span>
          <button aria-label="Menge erhöhen" onClick={() => onUpdate(item.productId, item.variantId, item.quantity + 1)} className="p-1 hover:bg-zinc-100"><Plus size={12} /></button>
        </div>
      </div>
    </div>
  );
}

export function CartButton() {
  const { totalItems, setIsOpen } = useCart();
  return (
    <button onClick={() => setIsOpen(true)} className="relative p-2 hover:bg-zinc-100 rounded-lg transition" aria-label="Warenkorb">
      <ShoppingBag size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}

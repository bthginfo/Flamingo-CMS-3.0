'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/shop/cart-context';
import { ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export function ShopProductDetailSection({ data }: Props) {
  const cart = useCart();
  const [fetchedProduct, setFetchedProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  // Get slug from data or from URL
  const slug = (data._slug as string) || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);

  useEffect(() => {
    if (data._product || !slug) return;
    setLoading(true);
    const params = data.tenantId ? `?tenantId=${data.tenantId}` : '';
    fetch(`/api/shop/products/${encodeURIComponent(slug)}${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.product) setFetchedProduct({ ...d.product, variants: d.variants, variantOptions: d.options });
      })
      .finally(() => setLoading(false));
  }, [slug, data._product, data.tenantId]);

  const product = (data._product || fetchedProduct) as {
    id: string; title: string; slug: string; description: string;
    priceCents: number; comparePriceCents?: number | null;
    images: string[]; stock: number; isDigital: boolean;
    variants?: { id: string; name: string; priceCents?: number | null; stock: number; image?: string }[];
    variantOptions?: { name: string; values: string[] }[];
  } | null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  if (loading) {
    return <section className="py-16 text-center text-zinc-400">Produkt wird geladen…</section>;
  }

  if (!product) {
    return <section className="py-16 text-center text-zinc-400">Produkt nicht gefunden.</section>;
  }

  const images = product.images?.length ? product.images : [];
  const variants = product.variants || [];
  const activeVariant = variants.find(v => v.id === selectedVariant);
  const currentPrice = activeVariant?.priceCents ?? product.priceCents;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const outOfStock = currentStock === 0 && !product.isDigital;

  function handleAdd() {
    cart.addItem({
      productId: product!.id,
      variantId: selectedVariant || undefined,
      title: product!.title,
      variantName: activeVariant?.name,
      priceCents: currentPrice,
      image: images[0],
      slug: product!.slug,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section className="py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-zinc-50 rounded-2xl overflow-hidden relative">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={60} className="text-zinc-200" /></div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"><ChevronLeft size={18} /></button>
                <button onClick={() => setSelectedImage((selectedImage + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"><ChevronRight size={18} /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 ${i === selectedImage ? 'border-zinc-900' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{formatPrice(currentPrice)}</span>
            {product.comparePriceCents && (
              <span className="text-lg text-zinc-400 line-through">{formatPrice(product.comparePriceCents)}</span>
            )}
          </div>

          {/* Variant options */}
          {product.variantOptions?.map(opt => (
            <div key={opt.name} className="mb-4">
              <label className="text-sm font-medium text-zinc-700 mb-2 block">{opt.name}</label>
              <div className="flex flex-wrap gap-2">
                {opt.values.map(val => {
                  const matchVariant = variants.find(v => v.name.includes(val));
                  const isSelected = matchVariant?.id === selectedVariant;
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedVariant(matchVariant?.id || null)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${isSelected ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 hover:border-zinc-400'}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-zinc-50"><Minus size={16} /></button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-zinc-50"><Plus size={16} /></button>
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${outOfStock ? 'bg-zinc-300 cursor-not-allowed' : added ? 'bg-green-500' : 'bg-zinc-900 hover:bg-zinc-800'}`}
            >
              {outOfStock ? 'Ausverkauft' : added ? <><Check size={18} /> Hinzugefügt</> : <><ShoppingBag size={18} /> In den Warenkorb</>}
            </button>
          </div>

          {!product.isDigital && currentStock > 0 && currentStock <= 5 && (
            <p className="text-xs text-orange-600 mt-2">Nur noch {currentStock} auf Lager!</p>
          )}

          {/* Description */}
          {product.description && (
            <div className="mt-8 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
          )}

          <Link href="/shop" className="inline-block mt-6 text-sm text-zinc-500 hover:text-zinc-700">← Zurück zum Shop</Link>
        </div>
      </div>
    </section>
  );
}

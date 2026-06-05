'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/shop/cart-context';
import { ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight, Check, ArrowLeft, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export function ShopProductDetailSection({ data }: Props) {
  const cart = useCart();
  const [fetchedProduct, setFetchedProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const shopBase = (data.basePath as string) || '/shop';

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
    shortDescription?: string;
    priceCents: number; comparePriceCents?: number | null;
    images: string[]; stock: number; isDigital: boolean;
    highlights?: string[];
    categoryName?: string; categorySlug?: string;
    variants?: { id: string; name: string; priceCents?: number | null; stock: number; image?: string }[];
    variantOptions?: { name: string; values: string[] }[];
  } | null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  if (loading) {
    return <section className="py-16 text-center text-[color:var(--token-body,#a1a1aa)]">Produkt wird geladen…</section>;
  }

  if (!product) {
    return <section className="py-16 text-center text-[color:var(--token-body,#a1a1aa)]">Produkt nicht gefunden.</section>;
  }

  const images = product.images?.length ? product.images : [];
  const variants = product.variants || [];
  const activeVariant = variants.find(v => v.id === selectedVariant);
  const currentPrice = activeVariant?.priceCents ?? product.priceCents;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const outOfStock = currentStock === 0 && !product.isDigital;
  const highlights = product.highlights?.filter(Boolean) || [];
  const discount = product.comparePriceCents ? Math.round((1 - product.priceCents / product.comparePriceCents) * 100) : 0;

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
    <section className="py-8 md:py-12">
      {/* Back link */}
      <Link href={shopBase} className="inline-flex items-center gap-2 text-sm text-[color:var(--token-muted,#71717a)] hover:text-[color:var(--token-heading,#27272a)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Zurück zum Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-[var(--token-section-bg-alt,#fafafa)] rounded-2xl overflow-hidden relative group">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={60} className="text-[color:var(--token-body,#e4e4e7)]" /></div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--token-card-bg,#ffffff)/90] rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-[var(--token-card-bg,#ffffff)] transition-all"><ChevronLeft size={18} /></button>
                <button onClick={() => setSelectedImage((selectedImage + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--token-card-bg,#ffffff)/90] rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-[var(--token-card-bg,#ffffff)] transition-all"><ChevronRight size={18} /></button>
              </>
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-[color:var(--token-on-dark-heading,#ffffff)] text-xs font-bold px-3 py-1 rounded-full">-{discount}%</span>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-[color:var(--token-card-border,#18181b)] ring-2 ring-zinc-900/20' : 'border-[color:var(--token-card-border,#e4e4e7)] hover:border-[color:var(--token-card-border,#a1a1aa)]'}`} data-edit-collection="images" data-edit-index={i}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {images.length > 4 && (
                <div className="w-20 h-20 rounded-xl border-2 border-[color:var(--token-card-border,#e4e4e7)] flex items-center justify-center text-sm text-[color:var(--token-body,#a1a1aa)] font-medium">
                  +{images.length - 4}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          {/* Category badge */}
          {product.categoryName && (
            <span className="inline-block text-xs font-medium text-[color:var(--token-muted,#71717a)] bg-[var(--token-section-bg-alt,#f4f4f5)] px-3 py-1 rounded-full w-fit mb-3">{product.categoryName}</span>
          )}

          <h1 className="text-2xl md:text-3xl font-bold mb-2" data-edit-path="title">{product.title}</h1>

          {product.shortDescription && (
            <p className="text-[color:var(--token-muted,#71717a)] mb-4">{product.shortDescription}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">{formatPrice(currentPrice)}</span>
            {product.comparePriceCents && (
              <span className="text-lg text-[color:var(--token-body,#a1a1aa)] line-through">{formatPrice(product.comparePriceCents)}</span>
            )}
          </div>

          {/* Highlights / Facts */}
          {highlights.length > 0 && (
            <div className="bg-[var(--token-section-bg-alt,#fafafa)] rounded-xl p-4 mb-6">
              <ul className="space-y-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" data-edit-collection="highlights" data-edit-index={i}>
                    <Sparkles size={14} className="text-amber-500 shrink-0" />
                    <span className="text-[color:var(--token-muted,#3f3f46)]">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Variant options */}
          {product.variantOptions?.map(opt => (
            <div key={opt.name} className="mb-5">
              <label className="text-sm font-medium text-[color:var(--token-muted,#3f3f46)] mb-2 block" data-edit-path="name">{opt.name}</label>
              <div className="flex flex-wrap gap-2">
                {opt.values.map(val => {
                  const matchVariant = variants.find(v => v.name.includes(val));
                  const isSelected = matchVariant?.id === selectedVariant;
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedVariant(matchVariant?.id || null)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${isSelected ? 'border-[color:var(--token-card-border,#18181b)] bg-[var(--token-section-bg-alt,#18181b)] text-[color:var(--token-on-dark-heading,#ffffff)]' : 'border-[color:var(--token-card-border,#e4e4e7)] hover:border-[color:var(--token-card-border,#a1a1aa)]'}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Add to cart */}
          <div className="flex items-center gap-4 mt-auto pt-4">
            <div className="flex items-center border border-[color:var(--token-card-border,#e4e4e7)] rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-[var(--token-section-bg-alt,#fafafa)] rounded-l-xl transition"><Minus size={16} /></button>
              <span className="w-10 text-center font-medium text-sm">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-[var(--token-section-bg-alt,#fafafa)] rounded-r-xl transition"><Plus size={16} /></button>
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              style={{ backgroundColor: outOfStock ? '#d4d4d8' : added ? '#22c55e' : '#18181b', color: '#ffffff' }}
              className={`flex-1 py-3.5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${outOfStock ? 'cursor-not-allowed' : added ? 'scale-[1.02]' : 'hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]'}`}
            >
              {outOfStock ? 'Ausverkauft' : added ? <><Check size={18} /> Hinzugefügt!</> : <><ShoppingBag size={18} /> In den Warenkorb</>}
            </button>
          </div>

          {!product.isDigital && currentStock > 0 && currentStock <= 5 && (
            <p className="text-xs text-orange-600 mt-2 font-medium">⚡ Nur noch {currentStock} auf Lager!</p>
          )}

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[color:var(--token-card-border,#f4f4f5)]">
            <div className="flex items-center gap-2 text-xs text-[color:var(--token-muted,#71717a)]">
              <Truck size={14} /> Schneller Versand
            </div>
            <div className="flex items-center gap-2 text-xs text-[color:var(--token-muted,#71717a)]">
              <ShieldCheck size={14} /> Sicherer Kauf
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 pt-8 border-t border-[color:var(--token-card-border,#f4f4f5)]">
          <h2 className="text-lg font-semibold mb-4">Beschreibung</h2>
          <div className="text-sm text-[color:var(--token-muted,#52525b)] whitespace-pre-line leading-relaxed">{plain(product.description)}</div>
        </div>
      )}
    </section>
  );
}

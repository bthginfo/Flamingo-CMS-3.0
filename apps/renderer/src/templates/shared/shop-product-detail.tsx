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
  const catalogPath = (data.catalogPath as string) || shopBase;

  const slug = (data._slug as string) || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);

  useEffect(() => {
    if (data._product || !slug) return;
    setLoading(true);
    const params = data.tenantId ? `?tenantId=${data.tenantId}` : '';
    fetch(`/api/shop/products/${encodeURIComponent(slug)}${params}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(d => {
        if (d.product) setFetchedProduct({ ...d.product, variants: d.variants, variantOptions: d.options });
      })
      .catch(() => {})
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
    return <section className="py-16 text-center text-[color:var(--token-body)]">Produkt wird geladen…</section>;
  }

  if (!product) {
    return <section className="py-16 text-center text-[color:var(--token-body)]">Produkt nicht gefunden.</section>;
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
      <Link href={catalogPath} className="inline-flex items-center gap-2 text-sm text-[color:var(--token-muted)] hover:text-[color:var(--token-heading)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Zurück zum Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-[var(--token-section-bg-alt)] rounded-2xl overflow-hidden relative group">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={60} className="text-[color:var(--token-body)]" /></div>
            )}
            {images.length > 1 && (
              <>
                <button aria-label="Vorheriges Bild" onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-[color-mix(in_srgb,var(--token-card-bg)_90%,transparent)] rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-[var(--token-card-bg)] transition-all"><ChevronLeft size={18} /></button>
                <button aria-label="Nächstes Bild" onClick={() => setSelectedImage((selectedImage + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[color-mix(in_srgb,var(--token-card-bg)_90%,transparent)] rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-[var(--token-card-bg)] transition-all"><ChevronRight size={18} /></button>
              </>
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[color:var(--token-danger-bg)] text-[color:var(--token-on-dark-heading)] text-xs font-bold px-3 py-1 rounded-full">-{discount}%</span>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.slice(0, 4).map((img, i) => (
                <button key={i} aria-label={`Bild ${i + 1} anzeigen`} aria-pressed={i === selectedImage} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-[color:var(--token-card-border)] ring-2 ring-zinc-900/20' : 'border-[color:var(--token-card-border)] hover:border-[color:var(--token-card-border)]'}`} data-card data-edit-collection="images" data-edit-index={i}>
                  <img data-edit-image="img" src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {images.length > 4 && (
                <div className="w-20 h-20 rounded-xl border-2 border-[color:var(--token-card-border)] flex items-center justify-center text-sm text-[color:var(--token-card-body,var(--token-body))] font-medium">
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
            <span className="inline-block text-xs font-medium text-[color:var(--token-card-muted,var(--token-muted))] bg-[var(--token-section-bg-alt)] px-3 py-1 rounded-full w-fit mb-3">{product.categoryName}</span>
          )}

          <h1 className="text-2xl md:text-3xl font-bold mb-2" data-edit-path="title">{product.title}</h1>

          {product.shortDescription && (
            <p className="text-[color:var(--token-card-muted,var(--token-muted))] mb-4">{product.shortDescription}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-[color:var(--token-price)]">{formatPrice(currentPrice)}</span>
            {product.comparePriceCents && (
              <span className="text-lg text-[color:var(--token-price-strikethrough)] line-through">{formatPrice(product.comparePriceCents)}</span>
            )}
          </div>

          {/* Highlights / Facts */}
          {highlights.length > 0 && (
            <div className="bg-[var(--token-section-bg-alt)] rounded-xl p-4 mb-6">
              <ul className="space-y-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" data-edit-collection="highlights" data-edit-index={i}>
                    <Sparkles size={14} className="text-[color:var(--token-rating-star)] shrink-0" />
                    <span className="text-[color:var(--token-card-muted,var(--token-muted))]">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Variant options */}
          {product.variantOptions?.map(opt => (
            <div key={opt.name} className="mb-5">
              <label className="text-sm font-medium text-[color:var(--token-label)] mb-2 block" data-edit-path="name">{opt.name}</label>
              <div className="flex flex-wrap gap-2">
                {opt.values.map(val => {
                  const matchVariant = variants.find(v => v.name.includes(val));
                  const isSelected = matchVariant?.id === selectedVariant;
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedVariant(matchVariant?.id || null)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${isSelected ? 'border-[color:var(--token-card-border)] bg-[var(--token-section-bg-alt)] text-[color:var(--token-on-dark-heading)]' : 'border-[color:var(--token-card-border)] hover:border-[color:var(--token-card-border)]'}`}
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
            <div className="flex items-center border border-[color:var(--token-card-border)] rounded-xl">
              <button aria-label="Menge verringern" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-[var(--token-section-bg-alt)] rounded-l-xl transition"><Minus size={16} /></button>
              <span className="w-10 text-center font-medium text-sm" aria-live="polite">{quantity}</span>
              <button aria-label="Menge erhöhen" onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-[var(--token-section-bg-alt)] rounded-r-xl transition"><Plus size={16} /></button>
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              style={{ backgroundColor: outOfStock ? '#d4d4d8' : added ? '#22c55e' : '#18181b', color: '#ffffff' }}
              className={`flex-1 py-3.5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${outOfStock ? 'cursor-not-allowed' : added ? 'scale-[1.02]' : 'hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]'}`}
            >
              {outOfStock ? 'Ausverkauft' : added ? <><Check className="text-[color:var(--token-check)]" size={18} /> Hinzugefügt!</> : <><ShoppingBag size={18} /> In den Warenkorb</>}
            </button>
          </div>

          {!product.isDigital && currentStock > 0 && currentStock <= 5 && (
            <p className="mt-2 text-xs font-medium text-[var(--token-danger)]">⚡ Nur noch {currentStock} auf Lager!</p>
          )}

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[color:var(--token-card-border)]">
            <div className="flex items-center gap-2 text-xs text-[color:var(--token-card-muted,var(--token-muted))]">
              <Truck size={14} /> Schneller Versand
            </div>
            <div className="flex items-center gap-2 text-xs text-[color:var(--token-card-muted,var(--token-muted))]">
              <ShieldCheck size={14} /> Sicherer Kauf
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 pt-8 border-t border-[color:var(--token-card-border)]">
          <h2 className="text-lg font-semibold mb-4">Beschreibung</h2>
          <div className="text-sm text-[color:var(--token-card-muted,var(--token-muted))] whitespace-pre-line leading-relaxed" data-edit-path="description">{plain(product.description)}</div>
        </div>
      )}
    </section>
  );
}

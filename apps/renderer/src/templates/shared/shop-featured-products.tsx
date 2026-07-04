'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  comparePriceCents?: number | null;
  images: string[];
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export function ShopFeaturedProductsSection({ data }: Props) {
  const headline = (data.headline as string) || 'Empfohlene Produkte';
  const mode = (data.mode as string) || 'latest';
  const categorySlug = (data.categorySlug as string) || '';
  const productIds = (data.productIds as string[]) || [];
  const count = (data.count as number) || 4;
  const columns = (data.columns as number) || 4;
  const shopBase = (data.basePath as string) || '/shop';
  const previewProducts = (data.products as Product[] | undefined) || [];
  const [products, setProducts] = useState<Product[]>(previewProducts.slice(0, count));

  useEffect(() => {
    if (previewProducts.length > 0) return;
    let url = '/api/shop/products?limit=' + count;
    if (data.tenantId) url += '&tenantId=' + data.tenantId;
    if (mode === 'category' && categorySlug) {
      url += '&category=' + encodeURIComponent(categorySlug);
    }
    if (mode === 'manual' && productIds.length) {
      url += '&ids=' + productIds.join(',');
    }
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(d => setProducts((d.products || []).slice(0, count)))
      .catch(() => setProducts([]));
  }, [mode, categorySlug, count, productIds.join(','), data.tenantId, previewProducts.length]);

  if (products.length === 0) return null;

  const colsClass = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';

  return (
    <section className="py-12 md:py-16">
      <h2 className="text-2xl font-bold mb-8 text-center" data-edit-path="headline">{headline}</h2>
      <div className={`grid grid-cols-2 ${colsClass} gap-4 md:gap-6`}>
        {products.map(product => (
          <Link key={product.id} href={`${shopBase}/${product.slug}`} className="group">
            <div className="relative rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {product.comparePriceCents && product.comparePriceCents > product.priceCents && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--token-btn-bg)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[color:var(--token-btn-text)] shadow">
                  −{Math.round((1 - product.priceCents / product.comparePriceCents) * 100)} %
                </span>
              )}
              <div className="aspect-square bg-[color:var(--token-section-bg-alt,var(--token-card-bg))] overflow-hidden">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={32} className="text-[var(--token-muted,theme(colors.zinc.200))]" /></div>
                )}
              </div>
              <div className="p-3.5">
                <h3 className="font-medium text-sm truncate text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{product.title}</h3>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="font-bold text-[color:var(--token-price)]">{formatPrice(product.priceCents)}</span>
                  {product.comparePriceCents && <span className="text-xs text-[color:var(--token-muted)] line-through">{formatPrice(product.comparePriceCents)}</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

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
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/shop/products')
      .then(r => r.json())
      .then(d => setProducts((d.products || []).slice(0, 4)));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <h2 className="text-2xl font-bold mb-8 text-center">{headline}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map(product => (
          <Link key={product.id} href={`/shop/${product.slug}`} className="group">
            <div className="rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-zinc-50 overflow-hidden">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={32} className="text-zinc-200" /></div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{product.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold">{formatPrice(product.priceCents)}</span>
                  {product.comparePriceCents && <span className="text-xs text-zinc-400 line-through">{formatPrice(product.comparePriceCents)}</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  comparePriceCents?: number | null;
  images: string[];
  shortDescription?: string;
  categoryName?: string;
  categorySlug?: string;
  status: string;
  stock: number;
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export function ShopProductGridSection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Produkte';
  const showSearch = data.showSearch !== false;
  const showCategories = data.showCategories !== false;
  const columns = (data.columns as number) || 3;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/shop/products')
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setCategories(d.categories || []); })
      .finally(() => setLoading(false));
  }, []);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  const filtered = useMemo(() => {
    let items = products.filter(p => p.status === 'active');
    if (search) items = items.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory) items = items.filter(p => p.categorySlug === activeCategory);
    switch (sortBy) {
      case 'price-asc': items.sort((a, b) => a.priceCents - b.priceCents); break;
      case 'price-desc': items.sort((a, b) => b.priceCents - a.priceCents); break;
      case 'name': items.sort((a, b) => a.title.localeCompare(b.title, 'de')); break;
    }
    return items;
  }, [products, search, activeCategory, sortBy]);

  return (
    <section className="py-12 md:py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">{headline}</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {showSearch && (
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Produkt suchen…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-zinc-400" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white">
            <option value="default">Standard</option>
            <option value="price-asc">Preis aufsteigend</option>
            <option value="price-desc">Preis absteigend</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Category filter */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveCategory(null)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${!activeCategory ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
            Alle
          </button>
          {categories.map(c => (
            <button key={c.slug} onClick={() => setActiveCategory(c.slug)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === c.slug ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      {loading ? (
        <div className="text-center py-16 text-zinc-400">Produkte werden geladen…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <ShoppingBag size={40} className="mx-auto mb-3 opacity-50" />
          <p>Keine Produkte gefunden.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-6`}>
          {filtered.map(product => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group">
              <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-zinc-50 relative overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={40} className="text-zinc-200" />
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Ausverkauft</div>
                  )}
                  {product.comparePriceCents && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">Sale</div>
                  )}
                </div>
                <div className="p-4">
                  {product.categoryName && <p className="text-xs text-zinc-400 mb-1">{product.categoryName}</p>}
                  <h3 className="font-semibold text-sm group-hover:text-zinc-600 transition">{product.title}</h3>
                  {product.shortDescription && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{product.shortDescription}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="font-bold text-lg">{formatPrice(product.priceCents)}</span>
                    {product.comparePriceCents && (
                      <span className="text-sm text-zinc-400 line-through">{formatPrice(product.comparePriceCents)}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const shopBase = (data.basePath as string) || '/shop';
  const isSectionPreview = data._isSectionPreview === true;

  const previewProducts = (data.products as Product[] | undefined) || [];
  const previewCategories = (data.categories as { name: string; slug: string }[] | undefined) || [];
  const [products, setProducts] = useState<Product[]>(previewProducts);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>(previewCategories);
  const [loading, setLoading] = useState(previewProducts.length === 0);

  useEffect(() => {
    if (previewProducts.length > 0) return;
    const params = data.tenantId ? `?tenantId=${data.tenantId}` : '';
    fetch(`/api/shop/products${params}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(d => { setProducts(d.products || []); setCategories(d.categories || []); })
      .catch(() => { setProducts([]); setCategories([]); })
      .finally(() => setLoading(false));
  }, [data.tenantId, previewProducts.length]);

  const searchParams = useSearchParams();
  const kategorieParam = searchParams.get('kategorie');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(kategorieParam);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 0]);

  // Sync category filter with URL param changes
  useEffect(() => {
    setActiveCategory(kategorieParam);
  }, [kategorieParam]);

  // Set price range from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.priceCents);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange([min, max]);
      setPriceFilter([min, max]);
    }
  }, [products]);

  const filtered = useMemo(() => {
    let items = products.filter(p => p.status === 'active');
    if (search) items = items.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory) items = items.filter(p => p.categorySlug === activeCategory);
    if (priceFilter[0] > priceRange[0] || priceFilter[1] < priceRange[1]) {
      items = items.filter(p => p.priceCents >= priceFilter[0] && p.priceCents <= priceFilter[1]);
    }
    switch (sortBy) {
      case 'price-asc': items.sort((a, b) => a.priceCents - b.priceCents); break;
      case 'price-desc': items.sort((a, b) => b.priceCents - a.priceCents); break;
      case 'name': items.sort((a, b) => a.title.localeCompare(b.title, 'de')); break;
    }
    return items;
  }, [products, search, activeCategory, sortBy, priceFilter, priceRange]);

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center" data-edit-path="headline">{headline}</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {showSearch && (
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--token-card-body,var(--token-body))]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Produkt suchen…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[color:var(--token-input-border)] bg-[var(--token-input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--token-card-border)] focus:bg-[var(--token-card-bg)] transition"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[color:var(--token-card-body,var(--token-body))]" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="text-sm border border-[color:var(--token-card-border)] rounded-lg px-3 py-2.5 bg-[var(--token-section-bg-alt)]">
            <option value="default">Standard</option>
            <option value="price-asc">Preis aufsteigend</option>
            <option value="price-desc">Preis absteigend</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Price filter */}
      {priceRange[1] > priceRange[0] && (
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
          <span className="text-[color:var(--token-muted)]">Preis:</span>
          <span className="text-[color:var(--token-muted)] font-medium">{formatPrice(priceFilter[0])}</span>
          <input
            type="range"
            min={priceRange[0]} max={priceRange[1]} step={100}
            value={priceFilter[0]}
            onChange={e => setPriceFilter([Math.min(Number(e.target.value), priceFilter[1]), priceFilter[1]])}
            className="w-24 sm:w-32 accent-[var(--token-icon)]"
          />
          <span className="text-[color:var(--token-card-body,var(--token-body))]">–</span>
          <input
            type="range"
            min={priceRange[0]} max={priceRange[1]} step={100}
            value={priceFilter[1]}
            onChange={e => setPriceFilter([priceFilter[0], Math.max(Number(e.target.value), priceFilter[0])])}
            className="w-24 sm:w-32 accent-[var(--token-icon)]"
          />
          <span className="text-[color:var(--token-muted)] font-medium">{formatPrice(priceFilter[1])}</span>
          {(priceFilter[0] > priceRange[0] || priceFilter[1] < priceRange[1]) && (
            <button onClick={() => setPriceFilter(priceRange)} className="text-xs text-[color:var(--token-muted)] underline">Zurücksetzen</button>
          )}
        </div>
      )}

      {/* Category filter */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveCategory(null)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${!activeCategory ? 'bg-[var(--token-section-bg-alt)] text-[color:var(--token-on-dark-heading)]' : 'bg-[var(--token-section-bg-alt)] text-[color:var(--token-muted)] hover:bg-[var(--token-section-bg-alt,theme(colors.zinc.200))]'}`}>
            Alle
          </button>
          {categories.map(c => (
            <button key={c.slug} onClick={() => setActiveCategory(c.slug)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === c.slug ? 'bg-[var(--token-section-bg-alt)] text-[color:var(--token-on-dark-heading)]' : 'bg-[var(--token-section-bg-alt)] text-[color:var(--token-muted)] hover:bg-[var(--token-section-bg-alt,theme(colors.zinc.200))]'}`} data-edit-path="name">
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      {loading ? (
        <div className="text-center py-16 text-[color:var(--token-card-body,var(--token-body))]">Produkte werden geladen…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[color:var(--token-card-body,var(--token-body))]">
          <ShoppingBag size={40} className="mx-auto mb-3 opacity-50" />
          <p>Keine Produkte gefunden.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-6 md:gap-8`}>
          {filtered.map(product => {
            const card = (
              <div className="rounded-2xl border border-[color:var(--token-card-border)] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-[var(--token-card-bg)]">
                <div className="aspect-[4/5] bg-[var(--token-section-bg-alt)] relative overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={40} className="text-[color:var(--token-card-body,var(--token-body))]" />
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-3 left-3 bg-[var(--token-danger-bg)] text-[color:var(--token-on-dark-heading)] text-xs font-bold px-2.5 py-1 rounded-full">Ausverkauft</div>
                  )}
                  {product.comparePriceCents && (
                    <div className="absolute top-3 right-3 bg-[color:var(--token-success-bg)] text-[color:var(--token-on-dark-heading)] text-xs font-bold px-2.5 py-1 rounded-full">Sale</div>
                  )}
                </div>
                <div className="p-5">
                  {product.categoryName && <p className="text-xs text-[color:var(--token-card-body,var(--token-body))] uppercase tracking-wide mb-1">{product.categoryName}</p>}
                  <h3 className="font-semibold group-hover:text-[color:var(--token-muted)] transition" data-edit-path="title">{product.title}</h3>
                  {product.shortDescription && <p className="text-sm text-[color:var(--token-muted)] mt-1.5 line-clamp-2">{product.shortDescription}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="font-bold text-lg text-[color:var(--token-price)]">{formatPrice(product.priceCents)}</span>
                    {product.comparePriceCents && (
                      <span className="text-sm text-[color:var(--token-price-strikethrough)] line-through">{formatPrice(product.comparePriceCents)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
            return isSectionPreview ? (
              <div key={product.id} className="group" aria-label={`${product.title} – Produktvorschau`}>
                {card}
              </div>
            ) : (
              <Link key={product.id} href={`${shopBase}/${product.slug}`} className="group">
                {card}
              </Link>
            );
          })}
        </div>
      )}
      </div>
    </section>
  );
}

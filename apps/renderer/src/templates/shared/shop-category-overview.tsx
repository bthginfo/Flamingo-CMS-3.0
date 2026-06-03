'use client';

import { useState, useEffect } from 'react';
import { FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { plain } from '@/lib/strip-html';

type Category = { id: string; name: string; slug: string; description?: string | null; image?: string | null };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ShopCategoryOverviewSection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Kategorien';
  const subline = (data.subline as string) || '';
  const columns = (data.columns as number) || 3;
  const shopBase = (data.basePath as string) || '/shop';
  const shopGridPath = (data.shopGridPath as string) || shopBase;

  const previewCategories = (data.categories as Category[] | undefined) || [];
  const [categories, setCategories] = useState<Category[]>(previewCategories);
  const [loading, setLoading] = useState(previewCategories.length === 0);

  useEffect(() => {
    if (previewCategories.length > 0) return;
    const params = data.tenantId ? `?tenantId=${data.tenantId}` : '';
    fetch(`/api/shop/products${params}`)
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .finally(() => setLoading(false));
  }, [data.tenantId, previewCategories.length]);

  if (loading) return <section className="py-12 text-center text-zinc-400">Kategorien werden geladen…</section>;
  if (categories.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{headline}</h2>
        {subline && <p className="text-zinc-500 mt-2 max-w-lg mx-auto">{plain(subline)}</p>}
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-6`}>
        {categories.map(cat => (
          <Link key={cat.id} href={`${shopGridPath}?kategorie=${cat.slug}`} className="group">
            <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-zinc-50 relative overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen size={40} className="text-zinc-200" />
                  </div>
                )}
              </div>
              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg group-hover:text-zinc-600 transition">{cat.name}</h3>
                {cat.description && <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{plain(cat.description)}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

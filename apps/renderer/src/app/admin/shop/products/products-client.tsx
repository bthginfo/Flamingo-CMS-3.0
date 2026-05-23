'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Pencil, Trash2, Package } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct } from '../actions';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  stock: number;
  status: 'draft' | 'active' | 'archived';
  categoryId: string | null;
  images: string[] | null;
};

type Category = {
  id: string;
  name: string;
};

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Entwurf', color: 'bg-zinc-100 text-zinc-600' },
  active: { label: 'Aktiv', color: 'bg-green-50 text-green-700' },
  archived: { label: 'Archiviert', color: 'bg-orange-50 text-orange-700' },
};

export function ProductsList({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = products.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  async function handleDelete(id: string) {
    if (!confirm('Produkt wirklich löschen?')) return;
    await deleteProduct(id);
    router.refresh();
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Produkt suchen…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white"
        >
          <option value="all">Alle Status</option>
          <option value="draft">Entwurf</option>
          <option value="active">Aktiv</option>
          <option value="archived">Archiviert</option>
        </select>
        <Link
          href="/admin/shop/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} /> Neues Produkt
        </Link>
      </div>

      {/* Product list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <Package size={40} className="mx-auto mb-3 opacity-50" />
          <p>Keine Produkte gefunden.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const st = statusLabels[p.status] || statusLabels.draft;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-4 relative">
                {/* Image */}
                <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="text-zinc-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-zinc-500">{formatPrice(p.priceCents)}</span>
                    {p.categoryId && categoryMap[p.categoryId] && (
                      <span className="text-xs text-zinc-400">· {categoryMap[p.categoryId]}</span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                  </div>
                </div>

                {/* Stock */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{p.stock}</p>
                  <p className="text-[10px] text-zinc-400">Bestand</p>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                    className="p-2 hover:bg-zinc-100 rounded-lg"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpen === p.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 py-1 w-40">
                      <Link
                        href={`/admin/shop/products/${p.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-50 w-full"
                        onClick={() => setMenuOpen(null)}
                      >
                        <Pencil size={14} /> Bearbeiten
                      </Link>
                      <button
                        onClick={() => { setMenuOpen(null); handleDelete(p.id); }}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 w-full text-left"
                      >
                        <Trash2 size={14} /> Löschen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

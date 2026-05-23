'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

type Category = { id: string; name: string };

type ProductData = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  priceCents: number;
  comparePriceCents: number | null;
  sku: string;
  stock: number;
  trackStock: boolean;
  isDigital: boolean;
  categoryId: string | null;
  status: 'draft' | 'active' | 'archived';
  images: string[];
  weightGrams: number | null;
  taxClass: string;
  metaTitle: string;
  metaDescription: string;
};

const defaultProduct: ProductData = {
  title: '', slug: '', description: '', shortDescription: '',
  priceCents: 0, comparePriceCents: null, sku: '', stock: 0,
  trackStock: true, isDigital: false, categoryId: null,
  status: 'draft', images: [], weightGrams: null, taxClass: 'standard',
  metaTitle: '', metaDescription: '',
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductData }) {
  const router = useRouter();
  const [data, setData] = useState<ProductData>(initial || defaultProduct);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?.id;

  function set<K extends keyof ProductData>(key: K, value: ProductData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!data.title.trim()) return;
    setSaving(true);
    const slug = data.slug || slugify(data.title);
    const payload = { ...data, slug, comparePriceCents: data.comparePriceCents ?? undefined };

    if (isEdit && initial?.id) {
      await updateProduct(initial.id, payload);
    } else {
      await createProduct(payload);
    }
    router.push('/admin/shop/products');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/shop/products" className="p-2 hover:bg-zinc-100 rounded-lg">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1" />
        <button
          onClick={handleSave}
          disabled={saving || !data.title.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'Speichern…' : 'Speichern'}
        </button>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Grunddaten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Titel *</label>
            <input
              value={data.title}
              onChange={e => { set('title', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Produktname"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Slug</label>
            <input
              value={data.slug}
              onChange={e => set('slug', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="produkt-slug"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Kurzbeschreibung</label>
          <input
            value={data.shortDescription}
            onChange={e => set('shortDescription', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Wird in der Produktliste angezeigt"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Beschreibung</label>
          <textarea
            value={data.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-y"
            placeholder="Ausführliche Produktbeschreibung (HTML erlaubt)"
          />
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Preis & Bestand</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Preis (€) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={(data.priceCents / 100).toFixed(2)}
              onChange={e => set('priceCents', Math.round(parseFloat(e.target.value || '0') * 100))}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Streichpreis (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data.comparePriceCents ? (data.comparePriceCents / 100).toFixed(2) : ''}
              onChange={e => set('comparePriceCents', e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="optional"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">SKU</label>
            <input
              value={data.sku}
              onChange={e => set('sku', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="ART-001"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Bestand</label>
            <input
              type="number"
              min="0"
              value={data.stock}
              onChange={e => set('stock', parseInt(e.target.value || '0'))}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.trackStock} onChange={e => set('trackStock', e.target.checked)} className="rounded" />
            Bestand verfolgen
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.isDigital} onChange={e => set('isDigital', e.target.checked)} className="rounded" />
            Digitales Produkt (kein Versand)
          </label>
        </div>
      </div>

      {/* Category & Status */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Kategorie & Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Kategorie</label>
            <select
              value={data.categoryId || ''}
              onChange={e => set('categoryId', e.target.value || null)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="">Keine Kategorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
            <select
              value={data.status}
              onChange={e => set('status', e.target.value as ProductData['status'])}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="draft">Entwurf</option>
              <option value="active">Aktiv</option>
              <option value="archived">Archiviert</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Steuerklasse</label>
            <select
              value={data.taxClass}
              onChange={e => set('taxClass', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="standard">Standard (19%)</option>
              <option value="reduced">Ermäßigt (7%)</option>
              <option value="free">Steuerfrei</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Versand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Gewicht (Gramm)</label>
            <input
              type="number"
              min="0"
              value={data.weightGrams || ''}
              onChange={e => set('weightGrams', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="z.B. 500"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">SEO</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Meta-Titel</label>
            <input
              value={data.metaTitle}
              onChange={e => set('metaTitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Falls leer wird Produkttitel verwendet"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Meta-Beschreibung</label>
            <textarea
              value={data.metaDescription}
              onChange={e => set('metaDescription', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-y"
              placeholder="156 Zeichen max"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

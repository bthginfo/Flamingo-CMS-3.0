'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '../actions';
import { ArrowLeft, Save, X, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ImageUploadField } from '@/components/image-upload-field';
import { usePreview } from '@/components/admin/preview-context';

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
  highlights: string[];
};

const defaultProduct: ProductData = {
  title: '', slug: '', description: '', shortDescription: '',
  priceCents: 0, comparePriceCents: null, sku: '', stock: 0,
  trackStock: true, isDigital: false, categoryId: null,
  status: 'draft', images: [], weightGrams: null, taxClass: 'standard',
  metaTitle: '', metaDescription: '', highlights: [],
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductData }) {
  const router = useRouter();
  const preview = usePreview();
  const [data, setData] = useState<ProductData>(initial || defaultProduct);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const isEdit = !!initial?.id;

  // Set preview URL to PDP when editing a product
  useEffect(() => {
    if (data.slug) {
      preview.setUrl(`/shop/${data.slug}`);
    }
    return () => { preview.setUrl('/live-preview'); };
  }, [data.slug]);

  function set<K extends keyof ProductData>(key: K, value: ProductData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!data.title.trim()) return;
    setSaving(true);
    const slug = data.slug || slugify(data.title);
    const payload = {
      ...data,
      slug,
      comparePriceCents: data.comparePriceCents ?? undefined,
      categoryId: data.categoryId || undefined,
      weightGrams: data.weightGrams ?? undefined,
    };

    if (isEdit && initial?.id) {
      await updateProduct(initial.id, payload);
      toast.success('Produkt gespeichert');
    } else {
      await createProduct(payload);
      toast.success('Produkt erstellt');
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
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition ${showPreview ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
        >
          <Eye size={16} /> Vorschau
        </button>
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
            placeholder="Ausführliche Produktbeschreibung (Absätze mit Enter trennen)"
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Produktbilder</h2>
        <p className="text-xs text-zinc-400">Erstes Bild wird als Hauptbild verwendet.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.images.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img} alt="" className="w-full aspect-square object-cover rounded-lg border border-zinc-200" />
              <button onClick={() => set('images', data.images.filter((_, j) => j !== i))} className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
                <X size={14} className="text-red-500" />
              </button>
            </div>
          ))}
          <div className="aspect-square">
            <ImageUploadField label="" value="" onChange={url => { if (url) set('images', [...data.images, url]); }} />
          </div>
        </div>
      </div>

      {/* Highlights / Facts */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <h2 className="font-semibold text-sm text-zinc-700">Highlights / Fakten</h2>
        <p className="text-xs text-zinc-400">Werden auf der Produktdetailseite als Auflistung angezeigt (z.B. &quot;Bio-zertifiziert&quot;, &quot;Handgemacht&quot;).</p>
        {data.highlights.map((h, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={h}
              onChange={e => { const arr = [...data.highlights]; arr[i] = e.target.value; set('highlights', arr); }}
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="z.B. Bio-zertifiziert"
            />
            <button type="button" onClick={() => set('highlights', data.highlights.filter((_, j) => j !== i))} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm">×</button>
          </div>
        ))}
        <button type="button" onClick={() => set('highlights', [...data.highlights, ''])} className="text-sm text-pink-600 hover:text-pink-700 font-medium">+ Highlight hinzufügen</button>
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
      {/* Live Preview */}
      {showPreview && (
        <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
          <h2 className="font-semibold text-sm text-zinc-700">Vorschau (Produktdetailseite)</h2>
          <div className="border border-zinc-100 rounded-xl p-6 bg-zinc-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image gallery */}
              <div className="space-y-3">
                {data.images.length > 0 ? (
                  <>
                    <div className="aspect-square rounded-xl overflow-hidden bg-white border border-zinc-200">
                      <img src={data.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    {data.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {data.images.map((img, i) => (
                          <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 shrink-0">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-square rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-400 text-sm">
                    Kein Bild
                  </div>
                )}
              </div>
              {/* Product info */}
              <div className="space-y-4">
                {data.categoryId && (
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">
                    {categories.find(c => c.id === data.categoryId)?.name}
                  </p>
                )}
                <h1 className="text-2xl font-bold text-zinc-900">{data.title || 'Produkttitel'}</h1>
                {data.shortDescription && (
                  <p className="text-sm text-zinc-600">{data.shortDescription}</p>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-zinc-900">
                    {(data.priceCents / 100).toFixed(2).replace('.', ',')} €
                  </span>
                  {data.comparePriceCents && (
                    <span className="text-lg text-zinc-400 line-through">
                      {(data.comparePriceCents / 100).toFixed(2).replace('.', ',')} €
                    </span>
                  )}
                </div>
                {data.highlights.length > 0 && (
                  <ul className="space-y-1.5">
                    {data.highlights.filter(h => h.trim()).map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {h}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <div className="px-4 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl cursor-default">
                    In den Warenkorb
                  </div>
                </div>
                {data.description && (
                  <div className="pt-4 border-t border-zinc-200">
                    <p className="text-sm text-zinc-600 whitespace-pre-line">{data.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { updateItemAction } from '../../actions';
import { toast } from 'sonner';

type Item = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  priority: number;
  data: Record<string, unknown>;
};

export function ItemEditor({ item: initial, collectionKey }: { item: Item; collectionKey: string }) {
  const [item, setItem] = useState(initial);
  const [json, setJson] = useState(JSON.stringify(initial.data, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [pending, startTransition] = useTransition();

  function handleSave() {
    let parsedData: Record<string, unknown>;
    try {
      parsedData = JSON.parse(json);
      setJsonError('');
    } catch {
      setJsonError('Ungültiges JSON');
      return;
    }
    startTransition(async () => {
      await updateItemAction(item.id, {
        title: item.title,
        slug: item.slug,
        published: item.published,
        priority: item.priority,
        data: parsedData,
      });
      toast.success('Gespeichert');
    });
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/collections/${collectionKey}`} className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold flex-1">{item.title}</h1>
        <button onClick={handleSave} disabled={pending} className="admin-btn-primary flex items-center gap-2">
          <Save size={16} /> Speichern
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="admin-card space-y-3">
            <label className="block text-sm">
              <span className="text-gray-600 text-xs">Titel</span>
              <input className="admin-input mt-1 w-full" value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 text-xs">Slug</span>
              <input className="admin-input mt-1 w-full" value={item.slug} onChange={(e) => setItem({ ...item, slug: e.target.value })} />
            </label>
          </div>
          <div className="admin-card">
            <h3 className="text-sm font-medium mb-2">Daten (JSON)</h3>
            <textarea className="admin-input font-mono text-xs w-full" rows={16} value={json} onChange={(e) => setJson(e.target.value)} />
            {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <div className="admin-card space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={item.published} onChange={() => setItem({ ...item, published: !item.published })} />
              Veröffentlicht
            </label>
            <label className="block text-sm">
              <span className="text-gray-600 text-xs">Priorität</span>
              <input type="number" className="admin-input mt-1 w-full" value={item.priority} onChange={(e) => setItem({ ...item, priority: parseInt(e.target.value) || 0 })} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

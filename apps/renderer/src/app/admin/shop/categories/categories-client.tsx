'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '../actions';
import { useRouter } from 'next/navigation';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  sortOrder: number;
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  function startNew() {
    setEditId(null); setName(''); setSlug(''); setDescription(''); setShowForm(true);
  }

  function startEdit(cat: Category) {
    setEditId(cat.id); setName(cat.name); setSlug(cat.slug); setDescription(cat.description || ''); setShowForm(true);
  }

  async function handleSave() {
    const s = slug || slugify(name);
    if (editId) {
      await updateCategory(editId, { name, slug: s, description: description || undefined });
    } else {
      await createCategory({ name, slug: s, description: description || undefined });
    }
    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Kategorie löschen?')) return;
    await deleteCategory(id);
    router.refresh();
  }

  return (
    <div>
      <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
        <Plus size={16} /> Neue Kategorie
      </button>

      {showForm && (
        <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Name *</label>
              <input value={name} onChange={e => { setName(e.target.value); if (!editId) setSlug(slugify(e.target.value)); }} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="Kategoriename" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Slug</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Beschreibung</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="Optional" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={!name.trim()} className="px-4 py-2 bg-zinc-900 text-white text-sm rounded-lg disabled:opacity-50">Speichern</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-zinc-200 text-sm rounded-lg">Abbrechen</button>
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <FolderOpen size={40} className="mx-auto mb-3 opacity-50" />
          <p>Noch keine Kategorien erstellt.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-3">
              <FolderOpen size={18} className="text-zinc-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{cat.name}</p>
                <p className="text-xs text-zinc-400">{cat.slug}</p>
              </div>
              <button onClick={() => startEdit(cat)} className="p-2 hover:bg-zinc-100 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

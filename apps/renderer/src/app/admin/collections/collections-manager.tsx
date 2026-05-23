'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderOpen, ChevronRight, Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import { createCollectionAction, updateCollectionAction, deleteCollectionAction } from './actions';
import { toast } from 'sonner';

type Collection = { id: string; key: string; label: string };

export function CollectionsManager({ collections }: { collections: Collection[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createCollectionAction(formData);
      setShowCreate(false);
      router.refresh();
      toast.success('Collection erstellt');
    });
  }

  function handleRename(id: string) {
    if (!editLabel.trim()) return;
    startTransition(async () => {
      await updateCollectionAction(id, { label: editLabel.trim() });
      setEditing(null);
      router.refresh();
      toast.success('Umbenannt');
    });
  }

  function handleDelete(col: Collection) {
    if (!confirm(`"${col.label}" wirklich löschen? Alle Einträge werden ebenfalls gelöscht.`)) return;
    startTransition(async () => {
      await deleteCollectionAction(col.id);
      router.refresh();
      toast.success('Gelöscht');
    });
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-sm text-zinc-500 mt-1">Verwalten Sie Ihre strukturierten Inhalte</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Neue Collection
        </button>
      </div>

      {showCreate && (
        <form action={handleCreate} className="admin-card p-4 mb-4 flex items-center gap-3">
          <input name="label" autoFocus placeholder="Name der Collection" className="input flex-1" required />
          <button type="submit" disabled={pending} className="btn-primary text-sm">{pending ? <Loader2 size={16} className="animate-spin" /> : 'Erstellen'}</button>
          <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary text-sm"><X size={16} /></button>
        </form>
      )}

      {collections.length === 0 && !showCreate ? (
        <div className="admin-card text-center py-16">
          <FolderOpen className="mx-auto mb-4 text-zinc-300" size={48} />
          <p className="text-zinc-500">Noch keine Collections vorhanden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div key={col.id} className="admin-card p-5 group relative">
              {editing === col.id ? (
                <div className="flex items-center gap-2">
                  <input value={editLabel} onChange={e => setEditLabel(e.target.value)} className="input flex-1 text-sm" autoFocus onKeyDown={e => e.key === 'Enter' && handleRename(col.id)} />
                  <button onClick={() => handleRename(col.id)} className="text-green-600 hover:text-green-700"><Check size={16} /></button>
                  <button onClick={() => setEditing(null)} className="text-zinc-400 hover:text-zinc-600"><X size={16} /></button>
                </div>
              ) : (
                <Link href={`/admin/collections/${col.key}`} className="block hover:opacity-80 transition-opacity">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                      <FolderOpen size={20} className="text-blue-500" />
                    </div>
                    <ChevronRight size={16} className="text-zinc-300 group-hover:text-blue-500 transition-colors mt-1" />
                  </div>
                  <p className="font-semibold text-zinc-900">{col.label}</p>
                  <p className="text-xs text-zinc-400 mt-1">{col.key}</p>
                </Link>
              )}
              {editing !== col.id && (
                <div className="absolute top-3 right-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.preventDefault(); setEditing(col.id); setEditLabel(col.label); }} className="p-1.5 rounded hover:bg-zinc-100" title="Umbenennen"><Pencil size={14} className="text-zinc-400" /></button>
                  <button onClick={(e) => { e.preventDefault(); handleDelete(col); }} className="p-1.5 rounded hover:bg-red-50" title="Löschen"><Trash2 size={14} className="text-red-400" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

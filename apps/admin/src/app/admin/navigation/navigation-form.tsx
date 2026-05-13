'use client';

import { useState } from 'react';
import { saveNavigationSettings } from '../settings-actions';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical } from 'lucide-react';

type NavItem = { label: string; href: string; type?: string };

export function NavigationForm({ initial }: { initial: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(initial.length > 0 ? initial : [{ label: '', href: '/', type: 'link' }]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNavigationSettings(items.filter(i => i.label.trim()));
      toast.success('Navigation gespeichert');
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const moveItem = (from: number, to: number) => {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
  };

  return (
    <div className="admin-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Hauptnavigation</h2>
        <span className="text-xs text-zinc-400">{items.length} Einträge</span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <div className="flex flex-col gap-0.5">
              <button type="button" disabled={i === 0} onClick={() => moveItem(i, i - 1)} className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 text-xs leading-none">▲</button>
              <button type="button" disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)} className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 text-xs leading-none">▼</button>
            </div>
            <GripVertical size={14} className="text-zinc-300" />
            <input className="admin-input w-44" value={item.label} onChange={e => { const u = [...items]; u[i] = { ...u[i], label: e.target.value }; setItems(u); }} placeholder="Label" />
            <input className="admin-input flex-1" value={item.href} onChange={e => { const u = [...items]; u[i] = { ...u[i], href: e.target.value }; setItems(u); }} placeholder="/seite" />
            <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} className="admin-btn-ghost text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={() => setItems([...items, { label: '', href: '/', type: 'link' }])} className="admin-btn-secondary">
          <Plus size={16} /> Link hinzufügen
        </button>
        <button type="button" onClick={handleSave} disabled={saving} className="admin-btn-primary">
          {saving ? 'Speichern…' : 'Navigation speichern'}
        </button>
      </div>
    </div>
  );
}

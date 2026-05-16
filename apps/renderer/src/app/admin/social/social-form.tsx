'use client';

import { useState, useEffect, useRef } from 'react';
import { saveSocialLinks } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState } from '@/components/save-context';

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'google', label: 'Google Business', placeholder: 'https://g.page/...' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
];

export function SocialForm({ initial }: { initial: Record<string, string> }) {
  const [links, setLinks] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(false);
  useEffect(() => { if (mounted.current) markDirty(); else mounted.current = true; }, [links]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const filtered = Object.fromEntries(Object.entries(links).filter(([, v]) => v.trim()));
      await saveSocialLinks(filtered);
      toast.success('Social-Media-Links gespeichert');
      markSaved();
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="admin-card p-6 space-y-5">
      <h2 className="font-semibold text-lg">Profile verknüpfen</h2>
      <p className="text-sm text-zinc-500">Geben Sie die URLs Ihrer Social-Media-Profile ein. Leere Felder werden nicht angezeigt.</p>
      <div className="space-y-4">
        {PLATFORMS.map(p => (
          <div key={p.key}>
            <label className="admin-label">{p.label}</label>
            <input className="admin-input" value={links[p.key] || ''} onChange={e => setLinks({ ...links, [p.key]: e.target.value })} placeholder={p.placeholder} />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Speichern…' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}

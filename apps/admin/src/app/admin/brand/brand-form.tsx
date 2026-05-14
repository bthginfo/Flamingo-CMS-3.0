'use client';

import { useState } from 'react';
import { saveBrandSettings } from '../settings-actions';
import { toast } from 'sonner';
import { ImageUploadField } from '@/components/image-upload-field';

type BrandData = { companyName?: string; tagline?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; logoUrl?: string };

export function BrandForm({ initial }: { initial: BrandData }) {
  const [form, setForm] = useState({
    companyName: initial.companyName || '',
    tagline: initial.tagline || '',
    primaryColor: initial.primaryColor || '#1a5276',
    secondaryColor: initial.secondaryColor || '#2e86c1',
    accentColor: initial.accentColor || '#f39c12',
    logoUrl: initial.logoUrl || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveBrandSettings(form);
      toast.success('Marken-Einstellungen gespeichert');
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Firmeninfo</h2>
        <div>
          <label className="admin-label">Firmenname</label>
          <input className="admin-input" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} placeholder="z.B. Müller & Söhne GmbH" />
        </div>
        <div>
          <label className="admin-label">Slogan / Tagline</label>
          <input className="admin-input" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="z.B. Ihr Experte für Heizung & Sanitär" />
        </div>
        <ImageUploadField
          label="Logo"
          value={form.logoUrl}
          onChange={(url) => setForm(f => ({ ...f, logoUrl: url }))}
        />
      </div>

      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Farbschema</h2>
        <p className="text-sm text-zinc-500">Diese Farben werden auf Ihrer gesamten Website verwendet.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="admin-label">Primärfarbe</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="admin-label">Sekundärfarbe</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.secondaryColor} onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input" value={form.secondaryColor} onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="admin-label">Akzentfarbe</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input" value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} />
            </div>
          </div>
        </div>
        {/* Preview */}
        <div className="pt-4 border-t border-admin-border">
          <p className="text-sm text-zinc-500 mb-3">Vorschau:</p>
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-xl shadow-sm" style={{ background: form.primaryColor }} />
            <div className="w-16 h-16 rounded-xl shadow-sm" style={{ background: form.secondaryColor }} />
            <div className="w-16 h-16 rounded-xl shadow-sm" style={{ background: form.accentColor }} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Speichern…' : 'Änderungen speichern'}
        </button>
      </div>
    </form>
  );
}

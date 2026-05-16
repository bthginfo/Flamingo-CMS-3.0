'use client';

import { useState, useEffect, useRef } from 'react';
import { saveBrandSettings } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { ImageUploadField } from '@/components/image-upload-field';

type BrandData = { companyName?: string; tagline?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; logoUrl?: string; logoDisplay?: string; headingFont?: string; bodyFont?: string };

const GOOGLE_FONTS = [
  { value: '', label: 'Standard (Outfit / Inter)' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Roboto Slab', label: 'Roboto Slab' },
  { value: 'Source Sans 3', label: 'Source Sans 3' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'DM Serif Display', label: 'DM Serif Display' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'Bricolage Grotesque', label: 'Bricolage Grotesque' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
];

export function BrandForm({ initial }: { initial: BrandData }) {
  const [form, setForm] = useState({
    companyName: initial.companyName || '',
    tagline: initial.tagline || '',
    primaryColor: initial.primaryColor || '#1a5276',
    secondaryColor: initial.secondaryColor || '#2e86c1',
    accentColor: initial.accentColor || '#f39c12',
    logoUrl: initial.logoUrl || '',
    logoDisplay: initial.logoDisplay || 'logoAndName',
    headingFont: initial.headingFont || '',
    bodyFont: initial.bodyFont || '',
  });
  const [saving, setSaving] = useState(false);
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { if (mounted.current) markDirty(); else mounted.current = true; }, [form]);
  useRegisterSave(() => formRef.current?.requestSubmit());

  // Load Google Fonts for preview
  useEffect(() => {
    const fonts = [form.headingFont, form.bodyFont].filter(Boolean);
    if (fonts.length === 0) return;
    const families = fonts.map(f => f.replace(/ /g, '+')).join('&family=');
    const id = 'brand-font-preview';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  }, [form.headingFont, form.bodyFont]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveBrandSettings(form);
      toast.success('Marken-Einstellungen gespeichert');
      markSaved();
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
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
        <div>
          <label className="admin-label">Logo-Anzeige in Navigation & Footer</label>
          <select className="admin-input" value={form.logoDisplay} onChange={e => setForm(f => ({ ...f, logoDisplay: e.target.value }))}>
            <option value="logo">Nur Logo</option>
            <option value="logoAndName">Logo + Firmenname</option>
            <option value="name">Nur Firmenname</option>
          </select>
        </div>
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

      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Schriften</h2>
        <p className="text-sm text-zinc-500">Wählen Sie Google Fonts für Überschriften und Fließtext. Leer = Standard-Schrift.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Überschriften-Schrift</label>
            <select className="admin-input" value={form.headingFont} onChange={e => setForm(f => ({ ...f, headingFont: e.target.value }))}>
              {GOOGLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            {form.headingFont && (
              <p className="mt-2 text-lg" style={{ fontFamily: `"${form.headingFont}", sans-serif` }}>
                Vorschau: Überschrift
              </p>
            )}
          </div>
          <div>
            <label className="admin-label">Fließtext-Schrift</label>
            <select className="admin-input" value={form.bodyFont} onChange={e => setForm(f => ({ ...f, bodyFont: e.target.value }))}>
              {GOOGLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            {form.bodyFont && (
              <p className="mt-2 text-sm" style={{ fontFamily: `"${form.bodyFont}", sans-serif` }}>
                Vorschau: Dies ist ein Beispieltext für die Fließtext-Schrift.
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

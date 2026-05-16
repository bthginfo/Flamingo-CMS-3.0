'use client';

import { useState, useEffect, useRef } from 'react';
import { saveBrandSettings } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { ImageUploadField } from '@/components/image-upload-field';

type BrandData = { companyName?: string; tagline?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; logoUrl?: string; logoDisplay?: string; headingFont?: string; bodyFont?: string; topBarColor?: string; footerColor?: string; customHeadingFontUrl?: string; customHeadingFontName?: string; customBodyFontUrl?: string; customBodyFontName?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; headingColor?: string; bodyTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string };

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
    topBarColor: initial.topBarColor || '',
    footerColor: initial.footerColor || '',
    customHeadingFontUrl: initial.customHeadingFontUrl || '',
    customHeadingFontName: initial.customHeadingFontName || '',
    customBodyFontUrl: initial.customBodyFontUrl || '',
    customBodyFontName: initial.customBodyFontName || '',
    footerLinkColor: initial.footerLinkColor || '',
    footerTextColor: initial.footerTextColor || '',
    navLinkColor: initial.navLinkColor || '',
    headingColor: initial.headingColor || '',
    bodyTextColor: initial.bodyTextColor || '',
    linkColor: initial.linkColor || '',
    linkHoverColor: initial.linkHoverColor || '',
    btnPrimaryBg: initial.btnPrimaryBg || '',
    btnPrimaryText: initial.btnPrimaryText || '',
  });
  const [saving, setSaving] = useState(false);
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formJson = JSON.stringify(form);
  useEffect(() => { if (mounted.current) markDirty(); else mounted.current = true; }, [formJson]);
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
        <h2 className="font-semibold text-lg">Bereichsfarben (optional)</h2>
        <p className="text-sm text-zinc-500">Standardmäßig wird eine dunklere Abwandlung der Primärfarbe verwendet. Hier können Sie eigene Farben festlegen.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Top-Banner Farbe</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.topBarColor || form.primaryColor} onChange={e => setForm(f => ({ ...f, topBarColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.topBarColor} onChange={e => setForm(f => ({ ...f, topBarColor: e.target.value }))} placeholder="Leer = Abwandlung Primärfarbe" />
              {form.topBarColor && <button type="button" onClick={() => setForm(f => ({ ...f, topBarColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Footer Farbe</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.footerColor || form.primaryColor} onChange={e => setForm(f => ({ ...f, footerColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.footerColor} onChange={e => setForm(f => ({ ...f, footerColor: e.target.value }))} placeholder="Leer = Abwandlung Primärfarbe" />
              {form.footerColor && <button type="button" onClick={() => setForm(f => ({ ...f, footerColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Schriften</h2>
        <p className="text-sm text-zinc-500">Wählen Sie Google Fonts oder laden Sie eigene Schrift-Dateien (.woff2, .woff, .ttf) hoch.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="admin-label">Überschriften-Schrift</label>
            <select className="admin-input" value={form.customHeadingFontUrl ? '__custom__' : form.headingFont} onChange={e => {
              if (e.target.value === '__custom__') return;
              setForm(f => ({ ...f, headingFont: e.target.value, customHeadingFontUrl: '', customHeadingFontName: '' }));
            }}>
              {GOOGLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              {form.customHeadingFontUrl && <option value="__custom__">✦ {form.customHeadingFontName || 'Custom Font'}</option>}
            </select>
            <div className="flex items-center gap-2">
              <label className="text-xs text-blue-600 hover:underline cursor-pointer">
                Eigene Schrift hochladen
                <input type="file" accept=".woff2,.woff,.ttf,.otf" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const { upload } = await import('@vercel/blob/client');
                  const blob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });
                  const fontName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
                  setForm(f => ({ ...f, customHeadingFontUrl: blob.url, customHeadingFontName: fontName, headingFont: '' }));
                }} />
              </label>
              {form.customHeadingFontUrl && (
                <button type="button" onClick={() => setForm(f => ({ ...f, customHeadingFontUrl: '', customHeadingFontName: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕ Entfernen</button>
              )}
            </div>
            {(form.headingFont || form.customHeadingFontUrl) && (
              <p className="mt-1 text-lg" style={{ fontFamily: form.customHeadingFontUrl ? `"${form.customHeadingFontName}"` : `"${form.headingFont}", sans-serif` }}>
                Vorschau: Überschrift
              </p>
            )}
          </div>
          <div className="space-y-3">
            <label className="admin-label">Fließtext-Schrift</label>
            <select className="admin-input" value={form.customBodyFontUrl ? '__custom__' : form.bodyFont} onChange={e => {
              if (e.target.value === '__custom__') return;
              setForm(f => ({ ...f, bodyFont: e.target.value, customBodyFontUrl: '', customBodyFontName: '' }));
            }}>
              {GOOGLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              {form.customBodyFontUrl && <option value="__custom__">✦ {form.customBodyFontName || 'Custom Font'}</option>}
            </select>
            <div className="flex items-center gap-2">
              <label className="text-xs text-blue-600 hover:underline cursor-pointer">
                Eigene Schrift hochladen
                <input type="file" accept=".woff2,.woff,.ttf,.otf" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const { upload } = await import('@vercel/blob/client');
                  const blob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });
                  const fontName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
                  setForm(f => ({ ...f, customBodyFontUrl: blob.url, customBodyFontName: fontName, bodyFont: '' }));
                }} />
              </label>
              {form.customBodyFontUrl && (
                <button type="button" onClick={() => setForm(f => ({ ...f, customBodyFontUrl: '', customBodyFontName: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕ Entfernen</button>
              )}
            </div>
            {(form.bodyFont || form.customBodyFontUrl) && (
              <p className="mt-1 text-sm" style={{ fontFamily: form.customBodyFontUrl ? `"${form.customBodyFontName}"` : `"${form.bodyFont}", sans-serif` }}>
                Vorschau: Dies ist ein Beispieltext für die Fließtext-Schrift.
              </p>
            )}
          </div>
        </div>
      </div>

      <details className="admin-card p-6">
        <summary className="font-semibold text-lg cursor-pointer select-none">Erweiterte Farbeinstellungen</summary>
        <div className="space-y-5 mt-5">
          <p className="text-sm text-zinc-500">Diese Farben überschreiben die Standardwerte. Leer lassen = automatisch abgeleitet.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {([
              { key: 'headingColor', label: 'Überschriften-Farbe' },
              { key: 'bodyTextColor', label: 'Fließtext-Farbe' },
              { key: 'linkColor', label: 'Link-Farbe' },
              { key: 'linkHoverColor', label: 'Link-Hover-Farbe' },
              { key: 'navLinkColor', label: 'Navigation-Link-Farbe' },
              { key: 'footerTextColor', label: 'Footer Text-Farbe' },
              { key: 'footerLinkColor', label: 'Footer Link-Farbe' },
              { key: 'btnPrimaryBg', label: 'Button Hintergrund' },
              { key: 'btnPrimaryText', label: 'Button Textfarbe' },
            ] as const).map(({ key, label }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={(form as Record<string, string>)[key] || '#000000'} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                  <input className="admin-input flex-1" value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="Leer = Standard" />
                  {(form as Record<string, string>)[key] && <button type="button" onClick={() => setForm(f => ({ ...f, [key]: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </form>
  );
}

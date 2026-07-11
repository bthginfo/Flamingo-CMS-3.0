'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveBrandSettings } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { usePreview } from '@/components/admin/preview-context';
import { getBrandCssVars } from '@/lib/brand-colors';
import { buildGoogleFontsProxyUrl, GOOGLE_FONT_FAMILIES } from '@/lib/font-proxy';
import { ImageUploadField } from '@/components/image-upload-field';

type BrandData = { companyName?: string; tagline?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; pageBg?: string; sectionBg?: string; sectionBgAlt?: string; cardBg?: string; logoUrl?: string; faviconUrl?: string; logoDisplay?: string; headingFont?: string; bodyFont?: string; topBarColor?: string; footerColor?: string; customHeadingFontUrl?: string; customHeadingFontName?: string; customBodyFontUrl?: string; customBodyFontName?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; navBgColor?: string; navBrandColor?: string; navLogoColor?: string; headingColor?: string; bodyTextColor?: string; mutedTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string; btnSecondaryBg?: string; btnSecondaryText?: string; btnSecondaryBorder?: string; btnOutlineBg?: string; btnOutlineText?: string; btnOutlineBorder?: string; badgeBg?: string; badgeText?: string; badgeBorder?: string; cardBorder?: string; borderColor?: string; dividerColor?: string; iconColor?: string; btnRadius?: string; cardRadius?: string };

const GOOGLE_FONTS = [
  { value: '', label: 'Standard (Outfit / Inter)' },
  ...GOOGLE_FONT_FAMILIES.map((font) => ({ value: font, label: font })),
];

export function BrandForm({ initial }: { initial: BrandData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: initial.companyName || '',
    tagline: initial.tagline || '',
    primaryColor: initial.primaryColor || '#1a5276',
    secondaryColor: initial.secondaryColor || '#2e86c1',
    accentColor: initial.accentColor || '#f39c12',
    pageBg: initial.pageBg || '',
    sectionBg: initial.sectionBg || '',
    sectionBgAlt: initial.sectionBgAlt || '',
    cardBg: initial.cardBg || '',
    logoUrl: initial.logoUrl || '',
    faviconUrl: initial.faviconUrl || '',
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
    navBgColor: initial.navBgColor || '',
    navBrandColor: initial.navBrandColor || '',
    navLogoColor: initial.navLogoColor || '',
    headingColor: initial.headingColor || '',
    bodyTextColor: initial.bodyTextColor || '',
    mutedTextColor: initial.mutedTextColor || '',
    linkColor: initial.linkColor || '',
    linkHoverColor: initial.linkHoverColor || '',
    btnPrimaryBg: initial.btnPrimaryBg || '',
    btnPrimaryText: initial.btnPrimaryText || '',
    btnSecondaryBg: initial.btnSecondaryBg || '',
    btnSecondaryText: initial.btnSecondaryText || '',
    btnSecondaryBorder: initial.btnSecondaryBorder || '',
    btnOutlineBg: initial.btnOutlineBg || '',
    btnOutlineText: initial.btnOutlineText || '',
    btnOutlineBorder: initial.btnOutlineBorder || '',
    badgeBg: initial.badgeBg || '',
    badgeText: initial.badgeText || '',
    badgeBorder: initial.badgeBorder || '',
    cardBorder: initial.cardBorder || '',
    borderColor: initial.borderColor || '',
    dividerColor: initial.dividerColor || '',
    iconColor: initial.iconColor || '',
    btnRadius: initial.btnRadius || '',
    cardRadius: initial.cardRadius || '',
  });
  const [saving, setSaving] = useState(false);
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formJson = JSON.stringify(form);
  useEffect(() => { if (mounted.current) markDirty(); else mounted.current = true; }, [formJson]);
  useRegisterSave(() => formRef.current?.requestSubmit());

  // Send live CSS vars to preview whenever brand colors change
  const preview = usePreview();
  useEffect(() => {
    if (!mounted.current) return;
    const cssVars = getBrandCssVars(form);
    if (Object.keys(cssVars).length > 0) {
      preview.sendLiveData({ cssVars });
    }
  }, [formJson]);

  // Load Google Fonts for preview
  useEffect(() => {
    const fonts = [form.headingFont, form.bodyFont].filter(Boolean);
    if (fonts.length === 0) return;
    const proxyUrl = buildGoogleFontsProxyUrl(fonts);
    if (!proxyUrl) return;
    const id = 'brand-font-preview';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = proxyUrl;
  }, [form.headingFont, form.bodyFont]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await saveBrandSettings(form);
      if (result.success) {
        toast.success('Marken-Einstellungen gespeichert ✓');
      } else {
        toast.error('Speichern fehlgeschlagen');
      }
      markSaved();
      router.refresh();
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
        <div className="space-y-1.5">
          <ImageUploadField
            label="Favicon (optional)"
            value={form.faviconUrl}
            onChange={(url) => setForm(f => ({ ...f, faviconUrl: url }))}
          />
          <p className="text-xs text-zinc-400">Wenn kein eigenes Favicon gesetzt ist, nutzt die Website automatisch das Logo.</p>
        </div>
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
        <p className="text-sm text-zinc-500">Ihre Hauptfarben bestimmen das gesamte Erscheinungsbild der Website.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="admin-label">Primärfarbe</label>
            <p className="text-xs text-zinc-400 mb-1.5">Buttons, Links, Navigation-Akzente, Badges, aktive Elemente</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="admin-label">Sekundärfarbe</label>
            <p className="text-xs text-zinc-400 mb-1.5">Hover-Zustände, sekundäre Buttons, Info-Bereiche</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.secondaryColor} onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input" value={form.secondaryColor} onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="admin-label">Akzentfarbe</label>
            <p className="text-xs text-zinc-400 mb-1.5">Call-to-Action-Bereiche, Highlights, Sterne/Bewertungen</p>
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

      {/* ─── Texte & Links ─── */}
      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Globale Flächen</h2>
        <p className="text-sm text-zinc-500">Basisfarben für Seiten, Sections und Karten. Leer lassen = automatisch aus Farbschema und Template abgeleitet.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {([
            { key: 'pageBg', label: 'Seitenhintergrund', hint: 'Grundfläche der Website hinter allen Inhalten', fallback: '#ffffff' },
            { key: 'sectionBg', label: 'Section-Hintergrund', hint: 'Standard-Hintergrund für normale Inhaltsbereiche', fallback: '#ffffff' },
            { key: 'sectionBgAlt', label: 'Alternative Section', hint: 'Abgesetzte Bereiche, Listen und ruhige Kontrastflächen', fallback: '#f8fafc' },
            { key: 'cardBg', label: 'Karten-Hintergrund', hint: 'Cards, Boxen, Testimonials, Preis- und Inhaltskarten', fallback: '#ffffff' },
          ] as { key: keyof typeof form; label: string; hint: string; fallback: string }[]).map(({ key, label, hint, fallback }) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <p className="text-xs text-zinc-400 mb-1.5">{hint}</p>
              <div className="flex items-center gap-3">
                <input type="color" value={(form as Record<string, string>)[key] || fallback} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="Leer = automatisch" />
                {(form as Record<string, string>)[key] && <button type="button" onClick={() => setForm(f => ({ ...f, [key]: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-admin-border">
          <p className="text-sm text-zinc-500 mb-3">Vorschau:</p>
          <div className="rounded-2xl border border-zinc-200 p-4" style={{ backgroundColor: form.pageBg || '#ffffff' }}>
            <div className="rounded-xl p-4" style={{ backgroundColor: form.sectionBg || '#ffffff' }}>
              <div className="rounded-xl border p-4 shadow-sm" style={{ backgroundColor: form.cardBg || '#ffffff', borderColor: form.borderColor || form.cardBorder || '#e5e7eb' }}>
                <div className="h-3 w-32 rounded-full" style={{ backgroundColor: form.primaryColor }} />
                <div className="mt-3 h-2 w-48 rounded-full bg-zinc-200" />
                <div className="mt-2 h-2 w-36 rounded-full bg-zinc-100" />
              </div>
              <div className="mt-3 rounded-xl p-3 text-xs text-zinc-500" style={{ backgroundColor: form.sectionBgAlt || '#f8fafc' }}>
                Alternative Section-Fläche
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Texte & Links</h2>
        <p className="text-sm text-zinc-500">Farben für Textinhalte auf der Website. Leer lassen = automatisch aus dem Farbschema abgeleitet.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {([
            { key: 'headingColor', label: 'Überschriften', hint: 'Alle H1–H6 Titel, Section-Überschriften' },
            { key: 'bodyTextColor', label: 'Fließtext', hint: 'Absätze, Listen, Beschreibungen' },
            { key: 'mutedTextColor', label: 'Dezenter Text', hint: 'Subtitles, Timestamps, Meta-Infos, Platzhalter' },
            { key: 'linkColor', label: 'Links', hint: 'Klickbare Textlinks im Inhaltsbereich' },
            { key: 'linkHoverColor', label: 'Links (Hover)', hint: 'Farbe beim Überfahren mit der Maus' },
          ] as { key: keyof typeof form; label: string; hint: string }[]).map(({ key, label, hint }) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <p className="text-xs text-zinc-400 mb-1.5">{hint}</p>
              <div className="flex items-center gap-3">
                <input type="color" value={(form as Record<string, string>)[key] || '#000000'} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="Leer = Standard" />
                {(form as Record<string, string>)[key] && <button type="button" onClick={() => setForm(f => ({ ...f, [key]: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Navigation & Header ─── */}
      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Navigation & Header</h2>
        <p className="text-sm text-zinc-500">Farben für die Hauptnavigation und den Info-Balken am oberen Seitenrand.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Navigations-Links</label>
            <p className="text-xs text-zinc-400 mb-1.5">Menüpunkte in der Hauptnavigation</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.navLinkColor || '#000000'} onChange={e => setForm(f => ({ ...f, navLinkColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.navLinkColor} onChange={e => setForm(f => ({ ...f, navLinkColor: e.target.value }))} placeholder="Leer = Standard" />
              {form.navLinkColor && <button type="button" onClick={() => setForm(f => ({ ...f, navLinkColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Navigations-Hintergrund</label>
            <p className="text-xs text-zinc-400 mb-1.5">Hintergrundfläche der Hauptnavigation (beim Scrollen)</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.navBgColor || '#ffffff'} onChange={e => setForm(f => ({ ...f, navBgColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.navBgColor} onChange={e => setForm(f => ({ ...f, navBgColor: e.target.value }))} placeholder="Leer = Weiß transluzent" />
              {form.navBgColor && <button type="button" onClick={() => setForm(f => ({ ...f, navBgColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Markenname-Farbe</label>
            <p className="text-xs text-zinc-400 mb-1.5">Farbe des Firmennamens in der Navigation</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.navBrandColor || form.primaryColor} onChange={e => setForm(f => ({ ...f, navBrandColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.navBrandColor} onChange={e => setForm(f => ({ ...f, navBrandColor: e.target.value }))} placeholder="Leer = Primärfarbe" />
              {form.navBrandColor && <button type="button" onClick={() => setForm(f => ({ ...f, navBrandColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Logo-Farbe</label>
            <p className="text-xs text-zinc-400 mb-1.5">Überschreibt die Farbe eines SVG-Logos in der Navigation</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.navLogoColor || form.primaryColor} onChange={e => setForm(f => ({ ...f, navLogoColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.navLogoColor} onChange={e => setForm(f => ({ ...f, navLogoColor: e.target.value }))} placeholder="Leer = keine Überschreibung" />
              {form.navLogoColor && <button type="button" onClick={() => setForm(f => ({ ...f, navLogoColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Top-Banner Hintergrund</label>
            <p className="text-xs text-zinc-400 mb-1.5">Schmaler Info-Balken ganz oben (Telefon, E-Mail, Öffnungszeiten)</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.topBarColor || form.primaryColor} onChange={e => setForm(f => ({ ...f, topBarColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.topBarColor} onChange={e => setForm(f => ({ ...f, topBarColor: e.target.value }))} placeholder="Leer = dunkle Primärfarbe" />
              {form.topBarColor && <button type="button" onClick={() => setForm(f => ({ ...f, topBarColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Footer</h2>
        <p className="text-sm text-zinc-500">Farben für den gesamten Footer-Bereich am Seitenende.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="admin-label">Hintergrund</label>
            <p className="text-xs text-zinc-400 mb-1.5">Hintergrundfläche des Footers</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.footerColor || form.primaryColor} onChange={e => setForm(f => ({ ...f, footerColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.footerColor} onChange={e => setForm(f => ({ ...f, footerColor: e.target.value }))} placeholder="Leer = dunkle Primärfarbe" />
              {form.footerColor && <button type="button" onClick={() => setForm(f => ({ ...f, footerColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Text</label>
            <p className="text-xs text-zinc-400 mb-1.5">Fließtext, Adressen, Öffnungszeiten im Footer</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.footerTextColor || '#ffffff'} onChange={e => setForm(f => ({ ...f, footerTextColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.footerTextColor} onChange={e => setForm(f => ({ ...f, footerTextColor: e.target.value }))} placeholder="Leer = Weiß" />
              {form.footerTextColor && <button type="button" onClick={() => setForm(f => ({ ...f, footerTextColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Links</label>
            <p className="text-xs text-zinc-400 mb-1.5">Klickbare Links im Footer (Navigation, Legal)</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.footerLinkColor || '#ffffff'} onChange={e => setForm(f => ({ ...f, footerLinkColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.footerLinkColor} onChange={e => setForm(f => ({ ...f, footerLinkColor: e.target.value }))} placeholder="Leer = Weiß" />
              {form.footerLinkColor && <button type="button" onClick={() => setForm(f => ({ ...f, footerLinkColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Buttons ─── */}
      <div className="admin-card p-6 space-y-6">
        <div>
          <h2 className="font-semibold text-lg">Buttons</h2>
          <p className="text-sm text-zinc-500">Drei Button-Typen stehen zur Verfügung. Leer lassen = Standard-Farben aus dem Farbschema.</p>
        </div>

        {/* Primary Button */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Primär-Button</h3>
          <p className="text-xs text-zinc-400">Wichtigste Aktion: „Jetzt anfragen", „Termin buchen", Formular-Absenden</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Hintergrund</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.btnPrimaryBg || form.accentColor} onChange={e => setForm(f => ({ ...f, btnPrimaryBg: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={form.btnPrimaryBg} onChange={e => setForm(f => ({ ...f, btnPrimaryBg: e.target.value }))} placeholder="Leer = Akzentfarbe" />
                {form.btnPrimaryBg && <button type="button" onClick={() => setForm(f => ({ ...f, btnPrimaryBg: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
            <div>
              <label className="admin-label">Text</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.btnPrimaryText || '#1a1a1a'} onChange={e => setForm(f => ({ ...f, btnPrimaryText: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={form.btnPrimaryText} onChange={e => setForm(f => ({ ...f, btnPrimaryText: e.target.value }))} placeholder="Leer = Dunkel" />
                {form.btnPrimaryText && <button type="button" onClick={() => setForm(f => ({ ...f, btnPrimaryText: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-zinc-400">Vorschau:</span>
            <button type="button" className="px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm" style={{ backgroundColor: form.btnPrimaryBg || form.accentColor, color: form.btnPrimaryText || '#1a1a1a' }}>
              Jetzt anfragen
            </button>
          </div>
        </div>

        <hr className="border-admin-border" />

        {/* Secondary Button */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Sekundär-Button</h3>
          <p className="text-xs text-zinc-400">Zweitwichtigste Aktion: „Mehr erfahren", zweiter CTA im Hero-Bereich (auf dunklem Hintergrund)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Hintergrund</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.btnSecondaryBg || '#000000'} onChange={e => setForm(f => ({ ...f, btnSecondaryBg: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={form.btnSecondaryBg} onChange={e => setForm(f => ({ ...f, btnSecondaryBg: e.target.value }))} placeholder="Leer = transparent" />
                {form.btnSecondaryBg && <button type="button" onClick={() => setForm(f => ({ ...f, btnSecondaryBg: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
            <div>
              <label className="admin-label">Text</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.btnSecondaryText || '#ffffff'} onChange={e => setForm(f => ({ ...f, btnSecondaryText: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={form.btnSecondaryText} onChange={e => setForm(f => ({ ...f, btnSecondaryText: e.target.value }))} placeholder="Leer = Weiß" />
                {form.btnSecondaryText && <button type="button" onClick={() => setForm(f => ({ ...f, btnSecondaryText: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
            <div>
              <label className="admin-label">Rahmen</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.btnSecondaryBorder || '#ffffff'} onChange={e => setForm(f => ({ ...f, btnSecondaryBorder: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={form.btnSecondaryBorder} onChange={e => setForm(f => ({ ...f, btnSecondaryBorder: e.target.value }))} placeholder="Leer = Weiß/20%" />
                {form.btnSecondaryBorder && <button type="button" onClick={() => setForm(f => ({ ...f, btnSecondaryBorder: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-zinc-400">Vorschau:</span>
            <span className="px-5 py-2.5 rounded-lg text-sm font-semibold inline-block" style={{ backgroundColor: form.btnSecondaryBg || 'transparent', color: form.btnSecondaryText || '#ffffff', border: `2px solid ${form.btnSecondaryBorder || 'rgba(255,255,255,0.2)'}`, background: form.btnSecondaryBg || '#1e293b' }}>
              Mehr erfahren
            </span>
          </div>
        </div>

        <hr className="border-admin-border" />

        {/* Outline Button */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Outline-Button</h3>
          <p className="text-xs text-zinc-400">Dezente Aktion: „Details ansehen", „Mehr lesen", alternative CTAs auf hellem Hintergrund</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Hintergrund</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.btnOutlineBg || '#ffffff'} onChange={e => setForm(f => ({ ...f, btnOutlineBg: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={form.btnOutlineBg} onChange={e => setForm(f => ({ ...f, btnOutlineBg: e.target.value }))} placeholder="Leer = transparent" />
                {form.btnOutlineBg && <button type="button" onClick={() => setForm(f => ({ ...f, btnOutlineBg: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
            <div>
              <label className="admin-label">Text</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.btnOutlineText || '#374151'} onChange={e => setForm(f => ({ ...f, btnOutlineText: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={form.btnOutlineText} onChange={e => setForm(f => ({ ...f, btnOutlineText: e.target.value }))} placeholder="Leer = Dunkelgrau" />
                {form.btnOutlineText && <button type="button" onClick={() => setForm(f => ({ ...f, btnOutlineText: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
            <div>
              <label className="admin-label">Rahmen</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.btnOutlineBorder || '#e5e7eb'} onChange={e => setForm(f => ({ ...f, btnOutlineBorder: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
                <input className="admin-input flex-1" value={form.btnOutlineBorder} onChange={e => setForm(f => ({ ...f, btnOutlineBorder: e.target.value }))} placeholder="Leer = Hellgrau" />
                {form.btnOutlineBorder && <button type="button" onClick={() => setForm(f => ({ ...f, btnOutlineBorder: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-zinc-400">Vorschau:</span>
            <span className="px-5 py-2.5 rounded-lg text-sm font-semibold inline-block" style={{ backgroundColor: form.btnOutlineBg || 'transparent', color: form.btnOutlineText || '#374151', border: `2px solid ${form.btnOutlineBorder || '#e5e7eb'}` }}>
              Details ansehen
            </span>
          </div>
        </div>
      </div>

      {/* ─── Badges & Tags ─── */}
      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Badges & Tags</h2>
        <p className="text-sm text-zinc-500">Section-Label (z.B. „Unsere Leistungen"), Kategorie-Tags, Status-Badges. Wenn nicht gesetzt, werden sie automatisch aus der Primärfarbe abgeleitet.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="admin-label">Hintergrund</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.badgeBg || form.primaryColor} onChange={e => setForm(f => ({ ...f, badgeBg: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.badgeBg} onChange={e => setForm(f => ({ ...f, badgeBg: e.target.value }))} placeholder="Auto (Primärfarbe 5%)" />
              {form.badgeBg && <button type="button" onClick={() => setForm(f => ({ ...f, badgeBg: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Text</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.badgeText || form.primaryColor} onChange={e => setForm(f => ({ ...f, badgeText: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.badgeText} onChange={e => setForm(f => ({ ...f, badgeText: e.target.value }))} placeholder="Auto (Primärfarbe)" />
              {form.badgeText && <button type="button" onClick={() => setForm(f => ({ ...f, badgeText: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Rahmen</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.badgeBorder || form.primaryColor} onChange={e => setForm(f => ({ ...f, badgeBorder: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.badgeBorder} onChange={e => setForm(f => ({ ...f, badgeBorder: e.target.value }))} placeholder="Auto (Primärfarbe 10%)" />
              {form.badgeBorder && <button type="button" onClick={() => setForm(f => ({ ...f, badgeBorder: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs text-zinc-400">Vorschau:</span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider inline-block" style={{ backgroundColor: form.badgeBg || `${form.primaryColor}0d`, color: form.badgeText || form.primaryColor, border: `1px solid ${form.badgeBorder || `${form.primaryColor}1a`}` }}>
            Unsere Leistungen
          </span>
        </div>
      </div>

      {/* ─── Karten & Ränder ─── */}
      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Karten & Ränder</h2>
        <p className="text-sm text-zinc-500">Icons, Rahmen und Trennlinien zwischen Sektionen, Karten und Inhaltsblöcken.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Icons</label>
            <p className="text-xs text-zinc-400 mb-1.5">Icon-Farbe in Karten, Listen, Standort- und Premium-Sektionen.</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.iconColor || form.primaryColor} onChange={e => setForm(f => ({ ...f, iconColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.iconColor} onChange={e => setForm(f => ({ ...f, iconColor: e.target.value }))} placeholder="Leer = Primärfarbe" />
              {form.iconColor && <button type="button" onClick={() => setForm(f => ({ ...f, iconColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Linienfarbe (Karten & Container)</label>
            <p className="text-xs text-zinc-400 mb-1.5">Linien von Team-Cards, Service-Karten, Testimonials, Containern.</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.borderColor || form.cardBorder || '#e5e7eb'} onChange={e => setForm(f => ({ ...f, borderColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.borderColor} onChange={e => setForm(f => ({ ...f, borderColor: e.target.value }))} placeholder="Leer = rgba(15,23,42,0.08)" />
              {form.borderColor && <button type="button" onClick={() => setForm(f => ({ ...f, borderColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
          <div>
            <label className="admin-label">Trennlinien / Divider</label>
            <p className="text-xs text-zinc-400 mb-1.5">Horizontale Linien zwischen Abschnitten, unter dem Header etc.</p>
            <div className="flex items-center gap-3">
              <input type="color" value={form.dividerColor || '#e5e7eb'} onChange={e => setForm(f => ({ ...f, dividerColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-admin-border cursor-pointer" />
              <input className="admin-input flex-1" value={form.dividerColor} onChange={e => setForm(f => ({ ...f, dividerColor: e.target.value }))} placeholder="Leer = rgba(0,0,0,0.06)" />
              {form.dividerColor && <button type="button" onClick={() => setForm(f => ({ ...f, dividerColor: '' }))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>}
            </div>
          </div>
        </div>
        <hr className="border-admin-border" />
        <h3 className="text-sm font-semibold text-zinc-700">Rundungen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Button-Radius</label>
            <select className="admin-input" value={form.btnRadius} onChange={e => setForm(f => ({ ...f, btnRadius: e.target.value }))}>
              <option value="">Standard (0.75rem)</option>
              <option value="0">Eckig (0)</option>
              <option value="0.375rem">Leicht gerundet (0.375rem)</option>
              <option value="0.75rem">Mittel (0.75rem)</option>
              <option value="1.5rem">Stark gerundet (1.5rem)</option>
              <option value="9999px">Pill / Rund</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Karten-Radius</label>
            <select className="admin-input" value={form.cardRadius} onChange={e => setForm(f => ({ ...f, cardRadius: e.target.value }))}>
              <option value="">Standard (1rem)</option>
              <option value="0">Eckig (0)</option>
              <option value="0.5rem">Leicht gerundet (0.5rem)</option>
              <option value="1rem">Mittel (1rem)</option>
              <option value="1.5rem">Stark gerundet (1.5rem)</option>
              <option value="2rem">Sehr rund (2rem)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Schriften</h2>
        <p className="text-sm text-zinc-500">Die Überschriften-Schrift wird für alle H1–H6 Titel verwendet, die Fließtext-Schrift für Absätze, Listen und allgemeine Inhalte.</p>
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

    </form>
  );
}

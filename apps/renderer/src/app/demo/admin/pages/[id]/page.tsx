'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';

const MOCK_SECTIONS = [
  { id: 'hero', type: 'hero', label: 'Hero', visible: true, data: { headline: 'Müller & Söhne Meisterbetrieb', subline: 'Seit 1987 Ihr Partner für Sanitär, Heizung und Bäder in Köln und Umgebung.', badgeText: 'Meisterbetrieb', bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85' } },
  { id: 'usp', type: 'uspStrip', label: 'USP-Leiste', visible: true, data: { items: [{ icon: 'shield-check', text: 'Meisterqualität' }, { icon: 'clock', text: '24h Notdienst' }, { icon: 'star', text: '4.9/5 Bewertung' }] } },
  { id: 'services', type: 'servicesGrid', label: 'Leistungen', visible: true, data: { headline: 'Unsere Leistungen', subline: 'Kompetenz in allen Gewerken', badgeText: 'Leistungen' } },
  { id: 'process', type: 'processSteps', label: 'Ablauf', visible: true, data: { headline: 'So arbeiten wir', badgeText: 'Ablauf' } },
  { id: 'testimonials', type: 'testimonials', label: 'Kundenstimmen', visible: true, data: { headline: 'Das sagen unsere Kunden', ratingValue: '4.9', ratingCount: '127' } },
  { id: 'portfolio', type: 'portfolio', label: 'Referenzen', visible: true, data: { headline: 'Unsere Projekte', badgeText: 'Referenzen' } },
  { id: 'team', type: 'team', label: 'Team', visible: true, data: { headline: 'Unser Team', badgeText: 'Team' } },
  { id: 'faq', type: 'faq', label: 'FAQ', visible: true, data: { headline: 'Häufige Fragen', badgeText: 'FAQ' } },
  { id: 'cta', type: 'ctaBand', label: 'CTA-Banner', visible: true, data: { headline: 'Projekt starten?', subline: 'Wir beraten Sie gerne — kostenlos und unverbindlich.' } },
  { id: 'contact', type: 'contact', label: 'Kontakt', visible: true, data: { headline: 'Kontaktieren Sie uns', badgeText: 'Kontakt' } },
];

function MockField({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  const [v, setV] = useState(value);
  return (
    <label className="block text-sm">
      <span className="text-zinc-500 text-xs font-medium">{label}</span>
      {multiline ? (
        <textarea value={v} onChange={(e) => setV(e.target.value)} rows={3} className="admin-input mt-1 w-full" />
      ) : (
        <input value={v} onChange={(e) => setV(e.target.value)} className="admin-input mt-1 w-full" />
      )}
    </label>
  );
}

function SectionEditor({ section }: { section: typeof MOCK_SECTIONS[number] }) {
  const d = section.data as Record<string, unknown>;
  return (
    <div className="space-y-3 p-4">
      {typeof d.headline === 'string' && d.headline && <MockField label="Headline" value={d.headline} />}
      {typeof d.subline === 'string' && d.subline && <MockField label="Subline" value={d.subline} multiline />}
      {typeof d.badgeText === 'string' && d.badgeText && <MockField label="Badge-Text" value={d.badgeText} />}
      {typeof d.bgImage === 'string' && d.bgImage && (
        <div>
          <span className="text-zinc-500 text-xs font-medium">Hintergrundbild</span>
          <div className="mt-1 border border-dashed border-zinc-300 rounded-xl p-4 text-center text-sm text-zinc-400">
            <img src={d.bgImage} alt="" className="h-24 w-full object-cover rounded-lg mb-2" />
            Bild hochladen ↑
          </div>
        </div>
      )}
      {typeof d.ratingValue === 'string' && d.ratingValue && (
        <div className="grid grid-cols-2 gap-3">
          <MockField label="Bewertung" value={d.ratingValue} />
          <MockField label="Anzahl" value={(d.ratingCount as string) || ''} />
        </div>
      )}
    </div>
  );
}

export default function DemoPageEditorPage() {
  const [sections, setSections] = useState(MOCK_SECTIONS);
  const [openId, setOpenId] = useState<string | null>('hero');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Startseite</h1>
          <p className="text-sm text-zinc-400 mt-0.5">/ · 10 Sections</p>
        </div>
        <div className="flex gap-2">
          <button className="admin-btn-secondary" onClick={() => toast.info('Demo-Modus — Vorschau nicht verfügbar')}>
            <Eye size={16} /> Vorschau
          </button>
          <button className="admin-btn-primary" onClick={() => toast.success('Demo-Modus — Änderungen werden nicht gespeichert')}>
            Speichern
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="admin-card overflow-hidden">
            <button
              onClick={() => setOpenId(openId === section.id ? null : section.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors text-left"
            >
              <GripVertical size={16} className="text-zinc-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm text-zinc-900">{section.label}</span>
                <span className="text-xs text-zinc-400 ml-2">{section.type}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); const next = sections.map(s => s.id === section.id ? { ...s, visible: !s.visible } : s); setSections(next); }}
                className="text-zinc-400 hover:text-zinc-600"
              >
                {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              {openId === section.id ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
            </button>
            {openId === section.id && (
              <div className="border-t border-zinc-100">
                <SectionEditor section={section} />
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="mt-4 w-full admin-card p-3 text-sm text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
        onClick={() => toast.info('Demo-Modus — Sections können nicht hinzugefügt werden')}>
        <Plus size={16} /> Section hinzufügen
      </button>
    </div>
  );
}

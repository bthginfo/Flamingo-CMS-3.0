'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Eye, Palette, Phone, ChevronDown, ChevronUp,
  GripVertical, Plus, Trash2, Save, ArrowLeft, Sparkles, Monitor, Tablet, Smartphone,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

/* ─── Types ──────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SectionData = { id: string; type: string; label: string; visible: boolean; data: Record<string, any> };

/* ─── Demo Section Presets ───────────────────────────────────────── */
const DEMO_SECTIONS: SectionData[] = [
  {
    id: 's1', type: 'hero', label: 'Hero', visible: true,
    data: {
      headline: 'Müller & Söhne Meisterbetrieb',
      subline: 'Ihr zuverlässiger Partner für Sanitär, Heizung und Klima in der Region Stuttgart. Seit über 25 Jahren.',
      variant: 'split',
      primaryCta: { label: 'Kostenlose Beratung', href: '/kontakt' },
      secondaryCta: { label: 'Unsere Leistungen', href: '/leistungen' },
    },
  },
  {
    id: 's2', type: 'uspStrip', label: 'USP-Leiste', visible: true,
    data: {
      items: [
        { icon: 'shield-check', title: 'Meisterbetrieb', text: 'Zertifizierte Qualität' },
        { icon: 'clock', title: '24h Notdienst', text: 'Immer erreichbar' },
        { icon: 'award', title: '25+ Jahre', text: 'Erfahrung & Vertrauen' },
        { icon: 'map-pin', title: 'Region Stuttgart', text: 'Schnell vor Ort' },
      ],
    },
  },
  {
    id: 's3', type: 'ctaLinks', label: 'CTA-Links', visible: true,
    data: {
      headline: 'Unsere Fachbereiche',
      subline: 'Wählen Sie den Bereich, der Sie interessiert',
      links: [
        { label: 'Sanitär & Bad', href: '/leistungen', icon: 'droplets', description: 'Badsanierung, Armaturen, Wasserinstallation' },
        { label: 'Heizung & Klima', href: '/leistungen', icon: 'flame', description: 'Wärmepumpen, Fußbodenheizung, Wartung' },
        { label: 'Notdienst', href: '/kontakt', icon: 'siren', description: '24/7 Soforthilfe bei Rohrbruch & Co.' },
      ],
    },
  },
  {
    id: 's4', type: 'stats', label: 'Zahlen & Fakten', visible: true,
    data: {
      headline: 'Unser Erfolg in Zahlen',
      stats: [
        { value: 25, suffix: '+', label: 'Jahre Erfahrung', icon: 'calendar' },
        { value: 1200, suffix: '+', label: 'Zufriedene Kunden', icon: 'users' },
        { value: 98, suffix: '%', label: 'Weiterempfehlung', icon: 'thumbs-up' },
        { value: 50, suffix: 'km', label: 'Einsatzradius', icon: 'map' },
      ],
    },
  },
  {
    id: 's5', type: 'testimonials', label: 'Bewertungen', visible: true,
    data: {
      headline: 'Das sagen unsere Kunden',
      items: [
        { quote: 'Schnell, sauber und professionell. Unser Bad sieht fantastisch aus!', name: 'Familie Weber', context: 'Badsanierung 2024', rating: 5 },
        { quote: 'Der Notdienst war innerhalb von 30 Minuten da. Top Service!', name: 'Thomas K.', context: 'Rohrbruch Soforthilfe', rating: 5 },
      ],
    },
  },
  {
    id: 's6', type: 'contact', label: 'Kontakt', visible: true,
    data: {
      headline: 'Kontaktieren Sie uns',
      introText: 'Wir freuen uns auf Ihre Anfrage!',
      badgeText: 'Jetzt anfragen',
      submitLabel: 'Nachricht senden',
      formEnabled: true,
      infoCards: [
        { icon: 'phone', label: 'Telefon', value: '0711 / 123 456 78' },
        { icon: 'mail', label: 'E-Mail', value: 'info@mueller-shk.de' },
        { icon: 'map-pin', label: 'Standort', value: 'Musterstraße 12, 70173 Stuttgart' },
        { icon: 'clock', label: 'Öffnungszeiten', value: 'Mo–Fr 7:30–17:00' },
      ],
    },
  },
];

const SECTION_TYPE_OPTIONS = [
  { type: 'hero', label: 'Hero' },
  { type: 'uspStrip', label: 'USP-Leiste' },
  { type: 'servicesGrid', label: 'Leistungen' },
  { type: 'processSteps', label: 'Ablauf' },
  { type: 'ctaLinks', label: 'CTA-Links' },
  { type: 'newsPreview', label: 'News-Vorschau' },
  { type: 'stats', label: 'Zahlen & Fakten' },
  { type: 'logoCloud', label: 'Logo-Cloud' },
  { type: 'galleryGrid', label: 'Galerie' },
  { type: 'testimonials', label: 'Bewertungen' },
  { type: 'faq', label: 'FAQ' },
  { type: 'ctaBand', label: 'CTA-Band' },
  { type: 'contact', label: 'Kontakt' },
  { type: 'map', label: 'Karte' },
  { type: 'serviceDetail', label: 'Leistungs-Detail' },
  { type: 'portfolio', label: 'Portfolio' },
  { type: 'team', label: 'Team' },
];

/* ─── Brand Settings ─────────────────────────────────────────────── */
const DEFAULT_BRAND = {
  companyName: 'Müller & Söhne Meisterbetrieb',
  tagline: 'Sanitär · Heizung · Klima',
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  accentColor: '#f59e0b',
};

/* ─── Main Demo Component ────────────────────────────────────────── */
export default function DemoPlayground() {
  const [sections, setSections] = useState<SectionData[]>(DEMO_SECTIONS);
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [activePanel, setActivePanel] = useState<'pages' | 'brand' | 'contact'>('pages');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const toggleVisibility = useCallback((id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  }, []);

  const removeSection = useCallback((id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    if (expandedSection === id) setExpandedSection(null);
  }, [expandedSection]);

  const moveSection = useCallback((id: string, dir: -1 | 1) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  }, []);

  const addSection = useCallback((type: string) => {
    const label = SECTION_TYPE_OPTIONS.find(o => o.type === type)?.label || type;
    const newSection: SectionData = {
      id: `s${Date.now()}`,
      type,
      label,
      visible: true,
      data: {},
    };
    setSections(prev => [...prev, newSection]);
    setShowAddMenu(false);
    setExpandedSection(newSection.id);
  }, []);

  const updateSectionData = useCallback((id: string, field: string, value: unknown) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, data: { ...s.data, [field]: value } } : s));
  }, []);

  const viewportWidth = viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px';

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Top bar */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-5 shrink-0 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Zurück
          </Link>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <span className="font-semibold text-sm">Flamingo CMS — Interactive Demo</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as [string, LucideIcon][]).map(([key, Icon]) => (
            <button
              key={key}
              onClick={() => setViewport(key as 'desktop' | 'tablet' | 'mobile')}
              className={`p-1.5 rounded-md transition-colors ${viewport === key ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-400/80 bg-amber-400/10 px-3 py-1 rounded-full">Demo-Modus — keine echten Änderungen</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-white/10 shrink-0 flex flex-col">
          <div className="p-4 space-y-1">
            {([
              ['pages', FileText, 'Seiten-Editor'],
              ['brand', Palette, 'Marke & Design'],
              ['contact', Phone, 'Kontakt-Daten'],
            ] as [string, LucideIcon, string][]).map(([key, Icon, label]) => (
              <button
                key={key}
                onClick={() => setActivePanel(key as 'pages' | 'brand' | 'contact')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activePanel === key ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          <div className="border-t border-white/10 mt-2 pt-3 px-4">
            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Weitere Bereiche</div>
            {['Mediathek', 'SEO', 'Navigation', 'Posteingang', 'Mail-Server'].map(l => (
              <div key={l} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/30 cursor-default">
                <div className="w-4 h-4 rounded bg-white/5" /> {l}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Panel */}
        <div className="w-[380px] bg-gray-900/50 border-r border-white/10 shrink-0 overflow-y-auto">
          <div className="p-5">
            <AnimatePresence mode="wait">
              {activePanel === 'pages' && (
                <motion.div key="pages" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">Startseite</h2>
                    <div className="relative">
                      <button onClick={() => setShowAddMenu(!showAddMenu)} className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">
                        <Plus size={14} /> Sektion
                      </button>
                      {showAddMenu && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-gray-800 border border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                          {SECTION_TYPE_OPTIONS.map(opt => (
                            <button key={opt.type} onClick={() => addSection(opt.type)} className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5 last:border-0">
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {sections.map((section, idx) => (
                      <div key={section.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-2.5">
                          <GripVertical size={14} className="text-white/20" />
                          <span className={`text-sm flex-1 ${section.visible ? 'text-white/90' : 'text-white/30 line-through'}`}>{section.label}</span>
                          <button onClick={() => moveSection(section.id, -1)} disabled={idx === 0} className="text-white/30 hover:text-white/70 disabled:opacity-20"><ChevronUp size={14} /></button>
                          <button onClick={() => moveSection(section.id, 1)} disabled={idx === sections.length - 1} className="text-white/30 hover:text-white/70 disabled:opacity-20"><ChevronDown size={14} /></button>
                          <button onClick={() => toggleVisibility(section.id)} className={`text-xs px-2 py-0.5 rounded ${section.visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {section.visible ? 'An' : 'Aus'}
                          </button>
                          <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)} className="text-white/40 hover:text-white/80">
                            <ChevronDown size={14} className={`transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`} />
                          </button>
                          <button onClick={() => removeSection(section.id)} className="text-red-400/50 hover:text-red-400"><Trash2 size={13} /></button>
                        </div>

                        <AnimatePresence>
                          {expandedSection === section.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 pt-1 border-t border-white/5">
                                <DemoFieldEditor section={section} onUpdate={updateSectionData} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activePanel === 'brand' && (
                <motion.div key="brand" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h2 className="font-semibold text-lg mb-4">Marke & Design</h2>
                  <div className="space-y-4">
                    <DemoField label="Firmenname" value={brand.companyName} onChange={v => setBrand({ ...brand, companyName: v })} />
                    <DemoField label="Tagline" value={brand.tagline} onChange={v => setBrand({ ...brand, tagline: v })} />
                    <div className="grid grid-cols-3 gap-3">
                      <DemoColorField label="Primärfarbe" value={brand.primaryColor} onChange={v => setBrand({ ...brand, primaryColor: v })} />
                      <DemoColorField label="Sekundär" value={brand.secondaryColor} onChange={v => setBrand({ ...brand, secondaryColor: v })} />
                      <DemoColorField label="Akzent" value={brand.accentColor} onChange={v => setBrand({ ...brand, accentColor: v })} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activePanel === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h2 className="font-semibold text-lg mb-4">Kontakt-Daten</h2>
                  <p className="text-sm text-white/40 mb-4">Diese Daten erscheinen automatisch im Kontakt-Bereich, Footer und Header der Website.</p>
                  {(() => {
                    const contactSection = sections.find(s => s.type === 'contact');
                    const cards = (contactSection?.data.infoCards as { icon: string; label: string; value: string }[]) || [];
                    return (
                      <div className="space-y-3">
                        {cards.map((card, i) => (
                          <DemoField key={i} label={card.label} value={card.value} onChange={v => {
                            if (!contactSection) return;
                            const newCards = [...cards];
                            newCards[i] = { ...card, value: v };
                            updateSectionData(contactSection.id, 'infoCards', newCards);
                          }} />
                        ))}
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-gray-950 flex items-start justify-center overflow-auto p-6">
          <div
            className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 shrink-0"
            style={{ width: viewportWidth, maxWidth: '100%', minHeight: '80vh' }}
          >
            <DemoPreview sections={sections.filter(s => s.visible)} brand={brand} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Demo Field Editor (per section) ────────────────────────────── */
function DemoFieldEditor({ section, onUpdate }: { section: SectionData; onUpdate: (id: string, field: string, value: unknown) => void }) {
  const { id, type, data } = section;

  if (type === 'hero') {
    return (
      <div className="space-y-2.5">
        <DemoField label="Headline" value={(data.headline as string) || ''} onChange={v => onUpdate(id, 'headline', v)} />
        <DemoField label="Subline" value={(data.subline as string) || ''} onChange={v => onUpdate(id, 'subline', v)} multiline />
      </div>
    );
  }

  if (type === 'stats') {
    const stats = (data.stats as { value: number; suffix: string; label: string }[]) || [];
    return (
      <div className="space-y-2.5">
        <DemoField label="Headline" value={(data.headline as string) || ''} onChange={v => onUpdate(id, 'headline', v)} />
        {stats.map((stat, i) => (
          <div key={i} className="flex gap-2">
            <input className="demo-input w-16" type="number" value={stat.value} onChange={e => {
              const newStats = [...stats]; newStats[i] = { ...stat, value: Number(e.target.value) }; onUpdate(id, 'stats', newStats);
            }} />
            <input className="demo-input flex-1" value={stat.label} placeholder="Label" onChange={e => {
              const newStats = [...stats]; newStats[i] = { ...stat, label: e.target.value }; onUpdate(id, 'stats', newStats);
            }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'contact') {
    return (
      <div className="space-y-2.5">
        <DemoField label="Headline" value={(data.headline as string) || ''} onChange={v => onUpdate(id, 'headline', v)} />
        <DemoField label="Einleitungstext" value={(data.introText as string) || ''} onChange={v => onUpdate(id, 'introText', v)} />
        <DemoField label="Button-Text" value={(data.submitLabel as string) || ''} onChange={v => onUpdate(id, 'submitLabel', v)} />
      </div>
    );
  }

  if (type === 'ctaLinks') {
    const links = (data.links as { label: string; href: string; icon: string; description: string }[]) || [];
    return (
      <div className="space-y-2.5">
        <DemoField label="Headline" value={(data.headline as string) || ''} onChange={v => onUpdate(id, 'headline', v)} />
        {links.map((link, i) => (
          <div key={i} className="space-y-1.5 bg-white/5 rounded-lg p-2">
            <input className="demo-input" value={link.label} placeholder="Label" onChange={e => {
              const n = [...links]; n[i] = { ...link, label: e.target.value }; onUpdate(id, 'links', n);
            }} />
            <input className="demo-input" value={link.description} placeholder="Beschreibung" onChange={e => {
              const n = [...links]; n[i] = { ...link, description: e.target.value }; onUpdate(id, 'links', n);
            }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'testimonials') {
    return (
      <div className="space-y-2.5">
        <DemoField label="Headline" value={(data.headline as string) || ''} onChange={v => onUpdate(id, 'headline', v)} />
        {((data.items as { quote: string; name: string; context: string }[]) || []).map((item, i) => (
          <div key={i} className="space-y-1.5 bg-white/5 rounded-lg p-2">
            <textarea className="demo-input resize-none" rows={2} value={item.quote} placeholder="Zitat" onChange={e => {
              const items = [...(data.items as { quote: string; name: string; context: string }[])];
              items[i] = { ...item, quote: e.target.value };
              onUpdate(id, 'items', items);
            }} />
            <input className="demo-input" value={item.name} placeholder="Name" onChange={e => {
              const items = [...(data.items as { quote: string; name: string; context: string }[])];
              items[i] = { ...item, name: e.target.value };
              onUpdate(id, 'items', items);
            }} />
          </div>
        ))}
      </div>
    );
  }

  // Fallback: show editable headline if present  
  if (typeof data.headline === 'string') {
    return <DemoField label="Headline" value={data.headline} onChange={v => onUpdate(id, 'headline', v)} />;
  }

  return <p className="text-xs text-white/30 italic">Erweiterte Felder im Admin verfügbar.</p>;
}

/* ─── Live Preview ───────────────────────────────────────────────── */
function DemoPreview({ sections, brand }: { sections: SectionData[]; brand: typeof DEFAULT_BRAND }) {
  return (
    <div style={{ '--c-primary': brand.primaryColor, '--c-secondary': brand.secondaryColor, '--c-accent': brand.accentColor } as React.CSSProperties}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ background: brand.primaryColor }} />
            <div>
              <div className="font-bold text-sm text-gray-900 leading-tight">{brand.companyName}</div>
              <div className="text-[10px] text-gray-400">{brand.tagline}</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <span>Startseite</span><span>Leistungen</span><span>Referenzen</span><span>Kontakt</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map(section => (
        <div key={section.id}>
          <PreviewSection section={section} brand={brand} />
        </div>
      ))}

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="font-bold text-lg">{brand.companyName}</div>
            <div className="text-gray-400 text-sm mt-1">{brand.tagline}</div>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <div>© 2024 {brand.companyName}</div>
            <div>Impressum · Datenschutz</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Preview Section Renderer ───────────────────────────────────── */
function PreviewSection({ section, brand }: { section: SectionData; brand: typeof DEFAULT_BRAND }) {
  const { type, data } = section;

  if (type === 'hero') {
    return (
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 30% 50%, ${brand.primaryColor}, transparent 70%)` }} />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">{(data.headline as string) || 'Ihre Headline'}</h1>
            <p className="text-lg text-white/70 mb-8">{(data.subline as string) || ''}</p>
            <div className="flex gap-3">
              <button className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: brand.primaryColor }}>
                {(data.primaryCta as { label: string })?.label || 'Jetzt anfragen'}
              </button>
              <button className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/5">
                {(data.secondaryCta as { label: string })?.label || 'Mehr erfahren'}
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-sm">
              Bild-Bereich
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'uspStrip') {
    const items = (data.items as { title: string; text: string }[]) || [];
    return (
      <div className="py-0 px-6">
        <div className="max-w-7xl mx-auto -mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1">
            <div className={`grid grid-cols-${Math.min(items.length, 4)} gap-px bg-gray-100 rounded-xl overflow-hidden`}>
              {items.map((item, i) => (
                <div key={i} className="bg-white p-6 text-center">
                  <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'ctaLinks') {
    const links = (data.links as { label: string; description: string; icon?: string }[]) || [];
    return (
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {data.headline && <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">{data.headline as string}</h2>}
          {data.subline && <p className="text-center text-gray-500 mb-10">{data.subline as string}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${brand.primaryColor}15` }}>
                  <div className="w-5 h-5 rounded" style={{ background: brand.primaryColor, opacity: 0.6 }} />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{link.label}</div>
                  {link.description && <div className="text-xs text-gray-500 mt-0.5">{link.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'stats') {
    const stats = (data.stats as { value: number; suffix?: string; label: string }[]) || [];
    return (
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {data.headline && <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{data.headline as string}</h2>}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="text-3xl font-bold text-gray-900">{stat.value}{stat.suffix || ''}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'testimonials') {
    const items = (data.items as { quote: string; name: string; context: string }[]) || [];
    return (
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {data.headline && <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{data.headline as string}</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-0.5 mb-3">{'★★★★★'.split('').map((s, j) => <span key={j} className="text-amber-400">{s}</span>)}</div>
                <p className="text-gray-700 italic mb-4">&ldquo;{item.quote}&rdquo;</p>
                <div className="text-sm"><span className="font-semibold text-gray-900">{item.name}</span> <span className="text-gray-400">· {item.context}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'contact') {
    const cards = (data.infoCards as { label: string; value: string }[]) || [];
    return (
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {data.headline && <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">{data.headline as string}</h2>}
          {data.introText && <p className="text-center text-gray-500 mb-10">{data.introText as string}</p>}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-3">
              {cards.map((card, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${brand.primaryColor}10` }}>
                    <div className="w-4 h-4 rounded" style={{ background: brand.primaryColor, opacity: 0.5 }} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{card.label}</div>
                    <div className="text-sm font-semibold text-gray-900">{card.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center px-4 text-sm text-gray-400">Ihr Name</div>
                  <div className="h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center px-4 text-sm text-gray-400">E-Mail</div>
                </div>
                <div className="h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center px-4 text-sm text-gray-400">Telefon (optional)</div>
                <div className="h-32 rounded-xl bg-gray-50 border border-gray-200 flex items-start p-4 text-sm text-gray-400">Nachricht…</div>
                <button className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: brand.primaryColor }}>
                  {(data.submitLabel as string) || 'Nachricht senden'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for unimplemented preview types
  return (
    <div className="py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {data.headline && <h2 className="text-3xl font-bold text-gray-900 mb-3">{data.headline as string}</h2>}
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-gray-400 text-sm">
          Vorschau: {section.label}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared UI Components ───────────────────────────────────────── */
function DemoField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="text-[11px] text-white/40 uppercase tracking-wide">{label}</span>
      {multiline ? (
        <textarea className="demo-input mt-1 resize-none" rows={3} value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input className="demo-input mt-1" value={value} onChange={e => onChange(e.target.value)} />
      )}
    </label>
  );
}

function DemoColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] text-white/40 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
        <input className="demo-input flex-1" value={value} onChange={e => onChange(e.target.value)} />
      </div>
    </label>
  );
}

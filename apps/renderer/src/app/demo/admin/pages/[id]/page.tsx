'use client';

import { useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Plus, Trash2, Settings2, Save, Rocket, ExternalLink } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IndustrySectionDataEditor } from '@/app/admin/pages/[id]/industry-section-editor';
import { getSectionTypesForIndustry } from '@/app/admin/pages/[id]/section-types';

/* ─── types ──────────────────────────────────────────────────────── */
type Section = {
  id: string;
  type: string;
  titleInternal: string | null;
  variant: string | null;
  visible: boolean;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId: string | null;
  data: Record<string, unknown>;
  sortOrder: number;
};

/* ─── Mock data per page ─────────────────────────────────────────── */
const MOCK_PAGES: Record<string, { title: string; slug: string; industry: string; sections: Section[] }> = {
  startseite: {
    title: 'Startseite',
    slug: 'startseite',
    industry: 'tradesman',
    sections: [
      { id: 'hero', type: 'hero', titleInternal: null, variant: null, visible: true, container: 'full', spacingTop: 'none', spacingBottom: 'none', anchorId: null, sortOrder: 0, data: { headline: 'Müller & Söhne Meisterbetrieb', subline: 'Seit 1987 Ihr Partner für Sanitär, Heizung und Bäder in Köln und Umgebung.', badgeText: 'Meisterbetrieb', bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85', trustItems: ['Meisterqualität', '24h Notdienst', 'Faire Preise'], primaryCta: { label: 'Kostenlos anfragen', href: '/kontakt' }, secondaryCta: { label: 'Unsere Leistungen', href: '/leistungen' } } },
      { id: 'usp', type: 'uspStrip', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 1, data: { items: [{ icon: 'shield-check', title: 'Meisterqualität', text: 'Alle Arbeiten in Meisterqualität mit 5 Jahren Garantie.' }, { icon: 'clock', title: '24h Notdienst', text: 'Rund um die Uhr erreichbar bei Rohrbruch und Heizungsausfall.' }, { icon: 'star', title: '4.9/5 Sterne', text: 'Über 120 zufriedene Kunden auf Google bewerten uns mit 4.9 Sternen.' }] } },
      { id: 'services', type: 'servicesGrid', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 2, data: { headline: 'Unsere Leistungen', subline: 'Kompetenz in allen Gewerken — von der Beratung bis zur Umsetzung.', badgeText: 'Leistungen', ctaLabel: 'Alle Leistungen', ctaHref: '/leistungen', manualCards: [{ title: 'Sanitärinstallation', text: 'Bäder, Leitungen, Armaturen.', icon: 'droplets' }, { title: 'Heizungstechnik', text: 'Moderne Heizsysteme.', icon: 'flame' }, { title: 'Badsanierung', text: 'Komplettbäder aus einer Hand.', icon: 'bath' }] } },
      { id: 'process', type: 'processSteps', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 3, data: { headline: 'So arbeiten wir', badgeText: 'Ablauf', steps: [{ title: 'Anfrage', text: 'Beschreiben Sie Ihr Anliegen.', icon: 'message-circle' }, { title: 'Beratung & Angebot', text: 'Kostenlose Vor-Ort-Beratung.', icon: 'clipboard-check' }, { title: 'Umsetzung', text: 'Termingerechte Ausführung.', icon: 'hammer' }, { title: 'Abnahme & Garantie', text: 'Gemeinsame Abnahme und 5 Jahre Gewährleistung.', icon: 'shield-check' }] } },
      { id: 'testimonials', type: 'testimonials', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 4, data: { headline: 'Das sagen unsere Kunden', badgeText: 'Bewertungen', ratingValue: '4.9', ratingCount: '127', items: [{ quote: 'Hervorragende Arbeit bei unserer Badsanierung!', name: 'Familie Weber', context: 'Badsanierung Köln-Ehrenfeld', rating: 5 }, { quote: 'Notdienst war innerhalb von 30 Minuten da.', name: 'Thomas K.', context: 'Rohrbruch Notdienst', rating: 5 }] } },
      { id: 'faq', type: 'faq', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 5, data: { headline: 'Häufige Fragen', badgeText: 'FAQ', items: [{ question: 'Wie schnell können Sie einen Termin anbieten?', answer: 'In der Regel innerhalb von 3-5 Werktagen.' }, { question: 'Bieten Sie kostenlose Angebote an?', answer: 'Ja — nach einer Vor-Ort-Besichtigung.' }] } },
      { id: 'cta', type: 'ctaBand', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 6, data: { headline: 'Projekt starten?', subline: 'Wir beraten Sie gerne — kostenlos und unverbindlich.', badgeText: 'Jetzt anfragen', ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' } } },
      { id: 'contact', type: 'contact', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 7, data: { headline: 'Kontaktieren Sie uns', badgeText: 'Kontakt', introText: 'Beschreiben Sie Ihr Anliegen.', formEnabled: true, submitLabel: 'Nachricht senden', infoCards: [{ icon: 'phone', label: 'Telefon', value: '0221 987 654' }, { icon: 'mail', label: 'E-Mail', value: 'info@mueller-soehne.de' }, { icon: 'map-pin', label: 'Adresse', value: 'Musterstraße 12, 50667 Köln' }] } },
    ],
  },
  leistungen: {
    title: 'Leistungen',
    slug: 'leistungen',
    industry: 'tradesman',
    sections: [
      { id: 'l-hero', type: 'hero', titleInternal: null, variant: null, visible: true, container: 'full', spacingTop: 'none', spacingBottom: 'none', anchorId: null, sortOrder: 0, data: { headline: 'Unsere Leistungen', subline: 'Sanitär, Heizung und Bäder — alles aus einer Hand.', badgeText: 'Leistungen', bgImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1800&q=85', primaryCta: { label: 'Jetzt anfragen', href: '/kontakt' } } },
      { id: 'l-services', type: 'serviceDetail', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 1, data: { headline: 'Leistungen im Detail', subline: 'Was wir für Sie tun können.', badgeText: 'Detail', items: [{ title: 'Sanitärinstallation', text: 'Neuinstallation und Sanierung.', icon: 'droplets', features: ['Trinkwasser', 'Abwasser', 'Regenwasser'] }, { title: 'Heizungstechnik', text: 'Moderne Heizsysteme.', icon: 'flame', features: ['Wärmepumpen', 'Gas', 'Fußbodenheizung'] }] } },
    ],
  },
  kontakt: {
    title: 'Kontakt',
    slug: 'kontakt',
    industry: 'tradesman',
    sections: [
      { id: 'k-hero', type: 'hero', titleInternal: null, variant: null, visible: true, container: 'full', spacingTop: 'none', spacingBottom: 'none', anchorId: null, sortOrder: 0, data: { headline: 'Kontakt', subline: 'Wir freuen uns auf Ihre Anfrage.', badgeText: 'Kontakt', bgImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&q=85', primaryCta: { label: 'Anrufen', href: 'tel:+49221987654' } } },
      { id: 'k-contact', type: 'contact', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 1, data: { headline: 'Schreiben Sie uns', badgeText: 'Formular', introText: 'Füllen Sie das Formular aus.', formEnabled: true, submitLabel: 'Absenden', infoCards: [{ icon: 'phone', label: 'Telefon', value: '0221 987 654' }, { icon: 'mail', label: 'E-Mail', value: 'info@mueller-soehne.de' }] } },
      { id: 'k-map', type: 'map', titleInternal: null, variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, sortOrder: 2, data: { headline: 'So finden Sie uns', embedUrl: '' } },
    ],
  },
};

/* ─── Section Meta Editor ────────────────────────────────────────── */
function SectionMetaEditor({ section }: { section: Section }) {
  const [meta, setMeta] = useState({
    titleInternal: section.titleInternal || '',
    variant: section.variant || '',
    container: section.container,
    spacingTop: section.spacingTop,
    spacingBottom: section.spacingBottom,
    anchorId: section.anchorId || '',
  });

  return (
    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
      <label className="block">
        <span className="text-gray-600 text-xs">Interner Titel</span>
        <input className="admin-input mt-1" value={meta.titleInternal} onChange={(e) => setMeta({ ...meta, titleInternal: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Variante</span>
        <input className="admin-input mt-1" value={meta.variant} onChange={(e) => setMeta({ ...meta, variant: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Container</span>
        <select className="admin-input mt-1" value={meta.container} onChange={(e) => setMeta({ ...meta, container: e.target.value })}>
          <option value="default">Standard</option>
          <option value="wide">Breit</option>
          <option value="full">Volle Breite</option>
          <option value="narrow">Schmal</option>
        </select>
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Anker-ID</span>
        <input className="admin-input mt-1" value={meta.anchorId} onChange={(e) => setMeta({ ...meta, anchorId: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Abstand oben</span>
        <select className="admin-input mt-1" value={meta.spacingTop} onChange={(e) => setMeta({ ...meta, spacingTop: e.target.value })}>
          <option value="none">Kein</option><option value="s">Klein</option><option value="m">Mittel</option><option value="l">Groß</option><option value="xl">Extra Groß</option>
        </select>
      </label>
      <label className="block">
        <span className="text-gray-600 text-xs">Abstand unten</span>
        <select className="admin-input mt-1" value={meta.spacingBottom} onChange={(e) => setMeta({ ...meta, spacingBottom: e.target.value })}>
          <option value="none">Kein</option><option value="s">Klein</option><option value="m">Mittel</option><option value="l">Groß</option><option value="xl">Extra Groß</option>
        </select>
      </label>
      <div className="col-span-2">
        <button className="admin-btn-primary text-xs" onClick={() => toast.info('Demo-Modus — Meta wird nicht gespeichert')}>Meta speichern</button>
      </div>
    </div>
  );
}

/* ─── Sortable Section ───────────────────────────────────────────── */
function SortableSection({ section, industry, onDelete, onToggleVisible, onChangeData }: {
  section: Section;
  industry: string;
  onDelete: () => void;
  onToggleVisible: () => void;
  onChangeData: (data: Record<string, unknown>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const sectionTypes = getSectionTypesForIndustry(industry);
  const typeInfo = sectionTypes.find(t => t.type === section.type);

  return (
    <div ref={setNodeRef} style={style} className={`admin-card mb-3 p-0 overflow-hidden ${expanded ? 'ring-2 ring-blue-500/20 border-blue-300' : ''}`}>
      <div className={`flex items-center px-4 py-3 border-b cursor-pointer ${expanded ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`} onClick={() => setExpanded(!expanded)}>
        <button {...attributes} {...listeners} className="cursor-grab mr-3 text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
          <GripVertical size={18} />
        </button>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className={`font-medium text-sm ${expanded ? 'text-blue-700' : ''}`}>{typeInfo?.label ?? section.type}</span>
          {section.titleInternal && <span className="text-xs text-gray-400">({section.titleInternal})</span>}
          {!expanded && <span className="text-[10px] text-zinc-400 ml-1">— Klicken zum Bearbeiten</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onToggleVisible(); }} className="p-1 mr-2" title={section.visible ? 'Ausblenden' : 'Einblenden'}>
          {section.visible ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-gray-400" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="p-1 mr-2">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-red-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
      {expanded && (
        <div className="p-4">
          <IndustrySectionDataEditor industry={industry} type={section.type} data={section.data} onChange={onChangeData} />
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1"><Settings2 size={12} /> Erweiterte Einstellungen</summary>
            <SectionMetaEditor section={section} />
          </details>
        </div>
      )}
    </div>
  );
}

/* ─── Main Demo Page Editor ──────────────────────────────────────── */
export default function DemoPageEditorPage() {
  const params = useParams();
  const pageSlug = (params.id as string) || 'startseite';
  const pageData = MOCK_PAGES[pageSlug] || MOCK_PAGES.startseite;

  const [page, setPage] = useState({ title: pageData.title, slug: pageData.slug, visible: true });
  const [sections, setSections] = useState<Section[]>(pageData.sections);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [hasDirty, setHasDirty] = useState(false);
  const pendingChanges = useRef<Map<string, Record<string, unknown>>>(new Map());

  const industry = pageData.industry;
  const sectionTypes = getSectionTypesForIndustry(industry);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);
    setSections(arrayMove(sections, oldIndex, newIndex));
    toast.success('Reihenfolge geändert (Demo — wird nicht gespeichert)');
  }

  function handleAddSection(type: string) {
    setShowAddMenu(false);
    const newSection: Section = {
      id: `demo-${Date.now()}`,
      type,
      titleInternal: null,
      variant: null,
      visible: true,
      container: 'default',
      spacingTop: 'l',
      spacingBottom: 'l',
      anchorId: null,
      data: {},
      sortOrder: sections.length,
    };
    setSections([...sections, newSection]);
    toast.success('Sektion hinzugefügt (Demo — wird nicht gespeichert)');
  }

  function handleDeleteSection(sectionId: string) {
    setSections(sections.filter(s => s.id !== sectionId));
    toast.success('Sektion entfernt (Demo — wird nicht gespeichert)');
  }

  function handleToggleVisible(sectionId: string) {
    setSections(sections.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s));
  }

  const handleSectionChange = useCallback((sectionId: string, data: Record<string, unknown>) => {
    pendingChanges.current.set(sectionId, data);
    setHasDirty(true);
  }, []);

  const [saved, setSaved] = useState(false);

  function handleSaveAll() {
    setSections(s => s.map(sec => {
      const newData = pendingChanges.current.get(sec.id);
      return newData ? { ...sec, data: newData } : sec;
    }));
    pendingChanges.current.clear();
    setHasDirty(false);
    setSaved(true);
    toast.success('Gespeichert');
  }

  return (
    <div>
      {/* Header — matches real admin */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/demo/admin/pages" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <div className="flex-1">
          <input className="text-2xl font-bold bg-transparent border-none outline-none w-full" value={page.title} onChange={(e) => { setPage({ ...page, title: e.target.value }); setHasDirty(true); setSaved(false); }} />
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">/</span>
            <input className="text-sm text-gray-500 bg-transparent border-none outline-none" value={page.slug} onChange={(e) => { setPage({ ...page, slug: e.target.value }); setHasDirty(true); setSaved(false); }} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={page.visible} onChange={() => { setPage({ ...page, visible: !page.visible }); setHasDirty(true); setSaved(false); }} />
          Sichtbar
        </label>
      </div>

      {/* Sections list with DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map(section => (
            <SortableSection
              key={section.id}
              section={section}
              industry={industry}
              onDelete={() => handleDeleteSection(section.id)}
              onToggleVisible={() => handleToggleVisible(section.id)}
              onChangeData={(data) => handleSectionChange(section.id, data)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="admin-card text-center py-12 text-gray-400">
          Noch keine Sektionen. Füge unten eine hinzu.
        </div>
      )}

      {/* Add Section — matches real admin */}
      <div className="mt-4 relative">
        <button onClick={() => setShowAddMenu(!showAddMenu)} className="admin-btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={18} /> Sektion hinzufügen
        </button>
        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-80 overflow-auto z-10">
            {sectionTypes.map((st) => (
              <button key={st.type} onClick={() => handleAddSection(st.type)} className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
                <span className="font-medium text-sm">{st.label}</span>
                <span className="text-xs text-gray-500 ml-2">{st.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FAB Bar — matches real admin */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
        {!saved ? (
          <button
            onClick={handleSaveAll}
            disabled={!hasDirty}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full shadow-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} /> Speichern
          </button>
        ) : (
          <>
            <a
              href="/demo/handwerk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-full shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={16} /> Vorschau
            </a>
            <button
              onClick={() => toast.info('Demo-Modus — Veröffentlichung ist deaktiviert')}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full shadow-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Rocket size={16} /> Veröffentlichen
            </button>
          </>
        )}
      </div>
    </div>
  );
}

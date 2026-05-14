'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, GripVertical, Eye, EyeOff, Settings2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updatePageAction, addSectionAction, deleteSectionAction, updateSectionAction, updateSectionMetaAction, reorderSectionsAction } from '../actions';
import { toast } from 'sonner';
import { SectionDataEditor } from './section-data-editor';
import { PageSeoPanel } from './page-seo-panel';

const SECTION_TYPES: { type: string; label: string; description: string }[] = [
  { type: 'hero', label: 'Hero', description: 'Hauptbanner der Seite' },
  { type: 'uspStrip', label: 'USP-Leiste', description: 'Einzigartige Verkaufsargumente' },
  { type: 'servicesGrid', label: 'Leistungen', description: 'Leistungs-Grid' },
  { type: 'processSteps', label: 'Ablauf', description: 'Prozess-Schritte Timeline' },
  { type: 'ctaLinks', label: 'CTA-Links', description: 'Button-Links zu Unterseiten' },
  { type: 'newsPreview', label: 'News-Vorschau', description: 'Aktuelle Beiträge (News/Blog)' },
  { type: 'stats', label: 'Zahlen & Fakten', description: 'Animierte Statistik-Zähler' },
  { type: 'logoCloud', label: 'Logo-Cloud', description: 'Partner- & Zertifikats-Logos' },
  { type: 'galleryGrid', label: 'Galerie', description: 'Bildergalerie mit Lightbox' },
  { type: 'projectGallery', label: 'Projekte', description: 'Projekt-Galerie' },
  { type: 'trust', label: 'Vertrauen', description: 'Zertifikate & Partner' },
  { type: 'testimonials', label: 'Bewertungen', description: 'Kundenstimmen' },
  { type: 'faq', label: 'FAQ', description: 'Häufige Fragen' },
  { type: 'ctaBand', label: 'CTA-Band', description: 'Call-to-Action Banner' },
  { type: 'contact', label: 'Kontakt', description: 'Kontaktformular' },
  { type: 'map', label: 'Karte', description: 'Google Maps Einbettung' },
  { type: 'serviceDetail', label: 'Leistungs-Detail', description: 'Detaillierte Leistungsbeschreibung' },
  { type: 'portfolio', label: 'Portfolio', description: 'Referenzprojekte-Galerie' },
  { type: 'team', label: 'Team', description: 'Team-Mitglieder' },
  { type: 'richText', label: 'Freitext / HTML', description: 'Impressum, Datenschutz, AGB etc.' },
  { type: 'headerBanner', label: 'Header-Banner', description: 'Obere Hinweisleiste' },
];

type Section = {
  id: string;
  type: string;
  variant: string | null;
  titleInternal: string | null;
  visible: boolean;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId: string | null;
  data: Record<string, unknown>;
  sortOrder: number;
};

type Page = {
  id: string;
  title: string;
  slug: string;
  status: string;
  visible: boolean;
  type: string;
};

function SortableSection({ section, onDelete, onToggleVisible, onSaveData, onSaveMeta }: {
  section: Section;
  onDelete: () => void;
  onToggleVisible: () => void;
  onSaveData: (data: Record<string, unknown>) => void;
  onSaveMeta: (meta: Record<string, unknown>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const typeInfo = SECTION_TYPES.find(t => t.type === section.type);

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
        <button onClick={onToggleVisible} className="p-1 mr-2" title={section.visible ? 'Ausblenden' : 'Einblenden'}>
          {section.visible ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-gray-400" />}
        </button>
        <button onClick={() => setExpanded(!expanded)} className="p-1 mr-2">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button onClick={onDelete} className="p-1 text-red-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
      {expanded && (
        <div className="p-4">
          <SectionDataEditor type={section.type} data={section.data} onSave={onSaveData} />
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1"><Settings2 size={12} /> Erweiterte Einstellungen</summary>
            <SectionMetaEditor section={section} onSave={onSaveMeta} />
          </details>
        </div>
      )}
    </div>
  );
}

function SectionMetaEditor({ section, onSave }: { section: Section; onSave: (meta: Record<string, unknown>) => void }) {
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
        <button className="admin-btn-primary text-xs" onClick={() => onSave(meta)}>Meta speichern</button>
      </div>
    </div>
  );
}

export function PageEditor({ page: initialPage, sections: initialSections }: { page: Page; sections: Section[] }) {
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState(initialSections);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);
    const newOrder = arrayMove(sections, oldIndex, newIndex);
    setSections(newOrder);
    startTransition(async () => {
      await reorderSectionsAction(page.id, newOrder.map(s => s.id));
      toast.success('Reihenfolge gespeichert');
    });
  }

  function handleAddSection(type: string) {
    setShowAddMenu(false);
    startTransition(async () => {
      const section = await addSectionAction(page.id, type);
      if (section) setSections(prev => [...prev, section as Section]);
      toast.success('Sektion hinzugefügt');
    });
  }

  function handleDeleteSection(sectionId: string) {
    if (!confirm('Sektion wirklich löschen?')) return;
    setSections(prev => prev.filter(s => s.id !== sectionId));
    startTransition(async () => {
      await deleteSectionAction(sectionId, page.id);
      toast.success('Sektion gelöscht');
    });
  }

  function handleToggleVisible(sectionId: string) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s));
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      startTransition(async () => {
        await updateSectionMetaAction(sectionId, { visible: !section.visible });
      });
    }
  }

  function handleSaveSectionData(sectionId: string, data: Record<string, unknown>) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, data } : s));
    startTransition(async () => {
      await updateSectionAction(sectionId, data);
      toast.success('Daten gespeichert');
    });
  }

  function handleSaveSectionMeta(sectionId: string, meta: Record<string, unknown>) {
    startTransition(async () => {
      await updateSectionMetaAction(sectionId, meta);
      toast.success('Einstellungen gespeichert');
    });
  }

  function handleSavePage() {
    startTransition(async () => {
      await updatePageAction(page.id, { title: page.title, slug: page.slug, visible: page.visible });
      toast.success('Seite gespeichert');
    });
  }

  return (
    <div>
      {/* SEO Panel */}
      <PageSeoPanel pageId={page.id} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/pages" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <div className="flex-1">
          <input className="text-2xl font-bold bg-transparent border-none outline-none w-full" value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} />
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">/</span>
            <input className="text-sm text-gray-500 bg-transparent border-none outline-none" value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={page.visible} onChange={() => setPage({ ...page, visible: !page.visible })} />
          Sichtbar
        </label>
        <button onClick={handleSavePage} disabled={pending} className="admin-btn-primary flex items-center gap-2">
          <Save size={16} /> Speichern
        </button>
      </div>

      {/* Section List with DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onDelete={() => handleDeleteSection(section.id)}
              onToggleVisible={() => handleToggleVisible(section.id)}
              onSaveData={(data) => handleSaveSectionData(section.id, data)}
              onSaveMeta={(meta) => handleSaveSectionMeta(section.id, meta)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="admin-card text-center py-12 text-gray-400">
          Noch keine Sektionen. Füge unten eine hinzu.
        </div>
      )}

      {/* Add Section */}
      <div className="mt-4 relative">
        <button onClick={() => setShowAddMenu(!showAddMenu)} className="admin-btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={18} /> Sektion hinzufügen
        </button>
        {showAddMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border rounded-lg shadow-lg max-h-80 overflow-auto z-10">
            {SECTION_TYPES.map((st) => (
              <button key={st.type} onClick={() => handleAddSection(st.type)} className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
                <span className="font-medium text-sm">{st.label}</span>
                <span className="text-xs text-gray-500 ml-2">{st.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

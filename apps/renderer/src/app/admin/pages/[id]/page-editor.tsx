'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, GripVertical, Eye, EyeOff, Settings2, ChevronDown, ChevronUp, Save, ExternalLink, Rocket, MonitorPlay } from 'lucide-react';
import { usePreview } from '@/components/admin/preview-context';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updatePageAction, addSectionAction, deleteSectionAction, updateSectionAction, updateSectionMetaAction, reorderSectionsAction } from '../actions';
import { publishAction } from '../../actions/publish';
import { PageSectionsProvider } from '@/components/button-field';
import { toast } from 'sonner';
import { IndustrySectionDataEditor } from './industry-section-editor';
import { SectionColorEditor } from './section-color-editor';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { PageSeoPanel } from './page-seo-panel';
import type { PageSeoPanelHandle } from './page-seo-panel';
import { getSectionTypesForIndustry, type SectionTypeDefinition } from './section-types';
import { SectionPickerModal } from '../../components/section-picker-modal';

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
  styleOverrides: Record<string, unknown> | null;
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

function SortableSection({ section, industry, sectionTypes, styleVariant, resolvedVars, iframeRef, onDelete, onToggleVisible, onChangeData, onSaveMeta, onSaveColorOverrides }: {
  section: Section;
  industry: string;
  sectionTypes: SectionTypeDefinition[];
  styleVariant: string;
  resolvedVars: Record<string, string>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onDelete: () => void;
  onToggleVisible: () => void;
  onChangeData: (data: Record<string, unknown>) => void;
  onSaveMeta: (meta: Record<string, unknown>) => void;
  onSaveColorOverrides: (overrides: Record<string, unknown> | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  // Stabilize onChange ref to prevent useReport re-fires after parent re-render
  const onChangeRef = useRef(onChangeData);
  onChangeRef.current = onChangeData;
  const stableOnChange = useCallback((data: Record<string, unknown>) => onChangeRef.current(data), []);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : !section.visible ? 0.5 : 1 };
  const typeInfo = sectionTypes.find(t => t.type === section.type);

  return (
    <div ref={setNodeRef} style={style} className={`admin-card mb-3 p-0 ${expanded ? 'ring-2 ring-blue-500/20 border-blue-300' : ''}`}>
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
          <IndustrySectionDataEditor industry={industry} type={section.type} data={section.data} onChange={stableOnChange} />
          <SectionColorEditor value={(section.styleOverrides as Record<string, string>) || null} onChange={onSaveColorOverrides} sectionType={section.type} resolvedVars={resolvedVars} iframeRef={iframeRef} sectionId={section.id} />
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1"><Settings2 size={12} /> Erweiterte Einstellungen</summary>
            <SectionMetaEditor section={section} styleVariant={styleVariant} onSave={onSaveMeta} />
          </details>
        </div>
      )}
    </div>
  );
}

function SectionMetaEditor({ section, styleVariant, onSave }: { section: Section; styleVariant: string; onSave: (meta: Record<string, unknown>) => void }) {
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
      {styleVariant === 'individual' && (
        <label className="block">
          <span className="text-gray-600 text-xs">Stil dieser Sektion</span>
          <select className="admin-input mt-1" value={meta.variant} onChange={(e) => setMeta({ ...meta, variant: e.target.value })}>
            <option value="">Standard (Classic)</option>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="bold">Bold</option>
          </select>
        </label>
      )}
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

// SectionPickerModal is imported from shared component

export function PageEditor({ page: initialPage, sections: initialSections, industry, styleVariant = 'classic', brand = {} }: { page: Page; sections: Section[]; industry: string; styleVariant?: string; brand?: Record<string, string> }) {
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState(initialSections);
  const sectionTypes = getSectionTypesForIndustry(industry);
  const resolvedVars = { ...getStyleCssVars(industry, styleVariant), ...getBrandCssVars(brand) };
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const preview = usePreview();
  const [pending, startTransition] = useTransition();
  const pendingChanges = useRef<Map<string, Record<string, unknown>>>(new Map());
  const [hasDirty, setHasDirty] = useState(false);
  const seoRef = useRef<PageSeoPanelHandle>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Live preview sync
  const sendPreviewData = useCallback(() => {
    if (!preview.isOpen) return;
    const liveSections = sections.map(sec => {
      const newData = pendingChanges.current.get(sec.id);
      return { ...sec, data: newData ?? sec.data };
    });
    preview.sendLiveData({ sections: liveSections, industry, styleVariant });
  }, [sections, preview, industry, styleVariant]);

  useEffect(() => { sendPreviewData(); }, [sendPreviewData]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === 'flamingo-live-preview-ready') sendPreviewData();
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [sendPreviewData]);

  // Sync props from server component on navigation/revalidation
  useEffect(() => { setPage(initialPage); }, [initialPage]);
  useEffect(() => { setSections(initialSections); }, [initialSections]);

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
        await updateSectionMetaAction(sectionId, { visible: !section.visible }, page.id);
      });
    }
  }

  const handleSectionChange = useCallback((sectionId: string, data: Record<string, unknown>) => {
    pendingChanges.current.set(sectionId, data);
    setHasDirty(true);
    setSaved(false);
    if (preview.isOpen) {
      const liveSections = sections.map(sec => {
        const newData = sec.id === sectionId ? data : pendingChanges.current.get(sec.id);
        return { ...sec, data: newData ?? sec.data };
      });
      preview.sendLiveData({ sections: liveSections, industry, styleVariant });
    }
  }, [sections, preview, industry, styleVariant]);

  async function handleSaveAll() {
    setSaving(true);
    try {
      // Save page title/slug/visible
      await updatePageAction(page.id, { title: page.title, slug: page.slug, visible: page.visible });
      // Save all dirty sections
      const entries = Array.from(pendingChanges.current.entries());
      const results = await Promise.all([
        ...entries.map(([sectionId, data]) => updateSectionAction(sectionId, data, page.id)),
        seoRef.current?.save(),
      ]);
      const errors = results.filter(r => r && 'error' in r);
      if (errors.length > 0) {
        toast.error(`${errors.length} Sektion(en) konnten nicht gespeichert werden`);
      } else {
        // Update local sections state with pending data
        setSections(s => s.map(sec => {
          const newData = pendingChanges.current.get(sec.id);
          return newData ? { ...sec, data: newData } : sec;
        }));
        pendingChanges.current.clear();
        setHasDirty(false);
        setSaved(true);
        preview.refresh();
        toast.success('Gespeichert');
      }
    } catch (e) {
      toast.error('Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  }

  function handleSaveSectionMeta(sectionId: string, meta: Record<string, unknown>) {
    startTransition(async () => {
      await updateSectionMetaAction(sectionId, meta, page.id);
      toast.success('Einstellungen gespeichert');
    });
  }

  const colorDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  function handleSaveColorOverrides(sectionId: string, overrides: Record<string, unknown> | null) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, styleOverrides: overrides } : s));
    // Debounce server save + toast per section
    if (colorDebounceRef.current[sectionId]) clearTimeout(colorDebounceRef.current[sectionId]);
    colorDebounceRef.current[sectionId] = setTimeout(() => {
      delete colorDebounceRef.current[sectionId];
      startTransition(async () => {
        await updateSectionMetaAction(sectionId, { styleOverrides: overrides }, page.id);
        toast.success('Farben gespeichert', { id: `color-save-${sectionId}` });
      });
    }, 1500);
  }



  async function handlePublish() {
    setPublishing(true);
    try {
      const result = await publishAction();
      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success('Änderungen veröffentlicht');
        setSaved(false);
      }
    } finally {
      setPublishing(false);
    }
  }

  const previewUrl = `/preview/${page.slug === 'home' ? '' : page.slug}?token=preview`;

  const sectionAnchors = sections.map(s => ({ id: s.id, type: s.type, anchorId: s.anchorId || null }));

  return (
    <PageSectionsProvider sections={sectionAnchors}>
    <div>
      {/* SEO Panel */}
      <PageSeoPanel ref={seoRef} pageId={page.id} onDirty={() => { setHasDirty(true); setSaved(false); }} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/pages" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
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

      {/* Section List with DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              industry={industry}
              sectionTypes={sectionTypes}
              styleVariant={styleVariant}
              resolvedVars={resolvedVars}
              iframeRef={preview.iframeRef}
              onDelete={() => handleDeleteSection(section.id)}
              onToggleVisible={() => handleToggleVisible(section.id)}
              onChangeData={(data) => handleSectionChange(section.id, data)}
              onSaveMeta={(meta) => handleSaveSectionMeta(section.id, meta)}
              onSaveColorOverrides={(overrides) => handleSaveColorOverrides(section.id, overrides)}
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
      <div className="mt-4">
        <button onClick={() => setShowAddMenu(true)} className="admin-btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={18} /> Sektion hinzufügen
        </button>
        {showAddMenu && (
          <SectionPickerModal
            sectionTypes={sectionTypes}
            onSelect={(type) => handleAddSection(type)}
            onClose={() => setShowAddMenu(false)}
            industry={industry}
            styleVariant={styleVariant}
          />
        )}
      </div>

      {/* FAB Bar */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
        <button
          onClick={() => { preview.isOpen ? preview.close() : preview.open('/live-preview'); }}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-full shadow-lg text-sm font-medium transition-colors ${preview.isOpen ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        >
          <MonitorPlay size={16} /> Vorschau
        </button>
        {!saved ? (
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full shadow-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} /> {saving ? 'Speichert…' : 'Speichern'}
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full shadow-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Rocket size={16} /> {publishing ? 'Wird veröffentlicht…' : 'Veröffentlichen'}
          </button>
        )}
      </div>
    </div>
    </PageSectionsProvider>
  );
}

'use client';

import { useState, useTransition, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, GripVertical, Eye, EyeOff, Settings2, ChevronDown, ChevronUp, Save, Rocket, MonitorPlay } from 'lucide-react';
import { usePreview } from '@/components/admin/preview-context';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateItemAction } from '../../actions';
import { publishAction } from '@/app/admin/actions/publish';
import { PageSectionsProvider } from '@/components/button-field';
import { IndustrySectionDataEditor } from '../../../pages/[id]/industry-section-editor';
import { SectionColorEditor } from '../../../pages/[id]/section-color-editor';
import { getSectionTypesForIndustry, type SectionTypeDefinition } from '../../../pages/[id]/section-types';
import { SectionPickerModal } from '../../../components/section-picker-modal';
import { ItemSeoPanel } from './item-seo-panel';
import type { ItemSeoPanelHandle } from './item-seo-panel';
import { toast } from 'sonner';

type Section = {
  id: string;
  type: string;
  variant: string | null;
  visible: boolean;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId: string | null;
  data: Record<string, unknown>;
  styleOverrides?: Record<string, unknown> | null;
};

type Item = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  priority: number;
  data: Record<string, unknown>;
};

function generateId() {
  return crypto.randomUUID();
}

function SortableSection({ section, industry, sectionTypes, onDelete, onToggleVisible, onChangeData, onSaveMeta, onSaveColorOverrides }: {
  section: Section;
  industry: string;
  sectionTypes: SectionTypeDefinition[];
  onDelete: () => void;
  onToggleVisible: () => void;
  onChangeData: (data: Record<string, unknown>) => void;
  onSaveMeta: (meta: Partial<Section>) => void;
  onSaveColorOverrides: (overrides: Record<string, unknown> | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  // Stabilize onChange ref to prevent useReport re-fires after parent re-render
  const onChangeRef = useRef(onChangeData);
  onChangeRef.current = onChangeData;
  const stableOnChange = useCallback((data: Record<string, unknown>) => onChangeRef.current(data), []);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const typeInfo = sectionTypes.find(t => t.type === section.type);

  return (
    <div ref={setNodeRef} style={style} className={`admin-card mb-3 p-0 overflow-hidden ${expanded ? 'ring-2 ring-blue-500/20 border-blue-300' : ''} ${isDragging ? 'opacity-50' : !section.visible ? 'opacity-50' : ''}`}>
      <div className={`flex items-center px-4 py-3 border-b cursor-pointer ${expanded ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`} onClick={() => setExpanded(!expanded)}>
        <button {...attributes} {...listeners} className="cursor-grab mr-3 text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
          <GripVertical size={18} />
        </button>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className={`font-medium text-sm ${expanded ? 'text-blue-700' : ''}`}>{typeInfo?.label ?? section.type}</span>
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
          <IndustrySectionDataEditor industry={industry} type={section.type} data={section.data} onChange={stableOnChange} />
          <SectionColorEditor value={(section.styleOverrides as Record<string, string>) || null} onChange={onSaveColorOverrides} sectionType={section.type} />
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1"><Settings2 size={12} /> Erweiterte Einstellungen</summary>
            <SectionMetaEditor section={section} onSave={onSaveMeta} />
          </details>
        </div>
      )}
    </div>
  );
}

function SectionMetaEditor({ section, onSave }: { section: Section; onSave: (meta: Partial<Section>) => void }) {
  const [meta, setMeta] = useState({
    variant: section.variant || '',
    container: section.container,
    spacingTop: section.spacingTop,
    spacingBottom: section.spacingBottom,
    anchorId: section.anchorId || '',
  });

  return (
    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
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

export function ItemEditor({ item: initial, collectionKey, industry }: { item: Item; collectionKey: string; industry: string }) {
  const [item, setItem] = useState(initial);
  const [sections, setSections] = useState<Section[]>(
    ((initial.data.sections as Section[]) || []).map(s => ({ ...s, id: s.id || generateId(), visible: s.visible !== false }))
  );
  const previewUrl = `/c/${collectionKey}/${item.slug}`;
  const preview = usePreview();
  const sectionTypes = getSectionTypesForIndustry(industry);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hasDirty, setHasDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const pendingChanges = useRef<Map<string, Record<string, unknown>>>(new Map());
  const seoRef = useRef<ItemSeoPanelHandle>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  // Send live preview data to iframe
  const sendPreviewData = useCallback(() => {
    if (!preview.isOpen) return;
    const liveSections = sectionsRef.current.map(sec => {
      const newData = pendingChanges.current.get(sec.id);
      return { ...sec, data: newData ?? sec.data };
    });
    preview.sendLiveData({ sections: liveSections, industry });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview.isOpen, industry]);

  // Re-send on sections array change (add/remove/reorder/toggle)
  useEffect(() => { sendPreviewData(); }, [sections, sendPreviewData]);

  // Listen for iframe ready signal to send initial data
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === 'flamingo-live-preview-ready') sendPreviewData();
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [sendPreviewData]);

  function markDirty() { setHasDirty(true); setSaved(false); }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);
    setSections(arrayMove(sections, oldIndex, newIndex));
    markDirty();
  }

  function handleAddSection(type: string) {
    setShowAddMenu(false);
    const newSection: Section = {
      id: generateId(),
      type,
      variant: null,
      visible: true,
      container: 'default',
      spacingTop: 'm',
      spacingBottom: 'm',
      anchorId: null,
      data: {},
    };
    setSections(prev => [...prev, newSection]);
    markDirty();
    toast.success('Sektion hinzugefügt');
  }

  function handleDeleteSection(sectionId: string) {
    if (!confirm('Sektion wirklich löschen?')) return;
    setSections(prev => prev.filter(s => s.id !== sectionId));
    pendingChanges.current.delete(sectionId);
    markDirty();
    toast.success('Sektion gelöscht');
  }

  function handleToggleVisible(sectionId: string) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s));
    markDirty();
  }

  const handleSectionChange = useCallback((sectionId: string, data: Record<string, unknown>) => {
    pendingChanges.current.set(sectionId, data);
    setHasDirty(true);
    setSaved(false);
    sendPreviewData();
  }, [sendPreviewData]);

  function handleSaveMeta(sectionId: string, meta: Partial<Section>) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...meta } : s));
    markDirty();
    toast.success('Einstellungen übernommen');
  }

  function handleSaveColorOverrides(sectionId: string, overrides: Record<string, unknown> | null) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, styleOverrides: overrides } : s));
    markDirty();
    toast.success('Farben übernommen');
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      const finalSections = sections.map(sec => {
        const newData = pendingChanges.current.get(sec.id);
        return newData ? { ...sec, data: newData } : sec;
      });

      const itemData = { ...item.data, sections: finalSections };
      await updateItemAction(item.id, {
        title: item.title,
        slug: item.slug,
        published: item.published,
        priority: item.priority,
        data: itemData,
      });
      await seoRef.current?.save();

      setSections(finalSections);
      setItem(prev => ({ ...prev, data: itemData }));
      pendingChanges.current.clear();
      setHasDirty(false);
      setSaved(true);
      toast.success('Gespeichert');
    } catch {
      toast.error('Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  }

  const sectionAnchors = sections.map(s => ({ id: s.id, type: s.type, anchorId: s.anchorId || null }));

  return (
    <PageSectionsProvider sections={sectionAnchors}>
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/collections/${collectionKey}`} className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
          <div className="flex-1">
            <input className="text-2xl font-bold bg-transparent border-none outline-none w-full" value={item.title} onChange={(e) => { setItem({ ...item, title: e.target.value }); markDirty(); }} />
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500">/c/{collectionKey}/</span>
              <input className="text-sm text-gray-500 bg-transparent border-none outline-none" value={item.slug} onChange={(e) => { setItem({ ...item, slug: e.target.value }); markDirty(); }} />
            </div>
          </div>
        </div>

        {/* Item meta */}
        <div className="admin-card mb-4 p-4">
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300" checked={item.published} onChange={() => { setItem({ ...item, published: !item.published }); markDirty(); }} />
              <span className={item.published ? 'text-green-700 font-medium' : 'text-zinc-600'}>Veröffentlicht</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <span className="text-zinc-500">Priorität</span>
              <input type="number" className="admin-input w-20 !py-1.5 text-center" value={item.priority} onChange={(e) => { setItem({ ...item, priority: parseInt(e.target.value) || 0 }); markDirty(); }} />
            </label>
          </div>
        </div>

        {/* SEO */}
        <ItemSeoPanel ref={seoRef} itemId={item.id} onDirty={() => { setHasDirty(true); setSaved(false); }} />

        {/* Section List with DnD */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                industry={industry}
                sectionTypes={sectionTypes}
                onDelete={() => handleDeleteSection(section.id)}
                onToggleVisible={() => handleToggleVisible(section.id)}
                onChangeData={(data) => handleSectionChange(section.id, data)}
                onSaveMeta={(meta) => handleSaveMeta(section.id, meta)}
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
          <button onClick={() => setShowAddMenu(!showAddMenu)} className="admin-btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={18} /> Sektion hinzufügen
          </button>
          {showAddMenu && (
            <SectionPickerModal
              sectionTypes={sectionTypes}
              onSelect={handleAddSection}
              onClose={() => setShowAddMenu(false)}
              industry={industry}
            />
          )}
        </div>

        {/* FAB Bar */}
        <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
          <button
            onClick={() => { preview.isOpen ? preview.close() : preview.open('/admin/live-preview'); }}
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
              onClick={async () => { setPublishing(true); try { await publishAction(); toast.success('Veröffentlicht!'); setSaved(false); } catch { toast.error('Fehler'); } finally { setPublishing(false); } }}
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

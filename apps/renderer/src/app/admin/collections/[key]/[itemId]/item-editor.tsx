'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePreview } from '@/components/admin/preview-context';
import { updateItemAction } from '../../actions';
import { getSectionCopySourceAction, getSectionCopySourcesAction } from '@/app/admin/pages/actions';
import { publishAction } from '@/app/admin/actions/publish';
import { PageSectionsProvider } from '@/components/button-field';
import { getSectionTypesForIndustry } from '../../../pages/[id]/section-types';
import { ItemSeoPanel } from './item-seo-panel';
import type { ItemSeoPanelHandle } from './item-seo-panel';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { toast } from 'sonner';
import { createEmptyEditableSection, normalizeEditableSection, type EditableSection } from '@/app/admin/editor/editable-section';
import { collectionItemSectionsToEditableSections, editableSectionsToCollectionItemSections, remapEditableSectionType } from '@/app/admin/editor/section-mappers';
import { EditorActionBar } from '@/app/admin/editor/editor-action-bar';
import { EditorLocaleTabs } from '@/app/admin/editor/editor-locale-tabs';
import { buildLiveSections, mergeLocalizedSectionData } from '@/app/admin/editor/live-preview-data';
import { SectionEditorCard } from '@/app/admin/editor/section-editor-card';
import { SectionStackEditor } from '@/app/admin/editor/section-stack-editor';

type Section = EditableSection;

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

export function ItemEditor({ item: initial, collectionKey, industry, styleVariant = 'classic', brand = {}, hasShop = false, hasBooking = false, i18n }: { item: Item; collectionKey: string; industry: string; styleVariant?: string; brand?: Record<string, string>; hasShop?: boolean; hasBooking?: boolean; i18n?: { enabled: boolean; locales: string[]; defaultLocale: string } }) {
  const [item, setItem] = useState(initial);
  const [sections, setSections] = useState<Section[]>(
    collectionItemSectionsToEditableSections(initial.data.sections, generateId)
  );
  const [activeLocale, setActiveLocale] = useState(i18n?.defaultLocale || 'de');
  const preview = usePreview();
  const sectionTypes = getSectionTypesForIndustry(industry, { hasShop, hasBooking });
  const resolvedVars = { ...getStyleCssVars(industry, styleVariant), ...getBrandCssVars(brand) };
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hasDirty, setHasDirty] = useState(false);
  const [copySources, setCopySources] = useState<{ pageId: string; pageTitle: string; pageSlug: string; sections: { id: string; type: string; titleInternal: string | null }[] }[]>([]);
  const [copySourcesLoading, setCopySourcesLoading] = useState(false);
  const pendingChanges = useRef<Map<string, Record<string, unknown>>>(new Map());
  const seoRef = useRef<ItemSeoPanelHandle>(null);
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  // Send live preview data to iframe
  const sendPreviewData = useCallback(() => {
    if (!preview.isOpen) return;
    const liveSections = buildLiveSections(sectionsRef.current, pendingChanges.current);
    preview.sendLiveData({ sections: liveSections, industry, styleVariant, locale: activeLocale });
  }, [preview.isOpen, preview.sendLiveData, industry, styleVariant, activeLocale]);

  // Re-send on sections array change (add/remove/reorder/toggle)
  useEffect(() => { sendPreviewData(); }, [sections, sendPreviewData]);

  // Listen for iframe ready signal to send initial data
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'flamingo-live-preview-ready') sendPreviewData();
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [sendPreviewData]);

  function markDirty() { setHasDirty(true); setSaved(false); }

  function handleReorder(nextSections: Section[]) {
    setSections(nextSections);
    markDirty();
  }

  function handleAddSection(type: string) {
    const newSection = createEmptyEditableSection(type, generateId(), sections.length);
    setSections(prev => [...prev, newSection]);
    markDirty();
    toast.success('Sektion hinzugefügt');
  }

  async function handleOpenAddMenu() {
    if (copySourcesLoading || copySources.length > 0) return;
    setCopySourcesLoading(true);
    try {
      const sources = await getSectionCopySourcesAction('');
      setCopySources(sources);
    } catch {
      toast.error('Sektion-Vorlagen konnten nicht geladen werden');
    } finally {
      setCopySourcesLoading(false);
    }
  }

  async function handleCopySection(sourceSectionId: string) {
    try {
      const source = await getSectionCopySourceAction(sourceSectionId);
      if (!source) {
        toast.error('Sektion konnte nicht kopiert werden');
        return;
      }

      const nextIndex = sectionsRef.current.length;
      const section = normalizeEditableSection({
        ...source,
        id: generateId(),
        anchorId: null,
        locked: false,
        sortOrder: nextIndex,
      });

      setSections(prev => [...prev, section]);
      markDirty();
      toast.success('Sektion kopiert');
    } catch {
      toast.error('Sektion konnte nicht kopiert werden');
    }
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
    const saveData = mergeLocalizedSectionData({ sectionId, data, sections: sectionsRef.current, pendingChanges: pendingChanges.current, i18n, activeLocale });
    pendingChanges.current.set(sectionId, saveData);
    setHasDirty(true);
    setSaved(false);
    if (preview.isOpen) {
      const liveSections = buildLiveSections(sectionsRef.current, pendingChanges.current, { sectionId, data: saveData });
      preview.sendLiveData({ sections: liveSections, industry, styleVariant, locale: activeLocale });
    }
  }, [preview.isOpen, preview.sendLiveData, industry, styleVariant, i18n, activeLocale]);

  function handleSaveMeta(sectionId: string, meta: Partial<Section>) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...meta } : s));
    markDirty();
    toast.success('Einstellungen übernommen', { id: 'meta-save' });
  }

  function handleChangeSectionType(sectionId: string, nextType: string) {
    const currentSections = sectionsRef.current;
    const currentSection = currentSections.find((section) => section.id === sectionId);
    if (!currentSection || currentSection.type === nextType) return;

    const nextSection = remapEditableSectionType({
      ...currentSection,
      data: pendingChanges.current.get(sectionId) ?? currentSection.data,
    }, nextType);
    const nextSections = currentSections.map((section) => section.id === sectionId ? nextSection : section);

    pendingChanges.current.set(sectionId, nextSection.data);
    setSections(nextSections);
    markDirty();
    if (preview.isOpen) {
      const liveSections = buildLiveSections(nextSections, pendingChanges.current);
      preview.sendLiveData({ sections: liveSections, industry, styleVariant, locale: activeLocale });
    }
    toast.success('Sektionstyp geändert');
  }

  const colorDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  function handleSaveColorOverrides(sectionId: string, overrides: Record<string, unknown> | null) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, styleOverrides: overrides } : s));
    markDirty();
    if (colorDebounceRef.current[sectionId]) clearTimeout(colorDebounceRef.current[sectionId]);
    colorDebounceRef.current[sectionId] = setTimeout(() => {
      delete colorDebounceRef.current[sectionId];
      toast.success('Farben übernommen', { id: `color-save-${sectionId}` });
    }, 1500);
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      const finalSections = sections.map(sec => {
        const newData = pendingChanges.current.get(sec.id);
        return newData ? { ...sec, data: newData } : sec;
      });

      const itemData = { ...item.data, sections: editableSectionsToCollectionItemSections(finalSections) };
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

  async function handlePublish() {
    setPublishing(true);
    try {
      await publishAction();
      toast.success('Veröffentlicht!');
      setSaved(false);
    } catch {
      toast.error('Fehler');
    } finally {
      setPublishing(false);
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
              <input type="number" className="admin-input w-20 !py-1.5 text-center" value={item.priority} onChange={(e) => { setItem({ ...item, priority: parseInt(e.target.value, 10) || 0 }); markDirty(); }} />
            </label>
          </div>
        </div>

        <EditorLocaleTabs i18n={i18n} activeLocale={activeLocale} onChange={setActiveLocale} />

        {/* SEO */}
        <ItemSeoPanel ref={seoRef} itemId={item.id} onDirty={() => { setHasDirty(true); setSaved(false); }} />

        <SectionStackEditor
          sections={sections}
          sectionTypes={sectionTypes}
          industry={industry}
          styleVariant={styleVariant}
          onReorder={handleReorder}
          onAddSection={handleAddSection}
          onOpenAddMenu={handleOpenAddMenu}
          onCopySection={handleCopySection}
          copySources={copySources}
          copySourcesLoading={copySourcesLoading}
          renderSection={(section) => (
              <SectionEditorCard
                key={section.id}
                section={section}
                industry={industry}
                sectionTypes={sectionTypes}
                resolvedVars={resolvedVars}
                iframeRef={preview.iframeRef}
                onDelete={() => handleDeleteSection(section.id)}
                onToggleVisible={() => handleToggleVisible(section.id)}
                onChangeData={(data) => handleSectionChange(section.id, data)}
                onChangeType={(type) => handleChangeSectionType(section.id, type)}
                onSaveMeta={(meta) => handleSaveMeta(section.id, meta)}
                onSaveColorOverrides={(overrides) => handleSaveColorOverrides(section.id, overrides)}
                activeLocale={activeLocale}
                i18n={i18n}
              />
            )}
        />
        <EditorActionBar
          previewOpen={preview.isOpen}
          saved={saved}
          saving={saving}
          publishing={publishing}
          onTogglePreview={() => { preview.isOpen ? preview.close() : preview.open(); }}
          onSave={handleSaveAll}
          onPublish={handlePublish}
        />
      </div>
    </PageSectionsProvider>
  );
}

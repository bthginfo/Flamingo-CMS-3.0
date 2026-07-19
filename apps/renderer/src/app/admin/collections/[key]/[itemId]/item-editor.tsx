'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
import { createSeededEditableSection, normalizeEditableSection, type EditableSection } from '@/app/admin/editor/editable-section';
import { collectionItemSectionsToEditableSections, editableSectionsToCollectionItemSections, remapEditableSectionType } from '@/app/admin/editor/section-mappers';
import { EditorActionBar } from '@/app/admin/editor/editor-action-bar';
import { EditorLocaleTabs } from '@/app/admin/editor/editor-locale-tabs';
import { buildLiveSections, mergeLocalizedSectionData } from '@/app/admin/editor/live-preview-data';
import { SectionEditorCard } from '@/app/admin/editor/section-editor-card';
import { SectionStackEditor } from '@/app/admin/editor/section-stack-editor';
import { EditorWorkspaceShell } from '@/app/admin/editor/editor-workspace-shell';
import { EditorDocumentHeader } from '@/app/admin/editor/editor-document-header';
import { useLivePreviewMessageBridge } from '@/app/admin/editor/use-live-preview-message-bridge';
import { getPublishFailureDescription } from '@/app/admin/publish-feedback';

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

export function ItemEditor({ item: initial, collectionKey, industry, styleVariant = 'classic', brand = {}, hasShop = false, hasBooking = false, i18n, collections, tenantId, previewProducts }: { item: Item; collectionKey: string; industry: string; styleVariant?: string; brand?: Record<string, string>; hasShop?: boolean; hasBooking?: boolean; tenantId?: string; previewProducts?: { id: string; title: string; slug: string; priceCents: number; comparePriceCents?: number | null; images: unknown }[]; i18n?: { enabled: boolean; locales: string[]; defaultLocale: string }; collections?: { key: string; label: string; items: { id: string; title: string; slug: string; data: unknown }[] }[] }) {
  const [item, setItem] = useState(initial);
  const [sections, setSections] = useState<Section[]>(
    collectionItemSectionsToEditableSections(initial.data.sections, generateId)
  );
  const [activeLocale, setActiveLocale] = useState(i18n?.defaultLocale || 'de');
  const preview = usePreview();
  const sectionTypes = getSectionTypesForIndustry(industry, { hasShop, hasBooking });
  const styleCssVars = getStyleCssVars(industry, styleVariant);
  const resolvedVars = { ...styleCssVars, ...getBrandCssVars(brand, styleCssVars) };
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [hasDirty, setHasDirty] = useState(false);
  const [copySources, setCopySources] = useState<{ pageId: string; pageTitle: string; pageSlug: string; sections: { id: string; type: string; titleInternal: string | null }[] }[]>([]);
  const [copySourcesLoading, setCopySourcesLoading] = useState(false);
  const pendingChanges = useRef<Map<string, Record<string, unknown>>>(new Map());
  const seoRef = useRef<ItemSeoPanelHandle>(null);
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const handleSectionChangeRef = useRef<((sectionId: string, data: Record<string, unknown>) => void) | null>(null);
  const handleSaveColorOverridesRef = useRef<((sectionId: string, overrides: Record<string, unknown> | null) => void) | null>(null);

  // Send live preview data to iframe
  const sendPreviewData = useCallback(() => {
    if (!preview.isOpen) return;
    const liveSections = buildLiveSections(sectionsRef.current, pendingChanges.current);
    preview.sendLiveData({ sections: liveSections.map(section => section.type.startsWith('shop') ? { ...section, data: { ...section.data, tenantId, products: previewProducts } } : section), industry, styleVariant, locale: activeLocale, collections });
  }, [preview.isOpen, preview.sendLiveData, industry, styleVariant, activeLocale, collections, tenantId, previewProducts]);

  // Re-send on sections array change (add/remove/reorder/toggle)
  useEffect(() => { sendPreviewData(); }, [sections, sendPreviewData]);

  useLivePreviewMessageBridge({
    sendPreviewData,
    iframeRef: preview.iframeRef,
    sectionsRef,
    pendingChangesRef: pendingChanges,
    sectionChangeRef: handleSectionChangeRef,
    colorChangeRef: handleSaveColorOverridesRef,
    i18n,
    activeLocale,
  });

  function markDirty() { setHasDirty(true); setSaved(false); }

  useEffect(() => {
    if (!hasDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasDirty]);

  function handleReorder(nextSections: Section[]) {
    setSections(nextSections);
    markDirty();
  }

  function handleAddSection(type: string) {
    const newSection = createSeededEditableSection(type, generateId(), sections.length);
    setSections(prev => [...prev, newSection]);
    markDirty();
    toast.success('Sektion hinzugefügt');
    return true;
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

  async function handleCopySection(sourceSectionId: string): Promise<boolean> {
    try {
      const source = await getSectionCopySourceAction(sourceSectionId);
      if (!source) {
        toast.error('Sektion konnte nicht kopiert werden');
        return false;
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
      return true;
    } catch {
      toast.error('Sektion konnte nicht kopiert werden');
      return false;
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
      preview.sendLiveData({ sections: liveSections.map(section => section.type.startsWith('shop') ? { ...section, data: { ...section.data, tenantId, products: previewProducts } } : section), industry, styleVariant, locale: activeLocale, collections });
    }
  }, [preview.isOpen, preview.sendLiveData, industry, styleVariant, i18n, activeLocale, collections, tenantId, previewProducts]);

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
      preview.sendLiveData({ sections: liveSections.map(section => section.type.startsWith('shop') ? { ...section, data: { ...section.data, tenantId, products: previewProducts } } : section), industry, styleVariant, locale: activeLocale, collections });
    }
    toast.success('Sektionstyp geändert');
  }

  const colorDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  function clearColorDebounces() {
    for (const timeout of Object.values(colorDebounceRef.current)) clearTimeout(timeout);
    colorDebounceRef.current = {};
  }

  useEffect(() => () => clearColorDebounces(), []);

  function handleSaveColorOverrides(sectionId: string, overrides: Record<string, unknown> | null) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, styleOverrides: overrides } : s));
    markDirty();
    if (colorDebounceRef.current[sectionId]) clearTimeout(colorDebounceRef.current[sectionId]);
    colorDebounceRef.current[sectionId] = setTimeout(() => {
      delete colorDebounceRef.current[sectionId];
      toast.success('Farben übernommen', { id: `color-save-${sectionId}` });
    }, 1500);
  }

  handleSectionChangeRef.current = handleSectionChange;
  handleSaveColorOverridesRef.current = handleSaveColorOverrides;

  async function persistAll(announce: boolean, publishItem = false): Promise<boolean> {
    setSaving(true);
    try {
      clearColorDebounces();
      const finalSections = sectionsRef.current.map(sec => {
        const newData = pendingChanges.current.get(sec.id);
        return newData ? { ...sec, data: newData } : sec;
      });

      const itemData = { ...item.data, sections: editableSectionsToCollectionItemSections(finalSections) };
      const nextPublished = publishItem ? true : item.published;
      const result = await updateItemAction(item.id, {
        title: item.title,
        slug: item.slug,
        published: nextPublished,
        priority: item.priority,
        data: itemData,
      });
      if (result?.error) {
        toast.error(result.error);
        return false;
      }
      await seoRef.current?.save();

      setSections(finalSections);
      setItem(prev => ({ ...prev, data: itemData, published: nextPublished }));
      pendingChanges.current.clear();
      setHasDirty(false);
      setSaved(true);
      if (announce) toast.success('Gespeichert');
      return true;
    } catch {
      toast.error('Speichern fehlgeschlagen');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAll() {
    await persistAll(true);
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const savedSuccessfully = await persistAll(false, true);
      if (!savedSuccessfully) return;
      const result = await publishAction();
      if (result.error) {
        toast.error(result.error, {
          description: getPublishFailureDescription(result), duration: 9000,
        });
        return;
      }
      toast.success(result.unchanged ? 'Eintrag ist bereits veröffentlicht' : 'Eintrag und Website veröffentlicht');
      setSaved(true);
    } catch {
      toast.error('Veröffentlichen fehlgeschlagen');
    } finally {
      setPublishing(false);
    }
  }

  const sectionAnchors = sections.map(s => ({ id: s.id, type: s.type, anchorId: s.anchorId || null }));

  return (
    <PageSectionsProvider sections={sectionAnchors}>
      <EditorWorkspaceShell>
        <EditorDocumentHeader
          backHref={`/admin/collections/${collectionKey}`}
          kindLabel={collectionKey}
          title={item.title}
          onTitleChange={(title) => { setItem({ ...item, title }); markDirty(); }}
          pathPrefix={`/c/${collectionKey}/`}
          slug={item.slug}
          onSlugChange={(slug) => { setItem({ ...item, slug }); markDirty(); }}
          statusActive={item.published}
          statusActiveLabel="Veröffentlicht"
          statusInactiveLabel="Entwurf"
          onStatusChange={(published) => { setItem({ ...item, published }); markDirty(); }}
          dirty={hasDirty}
          saved={saved}
          saving={saving}
          secondaryControls={(
            <label className="flex max-w-sm items-center justify-between gap-4 text-sm">
              <span>
                <span className="block font-semibold text-zinc-800">Priorität</span>
                <span className="mt-0.5 block text-xs text-zinc-500">Höhere Werte erscheinen weiter oben.</span>
              </span>
              <input
                type="number"
                className="admin-input w-24 !py-2 text-center"
                value={item.priority}
                onChange={(event) => { setItem({ ...item, priority: parseInt(event.target.value, 10) || 0 }); markDirty(); }}
                aria-label="Priorität"
              />
            </label>
          )}
        />

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
          renderSection={(section) => {
            const pending = pendingChanges.current.get(section.id);
            const effectiveSection = pending ? { ...section, data: pending } : section;
            return (
              <SectionEditorCard
                key={section.id}
                section={effectiveSection}
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
            );
          }}
        />
        <EditorActionBar
          previewOpen={preview.isOpen}
          saved={saved}
          dirty={hasDirty}
          saving={saving}
          publishing={publishing}
          onTogglePreview={() => { preview.isOpen ? preview.close() : preview.open(); }}
          onSave={handleSaveAll}
          onPublish={handlePublish}
        />
      </EditorWorkspaceShell>
    </PageSectionsProvider>
  );
}

'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { usePreview } from '@/components/admin/preview-context';
import { updatePageAction, addSectionAction, cloneSectionFromPageAction, deleteSectionAction, getSectionCopySourcesAction, updateSectionAction, updateSectionMetaAction, updateSectionTypeAndDataAction, reorderSectionsAction } from '../actions';
import { publishAction } from '../../actions/publish';
import { PageSectionsProvider } from '@/components/button-field';
import { toast } from 'sonner';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { PageSeoPanel } from './page-seo-panel';
import type { PageSeoPanelHandle } from './page-seo-panel';
import { getSectionTypesForIndustry } from './section-types';
import type { EditableSection } from '@/app/admin/editor/editable-section';
import { remapEditableSectionType } from '@/app/admin/editor/section-mappers';
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

type Page = {
  id: string;
  title: string;
  slug: string;
  status: string;
  visible: boolean;
  type: string;
};

export function PageEditor({ page: initialPage, sections: initialSections, industry, styleVariant = 'classic', brand = {}, hasShop = false, hasBooking = false, i18n, collections, tenantId, previewProducts }: { page: Page; sections: Section[]; industry: string; styleVariant?: string; brand?: Record<string, string>; hasShop?: boolean; hasBooking?: boolean; tenantId?: string; previewProducts?: { id: string; title: string; slug: string; priceCents: number; comparePriceCents?: number | null; images: unknown }[]; i18n?: { enabled: boolean; locales: string[]; defaultLocale: string }; collections?: { key: string; label: string; items: { id: string; title: string; slug: string; data: unknown }[] }[] }) {
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState(initialSections);
  const [activeLocale, setActiveLocale] = useState(i18n?.defaultLocale || 'de');
  const sectionTypes = getSectionTypesForIndustry(industry, { hasShop, hasBooking });
  const styleCssVars = getStyleCssVars(industry, styleVariant);
  const resolvedVars = { ...styleCssVars, ...getBrandCssVars(brand, styleCssVars) };
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [copySources, setCopySources] = useState<{ pageId: string; pageTitle: string; pageSlug: string; sections: { id: string; type: string; titleInternal: string | null }[] }[]>([]);
  const [copySourcesLoading, setCopySourcesLoading] = useState(false);
  const preview = usePreview();
  const [pending, startTransition] = useTransition();
  const pendingChanges = useRef<Map<string, Record<string, unknown>>>(new Map());
  const pendingTypeChanges = useRef<Set<string>>(new Set());
  const [hasDirty, setHasDirty] = useState(false);
  const seoRef = useRef<PageSeoPanelHandle>(null);
  // Live preview sync
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  // Forward ref to handleSectionChange so the postMessage listener (declared
  // before the handler) can invoke the latest closure without TDZ issues.
  const handleSectionChangeRef = useRef<((sectionId: string, data: Record<string, unknown>) => void) | null>(null);
  const handleSaveColorOverridesRef = useRef<((sectionId: string, overrides: Record<string, unknown> | null) => void) | null>(null);

  const sendPreviewData = useCallback(() => {
    if (!preview.isOpen) return;
    const liveSections = buildLiveSections(sectionsRef.current, pendingChanges.current);
    preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, defaultLocale: i18n?.defaultLocale, collections });
  }, [preview.isOpen, preview.sendLiveData, industry, styleVariant, i18n, activeLocale, collections, tenantId, previewProducts]);

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

  // Sync props from server component on navigation/revalidation
  useEffect(() => {
    if (!hasDirty) setPage(initialPage);
  }, [initialPage, hasDirty]);
  useEffect(() => {
    if (!hasDirty) setSections(initialSections);
  }, [initialSections, hasDirty]);

  // ── Data-loss protection ─────────────────────────────────────────────
  // 1) Never let the browser close/navigate away over unsaved changes.
  useEffect(() => {
    if (!hasDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasDirty]);

  // 2) Crash recovery: unsaved section edits are mirrored to localStorage on
  //    every change and offered for restore when the editor reopens.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`flamingo-draft-${initialPage.id}`);
      if (!raw) return;
      const draft = JSON.parse(raw) as { ts: number; entries: [string, Record<string, unknown>][] };
      if (!draft.entries?.length || Date.now() - draft.ts > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(`flamingo-draft-${initialPage.id}`);
        return;
      }
      toast('Ungespeicherter Entwurf gefunden', {
        description: `Änderungen von ${new Date(draft.ts).toLocaleString('de-DE')} wiederherstellen?`,
        duration: 15000,
        action: {
          label: 'Wiederherstellen',
          onClick: () => {
            for (const [id, data] of draft.entries) pendingChanges.current.set(id, data);
            setSections(prev => prev.map(sec => {
              const restored = pendingChanges.current.get(sec.id);
              return restored ? { ...sec, data: restored } : sec;
            }));
            setHasDirty(true);
            setSaved(false);
          },
        },
      });
    } catch { /* corrupt draft — ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleReorder(newOrder: Section[]) {
    setSections(newOrder);
    setHasDirty(true);
    setSaved(false);
    startTransition(async () => {
      await reorderSectionsAction(page.id, newOrder.map(s => s.id));
      toast.success('Reihenfolge gespeichert');
    });
  }

  function handleAddSection(type: string): Promise<boolean> {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const section = await addSectionAction(page.id, type);
          if (section) {
            setSections(prev => {
              const next = [...prev, section as Section];
              // Push to live preview synchronously — don't wait for the
              // useEffect tick, which sometimes misses the first paint when a
              // brand-new section is added back-to-back with field edits.
              if (preview.isOpen) {
                const liveSections = buildLiveSections(next, pendingChanges.current);
                preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, defaultLocale: i18n?.defaultLocale, collections });
              }
              return next;
            });
            setHasDirty(true);
            setSaved(false);
            toast.success('Sektion hinzugefügt');
            resolve(true);
          } else {
            toast.error('Sektion konnte nicht hinzugefügt werden');
            resolve(false);
          }
        } catch {
          toast.error('Sektion konnte nicht hinzugefügt werden');
          resolve(false);
        }
      });
    });
  }

  function handleOpenAddMenu() {
    if (copySources.length > 0 || copySourcesLoading) return;
    setCopySourcesLoading(true);
    startTransition(async () => {
      try {
        const pages = await getSectionCopySourcesAction(page.id);
        setCopySources(pages || []);
      } finally {
        setCopySourcesLoading(false);
      }
    });
  }

  function handleCopySection(sourceSectionId: string): Promise<boolean> {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const section = await cloneSectionFromPageAction(page.id, sourceSectionId);
          if (!section) {
            toast.error('Sektion konnte nicht kopiert werden');
            resolve(false);
            return;
          }
          setSections(prev => [...prev, section as Section]);
          setHasDirty(true);
          setSaved(false);
          toast.success('Sektion kopiert');
          if (preview.isOpen) {
            const liveSections = buildLiveSections([...sectionsRef.current, section as Section], pendingChanges.current);
            preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, defaultLocale: i18n?.defaultLocale, collections });
          }
          resolve(true);
        } catch {
          toast.error('Sektion konnte nicht kopiert werden');
          resolve(false);
        }
      });
    });
  }

  function handleDeleteSection(sectionId: string) {
    if (!confirm('Sektion wirklich löschen?')) return;
    setSections(prev => prev.filter(s => s.id !== sectionId));
    pendingChanges.current.delete(sectionId);
    pendingTypeChanges.current.delete(sectionId);
    setHasDirty(true);
    setSaved(false);
    startTransition(async () => {
      await deleteSectionAction(sectionId, page.id);
      toast.success('Sektion gelöscht');
    });
  }

  function handleToggleVisible(sectionId: string) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s));
    setHasDirty(true);
    setSaved(false);
  }

  const handleSectionChange = useCallback((sectionId: string, data: Record<string, unknown>) => {
    const saveData = mergeLocalizedSectionData({ sectionId, data, sections: sectionsRef.current, pendingChanges: pendingChanges.current, i18n, activeLocale });
    pendingChanges.current.set(sectionId, saveData);
    setHasDirty(true);
    setSaved(false);
    try {
      localStorage.setItem(`flamingo-draft-${page.id}`, JSON.stringify({ ts: Date.now(), entries: Array.from(pendingChanges.current.entries()) }));
    } catch { /* quota/private mode — draft mirror is best-effort */ }
    if (preview.isOpen) {
      const liveSections = buildLiveSections(sectionsRef.current, pendingChanges.current, { sectionId, data: saveData });
      // Always include collections so collection-driven sections (lists,
      // featured products, …) keep rendering when an unrelated field is
      // edited. Earlier this field was omitted and the iframe sometimes
      // reset to an "empty" state until a full refresh.
      preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, defaultLocale: i18n?.defaultLocale, collections });
    }
  }, [preview.isOpen, preview.sendLiveData, industry, styleVariant, i18n, activeLocale, collections]);

  // Keep the ref in sync so the postMessage listener (declared earlier) can
  // call the latest handler.
  handleSectionChangeRef.current = handleSectionChange;
  handleSaveColorOverridesRef.current = handleSaveColorOverrides;

  async function persistAll(announce: boolean): Promise<boolean> {
    if (pending) {
      toast.error('Bitte warte, bis die laufende Änderung abgeschlossen ist.');
      return false;
    }
    setSaving(true);
    try {
      await flushColorSaves();
      // Save page title/slug/visible
      await updatePageAction(page.id, { title: page.title, slug: page.slug, visible: page.visible });
      const currentSections = sectionsRef.current;
      const typeChanges = new Set(pendingTypeChanges.current);
      const entries = new Map(pendingChanges.current);
      const results = await Promise.all([
        ...currentSections.map(section => {
          const data = entries.get(section.id) ?? section.data;
          const meta = {
            visible: section.visible,
            titleInternal: section.titleInternal,
            variant: section.variant,
            container: section.container,
            spacingTop: section.spacingTop,
            spacingBottom: section.spacingBottom,
            anchorId: section.anchorId,
            styleOverrides: section.styleOverrides ?? null,
          };
          if (typeChanges.has(section.id)) {
            return updateSectionTypeAndDataAction(section.id, page.id, {
              type: section.type,
              data,
              ...meta,
            });
          }
          return Promise.all([
            ...(entries.has(section.id) ? [updateSectionAction(section.id, data, page.id)] : []),
            updateSectionMetaAction(section.id, meta, page.id),
          ]).then(sectionResults => sectionResults.find(result => result?.error) || { success: true });
        }),
        reorderSectionsAction(page.id, currentSections.map(section => section.id)),
        seoRef.current?.save(),
      ]);
      const errors = results.filter(result => result && typeof result === 'object' && 'error' in result && result.error);
      if (errors.length > 0) {
        toast.error(`${errors.length} Sektion(en) konnten nicht gespeichert werden`);
        return false;
      }

      setSections(current => current.map(section => {
        const newData = pendingChanges.current.get(section.id);
        return newData ? { ...section, data: newData } : section;
      }));
      pendingChanges.current.clear();
      pendingTypeChanges.current.clear();
      try { localStorage.removeItem(`flamingo-draft-${page.id}`); } catch { /* best-effort */ }
      setHasDirty(false);
      setSaved(true);
      preview.refresh();
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

  function handleSaveSectionMeta(sectionId: string, meta: Partial<Section>) {
    setSections(current => current.map(section => section.id === sectionId ? { ...section, ...meta } : section));
    setHasDirty(true);
    setSaved(false);
    toast.success('Einstellungen übernommen · noch speichern', { id: 'meta-save' });
  }

  function handleChangeSectionType(sectionId: string, nextType: string) {
    const currentSections = sectionsRef.current;
    const currentSection = currentSections.find((section) => section.id === sectionId);
    if (!currentSection || currentSection.type === nextType) return;

    const nextSection = remapEditableSectionType({
      ...currentSection,
      data: pendingChanges.current.get(sectionId) ?? currentSection.data,
    }, nextType);
    const nextSections = currentSections.map(section => section.id === sectionId ? nextSection : section);

    pendingChanges.current.set(sectionId, nextSection.data);
    pendingTypeChanges.current.add(sectionId);
    setSections(nextSections);
    setHasDirty(true);
    setSaved(false);
    if (preview.isOpen) {
      const liveSections = buildLiveSections(nextSections, pendingChanges.current);
      preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, collections });
    }
    toast.success('Sektionstyp geändert · noch speichern');
  }

  const colorDebounceRef = useRef<Record<string, NodeJS.Timeout>>({});
  const colorSavePromisesRef = useRef<Map<string, Promise<unknown>>>(new Map());

  async function flushColorSaves() {
    for (const timeout of Object.values(colorDebounceRef.current)) clearTimeout(timeout);
    colorDebounceRef.current = {};
    await Promise.all(colorSavePromisesRef.current.values());
  }

  useEffect(() => () => {
    for (const timeout of Object.values(colorDebounceRef.current)) clearTimeout(timeout);
  }, []);

  function handleSaveColorOverrides(sectionId: string, overrides: Record<string, unknown> | null) {
    setSections(prev => {
      const next = prev.map(s => s.id === sectionId ? { ...s, styleOverrides: overrides } : s);
      // Push the updated section (with new overrides) to the live preview
      // synchronously so colour changes show up on the next frame instead
      // of after the parent's useEffect tick — which the user reported as
      // "colors only appear after iframe reload".
      if (preview.isOpen) {
        const liveSections = buildLiveSections(next, pendingChanges.current);
        preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, defaultLocale: i18n?.defaultLocale, collections });
      }
      return next;
    });
    setHasDirty(true);
    setSaved(false);
    // Debounce server save + toast per section
    if (colorDebounceRef.current[sectionId]) clearTimeout(colorDebounceRef.current[sectionId]);
    colorDebounceRef.current[sectionId] = setTimeout(() => {
      delete colorDebounceRef.current[sectionId];
      const savePromise = updateSectionMetaAction(sectionId, { styleOverrides: overrides }, page.id);
      colorSavePromisesRef.current.set(sectionId, savePromise);
      void savePromise.then(result => {
        if (result.error) toast.error(result.error, { id: `color-save-${sectionId}` });
        else toast.success('Farben zwischengespeichert', { id: `color-save-${sectionId}` });
      }).catch(() => {
        toast.error('Farben konnten nicht gespeichert werden', { id: `color-save-${sectionId}` });
      }).finally(() => {
        if (colorSavePromisesRef.current.get(sectionId) === savePromise) colorSavePromisesRef.current.delete(sectionId);
      });
    }, 1500);
  }



  async function handlePublish() {
    setPublishing(true);
    try {
      const savedSuccessfully = await persistAll(false);
      if (!savedSuccessfully) return;
      const result = await publishAction();
      if (result.error) {
        toast.error(result.error, {
          description: getPublishFailureDescription(result), duration: 9000,
        });
      } else {
        toast.success(result.unchanged ? 'Website ist bereits aktuell' : 'Änderungen veröffentlicht');
        setSaved(true);
      }
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
        backHref="/admin/pages"
        kindLabel="Seite"
        title={page.title}
        onTitleChange={(title) => { setPage({ ...page, title }); setHasDirty(true); setSaved(false); }}
        pathPrefix="/"
        slug={page.slug}
        onSlugChange={(slug) => { setPage({ ...page, slug }); setHasDirty(true); setSaved(false); }}
        statusActive={page.visible}
        statusActiveLabel="Sichtbar"
        statusInactiveLabel="Nicht sichtbar"
        onStatusChange={(visible) => { setPage({ ...page, visible }); setHasDirty(true); setSaved(false); }}
        dirty={hasDirty}
        saved={saved}
        saving={saving}
      />

      <EditorLocaleTabs i18n={i18n} activeLocale={activeLocale} onChange={setActiveLocale} />

      <PageSeoPanel ref={seoRef} pageId={page.id} onDirty={() => { setHasDirty(true); setSaved(false); }} />

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
          // Show the section's PENDING (unsaved) data in the editor, not just the
          // last-saved `section.data`. With i18n the card is re-keyed per locale,
          // so it remounts on every locale switch; if it read the committed data
          // it would drop edits made to a locale as soon as you tab away and back.
          // pendingChanges holds the full localized structure for every locale.
          const pending = pendingChanges.current.get(section.id);
          const effectiveSection = pending ? { ...section, data: pending } : section;
          return (
          <div data-section-card-id={section.id} className="transition-shadow rounded-lg">
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
            onSaveMeta={(meta) => handleSaveSectionMeta(section.id, meta)}
            onSaveColorOverrides={(overrides) => handleSaveColorOverrides(section.id, overrides)}
            activeLocale={activeLocale}
            i18n={i18n}
          />
          </div>
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
        saveDisabled={pending || publishing}
        publishDisabled={pending}
      />
    </EditorWorkspaceShell>
    </PageSectionsProvider>
  );
}

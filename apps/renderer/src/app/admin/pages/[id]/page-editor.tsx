'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePreview } from '@/components/admin/preview-context';
import { updatePageAction, addSectionAction, deleteSectionAction, updateSectionAction, updateSectionMetaAction, reorderSectionsAction } from '../actions';
import { publishAction } from '../../actions/publish';
import { PageSectionsProvider } from '@/components/button-field';
import { toast } from 'sonner';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { PageSeoPanel } from './page-seo-panel';
import type { PageSeoPanelHandle } from './page-seo-panel';
import { getSectionTypesForIndustry } from './section-types';
import type { EditableSection } from '@/app/admin/editor/editable-section';
import { EditorActionBar } from '@/app/admin/editor/editor-action-bar';
import { EditorLocaleTabs } from '@/app/admin/editor/editor-locale-tabs';
import { buildLiveSections, mergeLocalizedSectionData } from '@/app/admin/editor/live-preview-data';
import { SectionEditorCard } from '@/app/admin/editor/section-editor-card';
import { SectionStackEditor } from '@/app/admin/editor/section-stack-editor';

type Section = EditableSection;

type Page = {
  id: string;
  title: string;
  slug: string;
  status: string;
  visible: boolean;
  type: string;
};

export function PageEditor({ page: initialPage, sections: initialSections, industry, styleVariant = 'classic', brand = {}, hasShop = false, hasBooking = false, i18n, collections }: { page: Page; sections: Section[]; industry: string; styleVariant?: string; brand?: Record<string, string>; hasShop?: boolean; hasBooking?: boolean; i18n?: { enabled: boolean; locales: string[]; defaultLocale: string }; collections?: { key: string; label: string; items: { id: string; title: string; slug: string; data: unknown }[] }[] }) {
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState(initialSections);
  const [activeLocale, setActiveLocale] = useState(i18n?.defaultLocale || 'de');
  const sectionTypes = getSectionTypesForIndustry(industry, { hasShop, hasBooking });
  const resolvedVars = { ...getStyleCssVars(industry, styleVariant), ...getBrandCssVars(brand) };
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const preview = usePreview();
  const [pending, startTransition] = useTransition();
  const pendingChanges = useRef<Map<string, Record<string, unknown>>>(new Map());
  const [hasDirty, setHasDirty] = useState(false);
  const seoRef = useRef<PageSeoPanelHandle>(null);
  // Live preview sync
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  // Forward ref to handleSectionChange so the postMessage listener (declared
  // before the handler) can invoke the latest closure without TDZ issues.
  const handleSectionChangeRef = useRef<((sectionId: string, data: Record<string, unknown>) => void) | null>(null);

  const sendPreviewData = useCallback(() => {
    if (!preview.isOpen) return;
    const liveSections = buildLiveSections(sectionsRef.current, pendingChanges.current);
    preview.sendLiveData({ sections: liveSections, industry, styleVariant, locale: activeLocale, collections });
  }, [preview.isOpen, preview.sendLiveData, industry, styleVariant, activeLocale]);

  useEffect(() => { sendPreviewData(); }, [sections, sendPreviewData]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      // Only trust the same-origin iframe (the live-preview tab).
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'flamingo-live-preview-ready') sendPreviewData();
      // Click-to-focus from live-preview: scroll matching editor card into view
      // and pulse it briefly so the user sees where their click landed.
      if (e.data?.type === 'flamingo-section-clicked') {
        const id = e.data.sectionId;
        if (typeof id !== 'string') return;
        const card = document.querySelector<HTMLElement>(`[data-section-card-id="${CSS.escape(id)}"]`);
        if (!card) return;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ring-2', 'ring-pink-400', 'ring-offset-2');
        setTimeout(() => card.classList.remove('ring-2', 'ring-pink-400', 'ring-offset-2'), 1600);
      }
      // In-place text edits from live-preview: a text element with
      // data-edit-path was blurred. Patch the corresponding field on the
      // section, mark dirty, and push back to preview for instant feedback.
      if (e.data?.type === 'flamingo-field-edit') {
        const { sectionId, path, value } = e.data as { sectionId: string; path: string; value: string };
        if (typeof sectionId !== 'string' || typeof path !== 'string' || typeof value !== 'string') return;
        const current = sectionsRef.current.find(s => s.id === sectionId);
        if (!current) return;
        // Merge with any pending changes already in flight for this section.
        const base = (pendingChanges.current.get(sectionId) ?? current.data ?? {}) as Record<string, unknown>;
        if (base[path] === value) return;
        const next = { ...base, [path]: value };
        handleSectionChangeRef.current?.(sectionId, next);
      }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [sendPreviewData]);

  // Sync props from server component on navigation/revalidation
  useEffect(() => { setPage(initialPage); }, [initialPage]);
  useEffect(() => { setSections(initialSections); }, [initialSections]);

  function handleReorder(newOrder: Section[]) {
    setSections(newOrder);
    startTransition(async () => {
      await reorderSectionsAction(page.id, newOrder.map(s => s.id));
      toast.success('Reihenfolge gespeichert');
    });
  }

  function handleAddSection(type: string) {
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
    const saveData = mergeLocalizedSectionData({ sectionId, data, sections: sectionsRef.current, pendingChanges: pendingChanges.current, i18n, activeLocale });
    pendingChanges.current.set(sectionId, saveData);
    setHasDirty(true);
    setSaved(false);
    if (preview.isOpen) {
      const liveSections = buildLiveSections(sectionsRef.current, pendingChanges.current, { sectionId, data: saveData });
      preview.sendLiveData({ sections: liveSections, industry, styleVariant, locale: activeLocale });
    }
  }, [preview.isOpen, preview.sendLiveData, industry, styleVariant, i18n, activeLocale]);

  // Keep the ref in sync so the postMessage listener (declared earlier) can
  // call the latest handler.
  handleSectionChangeRef.current = handleSectionChange;

  async function handleSaveAll() {
    setSaving(true);
    try {
      // Save page title/slug/visible
      await updatePageAction(page.id, { title: page.title, slug: page.slug, visible: page.visible });
      // Save all dirty sections
      const entries = Array.from(pendingChanges.current.entries());
      const results = await Promise.all([
        ...entries.map(([sectionId, data]) => updateSectionAction(sectionId, data, page.id)),
        ...sections
          .filter(section => section.styleOverrides !== undefined)
          .map(section => updateSectionMetaAction(section.id, { styleOverrides: section.styleOverrides ?? null }, page.id)),
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
      toast.success('Einstellungen gespeichert', { id: 'meta-save' });
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

      <EditorLocaleTabs i18n={i18n} activeLocale={activeLocale} onChange={setActiveLocale} />

      <SectionStackEditor
        sections={sections}
        sectionTypes={sectionTypes}
        industry={industry}
        styleVariant={styleVariant}
        onReorder={handleReorder}
        onAddSection={handleAddSection}
        renderSection={(section) => (
          <div data-section-card-id={section.id} className="transition-shadow rounded-lg">
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
            onSaveMeta={(meta) => handleSaveSectionMeta(section.id, meta)}
            onSaveColorOverrides={(overrides) => handleSaveColorOverrides(section.id, overrides)}
            activeLocale={activeLocale}
            i18n={i18n}
          />
          </div>
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

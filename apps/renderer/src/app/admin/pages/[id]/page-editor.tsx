'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
import { getPublishAdvisoryDescription, getPublishFailureDescription } from '@/app/admin/publish-feedback';

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
  const [saved, setSaved] = useState(false);
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
    preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, collections });
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
      // section (supports nested paths like "items.0.title" for items
      // rendered inside .map()) and push back to preview for instant
      // feedback.
      if (e.data?.type === 'flamingo-field-edit') {
        const { sectionId, path, value } = e.data as { sectionId: string; path: string; value: string };
        if (typeof sectionId !== 'string' || typeof path !== 'string' || typeof value !== 'string') return;
        const current = sectionsRef.current.find(s => s.id === sectionId);
        if (!current) return;
        const base = (pendingChanges.current.get(sectionId) ?? current.data ?? {}) as Record<string, unknown>;
        // Path: dot-separated, numeric segments index into arrays.
        // e.g. "items.0.title" → base.items[0].title = value.
        const segments = path.split('.').filter(Boolean);
        if (segments.length === 0) return;
        // No-op guard: read current value at the same path
        let probe: unknown = base;
        for (const seg of segments) {
          if (probe == null) { probe = undefined; break; }
          probe = (probe as Record<string, unknown>)[seg];
        }
        if (probe === value) return;
        // Immutably set the nested value, cloning every container along
        // the path so React sees a new reference at every level.
        const setNested = (obj: unknown, segs: string[], val: string): Record<string, unknown> | unknown[] => {
          const [head, ...rest] = segs;
          const isIndex = /^\d+$/.test(head);
          if (rest.length === 0) {
            if (Array.isArray(obj)) {
              const copy = [...obj];
              copy[Number(head)] = val;
              return copy;
            }
            return { ...(obj as Record<string, unknown> | null ?? {}), [head]: val };
          }
          if (Array.isArray(obj)) {
            const copy = [...obj];
            const idx = Number(head);
            copy[idx] = setNested(copy[idx], rest, val);
            return copy;
          }
          const container = (obj as Record<string, unknown> | null) ?? {};
          const childExisting = container[head];
          const childContainer = isIndex
            ? (Array.isArray(childExisting) ? childExisting : [])
            : (typeof childExisting === 'object' && childExisting !== null ? childExisting : {});
          return { ...container, [head]: setNested(childContainer, rest, val) };
        };
        const next = setNested(base, segments, value) as Record<string, unknown>;
        handleSectionChangeRef.current?.(sectionId, next);
      }
      // Rich-text edit from live-preview: same shape as field-edit but the
      // value is innerHTML. Reuse the same setNested helper.
      if (e.data?.type === 'flamingo-rich-edit') {
        const { sectionId, path, value } = e.data as { sectionId: string; path: string; value: string };
        if (typeof sectionId !== 'string' || typeof path !== 'string' || typeof value !== 'string') return;
        const current = sectionsRef.current.find(s => s.id === sectionId);
        if (!current) return;
        const base = (pendingChanges.current.get(sectionId) ?? current.data ?? {}) as Record<string, unknown>;
        const segments = path.split('.').filter(Boolean);
        if (segments.length === 0) return;
        let probe: unknown = base;
        for (const seg of segments) {
          if (probe == null) { probe = undefined; break; }
          probe = (probe as Record<string, unknown>)[seg];
        }
        if (probe === value) return;
        const setNested = (obj: unknown, segs: string[], val: string): Record<string, unknown> | unknown[] => {
          const [head, ...rest] = segs;
          const isIndex = /^\d+$/.test(head);
          if (rest.length === 0) {
            if (Array.isArray(obj)) {
              const copy = [...obj];
              copy[Number(head)] = val;
              return copy;
            }
            return { ...(obj as Record<string, unknown> | null ?? {}), [head]: val };
          }
          if (Array.isArray(obj)) {
            const copy = [...obj];
            const idx = Number(head);
            copy[idx] = setNested(copy[idx], rest, val);
            return copy;
          }
          const container = (obj as Record<string, unknown> | null) ?? {};
          const childExisting = container[head];
          const childContainer = isIndex
            ? (Array.isArray(childExisting) ? childExisting : [])
            : (typeof childExisting === 'object' && childExisting !== null ? childExisting : {});
          return { ...container, [head]: setNested(childContainer, rest, val) };
        };
        const next = setNested(base, segments, value) as Record<string, unknown>;
        handleSectionChangeRef.current?.(sectionId, next);
      }
      // Image-edit from live-preview overlay: set a string at the given
      // path (same engine as field-edit).
      if (e.data?.type === 'flamingo-image-edit') {
        const { sectionId, path, url } = e.data as { sectionId: string; path: string; url: string };
        if (typeof sectionId !== 'string' || typeof path !== 'string' || typeof url !== 'string') return;
        const current = sectionsRef.current.find(s => s.id === sectionId);
        if (!current) return;
        const base = (pendingChanges.current.get(sectionId) ?? current.data ?? {}) as Record<string, unknown>;
        const segments = path.split('.').filter(Boolean);
        if (segments.length === 0) return;
        const setNested = (obj: unknown, segs: string[], val: unknown): Record<string, unknown> | unknown[] => {
          const [head, ...rest] = segs;
          const isIndex = /^\d+$/.test(head);
          if (rest.length === 0) {
            if (Array.isArray(obj)) {
              const copy = [...obj];
              copy[Number(head)] = val;
              return copy;
            }
            return { ...(obj as Record<string, unknown> | null ?? {}), [head]: val };
          }
          if (Array.isArray(obj)) {
            const copy = [...obj];
            const idx = Number(head);
            copy[idx] = setNested(copy[idx], rest, val);
            return copy;
          }
          const container = (obj as Record<string, unknown> | null) ?? {};
          const childExisting = container[head];
          const childContainer = isIndex
            ? (Array.isArray(childExisting) ? childExisting : [])
            : (typeof childExisting === 'object' && childExisting !== null ? childExisting : {});
          return { ...container, [head]: setNested(childContainer, rest, val) };
        };
        const next = setNested(base, segments, url) as Record<string, unknown>;
        handleSectionChangeRef.current?.(sectionId, next);
      }
      // Icon-edit from live-preview overlay: writes a Lucide icon name string
      // at the given path. Same set-nested engine as image-edit.
      if (e.data?.type === 'flamingo-icon-edit') {
        const { sectionId, path, value } = e.data as { sectionId: string; path: string; value: string };
        if (typeof sectionId !== 'string' || typeof path !== 'string' || typeof value !== 'string') return;
        const current = sectionsRef.current.find(s => s.id === sectionId);
        if (!current) return;
        const base = (pendingChanges.current.get(sectionId) ?? current.data ?? {}) as Record<string, unknown>;
        const segments = path.split('.').filter(Boolean);
        if (segments.length === 0) return;
        const setNested = (obj: unknown, segs: string[], val: unknown): Record<string, unknown> | unknown[] => {
          const [head, ...rest] = segs;
          const isIndex = /^\d+$/.test(head);
          if (rest.length === 0) {
            if (Array.isArray(obj)) {
              const copy = [...obj];
              copy[Number(head)] = val;
              return copy;
            }
            return { ...(obj as Record<string, unknown> | null ?? {}), [head]: val };
          }
          if (Array.isArray(obj)) {
            const copy = [...obj];
            const idx = Number(head);
            copy[idx] = setNested(copy[idx], rest, val);
            return copy;
          }
          const container = (obj as Record<string, unknown> | null) ?? {};
          const childExisting = container[head];
          const childContainer = isIndex
            ? (Array.isArray(childExisting) ? childExisting : [])
            : (typeof childExisting === 'object' && childExisting !== null ? childExisting : {});
          return { ...container, [head]: setNested(childContainer, rest, val) };
        };
        const next = setNested(base, segments, value) as Record<string, unknown>;
        handleSectionChangeRef.current?.(sectionId, next);
      }
      // Link-edit from live-preview overlay: writes an object {label, href, icon?}.
      if (e.data?.type === 'flamingo-link-edit') {
        const { sectionId, path, value } = e.data as { sectionId: string; path: string; value: Record<string, unknown> };
        if (typeof sectionId !== 'string' || typeof path !== 'string' || !value || typeof value !== 'object') return;
        const current = sectionsRef.current.find(s => s.id === sectionId);
        if (!current) return;
        const base = (pendingChanges.current.get(sectionId) ?? current.data ?? {}) as Record<string, unknown>;
        const segments = path.split('.').filter(Boolean);
        if (segments.length === 0) return;
        const setNested = (obj: unknown, segs: string[], val: unknown): Record<string, unknown> | unknown[] => {
          const [head, ...rest] = segs;
          const isIndex = /^\d+$/.test(head);
          if (rest.length === 0) {
            if (Array.isArray(obj)) {
              const copy = [...obj];
              copy[Number(head)] = val;
              return copy;
            }
            return { ...(obj as Record<string, unknown> | null ?? {}), [head]: val };
          }
          if (Array.isArray(obj)) {
            const copy = [...obj];
            const idx = Number(head);
            copy[idx] = setNested(copy[idx], rest, val);
            return copy;
          }
          const container = (obj as Record<string, unknown> | null) ?? {};
          const childExisting = container[head];
          const childContainer = isIndex
            ? (Array.isArray(childExisting) ? childExisting : [])
            : (typeof childExisting === 'object' && childExisting !== null ? childExisting : {});
          return { ...container, [head]: setNested(childContainer, rest, val) };
        };
        const next = setNested(base, segments, value) as Record<string, unknown>;
        handleSectionChangeRef.current?.(sectionId, next);
      }
      // Color-edit from live-preview overlay: replaces the section's
      // styleOverrides wholesale (the overlay sends the merged object).
      if (e.data?.type === 'flamingo-color-edit') {
        const { sectionId, overrides } = e.data as { sectionId: string; overrides: Record<string, string> };
        if (typeof sectionId !== 'string' || !overrides || typeof overrides !== 'object') return;
        handleSaveColorOverridesRef.current?.(sectionId, overrides);
      }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [sendPreviewData]);

  // Sync props from server component on navigation/revalidation
  useEffect(() => { setPage(initialPage); }, [initialPage]);
  useEffect(() => { setSections(initialSections); }, [initialSections]);

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
                preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, collections });
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
            preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, collections });
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
      preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, collections });
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
        preview.sendLiveData({ sections: liveSections.map(s => s.type.startsWith('shop') ? { ...s, data: { ...s.data, tenantId, products: previewProducts } } : s), industry, styleVariant, locale: activeLocale, collections });
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
        toast.error(result.error, { description: getPublishFailureDescription(result), duration: 9000 });
      } else {
        toast.success(result.unchanged ? 'Website ist bereits aktuell' : 'Änderungen veröffentlicht', {
          description: getPublishAdvisoryDescription(result),
          duration: result.advisoryQueue?.length ? 9000 : undefined,
        });
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
        saving={saving}
        publishing={publishing}
        onTogglePreview={() => { preview.isOpen ? preview.close() : preview.open(); }}
        onSave={handleSaveAll}
        onPublish={handlePublish}
        saveDisabled={pending || publishing}
        publishDisabled={pending}
      />
    </div>
    </PageSectionsProvider>
  );
}

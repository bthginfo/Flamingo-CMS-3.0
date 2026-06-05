'use client';

import { useState, useEffect, useRef } from 'react';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import type { SnapshotSection, SnapshotCollection } from '@/lib/snapshot';

interface InitialData {
  industry?: string;
  styleVariant?: string;
  cssVars?: Record<string, string>;
  navItems?: Array<{ label: string; href: string }>;
  navCta?: { label: string; href: string } | null;
  brand?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  footer?: Record<string, unknown>;
  socialLinks?: Record<string, string>;
  fontsUrl?: string | null;
  sections?: SnapshotSection[];
}

export function LivePreviewClient({ initialData }: { initialData: InitialData }) {
  const [sections, setSections] = useState<SnapshotSection[]>(initialData.sections || []);
  const [industry, setIndustry] = useState(initialData.industry || 'tradesman');
  const [styleVariant, setStyleVariant] = useState(initialData.styleVariant || 'classic');
  const [cssVars, setCssVars] = useState<Record<string, string>>(initialData.cssVars || {});
  const [navItems, setNavItems] = useState(initialData.navItems || []);
  const [navCta, setNavCta] = useState(initialData.navCta || undefined);
  const [brand, setBrand] = useState(initialData.brand || {});
  const [contact, setContact] = useState(initialData.contact || {});
  const [footer, setFooter] = useState(initialData.footer || null);
  const [socialLinks, setSocialLinks] = useState(initialData.socialLinks || {});
  const [collections, setCollections] = useState<SnapshotCollection[]>([]);
  const [fontsUrl, setFontsUrl] = useState(initialData.fontsUrl || null);
  const [locale, setLocale] = useState<string | undefined>(undefined);
  // editMode is owned by the parent admin shell (PreviewPanel toolbar) and
  // pushed in via postMessage. The old in-iframe toggle button is gone.
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      // Only accept messages from the same origin (admin tab embedding this
      // iframe). Postmessage from any other window is ignored — protects
      // against malicious sites that try to inject CMS content via iframe.
      if (e.origin !== window.location.origin) return;
      if (!e.data || e.data.type !== 'flamingo-live-preview') return;
      const p = e.data.payload;
      if (p.sections) setSections(p.sections);
      if (p.industry) setIndustry(p.industry);
      if (p.styleVariant) setStyleVariant(p.styleVariant);
      if (p.cssVars) setCssVars(prev => ({ ...prev, ...p.cssVars }));
      if (p.navItems) setNavItems(p.navItems);
      if (p.navCta !== undefined) setNavCta(p.navCta || undefined);
      if (p.brand) setBrand(p.brand);
      if (p.contact) setContact(p.contact);
      if (p.footer) setFooter(p.footer);
      if (p.socialLinks) setSocialLinks(p.socialLinks);
      if (p.collections) setCollections(p.collections);
      if (p.fontsUrl !== undefined) setFontsUrl(p.fontsUrl);
      if (p.locale !== undefined) setLocale(p.locale);
      if (typeof p.editMode === 'boolean') setEditMode(p.editMode);
    }
    window.addEventListener('message', handleMessage);
    // Signal readiness to the parent. Targeting the parent's origin would be
    // safest, but the iframe is always rendered same-origin so '*' here is
    // acceptable and matches existing admin embedding.
    window.parent?.postMessage({ type: 'flamingo-live-preview-ready' }, window.location.origin);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ── In-place text editing ────────────────────────────────────────────────
  // Templates opt into editable text by adding `data-edit-path="headline"` to
  // their text elements. When edit mode is ON we attach contentEditable and
  // a blur listener that pushes the new value to the parent editor.
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!editMode) return;
    const root = mainRef.current;
    if (!root) return;

    const editables = Array.from(root.querySelectorAll<HTMLElement>('[data-edit-path]'));
    const cleanups: Array<() => void> = [];

    editables.forEach((el) => {
      const leafPath = el.getAttribute('data-edit-path');
      if (!leafPath) return;
      const sectionEl = el.closest<HTMLElement>('[data-section-id]');
      const sectionId = sectionEl?.getAttribute('data-section-id');
      if (!sectionId) return;

      // Build a compound path by walking parents that carry loop markers
      // (data-edit-collection / data-edit-index). For nested loops the
      // outer pair appears first in the resulting path, e.g.
      //   <div data-edit-collection="courses" data-edit-index={2}>
      //     <div data-edit-collection="items" data-edit-index={0}>
      //       <span data-edit-path="title">…</span>
      //     </div>
      //   </div>
      // …yields path "courses.2.items.0.title".
      const segments: string[] = [leafPath];
      let cursor: HTMLElement | null = el.parentElement;
      while (cursor && cursor !== root && cursor !== sectionEl) {
        const collection = cursor.getAttribute('data-edit-collection');
        const indexAttr = cursor.getAttribute('data-edit-index');
        if (collection && indexAttr !== null && /^\d+$/.test(indexAttr)) {
          segments.unshift(collection, indexAttr);
        }
        cursor = cursor.parentElement;
      }
      const path = segments.join('.');

      const original = el.innerText;
      el.setAttribute('contenteditable', 'plaintext-only');
      el.setAttribute('spellcheck', 'false');
      el.setAttribute('data-editable-active', 'true');
      // Inline edit affordance: dashed pink box + text cursor. The class
      // hook is a fallback the parent section CSS uses to re-enable
      // pointer-events on editable spans inside disabled <a>/<button>.
      el.style.outline = '1px dashed rgba(236,72,153,0.55)';
      el.style.outlineOffset = '2px';
      el.style.borderRadius = '3px';
      el.style.cursor = 'text';
      el.style.pointerEvents = 'auto';
      el.style.position = el.style.position || 'relative';

      // Capture-phase intercept on the editable element so the parent
      // <a href> never navigates and the section-wrapper click never
      // bubbles up to the section-select handler.
      const swallow = (e: Event) => { e.stopPropagation(); };
      const prevent = (e: Event) => { e.preventDefault(); e.stopPropagation(); };

      const onFocus = (e: Event) => { e.stopPropagation(); };
      const onClick = (e: Event) => { e.stopPropagation(); };
      const onMouseDown = (e: Event) => { e.stopPropagation(); };
      const onBlur = () => {
        const value = el.innerText.trim();
        if (value === original.trim()) return;
        window.parent?.postMessage(
          { type: 'flamingo-field-edit', sectionId, path, value },
          window.location.origin,
        );
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          el.blur();
        } else if (e.key === 'Escape') {
          el.innerText = original;
          el.blur();
        }
      };

      // Walk ancestor chain up to the section root and intercept clicks
      // on any <a>/<button> so the editable child gets the focus instead
      // of triggering navigation or the section-click handler. Without
      // this users see the pink outline on a button-wrapped text but
      // their click is swallowed by the disabled <a>.
      const ancestorPreventers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = [];
      let p: HTMLElement | null = el.parentElement;
      while (p && p !== root && p !== sectionEl) {
        if (p.tagName === 'A' || p.tagName === 'BUTTON') {
          const fn = (e: Event) => {
            const t = e.target as HTMLElement;
            if (t.closest('[data-editable-active]')) { e.preventDefault(); e.stopPropagation(); }
          };
          p.addEventListener('click', fn, true);
          ancestorPreventers.push({ el: p, fn });
        }
        p = p.parentElement;
      }

      el.addEventListener('focus', onFocus);
      el.addEventListener('click', onClick);
      el.addEventListener('mousedown', onMouseDown);
      el.addEventListener('blur', onBlur);
      el.addEventListener('keydown', onKey);
      // Silence the swallow ref so TS doesn't warn it's unused.
      void swallow; void prevent;

      cleanups.push(() => {
        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
        el.removeAttribute('data-editable-active');
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.style.borderRadius = '';
        el.style.cursor = '';
        el.style.pointerEvents = '';
        el.removeEventListener('focus', onFocus);
        el.removeEventListener('click', onClick);
        el.removeEventListener('mousedown', onMouseDown);
        el.removeEventListener('blur', onBlur);
        el.removeEventListener('keydown', onKey);
        ancestorPreventers.forEach(({ el: anc, fn }) => anc.removeEventListener('click', fn, true));
      });
    });

    return () => { cleanups.forEach(fn => fn()); };
    // Re-run when sections change so newly rendered editable elements get
    // hooked up; depending on `sections` covers field edits + reorders.
  }, [editMode, sections]);

  const visibleSections = sections.filter(s => s.visible !== false);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

  // Build dynamic style overrides that need !important to beat Tailwind utilities
  const importantOverrides: string[] = [];
  const b = brand as Record<string, string | undefined>;
  if (b.headingColor) importantOverrides.push(`[data-style] main h1, [data-style] main h2, [data-style] main h3, [data-style] main h4, [data-style] main h5, [data-style] main h6 { color: ${b.headingColor} !important; }`);
  if (b.bodyTextColor) importantOverrides.push(`[data-style] main p, [data-style] main li { color: ${b.bodyTextColor} !important; }`);
  if (b.mutedTextColor) importantOverrides.push(`[data-style] main .text-gray-500, [data-style] main .text-slate-500, [data-style] main .text-gray-600 { color: ${b.mutedTextColor} !important; }`);
  if (b.linkColor) importantOverrides.push(`[data-style] main a:not([class*="btn-"]):not([class*="bg-brand"]):not([class*="text-brand"]):not([class*="text-white"]) { color: ${b.linkColor} !important; }`);

  return (
    <div data-style={styleVariant} style={cssVars as React.CSSProperties}>
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
      {importantOverrides.length > 0 && <style dangerouslySetInnerHTML={{ __html: importantOverrides.join('\n') }} />}
      {/* Small unobtrusive badge — the actual edit-mode toggle now lives in
          the parent admin shell (PreviewPanel toolbar). */}
      <div
        className={`fixed top-0 left-0 right-0 z-[9999] text-white text-[10px] py-0.5 px-3 font-medium text-center pointer-events-none transition-colors ${editMode ? 'bg-pink-500' : 'bg-green-600'}`}
      >
        {editMode ? 'Bearbeitungsmodus' : 'Live-Vorschau'}
      </div>
      <div className="pt-4">
        {navItems.length > 0 && (
          <SiteHeader navItems={navItems} brand={brand as never} contact={contact as never} darkBg={firstSectionIsHero} cta={navCta} />
        )}
        <main ref={mainRef}>
          {visibleSections.length === 0 && (
            <div className="flex items-center justify-center h-[60vh] text-gray-400 text-sm">
              Bearbeite Sektionen im Editor um die Live-Vorschau zu sehen…
            </div>
          )}
          {visibleSections.map((section) => (
            <div
              key={section.id}
              data-section-id={section.id}
              onClick={(e) => {
                if (!editMode) return;
                // If the click was inside an editable text element, let
                // contentEditable take focus instead of jumping the editor.
                const target = e.target as HTMLElement;
                if (target.closest('[data-edit-path]')) return;
                e.preventDefault();
                e.stopPropagation();
                window.parent?.postMessage(
                  { type: 'flamingo-section-clicked', sectionId: section.id },
                  window.location.origin,
                );
              }}
              className={editMode ? 'relative cursor-pointer outline-2 outline-transparent hover:outline-pink-500 outline-dashed transition-[outline-color] [&_a]:pointer-events-none [&_button]:pointer-events-none [&_[data-edit-path]]:!pointer-events-auto [&_[data-edit-path]]:relative [&_[data-edit-path]]:z-[5]' : 'relative'}
            >
              {editMode && (
                <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500 text-white text-[10px] font-medium px-2 py-0.5 rounded pointer-events-none">
                  {section.type}
                </div>
              )}
              <SectionRenderer section={section} collections={collections} styleVariant={styleVariant} industry={industry} locale={locale} />
            </div>
          ))}
        </main>
        {footer && (
          <SiteFooter footer={footer as never} brand={brand as never} contact={contact as never} socialLinks={socialLinks as never} />
        )}
      </div>
    </div>
  );
}

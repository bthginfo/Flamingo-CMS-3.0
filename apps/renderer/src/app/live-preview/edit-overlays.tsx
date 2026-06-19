'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { icons as lucideIcons, type LucideIcon } from 'lucide-react';
import { FIELD_DEFS, type ColorFieldKey } from '@/lib/section-color-fields';
import { getFieldsForSection } from '@/lib/section-color-resolver';

// ─────────────────────────────────────────────────────────────────────────────
// LIVE-PREVIEW EDIT OVERLAYS
// Renders floating pink action-circle icons on top of editable elements and
// opens mini-modals when they are clicked. Owned by the iframe (same origin
// as the parent admin shell) and dispatches changes back via postMessage so
// the page-editor merges them into pendingChanges + sends them right back as
// live preview data.
//
// Target attributes (templates opt in):
//   data-section-id              → section root (gets a "brush" icon for colors)
//   data-edit-element="card"     → card container (gets a brush scoped to card overrides)
//   data-edit-image="bgImage"    → image element (gets an image-picker icon)
//   data-edit-link="primaryCta"  → button/link element (gets a gear icon)
//   data-edit-rich="content"     → rich-text content (handled in client.tsx)
// ─────────────────────────────────────────────────────────────────────────────

type Target = {
  el: HTMLElement;
  kind: 'section' | 'image' | 'link' | 'icon';
  sectionId: string;
  path: string; // for image/link/icon the data path within the section
};

type SectionMeta = {
  id: string;
  type: string;
  industry?: string;
  styleOverrides: Record<string, string>;
};

type LinkValue = { label?: string; href?: string; icon?: string };

type ActiveModal =
  | { kind: 'color'; sectionId: string }
  | { kind: 'image'; sectionId: string; path: string; current: string }
  | { kind: 'link'; sectionId: string; path: string; current: LinkValue }
  | { kind: 'icon'; sectionId: string; path: string; current: string }
  | null;

const PINK = 'rgb(236, 72, 153)';

// When the user picks one of these primary fields, also write the listed
// extra cssVars. Eliminates the confusing "auf Dunkel" double-fields —
// the user picks ONE "Headline-Farbe" and we set both --token-heading
// (light backgrounds) and --token-on-dark-heading (dark backgrounds) so the
// section always renders the chosen colour regardless of which slot the
// template uses.
const FIELD_FANOUT: Partial<Record<ColorFieldKey, string[]>> = {
  headingColor: ['--token-on-dark-heading'],
  bodyColor:    ['--token-on-dark-body'],
  mutedColor:   ['--token-on-dark-muted'],
};
// Fields that are now redundant because they are auto-written via FIELD_FANOUT.
const HIDDEN_FIELDS = new Set<ColorFieldKey>(['onDarkHeading', 'onDarkBody', 'onDarkMuted']);

export function EditOverlays({
  enabled,
  rootRef,
  sectionsMeta,
  industry,
}: {
  enabled: boolean;
  rootRef: React.RefObject<HTMLElement | null>;
  sectionsMeta: SectionMeta[];
  industry?: string;
}) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [active, setActive] = useState<ActiveModal>(null);
  // bump this to force a re-scan after sections mutate
  const [tick, setTick] = useState(0);

  // Re-scan editable targets whenever edit mode or sections change.
  useEffect(() => {
    if (!enabled || !rootRef.current) {
      setTargets([]);
      return;
    }
    const root = rootRef.current;
    function collect() {
      const next: Target[] = [];
      const seen = new Set<HTMLElement>();
      root.querySelectorAll<HTMLElement>('[data-section-id]').forEach((sec) => {
        const sectionId = sec.getAttribute('data-section-id');
        if (!sectionId || seen.has(sec)) return;
        seen.add(sec);
        next.push({ el: sec, kind: 'section', sectionId, path: '' });
        sec.querySelectorAll<HTMLElement>('[data-edit-image]').forEach((el) => {
          const path = buildPath(el, sec, el.getAttribute('data-edit-image') || '');
          next.push({ el, kind: 'image', sectionId, path });
        });
        sec.querySelectorAll<HTMLElement>('[data-edit-link]').forEach((el) => {
          const path = buildPath(el, sec, el.getAttribute('data-edit-link') || '');
          next.push({ el, kind: 'link', sectionId, path });
        });
        sec.querySelectorAll<HTMLElement>('[data-edit-icon]').forEach((el) => {
          const path = buildPath(el, sec, el.getAttribute('data-edit-icon') || '');
          next.push({ el, kind: 'icon', sectionId, path });
        });
      });
      setTargets(next);
    }
    collect();
    const mo = new MutationObserver(() => collect());
    mo.observe(root, { childList: true, subtree: true });
    const onResize = () => setTick((t) => t + 1);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      mo.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [enabled, rootRef, sectionsMeta.length]);

  if (!enabled) return null;

  return (
    <>
      {targets.map((t, i) => (
        <FloatingIcon
          key={`${t.sectionId}:${t.kind}:${t.path}:${i}:${tick}`}
          target={t}
          onActivate={() => openModal(t, sectionsMeta, setActive)}
        />
      ))}
      {active?.kind === 'color' && (
        <ColorModal
          sectionId={active.sectionId}
          sectionsMeta={sectionsMeta}
          industry={industry}
          onClose={() => setActive(null)}
        />
      )}
      {active?.kind === 'image' && (
        <ImageModal
          sectionId={active.sectionId}
          path={active.path}
          current={active.current}
          onClose={() => setActive(null)}
        />
      )}
      {active?.kind === 'link' && (
        <LinkModal
          sectionId={active.sectionId}
          path={active.path}
          current={active.current}
          onClose={() => setActive(null)}
        />
      )}
      {active?.kind === 'icon' && (
        <IconModal
          sectionId={active.sectionId}
          path={active.path}
          current={active.current}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}

// ── helpers ────────────────────────────────────────────────────────────────

function buildPath(el: HTMLElement, sectionRoot: HTMLElement, leaf: string): string {
  // Walk up to sectionRoot collecting collection/index markers, like
  // client.tsx does for data-edit-path.
  const segments: string[] = [leaf];
  let cursor: HTMLElement | null = el.parentElement;
  while (cursor && cursor !== sectionRoot) {
    const coll = cursor.getAttribute('data-edit-collection');
    const idx = cursor.getAttribute('data-edit-index');
    if (coll && idx !== null && /^\d+$/.test(idx)) {
      segments.unshift(coll, idx);
    }
    cursor = cursor.parentElement;
  }
  return segments.join('.');
}

function getDeep(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const seg of path.split('.').filter(Boolean)) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return cur;
}

function openModal(
  t: Target,
  meta: SectionMeta[],
  setActive: (m: ActiveModal) => void,
) {
  const section = meta.find((s) => s.id === t.sectionId);
  if (t.kind === 'section') {
    setActive({ kind: 'color', sectionId: t.sectionId });
  } else if (t.kind === 'image') {
    const data = (section as unknown as { data?: unknown })?.data ?? {};
    const current = (getDeep(data, t.path) as string) || '';
    setActive({ kind: 'image', sectionId: t.sectionId, path: t.path, current });
  } else if (t.kind === 'link') {
    const data = (section as unknown as { data?: unknown })?.data ?? {};
    const current = (getDeep(data, t.path) as LinkValue) || {};
    setActive({ kind: 'link', sectionId: t.sectionId, path: t.path, current });
  } else if (t.kind === 'icon') {
    const data = (section as unknown as { data?: unknown })?.data ?? {};
    const current = (getDeep(data, t.path) as string) || '';
    setActive({ kind: 'icon', sectionId: t.sectionId, path: t.path, current });
  }
}

// ── floating icon (positioned absolutely, follows target) ──────────────────

function FloatingIcon({ target, onActivate }: { target: Target; onActivate: () => void }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function place() {
      const r = target.el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        setPos(null);
        return;
      }
      // Section icon goes top-right of section. Image/link icons hover
      // top-right of the element. Use page coords so the icon stays
      // anchored when the page scrolls.
      const top = r.top + window.scrollY + 8;
      const left = r.right + window.scrollX - 36;
      setPos({ top, left });
    }
    function schedule() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(place);
    }
    place();
    const ro = new ResizeObserver(schedule);
    ro.observe(target.el);
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target.el]);

  if (!pos) return null;

  const icon = ICONS[target.kind];
  const label =
    target.kind === 'section' ? 'Farben dieser Section ändern'
    : target.kind === 'image' ? 'Bild ändern'
    : target.kind === 'icon' ? 'Icon ändern'
    : 'Link / Button bearbeiten';

  // Touch devices: bigger hit-target (44px iOS minimum, easier to tap).
  // We detect via pointer media query at render time; ssr defaults to small.
  const isTouch = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const size = isTouch ? 40 : 28;
  const offset = isTouch ? 48 : 36;

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onActivate(); }}
      onMouseDown={(e) => { e.stopPropagation(); }}
      onTouchStart={(e) => { e.stopPropagation(); }}
      title={label}
      aria-label={label}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left + (offset - 36),
        zIndex: 9998,
        width: size,
        height: size,
        borderRadius: '9999px',
        background: PINK,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '2px solid #fff',
        boxShadow: '0 4px 10px -2px rgba(0,0,0,0.25), 0 2px 4px -1px rgba(0,0,0,0.15)',
        padding: 0,
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

const ICONS: Record<Target['kind'], string> = {
  // Brush icon
  section: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>',
  // Image icon
  image: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  // Gear icon
  link: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  // Sparkles icon (icon picker)
  icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>',
};

// ── modal shell ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(15,23,42,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))',
        overscrollBehavior: 'contain',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', color: '#0f172a',
          borderRadius: 12, maxWidth: 480, width: '100%',
          maxHeight: '90vh', overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
          fontSize: 14,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{title}</h3>
          <button type="button" onClick={onClose} aria-label="Schließen" style={{ background: 'transparent', border: 0, fontSize: 22, cursor: 'pointer', color: '#64748b', padding: 8, lineHeight: 1, minWidth: 40, minHeight: 40 }}>✕</button>
        </div>
        <div style={{ padding: 18 }}>{children}</div>
      </div>
    </div>
  );
}

// ── color modal ────────────────────────────────────────────────────────────

// Scans the section's outerHTML for literal `var(--token-X)` references and
// returns the set of token cssVars in use. This covers BOTH inline styles
// (style="…var(--token-X)…") AND Tailwind arbitrary-value classes
// (class="bg-[var(--token-X)]") because Tailwind keeps the literal string
// in the class attribute. Re-runs whenever the section DOM mutates so freshly
// added/removed elements are reflected.
function useUsedTokens(sectionId: string): Set<string> {
  const [tokens, setTokens] = useState<Set<string>>(new Set());
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-section-id="${CSS.escape(sectionId)}"]`);
    if (!root) return;
    function scan() {
      if (!root) return;
      const html = root.outerHTML;
      const found = new Set<string>();
      // Match every `var(--token-NAME)` occurrence (NAME = kebab letters/digits).
      const re = /var\(\s*(--token-[\w-]+)\s*(?:,[^)]*)?\)/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(html)) !== null) found.add(m[1]);
      setTokens((prev) => {
        // Cheap shallow comparison so we don't trigger downstream renders.
        if (prev.size === found.size) {
          let same = true;
          for (const v of found) if (!prev.has(v)) { same = false; break; }
          if (same) return prev;
        }
        return found;
      });
    }
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    return () => mo.disconnect();
  }, [sectionId]);
  return tokens;
}

function ColorModal({ sectionId, sectionsMeta, industry, onClose }: { sectionId: string; sectionsMeta: SectionMeta[]; industry?: string; onClose: () => void }) {
  const section = sectionsMeta.find((s) => s.id === sectionId);
  if (!section) return <Modal title="Section nicht gefunden" onClose={onClose}>—</Modal>;

  const [overrides, setOverrides] = useState<Record<string, string>>(section.styleOverrides || {});
  const [showAll, setShowAll] = useState(false);
  const allFields = getFieldsForSection(section.type, industry || section.industry);
  // Hide the dark-pair fields — they are auto-written by FIELD_FANOUT.
  const candidateFields = allFields.filter((f) => !HIDDEN_FIELDS.has(f));

  // ─── Runtime detection: which fields ACTUALLY paint pixels in this DOM? ───
  // Both inline styles (style="background:var(--token-X)") and Tailwind
  // arbitrary-value classes (class="bg-[var(--token-X)]") put the literal
  // string "var(--token-X)" into outerHTML. A simple substring scan tells
  // us which fields are wired up. Fields not detected are hidden behind an
  // "Erweitert" toggle so the user is never shown a no-op picker.
  const usedTokens = useUsedTokens(sectionId);
  const liveFields = candidateFields.filter((f) => {
    const v = FIELD_DEFS[f]?.cssVar;
    if (!v) return false;
    // Always treat the user's existing overrides as live (they typed them).
    if (overrides[v]) return true;
    return usedTokens.has(v);
  });
  const inactiveFields = candidateFields.filter((f) => !liveFields.includes(f));
  const fields = showAll ? candidateFields : liveFields;

  const update = useCallback((key: ColorFieldKey, value: string) => {
    const def = FIELD_DEFS[key];
    if (!def) return;
    const extras = FIELD_FANOUT[key] || [];
    setOverrides((prev) => {
      const next = { ...prev };
      const allVars = [def.cssVar, ...extras];
      for (const v of allVars) {
        if (!value) delete next[v];
        else next[v] = value;
      }
      // Push live to parent so the preview updates immediately.
      window.parent?.postMessage(
        { type: 'flamingo-color-edit', sectionId, overrides: next },
        window.location.origin,
      );
      return next;
    });
  }, [sectionId]);

  const reset = useCallback((key: ColorFieldKey) => update(key, ''), [update]);

  return (
    <Modal title={`Farben — ${section.type}`} onClose={onClose}>
      <p style={{ marginTop: 0, color: '#64748b', fontSize: 12 }}>
        Nur Felder, die diese Section auch tatsächlich rendert. Änderungen werden sofort gespeichert.
      </p>
      <div style={{ display: 'grid', gap: 10 }}>
        {fields.map((fieldKey) => {
          const def = FIELD_DEFS[fieldKey];
          if (!def) return null;
          const isSize = def.type === 'size';
          const current = overrides[def.cssVar] || '';
          return (
            <div key={fieldKey} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ flex: 1, fontSize: 13 }}>
                <div style={{ fontWeight: 500 }}>{def.label}</div>
                <div style={{ color: '#94a3b8', fontSize: 11 }}>{def.description}</div>
              </label>
              {isSize ? (
                <input
                  type="text"
                  value={current}
                  placeholder="z.B. 8px"
                  onChange={(e) => update(fieldKey, e.target.value)}
                  style={{ width: 90, padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              ) : (
                <>
                  <input
                    type="color"
                    value={normalizeColor(current)}
                    onChange={(e) => update(fieldKey, composeWithAlpha(e.target.value, parseAlpha(current) ?? 1))}
                    style={{ width: 36, height: 28, padding: 0, border: '1px solid #cbd5e1', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={current}
                    placeholder="—"
                    onChange={(e) => update(fieldKey, e.target.value)}
                    style={{ width: 90, padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontFamily: 'monospace' }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(((parseAlpha(current) ?? 1)) * 100)}
                    onChange={(e) => {
                      const a = Number(e.target.value) / 100;
                      const base = normalizeColor(current);
                      update(fieldKey, composeWithAlpha(base, a));
                    }}
                    title="Transparenz"
                    style={{ width: 56 }}
                  />
                </>
              )}
              <button type="button" onClick={() => reset(fieldKey)} title="Zurücksetzen" style={{ background: 'transparent', border: 0, color: '#94a3b8', cursor: 'pointer', fontSize: 16, padding: 4 }}>↺</button>
            </div>
          );
        })}
      </div>
      {inactiveFields.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          style={{ marginTop: 14, background: 'transparent', border: 0, color: '#64748b', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}
        >
          {showAll
            ? 'Nur aktive Felder zeigen'
            : `Erweitert: ${inactiveFields.length} ungenutzte Slots anzeigen`}
        </button>
      )}
    </Modal>
  );
}

// Extract alpha from #rrggbbaa or rgba(...). Returns null if no explicit alpha.
function parseAlpha(v: string): number | null {
  if (!v) return null;
  const hex = v.match(/^#([0-9a-fA-F]{8})$/);
  if (hex) return parseInt(hex[1].slice(6, 8), 16) / 255;
  const rgba = v.match(/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)$/);
  if (rgba) return Math.min(1, Math.max(0, Number(rgba[1])));
  return null;
}

// Compose #rrggbb + alpha (0..1) → #rrggbbaa (or plain #rrggbb if alpha===1).
function composeWithAlpha(hex: string, alpha: number): string {
  const m = hex.match(/^#([0-9a-fA-F]{6})$/);
  if (!m) return hex;
  if (alpha >= 0.999) return hex;
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0');
  return `#${m[1]}${a}`;
}

function normalizeColor(v: string): string {
  if (!v) return '#000000';
  // <input type="color"> requires #rrggbb. For rgba/named values fall back
  // to black to keep the picker functional; the text input still shows the
  // real value.
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^#[0-9a-fA-F]{8}$/.test(v)) return v.slice(0, 7);
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const r = v[1], g = v[2], b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return '#000000';
}

// ── image modal ────────────────────────────────────────────────────────────

function ImageModal({ sectionId, path, current, onClose }: { sectionId: string; path: string; current: string; onClose: () => void }) {
  const [url, setUrl] = useState(current);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback((next: string) => {
    window.parent?.postMessage(
      { type: 'flamingo-image-edit', sectionId, path, url: next },
      window.location.origin,
    );
  }, [sectionId, path]);

  const onFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'same-origin' });
      if (!res.ok) throw new Error(`Upload fehlgeschlagen (${res.status})`);
      const json = await res.json();
      const u = (json.url as string) || '';
      if (!u) throw new Error('Antwort enthält keine URL');
      setUrl(u);
      save(u);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload fehlgeschlagen');
    } finally {
      setUploading(false);
    }
  }, [save]);

  return (
    <Modal title="Bild ändern" onClose={onClose}>
      <div style={{ display: 'grid', gap: 12 }}>
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
        )}
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Bild-URL</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… oder /uploads/…"
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Oder neues Bild hochladen</span>
          <input type="file" accept="image/*" onChange={onFile} disabled={uploading} style={{ fontSize: 12 }} />
        </label>
        {error && <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={btnGhost}>Abbrechen</button>
          <button type="button" onClick={() => { save(url); onClose(); }} disabled={uploading} style={btnPrimary}>Speichern</button>
        </div>
      </div>
    </Modal>
  );
}

// ── link modal ─────────────────────────────────────────────────────────────

function LinkModal({ sectionId, path, current, onClose }: { sectionId: string; path: string; current: LinkValue; onClose: () => void }) {
  const [label, setLabel] = useState(current.label || '');
  const [href, setHref] = useState(current.href || '');
  const [icon, setIcon] = useState(current.icon || '');

  const save = useCallback(() => {
    const next: LinkValue = { ...current, label, href };
    if (icon) next.icon = icon; else delete next.icon;
    window.parent?.postMessage(
      { type: 'flamingo-link-edit', sectionId, path, value: next },
      window.location.origin,
    );
    onClose();
  }, [current, label, href, icon, sectionId, path, onClose]);

  return (
    <Modal title="Link / Button bearbeiten" onClose={onClose}>
      <div style={{ display: 'grid', gap: 10 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Beschriftung</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Ziel (URL oder /pfad)</span>
          <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/kontakt oder https://…" style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Icon (Lucide-Name, optional)</span>
          <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="ArrowRight, Phone, Mail, …" style={inputStyle} />
          <span style={{ fontSize: 11, color: '#94a3b8' }}>Liste: lucide.dev/icons</span>
        </label>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
          <button type="button" onClick={onClose} style={btnGhost}>Abbrechen</button>
          <button type="button" onClick={save} style={btnPrimary}>Speichern</button>
        </div>
      </div>
    </Modal>
  );
}

const inputStyle: React.CSSProperties = { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 16, minHeight: 40 };
const btnGhost: React.CSSProperties = { padding: '10px 16px', borderRadius: 6, background: 'transparent', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: 14, minHeight: 40, touchAction: 'manipulation' };
const btnPrimary: React.CSSProperties = { padding: '10px 16px', borderRadius: 6, background: PINK, color: '#fff', border: 0, cursor: 'pointer', fontSize: 14, fontWeight: 500, minHeight: 40, touchAction: 'manipulation' };

// ── icon modal ─────────────────────────────────────────────────────────────

// Curated list of the most useful Lucide icons for content pages. Keeps the
// picker focused; the search box reaches the long tail via free-text entry.
const ICON_LIBRARY: { group: string; names: string[] }[] = [
  { group: 'Allgemein', names: ['Star', 'Heart', 'Check', 'X', 'Plus', 'Minus', 'Sparkles', 'Award', 'Trophy', 'Crown', 'Flame', 'Zap', 'Sun', 'Moon', 'Cloud', 'Quote'] },
  { group: 'Pfeile', names: ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowUpRight', 'ChevronRight', 'ChevronLeft', 'ChevronDown', 'ChevronUp', 'ExternalLink', 'Move', 'CornerDownRight'] },
  { group: 'Kontakt', names: ['Phone', 'Mail', 'MessageSquare', 'MessageCircle', 'MapPin', 'Map', 'Compass', 'Send', 'AtSign', 'Smartphone', 'Headphones'] },
  { group: 'Personen', names: ['User', 'Users', 'UserCheck', 'UserPlus', 'Smile', 'HeartHandshake', 'HandHeart', 'Handshake'] },
  { group: 'Zeit & Datum', names: ['Calendar', 'CalendarDays', 'Clock', 'Timer', 'History', 'AlarmClock'] },
  { group: 'Sicherheit', names: ['Shield', 'ShieldCheck', 'Lock', 'Key', 'Eye', 'EyeOff', 'CircleCheck', 'CircleAlert'] },
  { group: 'Business', names: ['Briefcase', 'Building', 'Building2', 'Home', 'Store', 'ShoppingBag', 'ShoppingCart', 'Package', 'Truck', 'CreditCard', 'Wallet', 'BadgeEuro', 'BadgeDollarSign', 'BarChart', 'TrendingUp', 'Target', 'Rocket'] },
  { group: 'Werkzeug', names: ['Wrench', 'Hammer', 'Settings', 'Cog', 'PenTool', 'Pencil', 'Pen', 'Brush', 'Ruler', 'Lightbulb'] },
  { group: 'Gastronomie', names: ['Coffee', 'GlassWater', 'Wine', 'Utensils', 'UtensilsCrossed', 'Pizza', 'Soup', 'IceCream', 'Cake', 'ChefHat'] },
  { group: 'Reise & Hotel', names: ['Plane', 'Car', 'Bus', 'Train', 'Bike', 'Bed', 'BedDouble', 'Hotel', 'Tent', 'TreePalm', 'Mountain', 'Waves'] },
  { group: 'Medizin', names: ['Stethoscope', 'Pill', 'HeartPulse', 'Activity', 'Cross', 'Syringe', 'Bandage'] },
  { group: 'Tech & Web', names: ['Globe', 'Wifi', 'Bluetooth', 'Database', 'Cloud', 'Server', 'Code', 'Cpu', 'Smartphone', 'Monitor', 'Camera', 'Image', 'Video', 'Music', 'Mic', 'Play', 'Download', 'Upload', 'Link', 'Share2'] },
  { group: 'Wellness', names: ['Leaf', 'Flower2', 'Sprout', 'Sparkle', 'Dumbbell'] },
];

function IconModal({ sectionId, path, current, onClose }: { sectionId: string; path: string; current: string; onClose: () => void }) {
  const [value, setValue] = useState(current);
  const [query, setQuery] = useState('');
  const norm = query.trim().toLowerCase();

  const filtered = norm
    ? ICON_LIBRARY.map((g) => ({ ...g, names: g.names.filter((n) => n.toLowerCase().includes(norm)) })).filter((g) => g.names.length > 0)
    : ICON_LIBRARY;

  const save = useCallback((next: string) => {
    window.parent?.postMessage(
      { type: 'flamingo-icon-edit', sectionId, path, value: next },
      window.location.origin,
    );
  }, [sectionId, path]);

  return (
    <Modal title="Icon auswählen" onClose={onClose}>
      <div style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Icon-Name (Lucide)</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="z.B. ArrowRight"
            style={inputStyle}
          />
          <span style={{ fontSize: 11, color: '#94a3b8' }}>Alle Icons: lucide.dev/icons — Tippen direkt in dieses Feld unterstützt jeden Lucide-Namen.</span>
        </label>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bibliothek durchsuchen…"
          style={inputStyle}
        />
        <div style={{ maxHeight: '50vh', overflow: 'auto', display: 'grid', gap: 16 }}>
          {filtered.length === 0 && (
            <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 16 }}>
              Keine Treffer. Du kannst den Lucide-Namen oben direkt eintippen.
            </div>
          )}
          {filtered.map((g) => (
            <div key={g.group}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{g.group}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: 6 }}>
                {g.names.map((n) => {
                  const active = n === value;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setValue(n)}
                      title={n}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 4, padding: '8px 4px', minHeight: 60, borderRadius: 6,
                        border: active ? '2px solid ' + PINK : '1px solid #e2e8f0',
                        background: active ? 'rgba(236,72,153,0.06)' : '#fff',
                        cursor: 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <LucideGlyph name={n} size={22} />
                      <span style={{ fontSize: 9, color: '#64748b', textAlign: 'center', wordBreak: 'break-word', lineHeight: 1.1 }}>{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, background: '#fff', padding: '8px 0', borderTop: '1px solid #e2e8f0', marginTop: 4 }}>
          <button type="button" onClick={() => { setValue(''); save(''); onClose(); }} style={{ ...btnGhost, color: '#dc2626', borderColor: '#fecaca' }}>Icon entfernen</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={onClose} style={btnGhost}>Abbrechen</button>
            <button type="button" onClick={() => { save(value); onClose(); }} style={btnPrimary}>Speichern</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function LucideGlyph({ name, size = 20 }: { name: string; size?: number }) {
  const Cmp = (lucideIcons as Record<string, LucideIcon>)[name];
  if (!Cmp) return <span style={{ fontSize: 9 }}>{name.slice(0, 3)}</span>;
  return <Cmp size={size} />;
}

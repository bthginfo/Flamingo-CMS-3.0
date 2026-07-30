'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Maximize2, Minus, Move, Plus, RotateCcw, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent, type WheelEvent } from 'react';
import { createPortal } from 'react-dom';
import { plain } from '@/lib/strip-html';

type CanvasItem = { image: string; alt?: string; title?: string; caption?: string; category?: string; href?: string; featured?: boolean };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type CanvasTheme = CSSProperties & Record<`--${string}`, string>;

const TILE_WIDTH = 2400;
const TILE_HEIGHT = 1680;
const CANVAS_THEME_VARS = [
  '--token-section-bg',
  '--token-section-bg-alt',
  '--token-card-bg',
  '--token-card-border',
  '--token-card-heading',
  '--token-card-body',
  '--token-card-muted',
  '--token-heading',
  '--token-body',
  '--token-muted',
  '--token-on-dark-heading',
  '--token-on-dark-body',
  '--token-on-dark-muted',
  '--token-accent',
  '--token-btn-bg',
  '--token-btn-text',
  '--token-shadow',
  '--token-card-radius',
] as const;

function wrap(value: number, span: number) {
  return ((((value + span / 2) % span) + span) % span) - span / 2;
}

function halton(index: number, base: number) {
  let fraction = 1;
  let result = 0;
  let value = index;
  while (value > 0) {
    fraction /= base;
    result += fraction * (value % base);
    value = Math.floor(value / base);
  }
  return result;
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function InfiniteCanvasSection({ data }: Props) {
  const items = Array.isArray(data.items) ? (data.items as CanvasItem[]).filter((item) => item?.image) : [];
  const maxExplorerItems = clampNumber(Number(data.maxExplorerItems || data.maxItems || 18), 8, 22);
  const explorerItems = items.slice(0, maxExplorerItems);
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = plain((data.subline as string) || '');
  const ctaLabel = (data.ctaLabel as string) || 'Galerie erkunden';
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  function openExplorer() {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (sectionRef.current) {
      const computed = window.getComputedStyle(sectionRef.current);
      const inheritedTheme = Object.fromEntries(
        CANVAS_THEME_VARS
          .map((name) => [name, computed.getPropertyValue(name).trim()] as const)
          .filter((entry) => entry[1]),
      ) as CanvasTheme;
      setCanvasTheme(inheritedTheme);
    }
    setOpen(true);
  }

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      openerRef.current?.focus();
    };
  }, [open]);

  if (!items.length) return null;
  const teaserItems = items.slice(0, 5);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 text-[color:var(--token-body)] md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-7 lg:grid-cols-[1fr_auto]">
          <div className="max-w-4xl">
            {badge && <p className="section-badge mb-4 w-fit" data-edit-path="badge">{badge}</p>}
            {headline && <h2 className="text-4xl font-black leading-[0.92] tracking-[-0.055em] text-[color:var(--token-heading)] md:text-6xl lg:text-7xl" data-edit-path="headline">{headline}</h2>}
            {subline && <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--token-muted)] md:text-lg" data-edit-path="subline">{subline}</p>}
          </div>
          <button type="button" onClick={openExplorer} className="inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-[var(--token-btn-bg)] px-5 text-sm font-bold text-[color:var(--token-btn-text)] shadow-lg transition hover:-translate-y-0.5"><Maximize2 size={17} /><span data-edit-path="ctaLabel">{ctaLabel}</span></button>
        </div>

        <button type="button" onClick={openExplorer} className="group relative mt-10 block h-[24rem] w-full overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] text-left shadow-[0_28px_90px_var(--token-shadow)] md:h-[58vh] md:min-h-[28rem]" aria-label={ctaLabel}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--token-card-bg),transparent_70%)] opacity-70" />
          {teaserItems.map((item, index) => {
            const positions = [
              'left-[3%] top-[8%] w-[27%] rotate-[-2deg]', 'left-[34%] top-[4%] w-[29%] rotate-[1deg]', 'right-[3%] top-[12%] w-[26%] rotate-[2deg]',
              'left-[8%] bottom-[5%] w-[24%] rotate-[2deg]', 'left-[38%] bottom-[2%] w-[27%] rotate-[-1deg]', 'right-[6%] bottom-[6%] w-[25%] rotate-[-2deg]',
            ];
            return (
              <motion.figure key={`${item.image}-${index}`} whileHover={{ scale: 1.035, zIndex: 5 }} className={`absolute overflow-hidden rounded-[calc(var(--token-card-radius)*.72)] border border-[color:color-mix(in_srgb,var(--token-card-border)_78%,transparent)] bg-[var(--token-card-bg)] shadow-2xl ${positions[index]}`} data-edit-collection="items" data-edit-index={index}>
                <img src={item.image} alt={item.alt || ''} className="aspect-[4/3] w-full object-cover" loading="lazy" decoding="async" data-edit-image="image" />
                {item.title && <figcaption className="truncate px-3 py-2 text-xs font-bold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{item.title}</figcaption>}
              </motion.figure>
            );
          })}
          <span className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_70%,transparent)] px-4 py-2 text-xs font-bold text-[color:var(--token-on-dark-heading)] backdrop-blur"><Move size={14} /> Öffnen, ziehen und entdecken</span>
        </button>
      </div>
      {mounted && open && createPortal(<CanvasExplorer items={explorerItems} totalItems={items.length} headline={headline} theme={canvasTheme} onClose={() => setOpen(false)} />, document.body)}
    </section>
  );
}

function CanvasExplorer({ items, totalItems, headline, theme, onClose }: { items: CanvasItem[]; totalItems: number; headline: string; theme: CanvasTheme; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.68);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const tileWidth = Math.max(TILE_WIDTH, Math.round(Math.sqrt(items.length) * 520));
  const tileHeight = Math.max(TILE_HEIGHT, Math.round(Math.sqrt(items.length) * 380));
  const nodes = useMemo(() => {
    const output: Array<{ item: CanvasItem; key: string; x: number; y: number; width: number }> = [];
    items.forEach((item, index) => {
      // A low-discrepancy sequence spreads arbitrary upload counts evenly
      // without turning the canvas into a rigid grid or collision-heavy stacks.
      const ringBoost = index % 4 === 0 ? 1.1 : 1;
      const x = (halton(index + 1, 2) - 0.5) * (tileWidth - 420) * ringBoost;
      const y = (halton(index + 1, 3) - 0.5) * (tileHeight - 360) * ringBoost;
      output.push({ item, key: `${index}`, x, y, width: item.featured ? 300 : 190 + ((index * 37) % 58) });
    });
    return output;
  }, [items, tileHeight, tileWidth]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const target = event.target;
    if (target instanceof Element && target.closest('a[href], button')) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    setPan({ x: drag.current.panX + event.clientX - drag.current.x, y: drag.current.panY + event.clientY - drag.current.y });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    drag.current = null;
    setIsDragging(false);
    setPan((current) => ({ x: wrap(current.x, tileWidth * zoom), y: wrap(current.y, tileHeight * zoom) }));
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    setZoom((current) => Math.min(1.45, Math.max(0.58, current - event.deltaY * 0.0008)));
  }

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[160] bg-[var(--token-section-bg,#08090b)] text-[color:var(--token-card-body,var(--token-on-dark-body,#f4f4f4))]"
      style={theme}
      role="dialog"
      aria-modal="true"
      aria-label="Infinite Canvas Explorer"
      onKeyDown={trapFocus}
    >
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_42%,transparent)] px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--token-card-muted,var(--token-on-dark-muted,#b8b8b8))]">Galerie-Explorer</p><h2 className="truncate text-sm font-bold text-[color:var(--token-card-heading,var(--token-on-dark-heading,#fff))] md:text-base">{headline || 'Infinite Canvas'}</h2></div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setZoom((value) => Math.max(0.58, value - 0.12))} className="grid h-10 w-10 place-items-center rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_7%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--token-card-bg)_13%,transparent)]" aria-label="Verkleinern"><Minus size={16} /></button>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.45, value + 0.12))} className="grid h-10 w-10 place-items-center rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_7%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--token-card-bg)_13%,transparent)]" aria-label="Vergrößern"><Plus size={16} /></button>
          <button type="button" onClick={() => { setPan({ x: 0, y: 0 }); setZoom(0.68); }} className="grid h-10 w-10 place-items-center rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_7%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--token-card-bg)_13%,transparent)]" aria-label="Ansicht zurücksetzen"><RotateCcw size={16} /></button>
          <button type="button" onClick={onClose} autoFocus className="ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-4 text-xs font-bold text-[color:var(--token-btn-text)] hover:opacity-90"><X size={15} /> Zurück zur Seite</button>
        </div>
      </header>

      <div className="absolute inset-0 cursor-grab overflow-hidden active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onWheel={handleWheel} style={{ touchAction: 'none' }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.06),transparent_52%)]" />
        <div className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform" style={{ transform: `scale(${zoom})`, transition: reduceMotion || isDragging ? undefined : 'transform 180ms ease-out' }}>
          {nodes.map(({ item, key, x, y, width }) => (
            <figure key={key} className="absolute overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[var(--token-card-bg)] shadow-[0_18px_48px_rgba(0,0,0,.42)]" style={{ left: wrap(x * zoom + pan.x, tileWidth * zoom) / zoom, top: wrap(y * zoom + pan.y, tileHeight * zoom) / zoom, width, transform: 'translate(-50%,-50%)', contain: 'layout paint' }}>
              <img src={item.image} alt={item.alt || ''} className="aspect-[4/3] w-full object-cover" draggable={false} loading="lazy" decoding="async" />
              {(item.title || item.caption) && <figcaption className="p-3"><div className="flex items-start justify-between gap-3"><div><strong className="block text-sm text-[color:var(--token-card-heading,var(--token-on-dark-heading,#fff))]">{item.title}</strong>{item.caption && <span className="mt-1 block text-xs leading-5 text-[color:var(--token-card-muted,var(--token-on-dark-muted,#b8b8b8))]">{plain(item.caption)}</span>}</div>{item.href && <a href={item.href} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()} className="pointer-events-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] transition hover:bg-[var(--token-btn-bg)] hover:text-[color:var(--token-btn-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--token-accent)]" aria-label={`${item.title || 'Eintrag'} öffnen`}><ArrowUpRight size={15} /></a>}</div></figcaption>}
            </figure>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_58%,transparent)] px-4 py-2 text-xs text-[color:var(--token-card-muted,var(--token-on-dark-muted,#b8b8b8))] backdrop-blur">
        <Move className="mr-2 inline" size={13} />Ziehen zum Bewegen · Mausrad zum Zoomen
        {totalItems > items.length ? <span className="ml-2 opacity-70">· {items.length} von {totalItems} Bildern geladen</span> : null}
      </div>
    </div>
  );
}

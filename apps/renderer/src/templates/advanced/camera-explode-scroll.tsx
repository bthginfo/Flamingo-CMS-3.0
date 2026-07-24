'use client';

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Aperture, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { visibleText } from '@/lib/visible-content';
import { AdvancedIntro, AdvancedLink, type AdvancedCta } from './advanced-shared';

type CameraPart = {
  id?: string;
  label?: string;
  text?: string;
  offsetX?: number;
  offsetY?: number;
  color?: string;
};

type Props = { data: Record<string, unknown> };

const FALLBACK_PARTS: CameraPart[] = [
  { id: 'body', label: 'Body', text: 'Kameragehäuse, Griff und Haltung.', offsetX: -150, offsetY: 4, color: '#f5f1e8' },
  { id: 'lens', label: 'Lens', text: 'Fokus, Blickrichtung und optische Tiefe.', offsetX: 6, offsetY: -128, color: '#111111' },
  { id: 'sensor', label: 'Sensor', text: 'Bilddaten, Look und Varianten.', offsetX: 152, offsetY: -6, color: '#d11224' },
  { id: 'light', label: 'Light', text: 'Lichtführung, Schatten und Atmosphäre.', offsetX: -118, offsetY: 132, color: '#ffffff' },
  { id: 'output', label: 'Output', text: 'Finale Assets für Website, Social und Kampagne.', offsetX: 132, offsetY: 132, color: '#c7ff4a' },
];

function partKind(part: CameraPart, index: number) {
  const value = `${part.id || ''} ${part.label || ''}`.toLowerCase();
  if (value.includes('lens') || value.includes('look') || value.includes('fokus')) return 'lens';
  if (value.includes('sensor') || value.includes('ai') || value.includes('chip')) return 'sensor';
  if (value.includes('light') || value.includes('shoot') || value.includes('flash')) return 'light';
  if (value.includes('output') || value.includes('asset') || value.includes('film')) return 'output';
  return index === 0 ? 'body' : 'plate';
}

function layerMotion(part: CameraPart, kind: string, index: number, progress: MotionValue<number>) {
  return {
    x: useTransform(progress, [0, 1], [0, Number(part.offsetX ?? 0) * 1.18]),
    y: useTransform(progress, [0, 1], [0, Number(part.offsetY ?? 0) * 1.06]),
    z: useTransform(progress, [0, 1], [0, kind === 'lens' ? 175 : kind === 'sensor' ? -105 : kind === 'light' ? 90 : kind === 'output' ? 125 : -34]),
    rotateX: useTransform(progress, [0, 1], [0, kind === 'lens' ? -8 : kind === 'light' ? 16 : kind === 'output' ? -12 : 0]),
    rotateY: useTransform(progress, [0, 1], [0, kind === 'body' ? -12 : kind === 'sensor' ? 18 : kind === 'output' ? 22 : (index - 2) * 5]),
    rotateZ: useTransform(progress, [0, 1], [0, kind === 'light' ? -8 : kind === 'output' ? 7 : (index - 2) * 2]),
  };
}

function CameraLayer({ part, index, progress }: { part: CameraPart; index: number; progress: MotionValue<number> }) {
  const reduceMotion = useReducedMotion();
  const kind = partKind(part, index);
  const layer = layerMotion(part, kind, index, progress);
  const color = part.color || '#f5f1e8';
  const baseStyle = {
    x: reduceMotion ? 0 : layer.x,
    y: reduceMotion ? 0 : layer.y,
    z: reduceMotion ? 0 : layer.z,
    rotateX: reduceMotion ? 0 : layer.rotateX,
    rotateY: reduceMotion ? 0 : layer.rotateY,
    rotateZ: reduceMotion ? 0 : layer.rotateZ,
    zIndex: 30 + index,
    transformStyle: 'preserve-3d' as const,
  };

  if (kind === 'lens') {
    return (
      <motion.div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full" style={baseStyle} data-edit-collection="parts" data-edit-index={index}>
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#050505,#454545,#070707,#1b1b1b,#050505)] shadow-[0_38px_96px_rgba(0,0,0,.62)] ring-1 ring-white/15" />
        <div className="absolute inset-7 rounded-full border border-white/10 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,.45),transparent_18%),radial-gradient(circle,#222_0_27%,#050505_28%_58%,#343434_59%_64%,#080808_65%)] shadow-[inset_0_0_44px_rgba(255,255,255,.08)]" />
        <div className="absolute inset-[4.15rem] grid place-items-center rounded-full bg-[radial-gradient(circle_at_40%_35%,#748091_0_10%,#1b2430_11%_45%,#050505_46%)] ring-[14px] ring-black/80">
          <Aperture className="text-white/75" size={30} />
        </div>
        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-white/12 bg-black/50 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-white/78 backdrop-blur" data-edit-path="label">{part.label}</span>
      </motion.div>
    );
  }

  if (kind === 'sensor') {
    return (
      <motion.div className="absolute left-1/2 top-1/2 h-40 w-52 -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] border border-white/15 shadow-[0_34px_86px_rgba(0,0,0,.5)]" style={{ ...baseStyle, background: color }} data-edit-collection="parts" data-edit-index={index}>
        <div className="absolute inset-5 rounded-xl border border-black/30 bg-[linear-gradient(135deg,rgba(255,255,255,.18),transparent_38%),radial-gradient(circle_at_65%_42%,rgba(255,255,255,.22),transparent_28%),rgba(0,0,0,.2)]" />
        <div aria-hidden="true" className="absolute -left-4 top-1/2 h-16 w-4 -translate-y-1/2 rounded-l bg-black/40" />
        <div aria-hidden="true" className="absolute -right-4 top-1/2 h-16 w-4 -translate-y-1/2 rounded-r bg-black/40" />
        <span className="absolute inset-x-0 bottom-4 text-center text-[10px] font-black uppercase tracking-[.22em] text-white/84" data-edit-path="label">{part.label}</span>
      </motion.div>
    );
  }

  if (kind === 'light') {
    return (
      <motion.div className="absolute left-1/2 top-1/2 h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-[1.15rem] border border-black/10 shadow-[0_26px_70px_rgba(0,0,0,.44)]" style={{ ...baseStyle, background: color }} data-edit-collection="parts" data-edit-index={index}>
        <div className="absolute inset-3 rounded-xl bg-[repeating-linear-gradient(90deg,rgba(0,0,0,.16)_0_1px,transparent_1px_9px),linear-gradient(135deg,rgba(255,255,255,.85),rgba(255,255,255,.1))]" />
        <span className="absolute inset-x-0 bottom-4 text-center text-[10px] font-black uppercase tracking-[.22em] text-black/68" data-edit-path="label">{part.label}</span>
      </motion.div>
    );
  }

  if (kind === 'output') {
    return (
      <motion.div className="absolute left-1/2 top-1/2 h-36 w-52 -translate-x-1/2 -translate-y-1/2 rounded-[1.35rem] border border-black/10 shadow-[0_28px_80px_rgba(0,0,0,.48)]" style={{ ...baseStyle, background: color }} data-edit-collection="parts" data-edit-index={index}>
        <div className="absolute inset-3 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,.7),transparent_38%),repeating-linear-gradient(0deg,rgba(0,0,0,.2)_0_1px,transparent_1px_12px)] opacity-70" />
        <span className="absolute inset-x-0 bottom-5 text-center text-[10px] font-black uppercase tracking-[.22em] text-black/72" data-edit-path="label">{part.label}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-56 w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-[2.3rem] border border-white/14 shadow-[0_42px_120px_rgba(0,0,0,.58)]"
      style={{ ...baseStyle, background: `linear-gradient(135deg, color-mix(in srgb, ${color} 88%, white), ${color})` }}
      data-edit-collection="parts"
      data-edit-index={index}
    >
      <div className="absolute -top-11 left-16 h-12 w-24 rounded-t-[1.2rem] border border-white/12 bg-black/80 shadow-xl" />
      <div className="absolute right-8 top-9 h-32 w-20 rounded-2xl bg-black/25 shadow-[inset_14px_0_28px_rgba(0,0,0,.22)]" />
      <div className="absolute left-10 top-8 h-10 w-24 rounded-full bg-black/16" />
      <div className="absolute inset-5 rounded-[1.8rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,.16),transparent_35%)]" />
      <span className="absolute bottom-7 left-9 rounded-full bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[.2em] text-white/82 backdrop-blur" data-edit-path="label">{part.label}</span>
    </motion.div>
  );
}

function PartCopy({ part, index }: { part: CameraPart; index: number }) {
  return (
    <article className="rounded-[var(--token-card-radius)] border border-white/10 bg-white/[.06] p-4 text-white/86 backdrop-blur" data-card data-color-context="dark" data-edit-collection="parts" data-edit-index={index}>
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]">{String(index + 1).padStart(2, '0')}</p>
      <h3 className="mt-2 text-lg font-black text-[color:var(--token-on-dark-heading)]" data-edit-path="label">{part.label}</h3>
      {part.text && <p className="mt-2 text-sm leading-6 text-[color:var(--token-on-dark-body)]" data-edit-path="text">{plain(part.text)}</p>}
    </article>
  );
}

export function CameraExplodeScrollSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const parts = Array.isArray(data.parts) && (data.parts as CameraPart[]).length ? (data.parts as CameraPart[]).filter((part) => part?.label) : FALLBACK_PARTS;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useTransform(scrollYProgress, [0.12, 0.75], [0, 1]);
  const brandImage = safeContentUrl(String(data.brandImage || ''));
  const cta = data.cta as AdvancedCta;
  const ctaHref = safeContentUrl(cta?.href || '');
  const ctaLabel = visibleText(cta?.label || '');
  return (
    <>
      <section className="advanced-static-fallback bg-[var(--token-section-bg)] px-5 py-16 md:hidden">
        <AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} compact />
        {brandImage && <img src={brandImage} alt="" loading="lazy" className="mt-8 aspect-square w-full rounded-[var(--token-card-radius)] object-cover" data-edit-image="brandImage" />}
        <div className="mt-8 space-y-3">{parts.map((part, index) => <PartCopy key={`${part.label}-${index}`} part={part} index={index} />)}</div>
        <AdvancedLink cta={cta} className="mt-8" />
      </section>
      <section ref={ref} className="advanced-motion-experience relative hidden bg-[var(--token-section-bg)] text-white md:block" style={{ height: `${Math.max(260, parts.length * 50)}vh` }}>
        <div className="sticky top-0 grid h-[100svh] overflow-hidden px-8 py-8 lg:grid-cols-[minmax(0,.74fr)_minmax(28rem,1.26fr)] lg:gap-12 lg:px-14">
          <div className="relative z-20 flex min-w-0 flex-col justify-between" data-color-context="dark">
            <AdvancedIntro compact badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
            <div className="grid gap-3 pb-8">{parts.slice(0, 5).map((part, index) => <PartCopy key={`${part.label}-${index}`} part={part} index={index} />)}</div>
          </div>
          <div className="relative grid min-h-0 place-items-center">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,.16),transparent_38%),radial-gradient(circle_at_80%_20%,color-mix(in_srgb,var(--token-accent)_32%,transparent),transparent_30%)]" />
            {brandImage && <img src={brandImage} alt="" loading="lazy" className="absolute right-6 top-6 h-28 w-28 rounded-2xl border border-white/15 object-cover opacity-80 shadow-2xl" data-edit-image="brandImage" />}
            <div className="relative h-[min(74vh,45rem)] w-full max-w-4xl" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
              <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[24rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 blur-3xl" />
              {parts.map((part, index) => <CameraLayer key={`${part.label}-${index}`} part={part} index={index} progress={progress} />)}
            </div>
            {ctaHref && ctaLabel && <a href={ctaHref} className="absolute bottom-8 right-8 z-30 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black" data-edit-link="cta"><span data-edit-path="cta.label">{ctaLabel}</span><ArrowUpRight size={16} /></a>}
          </div>
        </div>
      </section>
    </>
  );
}

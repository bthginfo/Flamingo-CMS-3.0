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
  { id: 'body', label: 'Body', text: 'Struktur, Haltung und Markenlook.', offsetX: -96, offsetY: -16, color: '#f5f1e8' },
  { id: 'lens', label: 'Lens', text: 'Das Motiv wird fokussiert, nicht nur aufgenommen.', offsetX: 0, offsetY: -92, color: '#111111' },
  { id: 'sensor', label: 'Sensor', text: 'KI-Workflow, Look und Retusche werden geplant.', offsetX: 96, offsetY: -12, color: '#d11224' },
  { id: 'light', label: 'Light', text: 'Licht trennt Standardbild von Kampagne.', offsetX: -70, offsetY: 78, color: '#ffffff' },
  { id: 'output', label: 'Output', text: 'Frames für Website, Social, Ads und Sales.', offsetX: 82, offsetY: 76, color: '#c7ff4a' },
];

function PartShape({ part, index, progress }: { part: CameraPart; index: number; progress: MotionValue<number> }) {
  const reduceMotion = useReducedMotion();
  const x = useTransform(progress, [0, 1], [0, Number(part.offsetX ?? 0)]);
  const y = useTransform(progress, [0, 1], [0, Number(part.offsetY ?? 0)]);
  const rotate = useTransform(progress, [0, 1], [0, (index - 2) * 2]);
  const color = part.color || '#f5f1e8';
  const isLens = (part.id || '').toLowerCase().includes('lens');
  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center border border-white/15 shadow-[0_28px_80px_rgba(0,0,0,.48)] ${isLens ? 'h-44 w-44 rounded-full' : 'h-24 w-40 rounded-[1.4rem]'}`}
      style={{ x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y, rotate: reduceMotion ? 0 : rotate, zIndex: 20 + index, background: color }}
      data-edit-collection="parts"
      data-edit-index={index}
    >
      {isLens ? (
        <div className="grid h-28 w-28 place-items-center rounded-full border-[18px] border-black/80 bg-[radial-gradient(circle,rgba(255,255,255,.82)_0_8%,#1a1a1a_9%_38%,#050505_39%)]">
          <Aperture className="text-white/80" size={28} />
        </div>
      ) : (
        <span className="text-[10px] font-black uppercase tracking-[.22em] text-black/70" data-edit-path="label">{part.label}</span>
      )}
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
      <section ref={ref} className="advanced-motion-experience relative hidden bg-[var(--token-section-bg)] text-white md:block" style={{ height: `${Math.max(240, parts.length * 46)}vh` }}>
        <div className="sticky top-0 grid h-[100svh] overflow-hidden px-8 py-8 lg:grid-cols-[minmax(0,.76fr)_minmax(28rem,1.24fr)] lg:gap-12 lg:px-14">
          <div className="relative z-20 flex min-w-0 flex-col justify-between" data-color-context="dark">
            <div>
              <AdvancedIntro compact badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
            </div>
            <div className="grid gap-3 pb-8">{parts.slice(0, 5).map((part, index) => <PartCopy key={`${part.label}-${index}`} part={part} index={index} />)}</div>
          </div>
          <div className="relative grid min-h-0 place-items-center">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,.16),transparent_38%),radial-gradient(circle_at_80%_20%,color-mix(in_srgb,var(--token-accent)_32%,transparent),transparent_30%)]" />
            {brandImage && <img src={brandImage} alt="" loading="lazy" className="absolute right-6 top-6 h-28 w-28 rounded-2xl border border-white/15 object-cover opacity-80 shadow-2xl" data-edit-image="brandImage" />}
            <div className="relative h-[min(70vh,42rem)] w-full max-w-3xl">
              <div className="absolute left-1/2 top-1/2 h-52 w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/10 bg-white/[.08] shadow-[inset_0_1px_0_rgba(255,255,255,.18)]" />
              {parts.map((part, index) => <PartShape key={`${part.label}-${index}`} part={part} index={index} progress={progress} />)}
            </div>
            {ctaHref && ctaLabel && <a href={ctaHref} className="absolute bottom-8 right-8 z-30 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black" data-edit-link="cta"><span data-edit-path="cta.label">{ctaLabel}</span><ArrowUpRight size={16} /></a>}
          </div>
        </div>
      </section>
    </>
  );
}

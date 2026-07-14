'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ScanSearch } from 'lucide-react';
import { useMemo, useState, type CSSProperties, type PointerEvent } from 'react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function XrayRevealSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = plain((data.subline as string) || '');
  const imageBase = (data.imageBase as string) || '';
  const imageReveal = (data.imageReveal as string) || '';
  const labelBase = (data.labelBase as string) || 'Ansicht';
  const labelReveal = (data.labelReveal as string) || 'Dahinter';
  const caption = plain((data.caption as string) || '');
  const revealStyle = (data.revealStyle as string) || 'lens';
  const aspectRatio = (data.aspectRatio as string) || '16/9';
  const reduceMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 52, y: 48 });
  const [slider, setSlider] = useState(50);
  const [engaged, setEngaged] = useState(false);

  const mask = useMemo(() => {
    if (reduceMotion || revealStyle === 'scan') return `linear-gradient(90deg, #000 0 ${slider}%, transparent ${slider + 0.8}%)`;
    const radius = revealStyle === 'soft' ? 190 : 145;
    const feather = revealStyle === 'soft' ? 34 : 14;
    return `radial-gradient(circle ${radius}px at ${position.x}% ${position.y}%, #000 0 ${Math.max(0, radius - feather)}px, transparent ${radius}px)`;
  }, [position, reduceMotion, revealStyle, slider]);

  if (!imageBase || !imageReveal) return null;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = { x: clamp(((event.clientX - rect.left) / rect.width) * 100), y: clamp(((event.clientY - rect.top) / rect.height) * 100) };
    setPosition(next);
    setSlider(Math.round(next.x));
    setEngaged(true);
  }

  const revealMaskStyle = {
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  } as CSSProperties;

  return (
    <section className="overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 text-[color:var(--token-body)] md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.55fr)]">
          <div>
            {badge && <p className="section-badge mb-4 w-fit" data-edit-path="badge">{badge}</p>}
            {headline && <h2 className="max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.055em] text-[color:var(--token-heading)] md:text-6xl lg:text-7xl" data-edit-path="headline">{headline}</h2>}
          </div>
          {subline && <p className="max-w-xl text-base leading-7 text-[color:var(--token-muted)] md:text-lg" data-edit-path="subline">{subline}</p>}
        </div>

        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="mt-10 overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_28px_90px_var(--token-shadow)]" data-card>
          <div className="relative isolate select-none overflow-hidden bg-[var(--token-section-bg-alt)]" style={{ aspectRatio }} onPointerMove={handlePointerMove} onPointerEnter={() => setEngaged(true)} onPointerLeave={() => setEngaged(false)}>
            <img src={imageBase} alt={labelBase} className="absolute inset-0 h-full w-full object-cover" draggable={false} data-edit-image="imageBase" />
            <div className="absolute inset-0" style={revealMaskStyle}>
              <img src={imageReveal} alt={labelReveal} className="h-full w-full object-cover" draggable={false} data-edit-image="imageReveal" />
              <div className="absolute inset-0 bg-[color:var(--token-accent)] opacity-[0.04] mix-blend-color" />
            </div>

            {revealStyle !== 'scan' && !reduceMotion && (
              <motion.div animate={{ opacity: engaged ? 1 : 0.76, scale: engaged ? 1 : 0.94 }} className="pointer-events-none absolute hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/25 text-white shadow-xl backdrop-blur-sm md:flex" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
                <ScanSearch size={23} />
              </motion.div>
            )}

            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/48 px-3 py-1.5 text-xs font-bold text-white backdrop-blur" data-edit-path="labelBase">{labelBase}</span>
            <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/48 px-3 py-1.5 text-xs font-bold text-white backdrop-blur" data-edit-path="labelReveal">{labelReveal}</span>
          </div>

          <div className="grid items-center gap-5 p-5 md:grid-cols-[1fr_minmax(16rem,28rem)] md:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--token-eyebrow)]">Interaktiver Blick hinter die Oberfläche</p>
              {caption && <p className="mt-1 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="caption">{caption}</p>}
            </div>
            <label className="block text-[color:var(--token-label)]">
              <span className="mb-2 flex items-center justify-between text-xs font-semibold"><span>Reveal verschieben</span><span>{slider}%</span></span>
              <input type="range" min="5" max="95" value={slider} onChange={(event) => { const value = Number(event.target.value); setSlider(value); setPosition((current) => ({ ...current, x: value })); }} className="w-full rounded-full border border-[color:var(--token-input-border)] bg-[var(--token-input-bg)] text-[color:var(--token-input-text)] accent-[var(--token-accent)]" aria-label="Position der X-Ray-Enthüllung" />
            </label>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

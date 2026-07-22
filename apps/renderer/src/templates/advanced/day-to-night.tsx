'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { plain } from '@/lib/strip-html';
import { AdvancedIntro, AdvancedLink, EmptyVisual, type AdvancedCta } from './advanced-shared';

type Scene = { time?: string; label?: string; title?: string; text?: string; image?: string; tint?: string };
type Props = { data: Record<string, unknown> };

function safeTint(value?: string) {
  const tint = (value || '').trim();
  return /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/i.test(tint) ? tint : 'var(--token-accent)';
}

export function DayToNightSection({ data }: Props) {
  const scenes = Array.isArray(data.scenes) ? (data.scenes as Scene[]).filter((scene) => scene?.title) : [];
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  if (scenes.length < 2) return null;

  const scene = scenes[active] || scenes[0];
  const percentage = scenes.length > 1 ? (active / (scenes.length - 1)) * 100 : 0;
  const tint = safeTint(scene.tint);

  return (
    <section className="overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
        <div className="mt-12 overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_32px_100px_var(--token-shadow)]" data-card style={{ '--scene-tint': tint } as CSSProperties}>
          <div className="relative isolate aspect-[4/5] overflow-hidden bg-[var(--token-section-bg-alt)] md:aspect-[16/8]">
            <AnimatePresence initial={false}>
              <motion.div
                key={`${scene.image}-${active}`}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : .62 }}
                className="absolute inset-0"
                data-edit-collection="scenes"
                data-edit-index={active}
              >
                {scene.image ? <img src={scene.image} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="image" /> : <EmptyVisual label={scene.label || 'Szene'} />}
              </motion.div>
            </AnimatePresence>
            <motion.div className="absolute inset-0 bg-[color:var(--scene-tint)] mix-blend-multiply" animate={{ opacity: .16 + active * .055 }} />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--token-image-overlay)_0%,color-mix(in_srgb,var(--token-image-overlay)_78%,transparent)_58%,transparent_100%)]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: reduceMotion ? 0 : .34 }}
                data-color-context="dark"
                className="absolute inset-x-4 bottom-4 max-w-2xl rounded-2xl border border-[var(--token-divider)] bg-[var(--token-image-overlay)] p-4 text-[color:var(--token-on-dark-heading)] shadow-[0_18px_60px_var(--token-shadow)] backdrop-blur-sm md:inset-x-8 md:bottom-8 md:p-6"
                data-edit-collection="scenes"
                data-edit-index={active}
              >
                <p className="text-xs font-bold uppercase tracking-[.22em] text-[color:var(--token-on-dark-muted)]">
                  <span data-edit-path="time">{scene.time}</span> · <span data-edit-path="label">{scene.label}</span>
                </p>
                <h3 className="mt-3 hyphens-auto [overflow-wrap:anywhere] text-3xl font-black leading-[.98] tracking-[-.045em] text-[color:var(--token-on-dark-heading)] md:text-5xl" data-edit-path="title">{scene.title}</h3>
                {scene.text && <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--token-on-dark-body)] md:text-base" data-edit-path="text">{plain(scene.text)}</p>}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="p-5 md:p-8">
            <div className="flex items-center gap-3 text-[color:var(--token-card-muted,var(--token-muted))]">
              <Sun size={17} />
              <div className="relative h-1 flex-1 bg-[var(--token-divider)]"><motion.div className="absolute inset-y-0 left-0 bg-[var(--token-accent)]" animate={{ width: `${percentage}%` }} /></div>
              <Moon size={17} />
            </div>
            <div className="mt-5 grid gap-2" role="group" aria-label="Tageszeit auswählen" style={{ gridTemplateColumns: `repeat(${scenes.length},minmax(0,1fr))` }}>
              {scenes.map((item, index) => (
                <button key={`${item.time}-${index}`} type="button" onClick={() => setActive(index)} className={`min-h-14 border-t-2 px-1 pt-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-accent)] ${index === active ? 'border-[var(--token-accent)]' : 'border-[var(--token-divider)] opacity-60 hover:opacity-100'}`} aria-label={`${item.time || ''} · ${item.label || item.title || `Szene ${index + 1}`}`} aria-pressed={index === active} aria-current={index === active ? 'true' : undefined} data-edit-collection="scenes" data-edit-index={index}>
                  <span className="block text-xs font-black text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="time">{item.time}</span>
                  <span className="mt-1 hidden text-[11px] text-[color:var(--token-card-muted,var(--token-muted))] sm:block" data-edit-path="label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <AdvancedLink cta={data.cta as AdvancedCta} className="mt-8" />
      </div>
    </section>
  );
}

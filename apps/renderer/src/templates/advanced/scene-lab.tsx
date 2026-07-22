'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Layers3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { plain } from '@/lib/strip-html';

type Choice = { id?: string; label: string; image?: string; swatch?: string; description?: string; priceLabel?: string };
type Group = { id?: string; label: string; description?: string; choices: Choice[] };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function choiceKey(choice: Choice, index: number) {
  return choice.id || `${choice.label}-${index}`;
}

export function SceneLabSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = plain((data.subline as string) || '');
  const baseImage = (data.baseImage as string) || '';
  const aspectRatio = (data.aspectRatio as string) || '4/3';
  const groups = Array.isArray(data.groups)
    ? (data.groups as Group[]).filter((group) => group?.label && Array.isArray(group.choices) && group.choices.length)
    : [];
  const cta = (data.cta as { label?: string; href?: string }) || {};
  const reduceMotion = useReducedMotion();
  const defaults = (data.defaultSelections as Record<string, string>) || {};
  const [activeGroup, setActiveGroup] = useState(0);
  const [selections, setSelections] = useState<Record<string, number>>(() => Object.fromEntries(groups.map((group, index) => {
    const groupId = group.id || `group-${index}`;
    const configured = defaults[groupId];
    const found = configured ? group.choices.findIndex((choice, choiceIndex) => choiceKey(choice, choiceIndex) === configured) : -1;
    return [groupId, found >= 0 ? found : 0];
  })));

  const selectedEntries = useMemo(() => groups.map((group, index) => {
    const groupId = group.id || `group-${index}`;
    const choiceIndex = selections[groupId] ?? 0;
    const choice = group.choices[choiceIndex];
    return choice ? { group, groupIndex: index, choice, choiceIndex } : null;
  }).filter(Boolean) as Array<{ group: Group; groupIndex: number; choice: Choice; choiceIndex: number }>, [groups, selections]);
  const selectedChoices = selectedEntries.map((entry) => entry.choice);

  if (!baseImage || !groups.length) return null;
  const currentGroup = groups[Math.min(activeGroup, groups.length - 1)];
  const currentGroupId = currentGroup.id || `group-${activeGroup}`;

  return (
    <section className="bg-[var(--token-section-bg)] px-5 py-16 text-[color:var(--token-body)] md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {badge && <p className="section-badge mx-auto mb-4 w-fit" data-edit-path="badge">{badge}</p>}
          {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="section-subline" data-edit-path="subline">{subline}</p>}
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_26px_80px_var(--token-shadow)] lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)]" data-card>
          <div className="relative isolate overflow-hidden bg-[var(--token-section-bg-alt)]" style={{ aspectRatio }}>
            <img src={baseImage} alt="Konfigurierbare Ausgangsszene" className="absolute inset-0 h-full w-full object-cover" data-edit-image="baseImage" />
            <AnimatePresence initial={false}>
              {selectedEntries.map(({ groupIndex, choice, choiceIndex }) => choice?.image && (
                <motion.img key={`${groupIndex}-${choiceIndex}-${choice.image}`} src={choice.image} alt="" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.32 }} className="pointer-events-none absolute inset-0 h-full w-full object-cover" loading="lazy" data-edit-collection="groups" data-edit-index={groupIndex} data-edit-image={`choices.${choiceIndex}.image`} />
              ))}
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs font-bold text-white backdrop-blur"><Layers3 size={14} /> Live-Komposition</div>
          </div>

          <div className="flex min-h-full flex-col p-5 md:p-7 lg:p-8">
            <div className="flex gap-1 overflow-x-auto border-b border-[var(--token-divider)] pb-3" role="tablist" aria-label="Konfigurationsbereiche">
              {groups.map((group, index) => (
                <button key={group.id || group.label} type="button" role="tab" aria-selected={index === activeGroup} onClick={() => setActiveGroup(index)} className={`min-h-10 shrink-0 rounded-full px-3 text-xs font-bold transition ${index === activeGroup ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]' : 'text-[color:var(--token-muted)] hover:bg-[var(--token-section-bg-alt)] hover:text-[color:var(--token-heading)]'}`}>{group.label}</button>
              ))}
            </div>

            <div className="py-6" data-edit-collection="groups" data-edit-index={activeGroup}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--token-eyebrow)]">{String(activeGroup + 1).padStart(2, '0')} / {String(groups.length).padStart(2, '0')}</p>
              <h3 className="mt-2 text-2xl font-black text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="label">{currentGroup.label}</h3>
              {currentGroup.description && <p className="mt-2 text-sm leading-6 text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="description">{plain(currentGroup.description)}</p>}

              <div className="mt-5 grid grid-cols-2 gap-2">
                {currentGroup.choices.map((choice, choiceIndex) => {
                  const selected = (selections[currentGroupId] ?? 0) === choiceIndex;
                  return (
                    <button key={choiceKey(choice, choiceIndex)} type="button" onClick={() => setSelections((current) => ({ ...current, [currentGroupId]: choiceIndex }))} className={`relative min-h-20 rounded-xl border p-3 text-left transition ${selected ? 'border-[var(--token-accent)] bg-[var(--token-section-bg-alt)] shadow-sm' : 'border-[var(--token-card-border)] hover:border-[var(--token-accent)]'}`} data-edit-collection="choices" data-edit-index={choiceIndex}>
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 shrink-0 rounded-full border border-black/10" style={{ background: choice.swatch || 'var(--token-section-bg-alt)' }} />
                        <span className="text-sm font-bold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="label">{choice.label}</span>
                      </span>
                      {choice.priceLabel && <span className="mt-2 block text-xs text-[color:var(--token-price)]" data-edit-path="priceLabel">{choice.priceLabel}</span>}
                      {selected && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]"><Check size={12} className="text-[color:var(--token-check)]" /></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto border-t border-[var(--token-divider)] pt-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--token-muted)]">Ihre Auswahl</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--token-card-heading,var(--token-heading))]">{selectedChoices.map((choice) => choice.label).join(' · ')}</p>
              {cta.label && <a href={cta.href || '#'} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 text-sm font-bold text-[color:var(--token-btn-text)]" data-edit-link="cta"><span data-edit-path="cta.label">{cta.label}</span><ArrowRight size={16} /></a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

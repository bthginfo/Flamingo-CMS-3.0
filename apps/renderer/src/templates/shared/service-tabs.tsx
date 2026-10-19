'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useId, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { useHydrationSafeReducedMotion } from '@/lib/use-hydration-safe-reduced-motion';
import { ResilientNextImage } from '@/components/ui/resilient-image';

type Cta = { label?: string; href?: string };
type Tab = { label: string; icon?: string; title?: string; text?: string; image?: string; imageAlt?: string; imagePosition?: string; features?: string[]; cta?: Cta };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ServiceTabsSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const tabs = (data.tabs as Tab[]) || [];
  const [active, setActive] = useState(0);
  const id = useId();
  const reduceMotion = useHydrationSafeReducedMotion();
  if (!tabs.length) return null;
  const selected = Math.min(active, tabs.length - 1);
  const tab = tabs[selected];
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label={headline || 'Themen auswählen'}>
        {tabs.map((t, i) => (
          <button
            key={`${t.label}-${i}`}
            type="button"
            id={`${id}-tab-${i}`}
            role="tab"
            aria-controls={`${id}-panel`}
            aria-selected={i === selected}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(event) => moveTab(event, i)}
            className={`inline-flex min-h-12 items-center gap-2 rounded-[var(--token-button-radius)] px-5 py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)] ${i === selected
              ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] shadow-lg'
              : 'border border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-card-body)] hover:text-[color:var(--token-card-heading)] hover:shadow-md'}`}
            data-edit-collection="tabs" data-edit-index={i} data-card-scope="control"
          >
            {t.icon && <DynamicIcon editPath="icon" name={t.icon} size={15} />}
            <span data-edit-path="label">{t.label}</span>
          </button>
        ))}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`} tabIndex={0} className="relative mt-8 overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)]">
        <AnimatePresence mode="wait">
          <motion.div key={selected} initial={reduceMotion ? false : { opacity: .8, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: .8 }} transition={{ duration: reduceMotion ? 0 : .2 }} className="grid md:grid-cols-2" data-edit-collection="tabs" data-edit-index={selected}>
            <div className="flex flex-col justify-center p-7 md:p-12">
              {tab.title && <h3 className="text-2xl font-bold text-[color:var(--token-card-heading,var(--token-heading))] md:text-3xl" data-edit-path="title">{tab.title}</h3>}
              {tab.text && <div className="mt-4 leading-7 text-[color:var(--token-card-body,var(--token-body))] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: sanitizeHtml(tab.text) }} />}
              {(tab.features?.length ?? 0) > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {tab.features!.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-[color:var(--token-card-body,var(--token-body))]" data-edit-collection="features" data-edit-index={fi}>
                      <Check size={17} className="mt-0.5 shrink-0 text-[color:var(--token-check)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tab.cta?.label && (
                <a data-edit-link="cta" href={tab.cta.href || '#'} className="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-6 py-3 text-sm font-bold text-[color:var(--token-btn-text)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)]">
                  <span data-edit-path="label">{tab.cta.label}</span>
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
            {tab.image && (
              <div className="relative min-h-[280px] md:min-h-[420px]">
                <ResilientNextImage data-edit-image="image" src={tab.image} alt={tab.imageAlt || tab.title || tab.label} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" style={{ objectPosition: tab.imagePosition || 'center' }} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

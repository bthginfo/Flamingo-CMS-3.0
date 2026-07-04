'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Cta = { label?: string; href?: string };
type Tab = { label: string; icon?: string; title?: string; text?: string; image?: string; features?: string[]; cta?: Cta };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ServiceTabsSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const tabs = (data.tabs as Tab[]) || [];
  const [active, setActive] = useState(0);
  if (!tabs.length) return null;
  const tab = tabs[Math.min(active, tabs.length - 1)];

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={`${t.label}-${i}`}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${i === active
              ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] shadow-lg'
              : 'border border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-muted)] hover:text-[color:var(--token-heading)] hover:shadow-md'}`}
            data-edit-collection="tabs" data-edit-index={i}
          >
            {t.icon && <DynamicIcon editPath="icon" name={t.icon} size={15} />}
            <span data-edit-path="label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="relative mt-8 overflow-hidden rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center p-7 md:p-12">
              {tab.title && <h3 className="text-2xl font-bold text-[color:var(--token-card-heading,var(--token-heading))] md:text-3xl" data-edit-path="title">{tab.title}</h3>}
              {tab.text && <div className="mt-4 leading-7 text-[color:var(--token-card-body,var(--token-body))] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: tab.text }} />}
              {(tab.features?.length ?? 0) > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {tab.features!.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-[color:var(--token-card-body,var(--token-body))]">
                      <Check size={17} className="mt-0.5 shrink-0 text-[color:var(--token-check)]" />
                      <span data-edit-path="feature">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tab.cta?.label && (
                <a data-edit-link="cta" href={tab.cta.href || '#'} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 text-sm font-bold text-[color:var(--token-btn-text)] transition hover:brightness-110">
                  <span data-edit-path="label">{tab.cta.label}</span>
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
            {tab.image && (
              <div className="relative min-h-[280px] md:min-h-[420px]">
                <img data-edit-image="image" src={tab.image} alt={tab.title || tab.label} className="absolute inset-0 h-full w-full object-cover" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

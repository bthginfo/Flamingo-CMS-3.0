'use client';

import { motion } from 'framer-motion';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type PriceItem = { name?: string; description?: string; durationLabel?: string; priceLabel?: string; note?: string; cta?: { label?: string; href?: string } };
type PriceCategory = { title?: string; text?: string; items?: PriceItem[] };

export function PriceListSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Preise';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Preisliste';
  const categories = asList<PriceCategory>(data.categories);
  const footnote = (data.footnote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, categories, footnote, ctaPrimary };

  return <PriceClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; categories: PriceCategory[]; footnote: string; ctaPrimary: ButtonValue };

function PriceClassic({ headline, subline, badgeText, categories, footnote, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((cat, ci) => (
          <motion.article key={`${cat.title || 'item'}-${ci}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.1 }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-6 shadow-md" data-edit-collection="categories" data-edit-index={ci}>
            <h3 className="text-2xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{cat.title || ''}</h3>
            {cat.text && <div className="mt-2 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: cat.text }} />}
            <div className="mt-5 divide-y divide-[color-mix(in_srgb,var(--token-icon)_20%,transparent)]">
              {asList<PriceItem>(cat.items).map((item, ii) => (
                <div key={`${item.name}-${ii}`} className="py-4" data-edit-collection="items" data-edit-index={ii}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4"><div className="min-w-0"><p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</p>{item.description && <div className="mt-1 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: item.description }} />}</div>{item.priceLabel && <p className="shrink-0 whitespace-nowrap font-bold text-[color:var(--token-price)]" data-edit-path="priceLabel">{item.priceLabel}</p>}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[color:var(--token-muted)]">{item.durationLabel && <span>{item.durationLabel}</span>}{item.note && <span data-edit-path="note">{item.note}</span>}{item.cta?.label && <a href={item.cta.href || '#'} className="font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{item.cta.label}</a>}</div>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
      {footnote && <p className="mt-6 text-sm text-[color:var(--token-muted)]">{footnote}</p>}
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}


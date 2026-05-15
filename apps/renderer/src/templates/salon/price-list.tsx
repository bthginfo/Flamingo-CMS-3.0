'use client';

import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type PriceItem = { name?: string; description?: string; durationLabel?: string; priceLabel?: string; note?: string; cta?: { label?: string; href?: string } };
type PriceCategory = { title?: string; text?: string; items?: PriceItem[] };

export function PriceListSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Preise', 'Preisliste');
  const categories = asList<PriceCategory>(data.categories);
  const footnote = (data.footnote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((category, index) => (
          <article key={`${category.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-6 shadow-[var(--style-card-shadow)]">
            <h3 className="text-2xl font-bold text-[var(--style-text-primary)]">{category.title || ''}</h3>
            {category.text && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{category.text}</p>}
            <div className="mt-5 divide-y divide-black/10">
              {asList<PriceItem>(category.items).map((item, itemIndex) => (
                <div key={`${item.name}-${itemIndex}`} className="py-4">
                  <div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-[var(--style-text-primary)]">{item.name || ''}</p>{item.description && <p className="mt-1 text-sm text-[var(--style-text-secondary)]">{item.description}</p>}</div>{item.priceLabel && <p className="font-bold text-[var(--style-text-primary)]">{item.priceLabel}</p>}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--style-text-secondary)]">{item.durationLabel && <span>{item.durationLabel}</span>}{item.note && <span>{item.note}</span>}{item.cta?.label && <a href={item.cta.href || '#'} className="font-semibold text-[var(--style-text-primary)]">{item.cta.label}</a>}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      {footnote && <p className="mt-6 text-sm text-[var(--style-text-secondary)]">{footnote}</p>}
      <div className="mt-8"><CtaButton cta={ctaPrimary} /></div>
    </div>
  );
}

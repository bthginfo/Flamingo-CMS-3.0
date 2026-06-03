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

  if (styleVariant === 'modern') return <PriceModern {...props} />;
  if (styleVariant === 'bold') return <PriceBold {...props} />;
  return <PriceClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; categories: PriceCategory[]; footnote: string; ctaPrimary: ButtonValue };

function PriceClassic({ headline, subline, badgeText, categories, footnote, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-on-dark-muted,#52525b)]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-on-dark-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((cat, ci) => (
          <motion.article key={`${cat.title}-${ci}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.1 }} className="rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] p-6 shadow-md">
            <h3 className="text-2xl font-bold text-[color:var(--token-heading,#18181b)]">{cat.title || ''}</h3>
            {cat.text && <div className="mt-2 text-sm text-[color:var(--token-on-dark-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: cat.text }} />}
            <div className="mt-5 divide-y divide-[var(--token-icon, var(--brand-primary))]/20">
              {asList<PriceItem>(cat.items).map((item, ii) => (
                <div key={`${item.name}-${ii}`} className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4"><div className="min-w-0"><p className="font-semibold text-[color:var(--token-heading,#18181b)]">{item.name || ''}</p>{item.description && <div className="mt-1 text-sm text-[color:var(--token-on-dark-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: item.description }} />}</div>{item.priceLabel && <p className="shrink-0 whitespace-nowrap font-bold text-[color:var(--token-heading,#18181b)]">{item.priceLabel}</p>}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[color:var(--token-on-dark-muted,#52525b)]">{item.durationLabel && <span>{item.durationLabel}</span>}{item.note && <span>{item.note}</span>}{item.cta?.label && <a href={item.cta.href || '#'} className="font-semibold text-[color:var(--token-heading,#18181b)]">{item.cta.label}</a>}</div>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
      {footnote && <p className="mt-6 text-sm text-[color:var(--token-on-dark-muted,#52525b)]">{footnote}</p>}
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-md">{ctaPrimary.label}</a>}
    </div>
  );
}

function PriceModern({ headline, subline, badgeText, categories, footnote, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-on-dark-muted,#52525b)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-on-dark-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        {categories.map((cat, ci) => (
          <article key={`${cat.title}-${ci}`} className="border-t border-black/10 pt-6">
            <h3 className="text-2xl font-light text-[color:var(--token-heading,#18181b)]">{cat.title || ''}</h3>
            {cat.text && <div className="mt-2 text-sm font-light text-[color:var(--token-on-dark-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: cat.text }} />}
            <div className="mt-5 divide-y divide-black/10">
              {asList<PriceItem>(cat.items).map((item, ii) => (
                <div key={`${item.name}-${ii}`} className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4"><div className="min-w-0"><p className="font-light text-[color:var(--token-heading,#18181b)]">{item.name || ''}</p>{item.description && <div className="mt-1 text-sm font-light text-[color:var(--token-on-dark-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: item.description }} />}</div>{item.priceLabel && <p className="shrink-0 whitespace-nowrap font-light text-[color:var(--token-heading,#18181b)]">{item.priceLabel}</p>}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-light text-[color:var(--token-on-dark-muted,#52525b)]">{item.durationLabel && <span>{item.durationLabel}</span>}{item.note && <span>{item.note}</span>}{item.cta?.label && <a href={item.cta.href || '#'} className="border-b border-[var(--token-card-border,var(--brand-accent,#f39c12))] pb-1 text-[color:var(--token-heading,#18181b)]">{item.cta.label}</a>}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      {footnote && <p className="mt-6 text-sm font-light text-[color:var(--token-on-dark-muted,#52525b)]">{footnote}</p>}
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[#111827] px-6 py-3 font-light text-[color:var(--token-heading,#18181b)]">{ctaPrimary.label}</a>}
    </div>
  );
}

function PriceBold({ headline, subline, badgeText, categories, footnote, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-on-dark-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((cat, ci) => (
          <article key={`${cat.title}-${ci}`} className="border-2 border-[#111827] bg-[#111] p-6 shadow-[4px_4px_0_var(--token-eyebrow, var(--brand-accent))]">
            <h3 className="text-2xl font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)]">{cat.title || ''}</h3>
            {cat.text && <div className="mt-2 text-sm text-[color:var(--token-on-dark-heading,#ffffff)/60] rt-content" dangerouslySetInnerHTML={{ __html: cat.text }} />}
            <div className="mt-5 divide-y-2 divide-[#111827]">
              {asList<PriceItem>(cat.items).map((item, ii) => (
                <div key={`${item.name}-${ii}`} className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4"><div className="min-w-0"><p className="font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)]">{item.name || ''}</p>{item.description && <div className="mt-1 text-sm text-[color:var(--token-on-dark-heading,#ffffff)/60] rt-content" dangerouslySetInnerHTML={{ __html: item.description }} />}</div>{item.priceLabel && <p className="shrink-0 whitespace-nowrap font-black text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{item.priceLabel}</p>}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-[color:var(--token-on-dark-heading,#ffffff)/50]">{item.durationLabel && <span>{item.durationLabel}</span>}{item.note && <span>{item.note}</span>}{item.cta?.label && <a href={item.cta.href || '#'} className="font-black uppercase text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{item.cta.label}</a>}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      {footnote && <p className="mt-6 text-sm font-bold text-[color:var(--token-on-dark-muted,#52525b)]">{footnote}</p>}
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{ctaPrimary.label}</a>}
    </div>
  );
}

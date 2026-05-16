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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-gray-600">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
        {subline && <p className="mt-4 text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((cat, ci) => (
          <motion.article key={`${cat.title}-${ci}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.1 }} className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-6 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900">{cat.title || ''}</h3>
            {cat.text && <p className="mt-2 text-sm text-gray-600">{cat.text}</p>}
            <div className="mt-5 divide-y divide-[var(--brand-primary)]/20">
              {asList<PriceItem>(cat.items).map((item, ii) => (
                <div key={`${item.name}-${ii}`} className="py-4">
                  <div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-gray-900">{item.name || ''}</p>{item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}</div>{item.priceLabel && <p className="font-bold text-gray-900">{item.priceLabel}</p>}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">{item.durationLabel && <span>{item.durationLabel}</span>}{item.note && <span>{item.note}</span>}{item.cta?.label && <a href={item.cta.href || '#'} className="font-semibold text-gray-900">{item.cta.label}</a>}</div>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
      {footnote && <p className="mt-6 text-sm text-gray-600">{footnote}</p>}
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
    </div>
  );
}

function PriceModern({ headline, subline, badgeText, categories, footnote, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 font-light text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        {categories.map((cat, ci) => (
          <article key={`${cat.title}-${ci}`} className="border-t border-black/10 pt-6">
            <h3 className="text-2xl font-light text-gray-900">{cat.title || ''}</h3>
            {cat.text && <p className="mt-2 text-sm font-light text-gray-600">{cat.text}</p>}
            <div className="mt-5 divide-y divide-black/10">
              {asList<PriceItem>(cat.items).map((item, ii) => (
                <div key={`${item.name}-${ii}`} className="py-4">
                  <div className="flex items-start justify-between gap-4"><div><p className="font-light text-gray-900">{item.name || ''}</p>{item.description && <p className="mt-1 text-sm font-light text-gray-600">{item.description}</p>}</div>{item.priceLabel && <p className="font-light text-gray-900">{item.priceLabel}</p>}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-light text-gray-600">{item.durationLabel && <span>{item.durationLabel}</span>}{item.note && <span>{item.note}</span>}{item.cta?.label && <a href={item.cta.href || '#'} className="border-b border-brand-accent pb-1 text-gray-900">{item.cta.label}</a>}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      {footnote && <p className="mt-6 text-sm font-light text-gray-600">{footnote}</p>}
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[#111827] px-6 py-3 font-light text-gray-900">{ctaPrimary.label}</a>}
    </div>
  );
}

function PriceBold({ headline, subline, badgeText, categories, footnote, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-brand-accent">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 font-bold text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((cat, ci) => (
          <article key={`${cat.title}-${ci}`} className="border-2 border-[#111827] bg-[#111] p-6 shadow-[4px_4px_0_var(--brand-accent)]">
            <h3 className="text-2xl font-black uppercase text-white">{cat.title || ''}</h3>
            {cat.text && <p className="mt-2 text-sm text-white/60">{cat.text}</p>}
            <div className="mt-5 divide-y-2 divide-[#111827]">
              {asList<PriceItem>(cat.items).map((item, ii) => (
                <div key={`${item.name}-${ii}`} className="py-4">
                  <div className="flex items-start justify-between gap-4"><div><p className="font-black uppercase text-white">{item.name || ''}</p>{item.description && <p className="mt-1 text-sm text-white/60">{item.description}</p>}</div>{item.priceLabel && <p className="font-black text-brand-accent">{item.priceLabel}</p>}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-white/50">{item.durationLabel && <span>{item.durationLabel}</span>}{item.note && <span>{item.note}</span>}{item.cta?.label && <a href={item.cta.href || '#'} className="font-black uppercase text-brand-accent">{item.cta.label}</a>}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      {footnote && <p className="mt-6 text-sm font-bold text-gray-600">{footnote}</p>}
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-brand-accent px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{ctaPrimary.label}</a>}
    </div>
  );
}

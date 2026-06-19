'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type ServiceCategory = { title?: string; text?: string; image?: string; category?: string; services?: string[]; cta?: { label?: string; href?: string } };

export function ServiceMenuSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Leistungen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Services';
  const categories = asList<ServiceCategory>(data.categories);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, categories, ctaPrimary };

  if (styleVariant === 'modern') return <ServiceModern {...props} />;
  if (styleVariant === 'bold') return <ServiceBold {...props} />;
  return <ServiceClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; categories: ServiceCategory[]; ctaPrimary: ButtonValue };

function ServiceClassic({ headline, subline, badgeText, categories, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((item, i) => (
          <motion.article key={`${item.title || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md" data-edit-collection="categories" data-edit-index={i}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.category && <span className="inline-block rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold uppercase text-[color:var(--token-eyebrow)]" data-edit-path="category">{item.category}</span>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {asList<string>(item.services).length > 0 && <p className="mt-2 text-sm text-[color:var(--token-muted)]">{asList<string>(item.services).join(' / ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-2 text-sm font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function ServiceModern({ headline, subline, badgeText, categories, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {categories.map((item, i) => (
          <article key={`${item.title || 'item'}-${i}`} className="group" data-edit-collection="categories" data-edit-index={i}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="mt-4">
              {item.category && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="category">{item.category}</p>}
              <h3 className="mt-2 text-xl font-light text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {asList<string>(item.services).length > 0 && <p className="mt-2 text-sm font-light text-[color:var(--token-muted)]">{asList<string>(item.services).join(' / ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex border-b border-[var(--token-card-border)] pb-1 text-sm font-light text-[color:var(--token-heading)]" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[var(--token-card-border)] px-6 py-3 font-light text-[color:var(--token-heading)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function ServiceBold({ headline, subline, badgeText, categories, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((item, i) => (
          <article key={`${item.title || 'item'}-${i}`} className="group overflow-hidden border-2 border-[var(--token-card-border)] bg-[#111] shadow-[4px_4px_0_var(--token-eyebrow)]" data-edit-collection="categories" data-edit-index={i}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              {item.category && <span className="inline-block bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-black uppercase text-[color:var(--token-on-dark-heading)]" data-edit-path="category">{item.category}</span>}
              <h3 className="mt-2 text-xl font-black uppercase text-[color:var(--token-on-dark-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {asList<string>(item.services).length > 0 && <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)]">{asList<string>(item.services).join(' / ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex bg-[var(--token-badge-bg)] px-5 py-2 text-sm font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-[var(--token-badge-bg)] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

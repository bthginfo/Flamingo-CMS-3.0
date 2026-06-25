'use client';

import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import Image from 'next/image';
import type { SectionProps } from './types';

type Experience = { title?: string; text?: string; image?: string; category?: string; durationLabel?: string; audienceLabel?: string; difficultyLabel?: string; priceLabel?: string; cta?: { label?: string; href?: string } };

export function ExperienceGridSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Erlebnisse & Aktivitaeten', 'Erleben');
  const items = asList<Experience>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  if (styleVariant === 'modern') return <Modern header={header} items={items} ctaPrimary={ctaPrimary} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} ctaPrimary={ctaPrimary} />;
  return <Classic header={header} items={items} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Experience[]; ctaPrimary: { label?: string; href?: string } };

function ExperienceMeta({ item, className }: { item: Experience; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest ${className || 'text-[color:var(--token-muted)]'}`}>
      {item.durationLabel && <span className="inline-flex items-center gap-1"><Clock size={13} />{item.durationLabel}</span>}
      {item.audienceLabel && <span className="inline-flex items-center gap-1"><Users size={13} />{item.audienceLabel}</span>}
      {item.category && <span data-edit-path="category">{item.category}</span>}
      {item.difficultyLabel && <span>{item.difficultyLabel}</span>}
      {item.priceLabel && <span className="text-[color:var(--token-price)]" data-edit-path="priceLabel">{item.priceLabel}</span>}
    </div>
  );
}

function Classic({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <motion.article key={`${item.title || 'item'}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="grid overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg sm:grid-cols-[220px_1fr]" data-edit-collection="items" data-edit-index={index}>
            {item.image && <div className="relative min-h-56"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-[color:var(--token-badge-text)]" />
              <h3 className="mt-3 text-2xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a></div>}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="grid overflow-hidden border border-[var(--token-card-border)] bg-[var(--token-card-bg)] sm:grid-cols-[220px_1fr]" data-edit-collection="items" data-edit-index={index}>
            {item.image && <div className="relative min-h-56"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-[color:var(--token-badge-text)] font-light" />
              <h3 className="mt-3 text-2xl font-light text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm font-light leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 font-semibold text-[color:var(--token-accent)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <article key={`${item.title || 'item'}-${index}`} className="grid overflow-hidden border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)] sm:grid-cols-[220px_1fr]" data-edit-collection="items" data-edit-index={index}>
            {item.image && <div className="relative min-h-56"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-[color:var(--token-badge-text)] font-black" />
              <h3 className="mt-3 text-2xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-black uppercase text-[color:var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

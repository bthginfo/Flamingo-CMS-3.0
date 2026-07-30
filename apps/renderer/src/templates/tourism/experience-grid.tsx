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
          <motion.article key={`${item.title || 'item'}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="grid overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg sm:grid-cols-[220px_1fr]" data-card data-edit-collection="items" data-edit-index={index}>
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


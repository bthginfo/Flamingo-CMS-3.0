'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Leaf } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Accommodation = { title?: string; text?: string; image?: string; category?: string; typeLabel?: string; priceLabel?: string; amenities?: string[]; cta?: { label?: string; href?: string } };

export function AccommodationGridSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Unterkuenfte', 'Bleiben');
  const items = asList<Accommodation>(data.items);

  if (styleVariant === 'modern') return <Modern header={header} items={items} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} />;
  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Accommodation[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-edit-collection="items" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text)]"><Leaf size={12} />{[item.category, item.typeLabel, item.priceLabel].filter(Boolean).join(' / ')}</div>
              <h3 className="mt-2 text-xl font-bold text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.amenities && item.amenities.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{asList<string>(item.amenities).map((a) => <span key={a} className="rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs text-[var(--token-badge-text)]">{a}</span>)}</div>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Modern({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${index}`} className="group overflow-hidden border border-[var(--token-card-border)] bg-[var(--token-card-bg)]" data-edit-collection="items" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <p className="text-xs font-light uppercase tracking-widest text-[var(--token-badge-text)]">{[item.category, item.typeLabel, item.priceLabel].filter(Boolean).join(' / ')}</p>
              <h3 className="mt-2 text-xl font-light text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm font-light leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.amenities && item.amenities.length > 0 && <p className="mt-3 text-xs font-light text-[var(--token-muted)]">{asList<string>(item.amenities).join(' · ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--token-accent)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, items }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${index}`} className="group overflow-hidden border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)]" data-edit-collection="items" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]">{[item.category, item.typeLabel, item.priceLabel].filter(Boolean).join(' / ')}</p>
              <h3 className="mt-2 text-xl font-black uppercase text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.amenities && item.amenities.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{asList<string>(item.amenities).map((a) => <span key={a} className="border border-[var(--token-accent)] px-2 py-0.5 text-xs font-bold uppercase text-[var(--token-accent)]">{a}</span>)}</div>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

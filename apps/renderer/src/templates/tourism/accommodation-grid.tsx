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
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]"><Leaf size={12} />{[item.category, item.typeLabel, item.priceLabel].filter(Boolean).join(' / ')}</div>
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.amenities && item.amenities.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{asList<string>(item.amenities).map((a) => <span key={a} className="rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs text-[color:var(--token-badge-text)]">{a}</span>)}</div>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}


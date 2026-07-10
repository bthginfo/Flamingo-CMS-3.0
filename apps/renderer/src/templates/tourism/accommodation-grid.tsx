'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Accommodation = {
  title?: string;
  name?: string;
  text?: string;
  description?: string;
  image?: string;
  category?: string;
  typeLabel?: string;
  type?: string;
  priceLabel?: string;
  priceFrom?: string | number;
  stars?: string | number;
  amenities?: string[];
  href?: string;
  url?: string;
  cta?: { label?: string; href?: string };
};

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
        {items.map((item, index) => {
          const title = item.title || item.name || '';
          const description = item.text || item.description || '';
          const typeLabel = item.typeLabel || item.type || item.category || '';
          const priceLabel = String(item.priceLabel || item.priceFrom || '');
          const starCount = Math.min(5, Math.max(0, Number.parseInt(String(item.stars || 0), 10) || 0));
          const actionHref = item.cta?.href || item.href || item.url || '';
          const actionLabel = item.cta?.label || (actionHref ? 'Details ansehen' : '');

          return (
            <motion.article key={`${title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="cms-card group flex h-full flex-col overflow-hidden border-[var(--token-card-border)] bg-[var(--token-card-bg)]" data-edit-collection="items" data-edit-index={index} data-card="">
              {item.image && <div className="cms-media-frame relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={title} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" /></div>}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1">
                  {typeLabel && <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--token-badge-text)]" data-edit-path={item.typeLabel ? 'typeLabel' : item.type ? 'type' : 'category'}>{typeLabel}</p>}
                  {starCount > 0 && (
                    <p className="flex items-center gap-0.5 text-[color:var(--token-rating-star)]" aria-label={`${starCount} von 5 Sternen`}>
                      {Array.from({ length: starCount }, (_, star) => <Star key={star} aria-hidden="true" size={13} fill="currentColor" />)}
                    </p>
                  )}
                </div>
                <h3 className="mt-2 text-xl font-bold leading-snug text-[color:var(--token-card-heading)]" data-edit-path={item.title ? 'title' : 'name'}>{title}</h3>
                {priceLabel && <p className="mt-2 font-semibold text-[color:var(--token-price)]" data-edit-path={item.priceLabel ? 'priceLabel' : 'priceFrom'}>{priceLabel}</p>}
                {description && <div className="mt-3 flex-1 text-sm leading-6 text-[color:var(--token-card-body)] rt-content" data-edit-rich={item.text ? 'text' : 'description'} dangerouslySetInnerHTML={{ __html: description }} />}
                {asList<string>(item.amenities).length > 0 && <div className="mt-4 flex flex-wrap gap-2">{asList<string>(item.amenities).map((amenity) => <span key={amenity} className="rounded-lg border border-[var(--token-card-border)] bg-[var(--token-badge-bg)] px-2.5 py-1 text-xs text-[color:var(--token-badge-text)]">{amenity}</span>)}</div>}
                {actionLabel && <a data-edit-link="cta" href={actionHref} className="cms-button cms-button--primary mt-5 self-start bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]"><span data-edit-path="label">{actionLabel}</span><ArrowRight aria-hidden="true" size={14} className="cms-button-icon" /></a>}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}


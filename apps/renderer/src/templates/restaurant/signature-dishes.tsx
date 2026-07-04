'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { asList, type SectionProps } from './types';

type Dish = { name?: string; description?: string; price?: string; image?: string; label?: string; ingredients?: string[]; cta?: { label?: string; href?: string } };

type SignatureDishesViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  dishes: Dish[];
};

export function SignatureDishesSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Empfehlungen des Hauses';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Signature Dishes';
  const dishes = asList<Dish>(data.dishes);

  const props: SignatureDishesViewProps = { headline, subline, badgeText, dishes };

  return <SignatureDishesClassic {...props} />;
}

function SignatureDishesClassic({ headline, subline, badgeText, dishes }: SignatureDishesViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="mb-10 max-w-3xl text-center mx-auto">
        {badgeText && <p className="inline-block rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {dishes.map((dish, index) => (
          <motion.article key={`${dish.name || 'item'}-${index}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group overflow-hidden rounded-xl border border-black/10 bg-[var(--token-card-bg)] shadow-md" data-edit-collection="dishes" data-edit-index={index}>
            {dish.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={dish.image} alt={dish.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {dish.label && <p className="inline-block rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="label">{dish.label}</p>}
              <div className="mt-2 flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="name">{dish.name || ''}</h3>
                {dish.price && <p className="shrink-0 font-bold text-[color:var(--token-price)]" data-edit-path="price">{dish.price}</p>}
              </div>
              {dish.description && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: dish.description }} />}
              {asList<string>(dish.ingredients).length > 0 && <p className="mt-4 text-xs text-[color:var(--token-muted)]">{asList<string>(dish.ingredients).join(' / ')}</p>}
              {dish.cta?.label && <a href={dish.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-[color:var(--token-icon)]"><span data-edit-path="label">{dish.cta.label}</span><ArrowRight size={16} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}


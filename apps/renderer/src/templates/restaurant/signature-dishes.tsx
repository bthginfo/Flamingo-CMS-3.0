'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { asList, type SectionProps } from './types';

type Dish = { name?: string; description?: string; price?: string; image?: string; label?: string; ingredients?: string[]; cta?: { label?: string; href?: string } };

export function SignatureDishesSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Empfehlungen des Hauses';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Signature Dishes';
  const dishes = asList<Dish>(data.dishes);

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {dishes.map((dish, index) => (
          <article key={`${dish.name}-${index}`} className="group overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)]">
            {dish.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={dish.image} alt={dish.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {dish.label && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{dish.label}</p>}
              <div className="mt-2 flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-[var(--style-text-primary)]">{dish.name || ''}</h3>
                {dish.price && <p className="font-bold text-[var(--style-text-primary)]">{dish.price}</p>}
              </div>
              {dish.description && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{dish.description}</p>}
              {asList<string>(dish.ingredients).length > 0 && <p className="mt-4 text-xs text-[var(--style-text-secondary)]">{asList<string>(dish.ingredients).join(' / ')}</p>}
              {dish.cta?.label && <a href={dish.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-[var(--style-text-primary)]">{dish.cta.label}<ArrowRight size={16} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}


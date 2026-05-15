'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type Amenity = { icon?: string; title?: string; text?: string; image?: string; mediaType?: string };

export function AmenitiesSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Ausstattung';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Service';
  const items = asList<Amenity>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div>
      <Header badgeText={badgeText} headline={headline} subline={subline} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]">
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[var(--style-radius-md)]"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-4 text-[var(--style-text-primary)]"><DynamicIcon name={item.icon || 'star'} size={24} /></div>
            )}
            <h3 className="font-bold text-[var(--style-text-primary)]">{item.title || ''}</h3>
            {item.text && <p className="mt-2 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

function Header({ badgeText, headline, subline }: { badgeText: string; headline: string; subline: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}


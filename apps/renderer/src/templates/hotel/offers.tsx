'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { asList, type SectionProps } from './types';

type Offer = { title?: string; description?: string; image?: string; priceLabel?: string; durationLabel?: string; includes?: string[]; validUntilLabel?: string; cta?: { label?: string; href?: string }; detailHref?: string; detailLabel?: string; highlighted?: boolean };

export function OffersSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Angebote';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Arrangements';
  const offers = asList<Offer>(data.offers);
  const fallbackText = (data.fallbackText as string) || '';

  return (
    <div>
      <Header badgeText={badgeText} headline={headline} subline={subline} />
      {offers.length === 0 && fallbackText ? <p className="text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-6 md:grid-cols-2">
        {offers.map((offer, index) => (
          <article key={`${offer.title}-${index}`} className={`grid overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)] sm:grid-cols-[180px_1fr] ${offer.highlighted ? 'ring-2 ring-[var(--style-badge-bg)]' : ''}`}>
            {offer.image && <div className="relative min-h-52"><Image src={offer.image} alt={offer.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--style-text-secondary)]">
                {offer.durationLabel && <span>{offer.durationLabel}</span>}
                {offer.priceLabel && <span>{offer.priceLabel}</span>}
                {offer.validUntilLabel && <span>{offer.validUntilLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold text-[var(--style-text-primary)]">{offer.title || ''}</h3>
              {offer.description && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{offer.description}</p>}
              {asList<string>(offer.includes).length > 0 && <p className="mt-3 text-xs text-[var(--style-text-secondary)]">{asList<string>(offer.includes).join(' / ')}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {offer.cta?.label && <a href={offer.cta.href || '#'} className="font-semibold text-[var(--style-text-primary)]">{offer.cta.label}</a>}
                {offer.detailHref && offer.detailLabel && <a href={offer.detailHref} className="inline-flex items-center gap-1 text-sm text-[var(--style-text-secondary)]">{offer.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
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


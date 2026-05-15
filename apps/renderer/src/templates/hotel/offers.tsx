'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { asList, type SectionProps } from './types';

type Offer = { title?: string; description?: string; image?: string; priceLabel?: string; durationLabel?: string; includes?: string[]; validUntilLabel?: string; cta?: { label?: string; href?: string }; detailHref?: string; detailLabel?: string; highlighted?: boolean };

export function OffersSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Angebote';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Arrangements';
  const offers = asList<Offer>(data.offers);
  const fallbackText = (data.fallbackText as string) || '';

  const props = { headline, subline, badgeText, offers, fallbackText };

  if (styleVariant === 'modern') return <OffersModern {...props} />;
  if (styleVariant === 'bold') return <OffersBold {...props} />;
  return <OffersClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string;
  offers: Offer[]; fallbackText: string;
};

/* --- CLASSIC --- */
function OffersClassic({ headline, subline, badgeText, offers, fallbackText }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]"><Star size={12} className="text-[var(--style-badge-bg)]" />{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      {offers.length === 0 && fallbackText ? <p className="text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-6 md:grid-cols-2">
        {offers.map((offer, index) => (
          <motion.article key={`${offer.title}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`grid overflow-hidden rounded-2xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] shadow-md sm:grid-cols-[180px_1fr] ${offer.highlighted ? 'ring-2 ring-[var(--style-badge-bg)]' : ''}`}>
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
                {offer.cta?.label && <a href={offer.cta.href || '#'} className="font-semibold text-[var(--style-badge-bg)]">{offer.cta.label}</a>}
                {offer.detailHref && offer.detailLabel && <a href={offer.detailHref} className="inline-flex items-center gap-1 text-sm text-[var(--style-text-secondary)]">{offer.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

/* --- MODERN --- */
function OffersModern({ headline, subline, badgeText, offers, fallbackText }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      {offers.length === 0 && fallbackText ? <p className="font-light text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-px border border-black/10 md:grid-cols-2">
        {offers.map((offer, index) => (
          <article key={`${offer.title}-${index}`} className={`grid overflow-hidden border border-black/10 bg-[var(--style-card-bg)] sm:grid-cols-[180px_1fr] ${offer.highlighted ? 'bg-black/[0.02]' : ''}`}>
            {offer.image && <div className="relative min-h-52"><Image src={offer.image} alt={offer.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-6">
              <div className="flex flex-wrap gap-3 text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">
                {offer.durationLabel && <span>{offer.durationLabel}</span>}
                {offer.priceLabel && <span>{offer.priceLabel}</span>}
                {offer.validUntilLabel && <span>{offer.validUntilLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-light text-[var(--style-text-primary)]">{offer.title || ''}</h3>
              {offer.description && <p className="mt-3 text-sm font-light leading-7 text-[var(--style-text-secondary)]">{offer.description}</p>}
              {asList<string>(offer.includes).length > 0 && <p className="mt-3 text-xs font-light text-[var(--style-text-secondary)]">{asList<string>(offer.includes).join(' / ')}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {offer.cta?.label && <a href={offer.cta.href || '#'} className="font-light text-[var(--style-text-primary)] underline underline-offset-4">{offer.cta.label}</a>}
                {offer.detailHref && offer.detailLabel && <a href={offer.detailHref} className="inline-flex items-center gap-1 text-sm font-light text-[var(--style-text-secondary)] underline underline-offset-4">{offer.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* --- BOLD --- */
function OffersBold({ headline, subline, badgeText, offers, fallbackText }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--style-badge-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--style-badge-text)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      {offers.length === 0 && fallbackText ? <p className="text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {offers.map((offer, index) => (
          <article key={`${offer.title}-${index}`} className={`grid overflow-hidden border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] shadow-[4px_4px_0_var(--style-text-primary)] sm:grid-cols-[180px_1fr] ${offer.highlighted ? 'ring-2 ring-[var(--style-badge-bg)]' : ''}`}>
            {offer.image && <div className="relative min-h-52"><Image src={offer.image} alt={offer.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">
                {offer.durationLabel && <span>{offer.durationLabel}</span>}
                {offer.priceLabel && <span>{offer.priceLabel}</span>}
                {offer.validUntilLabel && <span>{offer.validUntilLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-black uppercase text-[var(--style-text-primary)]">{offer.title || ''}</h3>
              {offer.description && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{offer.description}</p>}
              {asList<string>(offer.includes).length > 0 && <p className="mt-3 text-xs text-[var(--style-text-secondary)]">{asList<string>(offer.includes).join(' / ')}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {offer.cta?.label && <a href={offer.cta.href || '#'} className="font-black uppercase text-[var(--style-badge-bg)]">{offer.cta.label}</a>}
                {offer.detailHref && offer.detailLabel && <a href={offer.detailHref} className="inline-flex items-center gap-1 text-sm font-bold text-[var(--style-text-secondary)]">{offer.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

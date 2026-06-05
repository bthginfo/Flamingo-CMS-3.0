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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]"><Star size={12} className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" />{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {offers.length === 0 && fallbackText ? <p className="text-[color:var(--token-muted,#52525b)]">{fallbackText}</p> : null}
      <div className="grid gap-6 md:grid-cols-2">
        {offers.map((offer, index) => (
          <motion.article key={`${offer.title}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`grid overflow-hidden rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] shadow-md sm:grid-cols-[180px_1fr] ${offer.highlighted ? 'ring-2 ring-[var(--token-icon, var(--brand-primary))]' : ''}`} data-edit-collection="offers" data-edit-index={index}>
            {offer.image && <div className="relative min-h-52"><Image src={offer.image} alt={offer.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]">
                {offer.durationLabel && <span>{offer.durationLabel}</span>}
                {offer.priceLabel && <span data-edit-path="priceLabel">{offer.priceLabel}</span>}
                {offer.validUntilLabel && <span>{offer.validUntilLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold text-[color:var(--token-heading,#18181b)]">{offer.title || ''}</h3>
              {offer.description && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: offer.description }} />}
              {asList<string>(offer.includes).length > 0 && <p className="mt-3 text-xs text-[color:var(--token-muted,#52525b)]">{asList<string>(offer.includes).join(' / ')}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {offer.cta?.label && <a href={offer.cta.href || '#'} className="font-semibold text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]" data-edit-path="label">{offer.cta.label}</a>}
                {offer.detailHref && offer.detailLabel && <a href={offer.detailHref} className="inline-flex items-center gap-1 text-sm text-[color:var(--token-muted,#52525b)]">{offer.detailLabel}<ArrowRight size={14} /></a>}
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
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {offers.length === 0 && fallbackText ? <p className="font-light text-[color:var(--token-muted,#52525b)]">{fallbackText}</p> : null}
      <div className="grid gap-px border border-black/10 md:grid-cols-2">
        {offers.map((offer, index) => (
          <article key={`${offer.title}-${index}`} className={`grid overflow-hidden border border-black/10 bg-[var(--token-card-bg,#ffffff)] sm:grid-cols-[180px_1fr] ${offer.highlighted ? 'bg-[var(--token-section-bg-alt,#000000)]/[0.02]' : ''}`} data-edit-collection="offers" data-edit-index={index}>
            {offer.image && <div className="relative min-h-52"><Image src={offer.image} alt={offer.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-6">
              <div className="flex flex-wrap gap-3 text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">
                {offer.durationLabel && <span>{offer.durationLabel}</span>}
                {offer.priceLabel && <span data-edit-path="priceLabel">{offer.priceLabel}</span>}
                {offer.validUntilLabel && <span>{offer.validUntilLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-light text-[color:var(--token-heading,#18181b)]">{offer.title || ''}</h3>
              {offer.description && <div className="mt-3 text-sm font-light leading-7 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: offer.description }} />}
              {asList<string>(offer.includes).length > 0 && <p className="mt-3 text-xs font-light text-[color:var(--token-muted,#52525b)]">{asList<string>(offer.includes).join(' / ')}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {offer.cta?.label && <a href={offer.cta.href || '#'} className="font-light text-[color:var(--token-heading,#18181b)] underline underline-offset-4" data-edit-path="label">{offer.cta.label}</a>}
                {offer.detailHref && offer.detailLabel && <a href={offer.detailHref} className="inline-flex items-center gap-1 text-sm font-light text-[color:var(--token-muted,#52525b)] underline underline-offset-4">{offer.detailLabel}<ArrowRight size={14} /></a>}
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
        {badgeText && <p className="inline-block bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {offers.length === 0 && fallbackText ? <p className="text-[color:var(--token-muted,#52525b)]">{fallbackText}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {offers.map((offer, index) => (
          <article key={`${offer.title}-${index}`} className={`grid overflow-hidden border-2 border-[#111827] bg-[var(--token-card-bg,#ffffff)] shadow-[4px_4px_0_#111827] sm:grid-cols-[180px_1fr] ${offer.highlighted ? 'ring-2 ring-[var(--token-icon, var(--brand-primary))]' : ''}`} data-edit-collection="offers" data-edit-index={index}>
            {offer.image && <div className="relative min-h-52"><Image src={offer.image} alt={offer.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]">
                {offer.durationLabel && <span>{offer.durationLabel}</span>}
                {offer.priceLabel && <span data-edit-path="priceLabel">{offer.priceLabel}</span>}
                {offer.validUntilLabel && <span>{offer.validUntilLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-black uppercase text-[color:var(--token-heading,#18181b)]">{offer.title || ''}</h3>
              {offer.description && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: offer.description }} />}
              {asList<string>(offer.includes).length > 0 && <p className="mt-3 text-xs text-[color:var(--token-muted,#52525b)]">{asList<string>(offer.includes).join(' / ')}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {offer.cta?.label && <a href={offer.cta.href || '#'} className="font-black uppercase text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]" data-edit-path="label">{offer.cta.label}</a>}
                {offer.detailHref && offer.detailLabel && <a href={offer.detailHref} className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--token-muted,#52525b)]">{offer.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

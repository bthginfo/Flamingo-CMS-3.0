'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type Amenity = { icon?: string; title?: string; text?: string; image?: string; mediaType?: string };

export function AmenitiesSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Ausstattung';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Service';
  const items = asList<Amenity>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, items, ctaPrimary };

  if (styleVariant === 'modern') return <AmenitiesModern {...props} />;
  if (styleVariant === 'bold') return <AmenitiesBold {...props} />;
  return <AmenitiesClassic {...props} />;
}

type Props = {
  headline: string;
  subline: string;
  badgeText: string;
  items: Amenity[];
  ctaPrimary: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function AmenitiesClassic({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && (
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">
            <Star size={12} className="text-[var(--style-badge-bg)]" />{badgeText}
          </motion.p>
        )}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
        {subline && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-4 text-[var(--style-text-secondary)]">{subline}</motion.p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] p-5 shadow-md">
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--style-badge-bg)]/10 text-[var(--style-badge-bg)]"><DynamicIcon name={item.icon || 'star'} size={20} /></div>
            )}
            <h3 className="font-bold text-[var(--style-text-primary)]">{item.title || ''}</h3>
            {item.text && <p className="mt-2 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <motion.a initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-lg">{ctaPrimary.label}<ArrowRight size={16} /></motion.a>}
    </div>
  );
}

/* --- MODERN --- */
function AmenitiesModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="grid gap-px border border-black/10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border border-black/10 bg-[var(--style-card-bg)] p-8">
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-6 aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-6 text-[var(--style-text-secondary)]"><DynamicIcon name={item.icon || 'star'} size={20} /></div>
            )}
            <h3 className="font-light text-lg text-[var(--style-text-primary)]">{item.title || ''}</h3>
            {item.text && <p className="mt-3 text-sm font-light leading-7 text-[var(--style-text-secondary)]">{item.text}</p>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-[var(--style-text-primary)] underline underline-offset-4">{ctaPrimary.label}<ArrowRight size={14} /></a>}
    </div>
  );
}

/* --- BOLD --- */
function AmenitiesBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--style-badge-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--style-badge-text)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] p-5 shadow-[4px_4px_0_var(--style-text-primary)]">
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-4 aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-4 inline-block border-2 border-[var(--style-badge-bg)] p-2 text-[var(--style-badge-bg)]"><DynamicIcon name={item.icon || 'star'} size={22} /></div>
            )}
            <h3 className="font-black uppercase text-[var(--style-text-primary)]">{item.title || ''}</h3>
            {item.text && <p className="mt-2 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[var(--style-text-primary)] bg-[var(--style-text-primary)] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--style-badge-bg)]">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

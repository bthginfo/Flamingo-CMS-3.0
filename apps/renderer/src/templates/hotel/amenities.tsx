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
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]">
            <Star size={12} className="text-[color:var(--token-icon)]" /><span data-edit-path="badgeText">{badgeText}</span>
          </motion.p>
        )}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.article key={`$<span data-edit-path="title">{item.title}</span>-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-xl border border-[var(--token-icon)]/20 bg-[var(--token-card-bg)] p-5 shadow-md" data-edit-collection="items" data-edit-index={index}>
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--token-btn-bg)/10]/10 text-[color:var(--token-icon)]"><DynamicIcon name={item.icon || 'star'} size={20} /></div>
            )}
            <h3 className="font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <motion.a initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-lg"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></motion.a>}
    </div>
  );
}

/* --- MODERN --- */
function AmenitiesModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-px border border-black/10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${index}`} className="border border-black/10 bg-[var(--token-card-bg)] p-8" data-edit-collection="items" data-edit-index={index}>
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-6 aspect-[16/10] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-6 text-[color:var(--token-muted)]"><DynamicIcon name={item.icon || 'star'} size={20} /></div>
            )}
            <h3 className="font-light text-lg text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-3 text-sm font-light leading-7 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-[color:var(--token-heading)] underline underline-offset-4"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={14} /></a>}
    </div>
  );
}

/* --- BOLD --- */
function AmenitiesBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--token-btn-bg)/10] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${index}`} className="border-2 border-[#111827] bg-[var(--token-card-bg)] p-5 shadow-[4px_4px_0_#111827]" data-edit-collection="items" data-edit-index={index}>
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-4 aspect-[16/10] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-4 inline-block border-2 border-[var(--token-icon)] p-2 text-[color:var(--token-icon)]"><DynamicIcon name={item.icon || 'star'} size={22} /></div>
            )}
            <h3 className="font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_var(--token-icon)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a>}
    </div>
  );
}

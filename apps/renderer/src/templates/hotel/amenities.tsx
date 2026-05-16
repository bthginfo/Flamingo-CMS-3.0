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
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600">
            <Star size={12} className="text-brand-primary" />{badgeText}
          </motion.p>
        )}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
        {subline && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-4 text-gray-600">{subline}</motion.p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-5 shadow-md">
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10/10 text-brand-primary"><DynamicIcon name={item.icon || 'star'} size={20} /></div>
            )}
            <h3 className="font-bold text-gray-900">{item.title || ''}</h3>
            {item.text && <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>}
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <motion.a initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 font-semibold text-white shadow-lg">{ctaPrimary.label}<ArrowRight size={16} /></motion.a>}
    </div>
  );
}

/* --- MODERN --- */
function AmenitiesModern({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 font-light text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-px border border-black/10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border border-black/10 bg-white p-8">
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-6 aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-6 text-gray-600"><DynamicIcon name={item.icon || 'star'} size={20} /></div>
            )}
            <h3 className="font-light text-lg text-gray-900">{item.title || ''}</h3>
            {item.text && <p className="mt-3 text-sm font-light leading-7 text-gray-600">{item.text}</p>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-gray-900 underline underline-offset-4">{ctaPrimary.label}<ArrowRight size={14} /></a>}
    </div>
  );
}

/* --- BOLD --- */
function AmenitiesBold({ headline, subline, badgeText, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-2 border-[#111827] bg-white p-5 shadow-[4px_4px_0_#111827]">
            {item.mediaType === 'image' && item.image ? (
              <div className="relative mb-4 aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>
            ) : (
              <div className="mb-4 inline-block border-2 border-[var(--brand-primary)] p-2 text-brand-primary"><DynamicIcon name={item.icon || 'star'} size={22} /></div>
            )}
            <h3 className="font-black uppercase text-gray-900">{item.title || ''}</h3>
            {item.text && <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--brand-primary)]">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

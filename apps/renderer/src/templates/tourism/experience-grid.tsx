'use client';

import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import Image from 'next/image';
import type { SectionProps } from './types';

type Experience = { title?: string; text?: string; image?: string; category?: string; durationLabel?: string; audienceLabel?: string; difficultyLabel?: string; priceLabel?: string; cta?: { label?: string; href?: string } };

export function ExperienceGridSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Erlebnisse & Aktivitaeten', 'Erleben');
  const items = asList<Experience>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  if (styleVariant === 'modern') return <Modern header={header} items={items} ctaPrimary={ctaPrimary} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} ctaPrimary={ctaPrimary} />;
  return <Classic header={header} items={items} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Experience[]; ctaPrimary: { label?: string; href?: string } };

function ExperienceMeta({ item, className }: { item: Experience; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest ${className || 'text-gray-600'}`}>
      {item.durationLabel && <span className="inline-flex items-center gap-1"><Clock size={13} />{item.durationLabel}</span>}
      {item.audienceLabel && <span className="inline-flex items-center gap-1"><Users size={13} />{item.audienceLabel}</span>}
      {item.category && <span>{item.category}</span>}
      {item.difficultyLabel && <span>{item.difficultyLabel}</span>}
      {item.priceLabel && <span>{item.priceLabel}</span>}
    </div>
  );
}

function Classic({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="grid overflow-hidden rounded-xl bg-white shadow-lg sm:grid-cols-[220px_1fr]">
            {item.image && <div className="relative min-h-56"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-green-700" />
              <h3 className="mt-3 text-2xl font-bold text-gray-900">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-gray-600">{item.text}</p>}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white">{item.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="grid overflow-hidden border border-black/10 bg-white sm:grid-cols-[220px_1fr]">
            {item.image && <div className="relative min-h-56"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-teal-600 font-light" />
              <h3 className="mt-3 text-2xl font-light text-gray-900">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm font-light leading-6 text-gray-600">{item.text}</p>}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 font-semibold text-teal-600">{item.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-teal-600 bg-teal-600 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-gray-600">{header.subline}</p>}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="grid overflow-hidden border-2 border-[#111827] bg-white shadow-[4px_4px_0_#111827] sm:grid-cols-[220px_1fr]">
            {item.image && <div className="relative min-h-56"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-orange-500 font-black" />
              <h3 className="mt-3 text-2xl font-black uppercase text-gray-900">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-gray-600">{item.text}</p>}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-2.5 text-sm font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{item.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

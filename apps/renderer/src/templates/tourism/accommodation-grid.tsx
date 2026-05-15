'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Leaf } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Accommodation = { title?: string; text?: string; image?: string; category?: string; typeLabel?: string; priceLabel?: string; amenities?: string[]; cta?: { label?: string; href?: string } };

export function AccommodationGridSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Unterkuenfte', 'Bleiben');
  const items = asList<Accommodation>(data.items);

  if (styleVariant === 'modern') return <Modern header={header} items={items} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} />;
  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Accommodation[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group overflow-hidden rounded-2xl bg-[var(--style-card-bg)] shadow-lg">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-green-700"><Leaf size={12} />{[item.category, item.typeLabel, item.priceLabel].filter(Boolean).join(' / ')}</div>
              <h3 className="mt-2 text-xl font-bold text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
              {item.amenities && item.amenities.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{asList<string>(item.amenities).map((a) => <span key={a} className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-800">{a}</span>)}</div>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Modern({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border border-black/10 bg-[var(--style-card-bg)]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <p className="text-xs font-light uppercase tracking-widest text-teal-600">{[item.category, item.typeLabel, item.priceLabel].filter(Boolean).join(' / ')}</p>
              <h3 className="mt-2 text-xl font-light text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm font-light leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
              {item.amenities && item.amenities.length > 0 && <p className="mt-3 text-xs font-light text-[var(--style-text-secondary)]">{asList<string>(item.amenities).join(' · ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-600">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, items }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-text-primary)] sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-[var(--style-text-secondary)]">{header.subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] shadow-[4px_4px_0_var(--style-text-primary)]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-widest text-orange-500">{[item.category, item.typeLabel, item.priceLabel].filter(Boolean).join(' / ')}</p>
              <h3 className="mt-2 text-xl font-black uppercase text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
              {item.amenities && item.amenities.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{asList<string>(item.amenities).map((a) => <span key={a} className="border border-orange-500 px-2 py-0.5 text-xs font-bold uppercase text-orange-500">{a}</span>)}</div>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-2.5 text-sm font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

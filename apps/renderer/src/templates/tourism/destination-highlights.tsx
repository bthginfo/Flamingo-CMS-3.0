'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Leaf } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Highlight = { title?: string; text?: string; image?: string; category?: string; cta?: { label?: string; href?: string } };

export function DestinationHighlightsSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Highlights der Region', 'Entdecken');
  const items = asList<Highlight>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  if (styleVariant === 'modern') return <Modern header={header} items={items} ctaPrimary={ctaPrimary} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} ctaPrimary={ctaPrimary} />;
  return <Classic header={header} items={items} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Highlight[]; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group overflow-hidden rounded-xl bg-white shadow-lg">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.category && <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-green-700"><Leaf size={12} />{item.category}</div>}
              <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-gray-600">{item.text}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700">{item.cta.label}<ArrowRight size={14} /></a>}
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
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border border-black/10 bg-white">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              {item.category && <p className="text-xs font-light uppercase tracking-widest text-teal-600">{item.category}</p>}
              <h3 className="mt-2 text-xl font-light text-gray-900">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm font-light leading-6 text-gray-600">{item.text}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-600">{item.cta.label}<ArrowRight size={14} /></a>}
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
        <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-gray-600">{header.subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border-2 border-[#111827] bg-white shadow-[4px_4px_0_#111827]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              {item.category && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{item.category}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-gray-900">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-gray-600">{item.text}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase text-orange-500">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

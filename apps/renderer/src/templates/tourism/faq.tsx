'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type FaqItem = { question?: string; answer?: string };

export function TourismFaqSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Haeufige Fragen', 'FAQ');
  const items = asList<FaqItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  if (styleVariant === 'modern') return <Modern header={header} items={items} ctaPrimary={ctaPrimary} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} ctaPrimary={ctaPrimary} />;
  return <Classic header={header} items={items} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: FaqItem[]; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="divide-y divide-black/10 rounded-xl bg-white shadow-lg">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-semibold text-gray-900">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-gray-600">{item.answer}</p>}
          </details>
        ))}
      </motion.div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="divide-y divide-black/10 border border-black/10 bg-white">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-light text-gray-900">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm font-light leading-6 text-gray-600">{item.answer}</p>}
          </details>
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
      <div className="divide-y divide-[#111827] border-2 border-[#111827] bg-white shadow-[4px_4px_0_#111827]">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="p-5">
            <summary className="cursor-pointer font-black uppercase text-gray-900">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-gray-600">{item.answer}</p>}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

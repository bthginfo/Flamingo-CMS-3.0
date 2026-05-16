'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Insurance = { title?: string; text?: string; image?: string; typeLabel?: string; notice?: string; cta?: { label?: string; href?: string } };

export function InsuranceInfoSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Versicherung & Abrechnung', 'Info');
  const items = asList<Insurance>(data.items);

  if (styleVariant === 'modern') return <Modern header={header} items={items} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} />;
  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Insurance[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden rounded-xl bg-white shadow-lg">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.typeLabel && <p className="text-xs font-bold uppercase tracking-widest text-teal-700">{item.typeLabel}</p>}
              <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.notice && <p className="mt-2 whitespace-pre-line text-xs text-gray-600">{item.notice}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function Modern({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border border-black/10 bg-white">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.typeLabel && <p className="text-xs font-light uppercase tracking-widest text-blue-500">{item.typeLabel}</p>}
              <h3 className="mt-2 text-xl font-light text-gray-900">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm font-light leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.notice && <p className="mt-2 whitespace-pre-line text-xs font-light text-gray-600">{item.notice}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white">{item.cta.label}<ArrowRight size={14} /></a>}
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
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border-2 border-[#111827] bg-white shadow-[4px_4px_0_#111827]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.typeLabel && <p className="text-xs font-black uppercase tracking-widest text-teal-500">{item.typeLabel}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-gray-900">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.notice && <p className="mt-2 whitespace-pre-line text-xs text-gray-600">{item.notice}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 border-2 border-teal-400 bg-teal-400 px-4 py-2 text-sm font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.teal.700)]">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

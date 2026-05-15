'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Equipment = { title?: string; text?: string; image?: string; category?: string; benefitLabel?: string; cta?: { label?: string; href?: string } };

export function EquipmentHighlightsSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Ausstattung', 'Praxis');
  const items = asList<Equipment>(data.items);

  if (styleVariant === 'modern') return <Modern header={header} items={items} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} />;
  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Equipment[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden rounded-xl bg-[var(--style-card-bg)] shadow-lg">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {(item.category || item.benefitLabel) && <p className="text-xs font-bold uppercase tracking-widest text-teal-700">{[item.category, item.benefitLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-bold text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
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
          <article key={`${item.title}-${index}`} className="group overflow-hidden border border-black/10 bg-[var(--style-card-bg)]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {(item.category || item.benefitLabel) && <p className="text-xs font-light uppercase tracking-widest text-blue-500">{[item.category, item.benefitLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-light text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-3 whitespace-pre-line text-sm font-light leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white">{item.cta.label}<ArrowRight size={14} /></a>}
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
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-text-primary)] sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-[var(--style-text-secondary)]">{header.subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] shadow-[4px_4px_0_var(--style-text-primary)]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {(item.category || item.benefitLabel) && <p className="text-xs font-black uppercase tracking-widest text-teal-500">{[item.category, item.benefitLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 border-2 border-teal-400 bg-teal-400 px-4 py-2 text-sm font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.teal.700)]">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Service = { title?: string; text?: string; image?: string; icon?: string; category?: string; cta?: { label?: string; href?: string } };

export function ServiceOverviewSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Leistungen', 'Fachbereiche');
  const items = asList<Service>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  if (styleVariant === 'modern') return <Modern header={header} items={items} ctaPrimary={ctaPrimary} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} ctaPrimary={ctaPrimary} />;
  return <Classic header={header} items={items} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Service[]; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden rounded-xl bg-[var(--style-card-bg,#fff)] shadow-lg">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {(item.category || item.icon) && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-badge-text,var(--style-accent-color,var(--brand-primary)))]">{item.category || item.icon}</p>}
              <h3 className="mt-2 text-xl font-bold text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-4 py-2 text-sm font-semibold text-[var(--brand-btn-text,#fff)]">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </motion.div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-semibold text-[var(--brand-btn-text,#fff)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border border-[var(--style-border-color,rgba(0,0,0,.1))] bg-[var(--style-card-bg,#fff)]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {(item.category || item.icon) && <p className="text-xs font-light uppercase tracking-widest text-[var(--style-badge-text,var(--style-accent-color,var(--brand-primary)))]">{item.category || item.icon}</p>}
              <h3 className="mt-2 text-xl font-light text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm font-light leading-6 text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-4 py-2 text-sm font-semibold text-[var(--brand-btn-text,#fff)]">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-semibold text-[var(--brand-btn-text,#fff)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-badge-text,var(--style-accent-color,var(--brand-primary)))]">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-heading-color,var(--style-text-primary,#111827))] sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border-2 border-[var(--style-border-color,var(--style-text-primary,#111827))] bg-[var(--style-card-bg,#fff)] shadow-[4px_4px_0_var(--style-border-color,var(--style-text-primary,#111827))]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {(item.category || item.icon) && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-badge-text,var(--style-accent-color,var(--brand-primary)))]">{item.category || item.icon}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--style-body-color,var(--style-text-secondary,#4b5563))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 border-2 border-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-4 py-2 text-sm font-black uppercase text-[var(--brand-btn-text,#fff)]">{item.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] bg-[var(--brand-btn-bg,var(--style-accent-color,var(--brand-primary)))] px-5 py-3 font-black uppercase text-[var(--brand-btn-text,#fff)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

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
    <div className={`flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest ${className || 'text-[var(--token-muted, var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563))))]'}`}>
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
          <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="grid overflow-hidden rounded-xl bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#fff)))] shadow-lg sm:grid-cols-[220px_1fr]">
            {item.image && <div className="relative min-h-56"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-[var(--token-badge-text, var(--token-badge-text, var(--style-badge-text,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))]" />
              <h3 className="mt-3 text-2xl font-bold text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))]">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[var(--token-body, var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563))))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] px-5 py-2.5 text-sm font-semibold text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#fff)))]">{item.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] px-5 py-3 font-semibold text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#fff)))]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="grid overflow-hidden border border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,rgba(0,0,0,.1))))] bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#fff)))] sm:grid-cols-[220px_1fr]">
            {item.image && <div className="relative min-h-56"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-[var(--token-badge-text, var(--token-badge-text, var(--style-badge-text,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] font-light" />
              <h3 className="mt-3 text-2xl font-light text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))]">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm font-light leading-6 text-[var(--token-body, var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563))))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 font-semibold text-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]">{item.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] px-5 py-3 font-semibold text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#fff)))]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text, var(--token-badge-text, var(--style-badge-text,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))]">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))] sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--token-body, var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563))))] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="grid overflow-hidden border-2 border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827))))] bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#fff)))] shadow-[4px_4px_0_var(--token-card-border, var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827))))] sm:grid-cols-[220px_1fr]">
            {item.image && <div className="relative min-h-56"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <ExperienceMeta item={item} className="text-[var(--token-badge-text, var(--token-badge-text, var(--style-badge-text,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] font-black" />
              <h3 className="mt-3 text-2xl font-black uppercase text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))]">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[var(--token-body, var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563))))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <div className="mt-5"><a href={item.cta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] px-5 py-2.5 text-sm font-black uppercase text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#fff)))]">{item.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] px-5 py-3 font-black uppercase text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#fff)))]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

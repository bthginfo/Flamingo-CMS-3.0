'use client';

import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type EmergencyItem = { title?: string; text?: string; phoneLabel?: string; phoneHref?: string };

export function EmergencyInfoSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Notfallhinweise', 'Akut');
  const introText = (data.introText as string) || '';
  const items = asList<EmergencyItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { header, introText, items, ctaPrimary };
  if (styleVariant === 'modern') return <Modern {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; items: EmergencyItem[]; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, introText, items, ctaPrimary }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-lg sm:p-8">
      <SectionHeader {...header} />
      {introText && <div className="max-w-3xl text-sm leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-[var(--token-card-border)] pt-4" data-edit-collection="items" data-edit-index={index}>
            <AlertCircle size={18} className="text-[var(--token-icon)]" />
            <h3 className="mt-2 font-bold text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-semibold text-[var(--token-heading)]">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      <div className="mt-6"><CtaButton cta={ctaPrimary} /></div>
    </motion.div>
  );
}

function Modern({ header, introText, items, ctaPrimary }: Props) {
  return (
    <div className="border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 sm:p-8">
      <SectionHeader {...header} />
      {introText && <div className="max-w-3xl text-sm font-light leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-[var(--token-card-border)] pt-4" data-edit-collection="items" data-edit-index={index}>
            <AlertCircle size={18} className="text-[var(--token-icon)]" />
            <h3 className="mt-2 font-light text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm font-light leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-semibold text-[var(--token-accent)]">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, introText, items, ctaPrimary }: Props) {
  return (
    <div className="border-2 border-[var(--token-card-border)] bg-[var(--token-section-bg)] p-6 sm:p-8">
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      {introText && <div className="max-w-3xl text-sm leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-[var(--token-card-border)] pt-4" data-edit-collection="items" data-edit-index={index}>
            <AlertCircle size={18} className="text-[var(--token-icon)]" />
            <h3 className="mt-2 font-black uppercase text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-black uppercase text-[var(--token-accent)]">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

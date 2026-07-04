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
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; items: EmergencyItem[]; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, introText, items, ctaPrimary }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-lg sm:p-8">
      <SectionHeader {...header} />
      {introText && <div className="max-w-3xl text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title || 'item'}-${index}`} className="rounded-2xl border border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_76%,var(--token-section-bg-alt,#f8fafc))] p-5 shadow-sm" data-edit-collection="items" data-edit-index={index}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--token-badge-bg)] text-[color:var(--token-icon)]"><AlertCircle size={18} /></div>
            <h3 className="mt-4 font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-4 inline-flex rounded-full bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--token-btn-text)]">{item.phoneLabel}</a>}
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
      {introText && <div className="max-w-3xl text-sm font-light leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title || 'item'}-${index}`} className="rounded-2xl border border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_76%,var(--token-section-bg-alt,#f8fafc))] p-5" data-edit-collection="items" data-edit-index={index}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--token-badge-bg)] text-[color:var(--token-icon)]"><AlertCircle size={18} /></div>
            <h3 className="mt-4 font-medium text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm font-light leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-4 inline-flex rounded-full bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--token-btn-text)]">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-6"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, introText, items, ctaPrimary }: Props) {
  return (
    <div className="border-2 border-[var(--token-card-border)] bg-[var(--token-section-bg)] p-6 sm:p-8">
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      {introText && <div className="max-w-3xl text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title || 'item'}-${index}`} className="rounded-2xl border-2 border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_76%,var(--token-section-bg-alt,#f8fafc))] p-5" data-edit-collection="items" data-edit-index={index}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--token-badge-bg)] text-[color:var(--token-icon)]"><AlertCircle size={18} /></div>
            <h3 className="mt-4 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-4 inline-flex bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-black uppercase text-[color:var(--token-btn-text)]">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-6"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

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
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl border border-[var(--token-card-border, var(--style-border-color,#fecaca))] bg-[var(--token-card-bg, var(--style-card-bg,#fef2f2))] p-6 shadow-lg sm:p-8">
      <SectionHeader {...header} />
      {introText && <div className="max-w-3xl text-sm leading-6 text-[var(--token-body, var(--style-body-color,rgba(127,29,29,.8)))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-[var(--token-card-border, var(--style-border-color,#fecaca))] pt-4">
            <AlertCircle size={18} className="text-[var(--token-icon, var(--style-icon-color,var(--style-accent-color,#b91c1c)))]" />
            <h3 className="mt-2 font-bold text-[var(--token-heading, var(--style-heading-color,#450a0a))]">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm leading-6 text-[var(--token-body, var(--style-body-color,rgba(127,29,29,.75)))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-semibold text-[var(--token-heading, var(--style-heading-color,#450a0a))]">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      <div className="mt-6"><CtaButton cta={ctaPrimary} /></div>
    </motion.div>
  );
}

function Modern({ header, introText, items, ctaPrimary }: Props) {
  return (
    <div className="border border-[var(--token-card-border, var(--style-border-color,#fecaca))] bg-[var(--token-card-bg, var(--style-card-bg,rgba(254,242,242,.5)))] p-6 sm:p-8">
      <SectionHeader {...header} />
      {introText && <div className="max-w-3xl text-sm font-light leading-6 text-[var(--token-body, var(--style-body-color,rgba(127,29,29,.8)))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-[var(--token-card-border, var(--style-border-color,#fecaca))] pt-4">
            <AlertCircle size={18} className="text-[var(--token-icon, var(--style-icon-color,var(--style-accent-color,#dc2626)))]" />
            <h3 className="mt-2 font-light text-[var(--token-heading, var(--style-heading-color,#450a0a))]">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm font-light leading-6 text-[var(--token-body, var(--style-body-color,rgba(127,29,29,.75)))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-semibold text-[var(--style-accent-color,#b91c1c)]">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,#dc2626)))] bg-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,#dc2626)))] px-5 py-3 font-semibold text-[var(--token-btn-text, var(--brand-btn-text,#fff))]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, introText, items, ctaPrimary }: Props) {
  return (
    <div className="border-2 border-[var(--token-card-border, var(--style-border-color,var(--style-accent-color,#ef4444)))] bg-[var(--token-section-bg, var(--style-section-bg,#030712))] p-6 sm:p-8">
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text, var(--style-badge-text,var(--style-accent-color,#f87171)))]">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading, var(--style-heading-color,#fff))] sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--token-body, var(--style-body-color,rgba(255,255,255,.7)))] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      {introText && <div className="max-w-3xl text-sm leading-6 text-[var(--token-body, var(--style-body-color,rgba(255,255,255,.7)))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-[var(--token-card-border, var(--style-border-color,color-mix(in_srgb,var(--style-accent-color,#ef4444)_40%,transparent)))] pt-4">
            <AlertCircle size={18} className="text-[var(--token-icon, var(--style-icon-color,var(--style-accent-color,#f87171)))]" />
            <h3 className="mt-2 font-black uppercase text-[var(--token-heading, var(--style-heading-color,#fff))]">{item.title || ''}</h3>
            {item.text && <div className="mt-2 text-sm leading-6 text-[var(--token-body, var(--style-body-color,rgba(255,255,255,.7)))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-black uppercase text-[var(--style-accent-color,#f87171)]">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,#ef4444)))] bg-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,#ef4444)))] px-5 py-3 font-black uppercase text-[var(--token-btn-text, var(--brand-btn-text,#fff))]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

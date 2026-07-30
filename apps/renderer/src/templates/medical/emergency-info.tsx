'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
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
          <article key={`${item.title || 'item'}-${index}`} className="rounded-2xl border border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_76%,var(--token-section-bg-alt,#f8fafc))] p-5 shadow-sm" data-card data-edit-collection="items" data-edit-index={index}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)]"><AlertCircle size={18} /></div>
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


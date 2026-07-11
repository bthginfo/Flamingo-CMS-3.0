'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { asList, type SectionProps } from './types';

type Transformation = { title?: string; text?: string; beforeImage?: string; afterImage?: string; category?: string; caption?: string; cta?: { label?: string; href?: string } };

export function BeforeAfterSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Vorher & Nachher';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Transformation';
  const items = asList<Transformation>(data.items);

  const props = { headline, subline, badgeText, items };

  return <BeforeAfterClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; items: Transformation[] };

function BeforeAfterClassic({ headline, subline, badgeText, items }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <motion.article key={`${item.title || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md" data-edit-collection="items" data-edit-index={i}>
            <div className="grid grid-cols-2">
              {item.beforeImage && <div className="relative aspect-square"><Image data-edit-image="beforeImage" src={item.beforeImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              {item.afterImage && <div className="relative aspect-square"><Image data-edit-image="afterImage" src={item.afterImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
            </div>
            <div className="p-5">
              {item.category && <span className="inline-block rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold uppercase text-[color:var(--token-badge-text)]" data-edit-path="category">{item.category}</span>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.caption && <p className="mt-2 text-xs text-[color:var(--token-muted)]" data-edit-path="caption">{item.caption}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-2 text-sm font-semibold text-[color:var(--token-btn-text)]" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}


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

  if (styleVariant === 'modern') return <BeforeAfterModern {...props} />;
  if (styleVariant === 'bold') return <BeforeAfterBold {...props} />;
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
          <motion.article key={`$<span data-edit-path="title">{item.title}</span>-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md" data-edit-collection="items" data-edit-index={i}>
            <div className="grid grid-cols-2">
              {item.beforeImage && <div className="relative aspect-square"><Image data-edit-image="beforeImage" src={item.beforeImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              {item.afterImage && <div className="relative aspect-square"><Image data-edit-image="afterImage" src={item.afterImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
            </div>
            <div className="p-5">
              {item.category && <span className="inline-block rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold uppercase text-[color:var(--token-eyebrow)]" data-edit-path="category">{item.category}</span>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.caption && <p className="mt-2 text-xs text-[color:var(--token-muted)]" data-edit-path="caption">{item.caption}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-2 text-sm font-semibold text-[color:var(--token-on-dark-heading)]" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function BeforeAfterModern({ headline, subline, badgeText, items }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((item, i) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${i}`} className="border-b border-black/10 pb-8" data-edit-collection="items" data-edit-index={i}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {item.beforeImage && <div className="relative aspect-square"><Image data-edit-image="beforeImage" src={item.beforeImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              {item.afterImage && <div className="relative aspect-square"><Image data-edit-image="afterImage" src={item.afterImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
            </div>
            <div className="mt-5">
              {item.category && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="category">{item.category}</p>}
              <h3 className="mt-2 text-xl font-light text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex border-b border-[var(--token-card-border)] pb-1 text-sm font-light text-[color:var(--token-heading)]" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function BeforeAfterBold({ headline, subline, badgeText, items }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${i}`} className="overflow-hidden border-2 border-[var(--token-card-border)] bg-[#111] shadow-[4px_4px_0_var(--token-eyebrow)]" data-edit-collection="items" data-edit-index={i}>
            <div className="grid grid-cols-2">
              {item.beforeImage && <div className="relative aspect-square"><Image data-edit-image="beforeImage" src={item.beforeImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              {item.afterImage && <div className="relative aspect-square"><Image data-edit-image="afterImage" src={item.afterImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
            </div>
            <div className="p-5">
              {item.category && <span className="inline-block bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-black uppercase text-[color:var(--token-on-dark-heading)]" data-edit-path="category">{item.category}</span>}
              <h3 className="mt-2 text-xl font-black uppercase text-[color:var(--token-on-dark-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex bg-[var(--token-badge-bg)] px-5 py-2 text-sm font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

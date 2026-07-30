'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type PackageItem = { title?: string; text?: string; image?: string; priceLabel?: string; validUntilLabel?: string; includes?: string[]; cta?: { label?: string; href?: string } };

export function PackagesSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Pakete & Specials';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Specials';
  const packages = asList<PackageItem>(data.packages);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, packages, ctaPrimary };

  return <PackagesClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; packages: PackageItem[]; ctaPrimary: ButtonValue };

function PackagesClassic({ headline, subline, badgeText, packages, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((item, i) => (
          <motion.article key={`${item.title || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md" data-card data-edit-collection="packages" data-edit-index={i}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {(item.priceLabel || item.validUntilLabel) && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]">{[item.priceLabel, item.validUntilLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {asList<string>(item.includes).length > 0 && <p className="mt-2 text-sm text-[color:var(--token-muted)]">{asList<string>(item.includes).join(' / ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-2 text-sm font-semibold text-[color:var(--token-btn-text)] shadow-md" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}


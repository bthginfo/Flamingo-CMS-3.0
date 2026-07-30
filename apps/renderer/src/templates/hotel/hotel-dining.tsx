'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type Menu = { title?: string; description?: string; timeLabel?: string; priceLabel?: string; cta?: { label?: string; href?: string } };
type Highlight = { title?: string; text?: string; image?: string };

export function HotelDiningSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Restaurant & Bar';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Genuss';
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const openingText = (data.openingText as string) || '';
  const menus = asList<Menu>(data.menus);
  const highlights = asList<Highlight>(data.highlights);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, introText, image, openingText, menus, highlights, ctaPrimary };

  return <DiningClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string; introText: string;
  image: string; openingText: string; menus: Menu[]; highlights: Highlight[];
  ctaPrimary: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function DiningClassic({ headline, subline, badgeText, introText, image, openingText, menus, highlights, ctaPrimary }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]"><Star size={12} className="text-[color:var(--token-rating-star)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted)] leading-7 rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        {openingText && <p className="mt-4 text-sm font-semibold text-[color:var(--token-heading)]">{openingText}</p>}
        <div className="mt-6 grid gap-4">
          {menus.map((menu, index) => (
            <motion.article key={`${menu.title || 'item'}-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="border-t border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] pt-4" data-edit-collection="menus" data-edit-index={index}>
              <div className="flex justify-between gap-4"><h3 className="font-bold text-[color:var(--token-heading)]" data-edit-path="title">{menu.title || ''}</h3><span className="text-sm text-[color:var(--token-price)]" data-edit-path="priceLabel">{menu.priceLabel || ''}</span></div>
              {menu.description && <div className="mt-2 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: menu.description }} />}
              {menu.timeLabel && <p className="mt-2 text-xs text-[color:var(--token-muted)]">{menu.timeLabel}</p>}
              {menu.cta?.label && <a href={menu.cta.href || '#'} className="mt-3 inline-flex font-semibold text-[color:var(--token-link)] hover:text-[color:var(--token-link-hover)]" data-edit-path="label">{menu.cta.label}</a>}
            </motion.article>
          ))}
        </div>
        {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-lg"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-4">
        {image && <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-md"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item, index) => (
            <motion.article key={`${item.title || 'item'}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-4 shadow-md" data-card data-edit-collection="highlights" data-edit-index={index}>
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-2 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}


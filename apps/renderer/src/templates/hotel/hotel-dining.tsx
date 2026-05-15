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

  if (styleVariant === 'modern') return <DiningModern {...props} />;
  if (styleVariant === 'bold') return <DiningBold {...props} />;
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
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]"><Star size={12} className="text-[var(--style-badge-bg)]" />{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
          {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {introText && <p className="text-[var(--style-text-secondary)] leading-7">{introText}</p>}
        {openingText && <p className="mt-4 text-sm font-semibold text-[var(--style-text-primary)]">{openingText}</p>}
        <div className="mt-6 grid gap-4">
          {menus.map((menu, index) => (
            <motion.article key={`${menu.title}-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="border-t border-[var(--style-badge-bg)]/20 pt-4">
              <div className="flex justify-between gap-4"><h3 className="font-bold text-[var(--style-text-primary)]">{menu.title || ''}</h3><span className="text-sm text-[var(--style-text-secondary)]">{menu.priceLabel || ''}</span></div>
              {menu.description && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{menu.description}</p>}
              {menu.timeLabel && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{menu.timeLabel}</p>}
              {menu.cta?.label && <a href={menu.cta.href || '#'} className="mt-3 inline-flex font-semibold text-[var(--style-badge-bg)]">{menu.cta.label}</a>}
            </motion.article>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-lg">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-4">
        {image && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item, index) => (
            <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-2xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] p-4 shadow-md">
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-semibold text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{item.text}</p>}
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- MODERN --- */
function DiningModern({ headline, subline, badgeText, introText, image, openingText, menus, highlights, ctaPrimary }: Props) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <div className="mb-8 max-w-3xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {introText && <p className="font-light text-[var(--style-text-secondary)] leading-7">{introText}</p>}
        {openingText && <p className="mt-4 text-sm font-light text-[var(--style-text-primary)]">{openingText}</p>}
        <div className="mt-8 grid gap-4">
          {menus.map((menu, index) => (
            <article key={`${menu.title}-${index}`} className="border-t border-black/10 pt-4">
              <div className="flex justify-between gap-4"><h3 className="font-light text-[var(--style-text-primary)]">{menu.title || ''}</h3><span className="text-sm font-light text-[var(--style-text-secondary)]">{menu.priceLabel || ''}</span></div>
              {menu.description && <p className="mt-2 text-sm font-light text-[var(--style-text-secondary)]">{menu.description}</p>}
              {menu.timeLabel && <p className="mt-2 text-xs font-light text-[var(--style-text-secondary)]">{menu.timeLabel}</p>}
              {menu.cta?.label && <a href={menu.cta.href || '#'} className="mt-3 inline-flex font-light text-[var(--style-text-primary)] underline underline-offset-4">{menu.cta.label}</a>}
            </article>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-[var(--style-text-primary)] underline underline-offset-4">{ctaPrimary.label}<ArrowRight size={14} /></a>}
      </div>
      <div className="space-y-4">
        {image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        <div className="grid gap-px border border-black/10 sm:grid-cols-2">
          {highlights.map((item, index) => (
            <article key={`${item.title}-${index}`} className="border border-black/10 bg-[var(--style-card-bg)] p-5">
              {item.image && <div className="relative mb-4 aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-light text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-2 text-sm font-light text-[var(--style-text-secondary)]">{item.text}</p>}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- BOLD --- */
function DiningBold({ headline, subline, badgeText, introText, image, openingText, menus, highlights, ctaPrimary }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <p className="inline-block bg-[var(--style-badge-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--style-badge-text)]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {introText && <p className="text-[var(--style-text-secondary)] leading-7">{introText}</p>}
        {openingText && <p className="mt-4 text-sm font-black uppercase text-[var(--style-text-primary)]">{openingText}</p>}
        <div className="mt-6 grid gap-4">
          {menus.map((menu, index) => (
            <article key={`${menu.title}-${index}`} className="border-t-2 border-[var(--style-text-primary)] pt-4">
              <div className="flex justify-between gap-4"><h3 className="font-black uppercase text-[var(--style-text-primary)]">{menu.title || ''}</h3><span className="text-sm font-bold text-[var(--style-text-secondary)]">{menu.priceLabel || ''}</span></div>
              {menu.description && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{menu.description}</p>}
              {menu.timeLabel && <p className="mt-2 text-xs font-bold text-[var(--style-text-secondary)]">{menu.timeLabel}</p>}
              {menu.cta?.label && <a href={menu.cta.href || '#'} className="mt-3 inline-flex font-black uppercase text-[var(--style-badge-bg)]">{menu.cta.label}</a>}
            </article>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[var(--style-text-primary)] bg-[var(--style-text-primary)] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--style-badge-bg)]">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-4">
        {image && <div className="relative aspect-[4/3] overflow-hidden border-2 border-[var(--style-text-primary)] shadow-[4px_4px_0_var(--style-text-primary)]"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item, index) => (
            <article key={`${item.title}-${index}`} className="border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] p-4 shadow-[4px_4px_0_var(--style-text-primary)]">
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-black uppercase text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{item.text}</p>}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

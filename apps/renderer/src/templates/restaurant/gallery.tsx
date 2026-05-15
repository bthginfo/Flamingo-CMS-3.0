'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function RestaurantGallerySection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Galerie';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Einblicke';
  const images = asList<GalleryImage>(data.images);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, images, ctaPrimary };

  if (styleVariant === 'modern') return <GalleryModern {...props} />;
  if (styleVariant === 'bold') return <GalleryBold {...props} />;
  return <GalleryClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; images: GalleryImage[]; ctaPrimary: ButtonValue };

function GalleryClassic({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block rounded-full bg-[var(--style-accent)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
        {subline && <p className="mt-4 text-[var(--style-text-muted)]">{subline}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <motion.figure key={`${img.src}-${i}`} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group overflow-hidden rounded-2xl border border-black/10 bg-[var(--style-card-bg)] shadow-md">
            {img.src && <div className="relative aspect-[4/3]"><Image src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <figcaption className="p-4">
              {img.category && <p className="text-xs uppercase tracking-widest text-[var(--style-accent)]">{img.category}</p>}
              {img.caption && <p className="mt-1 text-sm text-[var(--style-text-primary)]">{img.caption}</p>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--style-brand)] px-6 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

function GalleryModern({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[var(--style-text-muted)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-[var(--style-accent)]" />
        {subline && <p className="mt-6 font-light text-[var(--style-text-muted)]">{subline}</p>}
      </div>
      <div className="grid gap-px border border-black/5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <figure key={`${img.src}-${i}`} className="group overflow-hidden border border-black/5 bg-[var(--style-card-bg)]">
            {img.src && <div className="relative aspect-[4/3]"><Image src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <figcaption className="p-5">
              {img.category && <p className="text-xs font-light uppercase tracking-[0.2em] text-[var(--style-text-muted)]">{img.category}</p>}
              {img.caption && <p className="mt-1 text-sm font-light text-[var(--style-text-primary)]">{img.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 border-b-2 border-[var(--style-text-primary)] pb-1 font-medium text-[var(--style-text-primary)]">{ctaPrimary.label}<ArrowRight size={14} /></a>}
    </div>
  );
}

function GalleryBold({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div className="bg-[var(--style-text-primary)] p-6 text-white sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--style-accent)] px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--style-text-primary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase">{headline}</h2>
        <div className="mt-2 h-1.5 w-20 bg-[var(--style-accent)]" />
        {subline && <p className="mt-4 text-white/70">{subline}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <figure key={`${img.src}-${i}`} className="group overflow-hidden border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.15)]">
            {img.src && <div className="relative aspect-[4/3]"><Image src={img.src} alt={img.alt || ''} fill className="object-cover" sizes="33vw" /></div>}
            <figcaption className="p-4">
              {img.category && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-accent)]">{img.category}</p>}
              {img.caption && <p className="mt-1 text-sm font-bold">{img.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-white bg-white px-6 py-3 font-black uppercase text-[var(--style-text-primary)] shadow-[4px_4px_0_rgba(255,255,255,0.3)]">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

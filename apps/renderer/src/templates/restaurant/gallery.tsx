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

  return <GalleryClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; images: GalleryImage[]; ctaPrimary: ButtonValue };

function GalleryClassic({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <motion.figure key={`${img.src}-${i}`} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group overflow-hidden rounded-xl border border-black/10 bg-[var(--token-card-bg)] shadow-md" data-card data-edit-collection="images" data-edit-index={i}>
            {img.src && <div className="relative aspect-[4/3]"><Image data-edit-image="src" src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <figcaption className="p-4">
              {img.category && <p className="text-xs uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="category">{img.category}</p>}
              {img.caption && <p className="mt-1 text-sm text-[color:var(--token-heading)]" data-edit-path="caption">{img.caption}</p>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a>}
    </div>
  );
}


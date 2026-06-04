'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function HotelGallerySection({ data, styleVariant }: SectionProps) {
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

type Props = {
  headline: string; subline: string; badgeText: string;
  images: GalleryImage[]; ctaPrimary: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function GalleryClassic({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]"><Star size={12} className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" />{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <motion.figure key={`${image.src}-${index}`} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="group overflow-hidden rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] shadow-md">
            {image.src && <div className="relative aspect-[4/3]"><Image src={image.src} alt={image.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <figcaption className="p-4">
              {image.category && <p className="text-xs uppercase tracking-widest text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">{image.category}</p>}
              {image.caption && <p className="mt-1 text-sm text-[color:var(--token-heading,#18181b)]">{image.caption}</p>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-lg">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

/* --- MODERN --- */
function GalleryModern({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-px border border-black/10 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="group overflow-hidden border border-black/10 bg-[var(--token-card-bg,#ffffff)]">
            {image.src && <div className="relative aspect-[4/3]"><Image src={image.src} alt={image.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <figcaption className="p-5">
              {image.category && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{image.category}</p>}
              {image.caption && <p className="mt-1 text-sm font-light text-[color:var(--token-heading,#18181b)]">{image.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-[color:var(--token-heading,#18181b)] underline underline-offset-4">{ctaPrimary.label}<ArrowRight size={14} /></a>}
    </div>
  );
}

/* --- BOLD --- */
function GalleryBold({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading,#18181b)]">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="group overflow-hidden border-2 border-[#111827] bg-[var(--token-card-bg,#ffffff)] shadow-[4px_4px_0_#111827]">
            {image.src && <div className="relative aspect-[4/3]"><Image src={image.src} alt={image.alt || ''} fill className="object-cover" sizes="33vw" /></div>}
            <figcaption className="p-4">
              {image.category && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">{image.category}</p>}
              {image.caption && <p className="mt-1 text-sm font-bold text-[color:var(--token-heading,#18181b)]">{image.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_var(--token-icon, var(--brand-primary))]">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

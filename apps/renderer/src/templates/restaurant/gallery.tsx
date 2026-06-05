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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block rounded-full bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))/10] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <motion.figure key={`${img.src}-${i}`} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group overflow-hidden rounded-xl border border-black/10 bg-[var(--token-card-bg,#ffffff)] shadow-md" data-edit-collection="images" data-edit-index={i}>
            {img.src && <div className="relative aspect-[4/3]"><Image src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <figcaption className="p-4">
              {img.category && <p className="text-xs uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{img.category}</p>}
              {img.caption && <p className="mt-1 text-sm text-[color:var(--token-heading,#18181b)]" data-edit-path="caption">{img.caption}</p>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] px-6 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-md">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

function GalleryModern({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[color:var(--token-muted,#71717a)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))]" />
        {subline && <div className="mt-6 font-light text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-px border border-black/5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <figure key={`${img.src}-${i}`} className="group overflow-hidden border border-black/5 bg-[var(--token-card-bg,#ffffff)]" data-edit-collection="images" data-edit-index={i}>
            {img.src && <div className="relative aspect-[4/3]"><Image src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <figcaption className="p-5">
              {img.category && <p className="text-xs font-light uppercase tracking-[0.2em] text-[color:var(--token-muted,#71717a)]">{img.category}</p>}
              {img.caption && <p className="mt-1 text-sm font-light text-[color:var(--token-heading,#18181b)]" data-edit-path="caption">{img.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 border-b-2 border-[#111827] pb-1 font-medium text-[color:var(--token-heading,#18181b)]">{ctaPrimary.label}<ArrowRight size={14} /></a>}
    </div>
  );
}

function GalleryBold({ headline, subline, badgeText, images, ctaPrimary }: Props) {
  return (
    <div className="bg-[#111827] p-6 text-[color:var(--token-on-dark-heading,#ffffff)] sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-3 py-1 text-xs font-black uppercase tracking-widest text-[color:var(--token-heading,#18181b)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase" data-edit-path="headline">{headline}</h2>
        <div className="mt-2 h-1.5 w-20 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))]" />
        {subline && <div className="mt-4 text-[color:var(--token-on-dark-heading,#ffffff)/70] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <figure key={`${img.src}-${i}`} className="group overflow-hidden border-2 border-[color:var(--token-card-border,#ffffff)/20] shadow-[4px_4px_0_rgba(255,255,255,0.15)]" data-edit-collection="images" data-edit-index={i}>
            {img.src && <div className="relative aspect-[4/3]"><Image src={img.src} alt={img.alt || ''} fill className="object-cover" sizes="33vw" /></div>}
            <figcaption className="p-4">
              {img.category && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{img.category}</p>}
              {img.caption && <p className="mt-1 text-sm font-bold" data-edit-path="caption">{img.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[color:var(--token-card-border,#ffffff)] bg-[var(--token-card-bg,#ffffff)] px-6 py-3 font-black uppercase text-[color:var(--token-heading,#18181b)] shadow-[4px_4px_0_rgba(255,255,255,0.3)]">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

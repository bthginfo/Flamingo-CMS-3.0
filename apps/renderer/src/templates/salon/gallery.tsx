'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { asList, type SectionProps } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function SalonGallerySection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Galerie';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Einblicke';
  const images = asList<GalleryImage>(data.images);

  const props = { headline, subline, badgeText, images };

  if (styleVariant === 'modern') return <GalleryModern {...props} />;
  if (styleVariant === 'bold') return <GalleryBold {...props} />;
  return <GalleryClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; images: GalleryImage[] };

function GalleryClassic({ headline, subline, badgeText, images }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <motion.article key={`${img.src}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group overflow-hidden rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] shadow-md">
            {img.src && <div className="relative aspect-[4/3] overflow-hidden"><Image src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-4">
              {img.category && <span className="inline-block rounded-full bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] px-3 py-1 text-xs font-bold uppercase text-[var(--token-eyebrow, var(--brand-accent))]">{img.category}</span>}
              {(img.caption || img.alt) && <p className="mt-2 text-sm text-[color:var(--token-heading,#18181b)]">{img.caption || img.alt}</p>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function GalleryModern({ headline, subline, badgeText, images }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <article key={`${img.src}-${i}`} className="group">
            {img.src && <div className="relative aspect-[4/3] overflow-hidden"><Image src={img.src} alt={img.alt || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="mt-3">
              {img.category && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{img.category}</p>}
              {(img.caption || img.alt) && <p className="mt-1 text-sm font-light text-[color:var(--token-heading,#18181b)]">{img.caption || img.alt}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function GalleryBold({ headline, subline, badgeText, images }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <article key={`${img.src}-${i}`} className="group overflow-hidden border-2 border-[#111827] bg-[#111] shadow-[4px_4px_0_var(--token-eyebrow, var(--brand-accent))]">
            {img.src && <div className="relative aspect-[4/3] overflow-hidden"><Image src={img.src} alt={img.alt || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-4">
              {img.category && <span className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-3 py-1 text-xs font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)]">{img.category}</span>}
              {(img.caption || img.alt) && <p className="mt-2 text-sm font-bold uppercase text-[color:var(--token-on-dark-heading,#ffffff)]">{img.caption || img.alt}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

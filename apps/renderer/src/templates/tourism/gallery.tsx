'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function TourismGallerySection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Galerie', 'Einblicke');
  const images = asList<GalleryImage>(data.images);

  if (styleVariant === 'modern') return <Modern header={header} images={images} />;
  if (styleVariant === 'bold') return <Bold header={header} images={images} />;
  return <Classic header={header} images={images} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; images: GalleryImage[] };

function Classic({ header, images }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <motion.article key={`${image.src}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-edit-collection="images" data-edit-index={index}>
            {image.src && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="src" src={image.src} alt={image.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-4">
              {image.category && <p className="text-xs font-bold uppercase tracking-widest text-green-700" data-edit-path="category">{image.category}</p>}
              {(image.caption || image.alt) && <h3 className="mt-1 font-bold text-[color:var(--token-heading)]" data-edit-path="caption">{image.caption || image.alt}</h3>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Modern({ header, images }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <article key={`${image.src}-${index}`} className="group overflow-hidden border border-black/10 bg-[var(--token-card-bg)]" data-edit-collection="images" data-edit-index={index}>
            {image.src && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="src" src={image.src} alt={image.alt || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-4">
              {image.category && <p className="text-xs font-light uppercase tracking-widest text-teal-600" data-edit-path="category">{image.category}</p>}
              {(image.caption || image.alt) && <h3 className="mt-1 font-light text-[color:var(--token-heading)]" data-edit-path="caption">{image.caption || image.alt}</h3>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, images }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <article key={`${image.src}-${index}`} className="group overflow-hidden border-2 border-[#111827] bg-[var(--token-card-bg)] shadow-[4px_4px_0_#111827]" data-edit-collection="images" data-edit-index={index}>
            {image.src && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="src" src={image.src} alt={image.alt || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-4">
              {image.category && <p className="text-xs font-black uppercase tracking-widest text-orange-500" data-edit-path="category">{image.category}</p>}
              {(image.caption || image.alt) && <h3 className="mt-1 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="caption">{image.caption || image.alt}</h3>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

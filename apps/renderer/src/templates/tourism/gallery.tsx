'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function TourismGallerySection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Galerie', 'Einblicke');
  const images = asList<GalleryImage>(data.images);

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
              {image.category && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-success)]" data-edit-path="category">{image.category}</p>}
              {(image.caption || image.alt) && <h3 className="mt-1 font-bold text-[color:var(--token-heading)]" data-edit-path="caption">{image.caption || image.alt}</h3>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}


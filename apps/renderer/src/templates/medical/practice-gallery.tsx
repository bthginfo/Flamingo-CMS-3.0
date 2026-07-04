'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function PracticeGallerySection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Praxisbilder', 'Einblicke');
  const images = asList<GalleryImage>(data.images);

  return <Classic header={header} images={images} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; images: GalleryImage[] };

function Classic({ header, images }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, index) => (
          <article key={`${img.src}-${index}`} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-edit-collection="images" data-edit-index={index}>
            {img.src && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="src" src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-4">
              {img.category && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-success)]" data-edit-path="category">{img.category}</p>}
              {(img.caption || img.alt) && <h3 className="mt-1 font-semibold text-[color:var(--token-heading)]" data-edit-path="caption">{img.caption || img.alt}</h3>}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}


'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function PracticeGallerySection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Praxisbilder', 'Einblicke');
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
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, index) => (
          <article key={`${img.src}-${index}`} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg,#ffffff)] shadow-lg">
            {img.src && <div className="relative aspect-[4/3] overflow-hidden"><Image src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-4">
              {img.category && <p className="text-xs font-bold uppercase tracking-widest text-teal-700">{img.category}</p>}
              {(img.caption || img.alt) && <h3 className="mt-1 font-semibold text-[color:var(--token-heading,#18181b)]">{img.caption || img.alt}</h3>}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function Modern({ header, images }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, index) => (
          <article key={`${img.src}-${index}`} className="group overflow-hidden border border-black/10 bg-[var(--token-card-bg,#ffffff)]">
            {img.src && <div className="relative aspect-[4/3] overflow-hidden"><Image src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-4">
              {img.category && <p className="text-xs font-light uppercase tracking-widest text-blue-500">{img.category}</p>}
              {(img.caption || img.alt) && <h3 className="mt-1 font-light text-[color:var(--token-heading,#18181b)]">{img.caption || img.alt}</h3>}
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
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading,#18181b)] sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, index) => (
          <article key={`${img.src}-${index}`} className="group overflow-hidden border-2 border-[#111827] bg-[var(--token-card-bg,#ffffff)] shadow-[4px_4px_0_#111827]">
            {img.src && <div className="relative aspect-[4/3] overflow-hidden"><Image src={img.src} alt={img.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-4">
              {img.category && <p className="text-xs font-black uppercase tracking-widest text-teal-500">{img.category}</p>}
              {(img.caption || img.alt) && <h3 className="mt-1 font-black uppercase text-[color:var(--token-heading,#18181b)]">{img.caption || img.alt}</h3>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

type GalleryImage = { src: string; caption?: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function AtmosphereGallerySection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const images = (data.images as GalleryImage[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-[var(--token-section-bg)] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {headline && (
          <motion.h2 initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-12 text-center text-3xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">
            {headline}
          </motion.h2>
        )}

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.08 }}
              className="relative break-inside-avoid rounded-lg overflow-hidden group"
             data-edit-collection="images" data-edit-index={i}>
              <Image data-edit-image="src"
                src={img.src}
                alt={img.caption || ''}
                width={600}
                height={i % 3 === 0 ? 800 : 500}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {img.caption && (
                <div className="absolute inset-0 flex items-end bg-[var(--token-image-overlay,rgba(0,0,0,0.5))] p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-medium text-[color:var(--token-on-dark-heading)]" data-edit-path="caption">{img.caption}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

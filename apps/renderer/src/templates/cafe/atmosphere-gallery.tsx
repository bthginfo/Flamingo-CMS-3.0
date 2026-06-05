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
    <section ref={ref} className="py-20 md:py-28 bg-stone-900">
      <div className="max-w-7xl mx-auto px-6">
        {headline && (
          <motion.h2 initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-3xl font-bold text-white text-center mb-12" data-edit-path="headline">
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
              <Image
                src={img.src}
                alt={img.caption || ''}
                width={600}
                height={i % 3 === 0 ? 800 : 500}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {img.caption && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-medium" data-edit-path="caption">{img.caption}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

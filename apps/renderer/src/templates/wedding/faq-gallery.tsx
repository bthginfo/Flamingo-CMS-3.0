'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaqAccordion } from '@/templates/shared/faq-accordion';
import { PremiumSectionHeader } from '@/templates/shared/section-primitives';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingFaqSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'FAQ';
  const headline = (data.headline as string) || 'Häufige Fragen';
  const items = (data.items as Array<{ question: string; answer: string }>) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <PremiumSectionHeader eyebrow={badge} headline={headline} eyebrowPath="badge" align="center" />
      <FaqAccordion items={items} variant="cards" />
    </div>
  );
}

export function WeddingGallerySection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Galerie';
  const headline = (data.headline as string) || 'Momente';
  const images = (data.images as Array<{ src: string; alt?: string }>) || [];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        </div>
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative break-inside-avoid rounded-xl overflow-hidden" data-edit-collection="images" data-edit-index={i}>
              <Image data-edit-image="src" src={img.src} alt={img.alt || ''} width={600} height={800} className="w-full h-auto object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

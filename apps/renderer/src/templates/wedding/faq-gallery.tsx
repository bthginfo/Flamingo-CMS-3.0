'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

type FaqItem = { question: string; answer: string };
type GalleryImage = { src: string; alt?: string };

export function WeddingFaqSection({ data }: Props) {
  const headline = (data.headline as string) || 'Häufige Fragen';
  const items = (data.items as FaqItem[]) || [];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-serif text-center mb-10">{headline}</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.details
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="border rounded-xl p-5 group"
          >
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
              {item.question}
              <span className="text-rose-400 group-open:rotate-45 transition-transform text-xl">+</span>
            </summary>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.answer}</p>
          </motion.details>
        ))}
      </div>
    </div>
  );
}

export function WeddingGallerySection({ data }: Props) {
  const headline = (data.headline as string) || 'Galerie';
  const images = (data.images as GalleryImage[]) || [];

  return (
    <div>
      {headline && <h2 className="text-3xl md:text-4xl font-serif text-center mb-10">{headline}</h2>}
      <div className="columns-2 sm:columns-3 gap-3 space-y-3">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="break-inside-avoid rounded-xl overflow-hidden"
          >
            <Image src={img.src} alt={img.alt || ''} width={600} height={400} className="w-full h-auto object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

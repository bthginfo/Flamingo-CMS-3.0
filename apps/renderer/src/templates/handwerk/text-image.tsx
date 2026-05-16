'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TextImageSection({ data, variant }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || '';
  const image = (data.image as string) || '';
  const imageAlt = (data.imageAlt as string) || headline;
  const layout = (data.layout as string) || 'image-right';
  const items = (data.items as Array<{ icon?: string; title: string; text: string }>) || [];

  const imageLeft = layout === 'image-left';

  return (
    <section className="py-20 px-6 bg-white">
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-8 lg:gap-16 items-center ${imageLeft ? '' : 'md:[&>*:first-child]:order-2'}`}>
        {image && (
          <motion.div initial={{ opacity: 0, x: imageLeft ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <Image src={image} alt={imageAlt} fill className="object-cover" />
          </motion.div>
        )}
        <div className={!image ? 'md:col-span-2 max-w-3xl mx-auto' : ''}>
          {badge && <span className="section-badge">{badge}</span>}
          {headline && <h2 className="section-headline">{headline}</h2>}
          {text && <p className="text-gray-600 text-lg leading-relaxed mt-4">{text}</p>}
          {items.length > 0 && (
            <ul className="mt-6 space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-brand-primary shrink-0" />
                  <div>
                    <span className="font-medium text-gray-900">{item.title}</span>
                    {item.text && <span className="text-gray-600"> – {item.text}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

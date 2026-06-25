'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { plain } from '@/lib/strip-html';

type SoldProperty = {
  title: string;
  image: string;
  location: string;
  soldIn?: string;
  price?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ReferencesSoldSection({ data }: Props) {
  const headline = (data.headline as string) || 'Erfolgreich vermittelt';
  const subline = (data.subline as string) || '';
  const properties = (data.properties as SoldProperty[]) || [];
  const totalSold = (data.totalSold as string) || '';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-lg text-[color:var(--token-muted)] mt-4" data-edit-path="subline">{plain(subline)}</p>}
          {totalSold && <p className="text-sm text-[color:var(--token-icon)] font-semibold mt-2">{totalSold}</p>}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((prop, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08 }}
              className="relative group rounded-xl overflow-hidden aspect-[3/4]"
             data-edit-collection="properties" data-edit-index={i}>
              <Image data-edit-image="image" src={prop.image} alt={prop.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              {/* Sold overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-[var(--token-badge-bg)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--token-badge-text)] shadow-sm backdrop-blur">
                Verkauft
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-[color:var(--token-on-dark-heading)] font-semibold text-sm" data-edit-path="title">{prop.title}</h3>
                <p className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] text-xs mt-0.5" data-edit-path="location">{prop.location}</p>
                {prop.price && <p className="text-[color:var(--token-price,var(--token-on-dark-heading))] font-semibold text-sm mt-1" data-edit-path="price">{prop.price}</p>}
                {prop.soldIn && <p className="mt-1 text-xs font-semibold text-[color:var(--token-accent,var(--token-badge-text))]">Vermittelt in {prop.soldIn}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

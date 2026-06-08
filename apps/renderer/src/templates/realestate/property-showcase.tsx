'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { plain } from '@/lib/strip-html';

type Property = {
  title: string;
  image: string;
  price: string;
  size: string;
  rooms: string;
  location: string;
  badge?: string;
  href?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PropertyShowcaseSection({ data }: Props) {
  const headline = (data.headline as string) || 'Aktuelle Immobilien';
  const subline = (data.subline as string) || '';
  const properties = (data.properties as Property[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-lg text-[color:var(--token-muted)] mt-4 max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, i) => (
            <motion.a
              key={i}
              href={property.href || '#'}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-3xl border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_18px_50px_color-mix(in_srgb,var(--token-shadow)_8%,transparent)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_color-mix(in_srgb,var(--token-shadow)_13%,transparent)]"
             data-edit-collection="properties" data-edit-index={i}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--token-card-bg,#fff)_84%,var(--token-section-bg-alt,#f8fafc)),color-mix(in_srgb,var(--token-accent,#f59e0b)_12%,var(--token-card-bg,#fff)))]" />
                {property.image && (
                  <Image data-edit-image="image" src={property.image} alt={property.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                )}
                {property.badge && (
                  <span className="absolute left-4 top-4 rounded-full border border-[color:var(--token-badge-border,var(--token-card-border))] bg-[var(--token-badge-bg)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[color:var(--token-badge-text)] shadow-sm backdrop-blur" data-edit-path="badge">
                    {property.badge}
                  </span>
                )}
              </div>
              <div className="p-6 md:p-7">
                <h3 className="font-semibold text-[color:var(--token-heading)] text-lg group-hover:text-[color:var(--token-icon)] transition-colors" data-edit-path="title">{property.title}</h3>
                <p className="text-sm text-[color:var(--token-muted)] mt-1" data-edit-path="location">{property.location}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-[color:var(--token-card-border)] bg-[color-mix(in_srgb,var(--token-card-bg,#fff)_82%,var(--token-section-bg,#fff))] p-4 shadow-inner">
                  <span className="rounded-xl bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_82%,transparent)] px-4 py-3">
                    <strong className="block text-lg leading-none text-[color:var(--token-heading)]">{property.rooms}</strong>
                    <span className="mt-1 block text-xs font-medium text-[color:var(--token-muted)]">Zimmer</span>
                  </span>
                  <span className="rounded-xl bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_82%,transparent)] px-4 py-3">
                    <strong className="block text-lg leading-none text-[color:var(--token-heading)]">{property.size}</strong>
                    <span className="mt-1 block text-xs font-medium text-[color:var(--token-muted)]">Wohnfläche</span>
                  </span>
                </div>
                <p className="text-xl font-bold text-[color:var(--token-stat-value,var(--token-icon))] mt-3" data-edit-path="price">{property.price}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

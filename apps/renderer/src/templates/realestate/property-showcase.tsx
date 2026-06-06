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
              className="group bg-[var(--token-card-bg)] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
             data-edit-collection="properties" data-edit-index={i}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image data-edit-image="image" src={property.image} alt={property.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                {property.badge && (
                  <span className="absolute left-4 top-4 rounded-full border border-[color:var(--token-badge-border,var(--token-card-border))] bg-[var(--token-badge-bg)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--token-badge-text)] shadow-sm backdrop-blur" data-edit-path="badge">
                    {property.badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[color:var(--token-heading)] text-lg group-hover:text-[color:var(--token-icon)] transition-colors" data-edit-path="title">{property.title}</h3>
                <p className="text-sm text-[color:var(--token-muted)] mt-1" data-edit-path="location">{property.location}</p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[color:var(--token-card-border)]">
                  <span className="text-sm text-[color:var(--token-muted)]"><strong>{property.rooms}</strong> Zimmer</span>
                  <span className="text-sm text-[color:var(--token-muted)]"><strong>{property.size}</strong></span>
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

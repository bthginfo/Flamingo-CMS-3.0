'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Product = {
  image?: string;
  title: string;
  price?: string;
  badge?: string;
  href?: string;
  description?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null };

export function ProductShowcaseSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as Product[]) || [];
  const columns = (data.columns as string) || '3';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const colClass = columns === '4' ? 'lg:grid-cols-4' : columns === '2' ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <div className="text-center mb-10">
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--token-heading-weight,700)] tracking-[var(--token-heading-tracking,-0.02em)] text-[color:var(--token-body)]" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-3 text-[color:var(--token-body)] text-lg max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} gap-6`}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
           data-edit-collection="items" data-edit-index={i}>
            <a
              href={item.href || '#'}
              className="group block rounded-[var(--token-card-radius)] overflow-hidden bg-[var(--token-card-bg)] border-[var(--token-card-border)] shadow-[var(--token-card-shadow,0_4px_20px_rgba(0,0,0,0.06))] hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--token-section-bg-alt,var(--token-card-bg))]">
                {item.image ? (
                  <img data-edit-image="image" src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag size={48} />
                  </div>
                )}
                {item.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-[var(--token-icon)] text-[color:var(--token-btn-text,#fff)] shadow-md" data-edit-path="badge">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg text-[color:var(--token-card-body, var(--token-body))] group-hover:text-[color:var(--token-icon)] transition-colors" data-edit-path="title">{item.title}</h3>
                {item.description && <p className="mt-1.5 text-sm text-[color:var(--token-card-body, var(--token-body))] line-clamp-2" data-edit-path="description">{plain(item.description)}</p>}
                {item.price && <p className="mt-3 text-lg font-bold text-[color:var(--token-icon)]" data-edit-path="price">{item.price}</p>}
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

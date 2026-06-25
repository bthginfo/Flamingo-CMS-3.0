'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Image from 'next/image';

/* ─── Types ──────────────────────────────────────────────────────────────────── */
type Dish = {
  title: string;
  description?: string;
  price?: string;
  image?: string;
  badge?: string;
  allergens?: string;
};

type Category = {
  label: string;
  items: Dish[];
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

/* ─── Component ──────────────────────────────────────────────────────────────── */
export function MenuCardSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const categories = (data.categories as Category[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [activeTab, setActiveTab] = useState(0);

  const activeCategory = categories[activeTab] || categories[0];
  const items = activeCategory?.items || [];

  const isPreview = typeof window !== 'undefined' && window.location.pathname.includes('/admin');

  if (!categories.length && !isPreview) return null;

  return (
    <div ref={ref}>
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        {(badgeText || isPreview) && (
          <span
            className="inline-block text-xs font-semibold tracking-wider uppercase mb-3 px-3 py-1 rounded-full bg-[color:var(--token-badge-bg)] text-[color:var(--token-badge-text)]"
            data-edit-path="badgeText"
          >
            {badgeText || (isPreview ? 'Badge' : '')}
          </span>
        )}
        {(headline || isPreview) && (
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight text-[color:var(--token-heading,#0f172a)]"
            data-edit-path="headline"
          >
            {headline || (isPreview ? 'Unsere Speisekarte' : '')}
          </h2>
        )}
        {(subline || isPreview) && (
          <p
            className="mt-3 text-base md:text-lg text-[color:var(--token-muted,#64748b)]"
            data-edit-path="subline"
          >
            {subline || (isPreview ? 'Frische Zutaten, saisonale Gerichte' : '')}
          </p>
        )}
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
                activeTab === idx
                  ? 'bg-[color:var(--token-btn-bg)] text-[color:var(--token-btn-text)] border-transparent shadow-md'
                  : 'bg-[color:var(--token-card-bg,#fff)] text-[color:var(--token-card-body,#475569)] border-[color:var(--token-card-border)] hover:border-[color:var(--token-accent)]/30'
              }`}
              data-edit-collection="categories"
              data-edit-index={idx}
            >
              <span data-edit-path="label">{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Dish Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-edit-collection="categories"
          data-edit-index={activeTab}
        >
          {items.map((dish, i) => (
            <motion.article
              key={`${dish.title}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative flex gap-4 rounded-xl border border-[color:var(--token-card-border)] bg-[color:var(--token-card-bg,#fff)] p-4 shadow-sm transition-shadow hover:shadow-md"
              data-edit-collection="items"
              data-edit-index={i}
            >
              {/* Optional Image */}
              {dish.image && (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={dish.image}
                    alt={dish.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="text-sm font-semibold text-[color:var(--token-card-heading,#0f172a)] leading-tight"
                    data-edit-path="title"
                  >
                    {dish.title}
                  </h3>
                  {dish.price && (
                    <span
                      className="flex-shrink-0 text-sm font-bold text-[color:var(--token-price)]"
                      data-edit-path="price"
                    >
                      {dish.price}
                    </span>
                  )}
                </div>
                {dish.description && (
                  <p
                    className="mt-1 text-xs text-[color:var(--token-card-muted,#64748b)] line-clamp-2"
                    data-edit-path="description"
                  >
                    {dish.description}
                  </p>
                )}
                {dish.allergens && (
                  <p className="mt-1 text-[10px] text-[color:var(--token-muted,#64748b)] opacity-70" data-edit-path="allergens">
                    {dish.allergens}
                  </p>
                )}
              </div>

              {/* Badge */}
              {dish.badge && (
                <span
                  className="absolute -top-2 -right-2 rounded-full bg-[color:var(--token-card-badge-bg)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--token-card-badge-text)]"
                  data-edit-path="badge"
                >
                  {dish.badge}
                </span>
              )}
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

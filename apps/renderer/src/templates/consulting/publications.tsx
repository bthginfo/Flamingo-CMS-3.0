'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import Link from 'next/link';
import { plain } from '@/lib/strip-html';

type Article = { title: string; excerpt?: string; date?: string; category?: string; href?: string; image?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PublicationsSection({ data }: Props) {
  const headline = (data.headline as string) || 'Fachbeiträge & Aktuelles';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const articles = (data.articles as Article[]) || [];
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className="group border border-[color:var(--token-card-border)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-[var(--token-card-bg)]"
           data-edit-collection="articles" data-edit-index={i}>
            {article.image && (
              <div className="aspect-[16/9] overflow-hidden bg-[var(--token-section-bg-alt)]">
                <img data-edit-image="image" src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-[color:var(--token-body)] mb-3">
                {article.category && <span className="bg-[color-mix(in_srgb,var(--token-btn-bg)_10%,transparent)] text-[color:var(--token-icon)] px-2 py-0.5 rounded font-medium" data-edit-path="category">{article.category}</span>}
                {article.date && <span data-edit-path="date">{article.date}</span>}
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--token-heading)] group-hover:text-[color:var(--token-icon)] transition-colors mb-2" data-edit-path="title">{article.title}</h3>
              {article.excerpt && <p className="text-[color:var(--token-muted)] text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>}
              {article.href && (
                <Link href={article.href} className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--token-icon)] mt-4">
                  Weiterlesen <DynamicIcon name="arrow-right" size={14} />
                </Link>
              )}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }} className="text-center mt-10">
          <Link href={ctaHref} className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--token-card-border)] text-[color:var(--token-icon)] font-medium rounded-lg hover:bg-[var(--token-btn-bg)] hover:text-[color:var(--token-on-dark-heading)] transition-all">
            {ctaLabel} <DynamicIcon name="arrow-right" size={16} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

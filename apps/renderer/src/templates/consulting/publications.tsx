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
        {badgeText && <div className="section-badge"><span>{badgeText}</span></div>}
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
            className="group border border-[color:var(--token-card-border,#e4e4e7)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-[var(--token-card-bg,#ffffff)]"
          >
            {article.image && (
              <div className="aspect-[16/9] overflow-hidden bg-[var(--token-section-bg-alt,#f4f4f5)]">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-[color:var(--token-body,#a1a1aa)] mb-3">
                {article.category && <span className="bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] text-[color:var(--token-icon,var(--brand-primary,#1a5276))] px-2 py-0.5 rounded font-medium">{article.category}</span>}
                {article.date && <span>{article.date}</span>}
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--token-heading,#18181b)] group-hover:text-[color:var(--token-icon,var(--brand-primary,#1a5276))] transition-colors mb-2" data-edit-path="title">{article.title}</h3>
              {article.excerpt && <p className="text-[color:var(--token-muted,#71717a)] text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>}
              {article.href && (
                <Link href={article.href} className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--token-icon,var(--brand-primary,#1a5276))] mt-4">
                  Weiterlesen <DynamicIcon name="arrow-right" size={14} />
                </Link>
              )}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }} className="text-center mt-10">
          <Link href={ctaHref} className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--token-card-border,var(--brand-primary,#1a5276))] text-[color:var(--token-icon,var(--brand-primary,#1a5276))] font-medium rounded-lg hover:bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] hover:text-[color:var(--token-on-dark-heading,#ffffff)] transition-all">
            {ctaLabel} <DynamicIcon name="arrow-right" size={16} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

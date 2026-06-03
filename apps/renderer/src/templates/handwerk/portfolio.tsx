'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { DynamicIcon } from '@/components/ui/icon-map';

type Props = { data: Record<string, unknown>; variant?: string | null };

type ProjectItem = {
  title: string;
  category?: string;
  description?: string;
  image: string;
  href?: string;
  icon?: string;
  stats?: { label: string; value: string }[];
};

export function PortfolioSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const projects = (data.projects as ProjectItem[]) || [];
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';
  const ctaIcon = (data.ctaIcon as string) || '';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-16"
      >
        {badgeText && (
          <div className="section-badge">
            <span>{badgeText}</span>
          </div>
        )}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, i) => {
          const card = (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden bg-[var(--token-card-bg, var(--style-card-bg,#fff))] border border-[var(--style-border,rgba(0,0,0,.08))] shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--style-image-overlay,rgba(0,0,0,.6))] via-black/10 to-transparent" />
                {project.category && (
                  <span className="absolute top-4 left-4 bg-[var(--token-badge-bg, var(--style-badge-bg,rgba(255,255,255,.9)))] backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-[var(--token-badge-text, var(--style-badge-text,#374151))]">
                    {project.category}
                  </span>
                )}
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="font-display font-bold text-xl mb-2 text-[var(--style-text-primary,#111827)]">{project.title}</h3>
                {project.description && (
                  <div className="text-[var(--style-text-secondary,#6b7280)] text-sm leading-relaxed mb-4 rt-content" dangerouslySetInnerHTML={{ __html: project.description }} />
                )}
                {project.stats && project.stats.length > 0 && (
                  <div className="flex gap-6 pt-4 border-t border-[var(--style-border,rgba(0,0,0,.08))]">
                    {project.stats.map((stat, j) => (
                      <div key={j}>
                        <div className="text-lg font-bold text-[var(--style-accent,var(--brand-primary))]">{stat.value}</div>
                        <div className="text-xs text-[var(--style-muted,var(--style-text-secondary,#9ca3af))]">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {project.href && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--style-accent,var(--brand-primary))] mt-4 group-hover:underline">
                    Projekt ansehen {project.icon && <DynamicIcon name={project.icon} size={14} />}
                  </span>
                )}
              </div>
            </motion.div>
          );
          return project.href ? <Link key={i} href={project.href}>{card}</Link> : card;
        })}
      </div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="text-center mt-12">
          <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--style-button-bg,var(--brand-primary))] text-[var(--style-button-text,#fff)] font-semibold rounded-full transition-all shadow-md hover:shadow-lg">
            {ctaLabel} {ctaIcon && <DynamicIcon name={ctaIcon} size={16} />}
          </Link>
        </motion.div>
      )}
    </div>
  );
}

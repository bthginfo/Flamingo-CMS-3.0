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
  meta?: string;
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
  // `projects` {category} is canonical; `items` {meta} is the older shape.
  const projects = (((data.projects as ProjectItem[]) || (data.items as ProjectItem[]) || []))
    .map((p) => p && ({ ...p, category: p.category ?? p.meta }));
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
            <span data-edit-path="badgeText">{badgeText}</span>
          </div>
        )}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, i) => {
          const card = (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-[28px] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10"
              data-color-slot="cardBg borderColor"
              style={{ background: 'var(--token-card-bg)', borderColor: 'var(--token-card-border)' }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image data-edit-image="image"
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25" />
                {project.category && (
                  <span className="absolute top-4 left-4 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-xs font-semibold text-[var(--token-on-dark-heading,white)] shadow-sm backdrop-blur-md" data-edit-path="category">
                    {project.category}
                  </span>
                )}
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="font-display text-xl font-extrabold leading-tight text-[color:var(--token-heading)]" data-color-slot="headingColor" data-edit-path="title">{project.title}</h3>
                {project.description && (
                  <div className="rt-content mt-3 text-sm leading-relaxed text-[color:var(--token-body)]" data-color-slot="bodyColor" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: project.description }} />
                )}
                {project.stats && project.stats.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-section-bg-alt,#f8fafc)] p-4" data-color-slot="sectionBgAlt borderColor" style={{ background: 'var(--token-section-bg-alt,#f8fafc)', borderColor: 'var(--token-card-border)' }}>
                    {project.stats.map((stat, j) => (
                      <div key={j} className="min-w-0 rounded-xl bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_82%,transparent)] px-4 py-3" data-color-slot="cardBg" data-edit-collection="stats" data-edit-index={j}>
                        <div className="text-lg font-extrabold leading-none text-[color:var(--token-heading)]" data-color-slot="headingColor" data-edit-path="value">{stat.value}</div>
                        <div className="mt-1 text-xs font-medium leading-tight text-[color:var(--token-muted)]" data-color-slot="mutedColor" data-edit-path="label">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {project.href && (
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--token-link)] transition group-hover:translate-x-1 group-hover:text-[color:var(--token-link-hover)]" data-color-slot="linkColor">
                    Projekt ansehen {project.icon && <DynamicIcon editPath="icon" name={project.icon} size={14} />}
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
          <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] font-semibold rounded-full transition-all shadow-md hover:shadow-lg" data-color-slot="btnBg btnText">
            {ctaLabel} {ctaIcon && <DynamicIcon name={ctaIcon} size={16} />}
          </Link>
        </motion.div>
      )}
    </div>
  );
}

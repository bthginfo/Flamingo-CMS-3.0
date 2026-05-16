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
              className="group relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {project.category && (
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-gray-700">
                    {project.category}
                  </span>
                )}
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="font-display font-bold text-xl mb-2 text-gray-900">{project.title}</h3>
                {project.description && (
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.description}</p>
                )}
                {project.stats && project.stats.length > 0 && (
                  <div className="flex gap-6 pt-4 border-t border-gray-100">
                    {project.stats.map((stat, j) => (
                      <div key={j}>
                        <div className="text-lg font-bold text-brand-primary">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {project.href && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary mt-4 group-hover:underline">
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
          <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-dark transition-all shadow-md hover:shadow-lg">
            {ctaLabel} {ctaIcon && <DynamicIcon name={ctaIcon} size={16} />}
          </Link>
        </motion.div>
      )}
    </div>
  );
}

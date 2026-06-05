'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import Link from 'next/link';

type LinkItem = { label: string; href: string; icon?: string; description?: string };
type Props = { data: Record<string, unknown>; variant?: string | null };

export function CtaLinksSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const links = (data.links as LinkItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      {headline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </motion.div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((link, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08 }}
           data-edit-collection="links" data-edit-index={i}>
            <Link
              href={link.href}
              className="group flex items-center gap-4 p-6 rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm hover:shadow-lg hover:border-[color-mix(in_srgb,var(--token-icon)_28%,transparent)] transition-all duration-300 hover:-translate-y-1"
            >
              {link.icon && (
                <div className="w-12 h-12 rounded-xl bg-[color-mix(in_srgb,var(--token-icon)_12%,transparent)] flex items-center justify-center text-[var(--token-icon)] shrink-0">
                  <DynamicIcon name={link.icon} size={22} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[var(--token-heading)] group-hover:text-[var(--token-accent)] transition-colors" data-edit-path="label">{link.label}</div>
                {link.description && <div className="text-sm text-[var(--token-body)] mt-0.5 truncate rt-content" dangerouslySetInnerHTML={{ __html: link.description }} />}
              </div>
              {link.icon && <DynamicIcon name={link.icon} size={18} className="text-[var(--token-muted)] group-hover:text-[var(--token-accent)] group-hover:translate-x-1 transition-all shrink-0" />}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

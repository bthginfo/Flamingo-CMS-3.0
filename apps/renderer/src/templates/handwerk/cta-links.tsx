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
          <h2 className="section-headline">{headline}</h2>
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
          >
            <Link
              href={link.href}
              className="group flex items-center gap-4 p-6 rounded-2xl border border-[var(--token-card-border,var(--style-border-color,rgba(0,0,0,.08)))] bg-[var(--token-card-bg,var(--style-card-bg,#fff))] shadow-sm hover:shadow-lg hover:border-[color-mix(in_srgb,var(--token-icon,var(--style-icon-color,var(--style-accent-color,var(--brand-primary))))_28%,transparent)] transition-all duration-300 hover:-translate-y-1"
            >
              {link.icon && (
                <div className="w-12 h-12 rounded-xl bg-[color-mix(in_srgb,var(--token-icon,var(--style-icon-color,var(--style-accent-color,var(--brand-primary))))_12%,transparent)] flex items-center justify-center text-[var(--token-icon,var(--style-icon-color,var(--style-accent-color,var(--brand-primary))))] shrink-0">
                  <DynamicIcon name={link.icon} size={22} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[var(--token-heading,var(--style-heading-color,var(--style-text-primary,#111827)))] group-hover:text-[var(--style-accent-color,var(--token-icon,var(--brand-primary)))] transition-colors">{link.label}</div>
                {link.description && <div className="text-sm text-[var(--token-body,var(--style-body-color,var(--style-text-secondary,#6b7280)))] mt-0.5 truncate rt-content" dangerouslySetInnerHTML={{ __html: link.description }} />}
              </div>
              {link.icon && <DynamicIcon name={link.icon} size={18} className="text-[var(--token-muted,var(--style-text-muted,#cbd5e1))] group-hover:text-[var(--style-accent-color,var(--token-icon,var(--brand-primary)))] group-hover:translate-x-1 transition-all shrink-0" />}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

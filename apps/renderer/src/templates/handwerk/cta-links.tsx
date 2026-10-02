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
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
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
            <Link data-edit-link="link"
              href={link.href}
              className="group flex items-center gap-4 p-6 rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm hover:shadow-lg hover:border-[color-mix(in_srgb,var(--token-card-icon)_28%,transparent)] transition-all duration-300 hover:-translate-y-1" data-card
            >
              {link.icon && (
                <div className="w-12 h-12 rounded-xl bg-[color-mix(in_srgb,var(--token-card-icon)_12%,var(--token-card-bg))] flex items-center justify-center text-[color:var(--token-card-icon)] shrink-0">
                  <DynamicIcon editPath="icon" name={link.icon} size={22} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[color:var(--token-card-heading)]" data-edit-path="label">{link.label}</div>
                {link.description && <div className="text-sm text-[color:var(--token-card-body)] mt-0.5 truncate rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: link.description }} />}
              </div>
              {link.icon && <DynamicIcon editPath="icon" name={link.icon} size={18} className="text-[color:var(--token-card-muted)] group-hover:translate-x-1 transition-transform shrink-0" />}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

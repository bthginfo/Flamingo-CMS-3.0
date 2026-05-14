'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
          {subline && <p className="section-subline">{subline}</p>}
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
              className="group flex items-center gap-4 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-brand-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              {link.icon && (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <DynamicIcon name={link.icon} size={22} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">{link.label}</div>
                {link.description && <div className="text-sm text-gray-500 mt-0.5 truncate">{link.description}</div>}
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

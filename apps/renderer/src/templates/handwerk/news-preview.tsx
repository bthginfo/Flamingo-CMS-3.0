'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import Image from 'next/image';
import Link from 'next/link';

type NewsItem = { title: string; slug: string; image?: string; excerpt?: string; date?: string };
type Props = { data: Record<string, unknown>; variant?: string | null };

export function NewsPreviewSection({ data }: Props) {
  const headline = (data.headline as string) || 'Aktuelles';
  const subline = (data.subline as string) || '';
  const items = (data.items as NewsItem[]) || [];
  const collectionKey = (data.collectionKey as string) || 'news';
  const collectionBasePath = (data.collectionBasePath as string) || '';
  const linkPrefix = (data.linkPrefix as string) || '';
  const linkLabel = (data.linkLabel as string) || 'Alle Beiträge';
  const linkIcon = (data.linkIcon as string) || '';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Derive base path for shared renderer routes (e.g. /spiral-coffee or /demo/tourism)
  const pathname = usePathname();
  const demoMatch = pathname.match(/^(\/demo\/[^/]+)/);
  const tenantMatch = pathname.match(/^\/(?!admin(?:\/|$)|api(?:\/|$)|c(?:\/|$)|shop(?:\/|$)|demo(?:\/|$)|_next(?:\/|$))([^/]+)/);
  const basePath = linkPrefix || (demoMatch ? demoMatch[1] : tenantMatch ? `/${tenantMatch[1]}` : '');
  const detailBasePath = collectionBasePath || `${basePath}/c/${collectionKey}`;
  const linkHref = (data.linkHref as string) || (collectionBasePath ? collectionBasePath.replace(/\/c\//, '/') : `${basePath}/${collectionKey}`);

  if (items.length === 0) return null;

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <h2 className="section-headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        <Link href={linkHref} className="hidden items-center gap-1.5 text-sm font-medium text-[var(--style-accent-color,var(--brand-primary))] hover:underline sm:flex">
          {linkLabel} {linkIcon && <DynamicIcon name={linkIcon} size={14} />}
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, 3).map((item, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`${detailBasePath}/${item.slug}`} className="group block">
              {item.image && (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              {item.date && (
                <div className="mb-2 flex items-center gap-1.5 text-xs text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af)))]">
                  <Calendar size={12} />
                  {new Date(item.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
              <h3 className="line-clamp-2 text-lg font-semibold text-[var(--style-text-primary,var(--token-heading, var(--style-heading-color,#111827)))] transition-colors group-hover:text-[var(--style-accent-color,var(--brand-primary))]">{item.title}</h3>
              {item.excerpt && <p className="mt-1.5 line-clamp-2 text-sm text-[var(--style-text-secondary,var(--token-muted, var(--style-text-muted,#6b7280)))]">{item.excerpt}</p>}
            </Link>
          </motion.article>
        ))}
      </div>

      <Link href={linkHref} className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--style-accent-color,var(--brand-primary))] sm:hidden">
        {linkLabel} {linkIcon && <DynamicIcon name={linkIcon} size={14} />}
      </Link>
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { CheckCircle } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type ServiceItem = { title: string; text: string; image?: string; icon?: string; mediaType?: 'icon' | 'image'; features?: string[]; ctaLabel?: string; ctaHref?: string };

export function ServiceDetailSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const items = (data.items as ServiceItem[]) || [];

  return <ServiceClassic headline={headline} subline={plain(subline)} badgeText={badgeText} items={items} />;
}

type SProps = { headline: string; subline: string; badgeText: string; items: ServiceItem[] };

/* ─── CLASSIC: Alternating image/text rows, rounded images, feature checkmarks ─── */
function ServiceClassic({ headline, subline, badgeText, items }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-20">
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      <div className="space-y-24">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15 }}
            className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 md:gap-12 lg:gap-16 items-center`} data-edit-collection="items" data-edit-index={i}>
            <div className="w-full lg:w-1/2">
              {item.mediaType === 'image' && item.image ? (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                  <Image data-edit-image="image" src={item.image} alt={item.title} fill className="object-cover" sizes="50vw" />
                </div>
              ) : item.icon ? (
                <div className="w-24 h-24 rounded-2xl bg-[color-mix(in_srgb,var(--token-icon)_10%,transparent)] flex items-center justify-center mx-auto lg:mx-0">
                  <DynamicIcon editPath="icon" name={item.icon} size={40} className="text-[color:var(--token-icon)]" />
                </div>
              ) : null}
            </div>
            <div className="w-full lg:w-1/2">
              <h3 className="font-display font-bold text-2xl lg:text-3xl mb-4 text-[color:var(--token-body)]" data-edit-path="title">{item.title}</h3>
              <p className="text-[color:var(--token-body)] leading-relaxed mb-6 rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />
              {item.features && item.features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {item.features.map((f, fi) => <li key={fi} className="flex items-center gap-2 text-sm text-[color:var(--token-muted)]" data-edit-collection="features" data-edit-index={fi}><CheckCircle size={16} className="text-[color:var(--token-check)] shrink-0" />{f}</li>)}
                </ul>
              )}
              {item.ctaLabel && item.ctaHref && (
                <a href={item.ctaHref} className="inline-flex items-center gap-2 text-[color:var(--token-icon)] font-medium hover:gap-3 transition-all">
                  <span data-edit-path="ctaLabel">{item.ctaLabel}</span>{item.icon && <DynamicIcon editPath="icon" name={item.icon} size={16} />}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


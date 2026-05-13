'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { ArrowRight } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null };

type ServiceItem = {
  title: string;
  text: string;
  image?: string;
  icon?: string;
  mediaType?: 'icon' | 'image';
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function ServiceDetailSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const items = (data.items as ServiceItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        {badgeText && (
          <div className="section-badge">
            <span>{badgeText}</span>
          </div>
        )}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{subline}</p>}
      </motion.div>

      <div className="space-y-24">
        {items.map((item, i) => {
          const isReversed = i % 2 === 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}
            >
              {/* Image / Icon */}
              <div className="w-full lg:w-1/2">
                {item.mediaType === 'image' && item.image ? (
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl group">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border border-gray-100 flex items-center justify-center">
                    {item.icon && <DynamicIcon name={item.icon} size={80} className="text-brand-primary/40" />}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <h3 className="font-display font-bold text-2xl lg:text-3xl mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 text-lg">{item.text}</p>
                {item.features && item.features.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {item.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-600">
                        <DynamicIcon name="check-circle" size={18} className="text-brand-accent mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.ctaLabel && (
                  <a
                    href={item.ctaHref || '/kontakt'}
                    className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:gap-3 transition-all duration-300"
                  >
                    {item.ctaLabel}
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

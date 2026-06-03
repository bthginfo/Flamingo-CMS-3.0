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

  if (styleVariant === 'modern') return <ServiceModern headline={headline} subline={plain(subline)} badgeText={badgeText} items={items} />;
  if (styleVariant === 'bold') return <ServiceBold headline={headline} subline={plain(subline)} badgeText={badgeText} items={items} />;
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
        {badgeText && <div className="section-badge"><span>{badgeText}</span></div>}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      <div className="space-y-24">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15 }}
            className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-8 lg:gap-16 items-center`}>
            <div className="w-full lg:w-1/2">
              {item.mediaType === 'image' && item.image ? (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="50vw" />
                </div>
              ) : item.icon ? (
                <div className="w-24 h-24 rounded-2xl bg-[color-mix(in_srgb,var(--style-accent,var(--brand-primary))_10%,transparent)] flex items-center justify-center mx-auto lg:mx-0">
                  <DynamicIcon name={item.icon} size={40} className="text-[var(--style-accent,var(--brand-primary))]" />
                </div>
              ) : null}
            </div>
            <div className="w-full lg:w-1/2">
              <h3 className="font-display font-bold text-2xl lg:text-3xl mb-4 text-[var(--style-text-primary,#111827)]">{item.title}</h3>
              <p className="text-[var(--style-text-secondary,#6b7280)] leading-relaxed mb-6 rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />
              {item.features && item.features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {item.features.map((f, fi) => <li key={fi} className="flex items-center gap-2 text-sm text-[var(--style-muted,var(--style-text-secondary,#4b5563))]"><CheckCircle size={16} className="text-[var(--style-accent,var(--brand-accent))] shrink-0" />{f}</li>)}
                </ul>
              )}
              {item.ctaLabel && item.ctaHref && (
                <a href={item.ctaHref} className="inline-flex items-center gap-2 text-[var(--style-accent,var(--brand-primary))] font-medium hover:gap-3 transition-all">
                  {item.ctaLabel}{item.icon && <DynamicIcon name={item.icon} size={16} />}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── MODERN: Full-width images, overlaid text, minimal ─── */
function ServiceModern({ headline, subline, badgeText, items }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12 md:mb-20">
        {badgeText && <div className="flex items-center gap-3 text-sm text-[var(--style-muted,var(--style-text-secondary,#9ca3af))] mb-4 tracking-wide uppercase"><span className="w-8 h-px bg-[var(--style-border,#d1d5db)]" />{badgeText}</div>}
        {headline && <h2 className="text-4xl lg:text-3xl md:text-5xl font-light text-[var(--style-text-primary,#111827)] tracking-tight">{headline}</h2>}
        {subline && <div className="text-lg text-[var(--style-text-secondary,#9ca3af)] mt-4 max-w-2xl rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      <div className="space-y-20">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }}>
            {item.mediaType === 'image' && item.image && (
              <div className="relative aspect-[21/9] rounded-lg overflow-hidden mb-8">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="100vw" />
              </div>
            )}
            <div className="max-w-2xl">
              <h3 className="text-2xl font-medium text-[var(--style-text-primary,#111827)] mb-3">{item.title}</h3>
              <p className="text-[var(--style-text-secondary,#9ca3af)] leading-loose rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />
              {item.features && item.features.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {item.features.map((f, fi) => <span key={fi} className="text-xs text-[var(--style-muted,var(--style-text-secondary,#6b7280))] border border-[var(--style-border,#e5e7eb)] rounded px-3 py-1">{f}</span>)}
                </div>
              )}
              {item.ctaLabel && item.ctaHref && (
                <a href={item.ctaHref} className="inline-flex items-center gap-2 text-[var(--style-text-primary,#111827)] font-medium mt-6 border-b border-[var(--style-text-primary,#111827)] pb-0.5 hover:border-[var(--style-accent,var(--brand-accent))] hover:text-[var(--style-accent,var(--brand-accent))] transition-colors">
                  {item.ctaLabel}{item.icon && <DynamicIcon name={item.icon} size={14} />}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── BOLD: Stacked cards, thick borders, numbered ─── */
function ServiceBold({ headline, subline, badgeText, items }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12">
        {badgeText && <span className="inline-block bg-[var(--style-accent,var(--brand-accent))] text-[var(--style-text-primary,var(--brand-dark))] font-bold text-xs uppercase tracking-widest px-3 py-1.5 mb-4">{badgeText}</span>}
        {headline && <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-[var(--style-text-primary,#111827)]">{headline}</h2>}
        {subline && <div className="text-[var(--style-text-secondary,#6b7280)] mt-3 font-medium rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      <div className="space-y-6">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col lg:flex-row gap-6 p-6 border-3 border-[var(--style-border,var(--style-text-primary,#111827))] shadow-[4px_4px_0_var(--style-text-primary,#0d2137)] bg-[var(--style-card-bg,transparent)]">
            {item.mediaType === 'image' && item.image && (
              <div className="relative w-full lg:w-64 aspect-[4/3] lg:aspect-square shrink-0 overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="256px" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 bg-[var(--style-accent,var(--brand-accent))] text-[var(--style-text-primary,var(--brand-dark))] font-black text-sm flex items-center justify-center">{i + 1}</span>
                <h3 className="font-bold uppercase tracking-wide text-lg text-[var(--style-text-primary,#111827)]">{item.title}</h3>
              </div>
              <p className="text-[var(--style-text-secondary,#4b5563)] leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />
              {item.features && item.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.features.map((f, fi) => <span key={fi} className="text-xs font-bold uppercase bg-[color-mix(in_srgb,var(--style-card-bg,#fff)_70%,var(--style-accent,var(--brand-accent))_30%)] text-[var(--style-text-primary,#111827)] px-2 py-1">{f}</span>)}
                </div>
              )}
              {item.ctaLabel && item.ctaHref && (
                <a href={item.ctaHref} className="inline-flex items-center gap-2 mt-4 font-bold uppercase text-sm text-[var(--style-text-primary,var(--brand-dark))] hover:text-[var(--style-accent,var(--brand-accent))] transition-colors">
                  {item.ctaLabel}{item.icon && <DynamicIcon name={item.icon} size={14} />}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

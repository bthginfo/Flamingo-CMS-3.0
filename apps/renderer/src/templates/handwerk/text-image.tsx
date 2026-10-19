'use client';

import { motion } from 'framer-motion';
import { ResilientNextImage as Image } from '@/components/ui/resilient-image';
import Link from 'next/link';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';
import { useHydrationSafeReducedMotion } from '@/lib/use-hydration-safe-reduced-motion';

type ButtonValue = { label?: string; href?: string; icon?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

export function TextImageSection({ data, variant }: Props) {
  const reduceMotion = useHydrationSafeReducedMotion();
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || '';
  const image = pickString(data.image, data.imageUrl, data.imageSrc, data.backgroundImage, data.bgImage, data.media);
  const imageAlt = (data.imageAlt as string) || headline;
  const layout = (data.layout as string) || (data.imagePosition === 'left' ? 'image-left' : 'image-right');
  const imagePosition = typeof data.imagePosition === 'string' && (data.layout || !['left', 'right'].includes(data.imagePosition)) ? data.imagePosition : 'center';
  const items = (data.items as Array<{ icon?: string; title: string; text: string }>) || [];
  const primaryCta = (data.primaryCta as ButtonValue) || {};
  const secondaryCta = (data.secondaryCta as ButtonValue) || {};

  const imageLeft = layout === 'image-left';

  return (
    <section className="py-7 px-6 bg-[var(--token-section-bg)] overflow-hidden md:py-12">
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${imageLeft ? '' : 'md:[&>*:first-child]:order-2'}`}>
        {image && (
          <motion.div initial={false} whileInView={{ opacity: 1, x: 0 }} transition={reduceMotion ? { duration: 0 } : undefined} viewport={{ once: true }} className="relative aspect-[4/3] overflow-hidden bg-[var(--token-section-bg-alt)]" style={{ borderRadius: 'var(--token-card-radius)' }}>
            <Image data-edit-image="image" src={image} alt={imageAlt} fill className={data.imageFit === 'contain' ? 'object-contain p-3' : 'object-cover'} style={{ objectPosition: imagePosition }} sizes="(min-width: 768px) 50vw, 100vw" />
          </motion.div>
        )}
        <div className={!image ? 'md:col-span-2 max-w-3xl mx-auto' : ''}>
          {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
          {headline && <h2 className="section-headline mx-0 text-left" data-edit-path="headline">{headline}</h2>}
          {text && <div className="text-[color:var(--token-body)] text-lg leading-relaxed mt-4 rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
          {items.length > 0 && (
            <ul className="mt-6 divide-y divide-[var(--token-divider)] border-y border-[var(--token-divider)]">
              {items.map((item, i) => (
                <li key={i} className="py-4" data-edit-collection="items" data-edit-index={i}>
                  <div>
                    <h3 className="font-display text-xl font-medium text-[color:var(--token-heading)]" data-edit-path="title">{item.title}</h3>
                    {item.text && <p className="mt-2 leading-7 text-[color:var(--token-body)]" data-edit-path="text">{plain(item.text)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {(primaryCta.label || secondaryCta.label) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta.label && (
                <Link data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md transition-colors">
                  {primaryCta.label} {primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={16} />}
                </Link>
              )}
              {secondaryCta.label && (
                <Link data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-btn-secondary-border)] px-6 py-3 font-semibold text-[color:var(--token-btn-secondary-text)] hover:border-[var(--token-icon)] hover:text-[color:var(--token-icon)] transition-colors">
                  {secondaryCta.label} {secondaryCta.icon && <DynamicIcon editPath="secondaryCta.icon" name={secondaryCta.icon} size={16} />}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

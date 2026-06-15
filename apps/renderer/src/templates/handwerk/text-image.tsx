'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type ButtonValue = { label?: string; href?: string; icon?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

export function TextImageSection({ data, variant }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || '';
  const image = pickString(data.image, data.imageUrl, data.imageSrc, data.backgroundImage, data.bgImage, data.media);
  const imageAlt = (data.imageAlt as string) || headline;
  const layout = (data.layout as string) || 'image-right';
  const items = (data.items as Array<{ icon?: string; title: string; text: string }>) || [];
  const primaryCta = (data.primaryCta as ButtonValue) || {};
  const secondaryCta = (data.secondaryCta as ButtonValue) || {};

  const imageLeft = layout === 'image-left';

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg)] overflow-hidden">
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${imageLeft ? '' : 'md:[&>*:first-child]:order-2'}`}>
        {image && (
          <motion.div initial={{ opacity: 0, x: imageLeft ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <Image data-edit-image="image" src={image} alt={imageAlt} fill className="object-cover" />
          </motion.div>
        )}
        <div className={!image ? 'md:col-span-2 max-w-3xl mx-auto' : ''}>
          {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
          {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
          {text && <div className="text-[color:var(--token-body)] text-lg leading-relaxed mt-4 rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
          {items.length > 0 && (
            <ul className="mt-6 space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3" data-edit-collection="items" data-edit-index={i}>
                  <span className="w-2 h-2 mt-2 rounded-full bg-[var(--token-icon)] shrink-0" />
                  <div>
                    <span className="font-medium text-[color:var(--token-body)]" data-edit-path="title">{item.title}</span>
                    {item.text && <span className="text-[color:var(--token-body)]"> - <span data-edit-path="text">{plain(item.text)}</span></span>}
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
                <Link data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-card-border)] px-6 py-3 font-semibold text-[color:var(--token-body)] hover:border-[var(--token-icon)] hover:text-[color:var(--token-icon)] transition-colors">
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

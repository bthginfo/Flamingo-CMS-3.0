'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { DynamicIcon } from '@/components/ui/icon-map';

type ButtonValue = { label?: string; href?: string; icon?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TextImageSection({ data, variant }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || '';
  const image = (data.image as string) || '';
  const imageAlt = (data.imageAlt as string) || headline;
  const layout = (data.layout as string) || 'image-right';
  const items = (data.items as Array<{ icon?: string; title: string; text: string }>) || [];
  const primaryCta = (data.primaryCta as ButtonValue) || {};
  const secondaryCta = (data.secondaryCta as ButtonValue) || {};

  const imageLeft = layout === 'image-left';

  return (
    <section className="py-20 px-6 bg-white overflow-hidden">
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${imageLeft ? '' : 'md:[&>*:first-child]:order-2'}`}>
        {image && (
          <motion.div initial={{ opacity: 0, x: imageLeft ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <Image src={image} alt={imageAlt} fill className="object-cover" />
          </motion.div>
        )}
        <div className={!image ? 'md:col-span-2 max-w-3xl mx-auto' : ''}>
          {badge && <span className="section-badge">{badge}</span>}
          {headline && <h2 className="section-headline">{headline}</h2>}
          {text && <div className="text-gray-600 text-lg leading-relaxed mt-4 rt-content" dangerouslySetInnerHTML={{ __html: text }} />}
          {items.length > 0 && (
            <ul className="mt-6 space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-brand-primary shrink-0" />
                  <div>
                    <span className="font-medium text-gray-900">{item.title}</span>
                    {item.text && <span className="text-gray-600"> – {item.text}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {(primaryCta.label || secondaryCta.label) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta.label && (
                <Link href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 font-semibold text-white shadow-md hover:bg-brand-dark transition-colors">
                  {primaryCta.label} {primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={16} />}
                </Link>
              )}
              {secondaryCta.label && (
                <Link href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:border-brand-primary hover:text-brand-primary transition-colors">
                  {secondaryCta.label} {secondaryCta.icon && <DynamicIcon name={secondaryCta.icon} size={16} />}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

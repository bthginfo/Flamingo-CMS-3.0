'use client';

import Image from 'next/image';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Transformation = { title?: string; text?: string; beforeImage?: string; afterImage?: string; category?: string; caption?: string; cta?: { label?: string; href?: string } };

export function BeforeAfterSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Vorher & Nachher', 'Transformation');
  const items = asList<Transformation>(data.items);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)]">
            <div className="grid grid-cols-2">
              {item.beforeImage && <div className="relative aspect-square"><Image src={item.beforeImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              {item.afterImage && <div className="relative aspect-square"><Image src={item.afterImage} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
            </div>
            <div className="p-5">{item.category && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{item.category}</p>}<h3 className="mt-2 text-xl font-bold text-[var(--style-text-primary)]">{item.title || ''}</h3>{item.text && <p className="mt-3 text-sm text-[var(--style-text-secondary)]">{item.text}</p>}{item.caption && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{item.caption}</p>}{item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex font-semibold text-[var(--style-text-primary)]">{item.cta.label}</a>}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

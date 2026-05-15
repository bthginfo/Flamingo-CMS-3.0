import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type ButtonValue } from './types';

export type HeaderData = { headline: string; subline: string; badgeText: string };

export function SectionHeader({ headline, subline, badgeText }: HeaderData) {
  return (
    <div className="mb-10 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)] sm:text-5xl">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}

export function CtaButton({ cta }: { cta: ButtonValue }) {
  if (!cta.label) return null;
  return <a href={cta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{cta.label}<ArrowRight size={16} /></a>;
}

export function ImageCard({ image, title, text, meta, cta }: { image?: string; title?: string; text?: string; meta?: string; cta?: ButtonValue }) {
  return (
    <article className="group overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)]">
      {image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={image} alt={title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
      <div className="p-5">
        {meta && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{meta}</p>}
        <h3 className="mt-2 text-xl font-bold text-[var(--style-text-primary)]">{title || ''}</h3>
        {text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{text}</p>}
        {cta?.label && <div className="mt-5"><CtaButton cta={cta} /></div>}
      </div>
    </article>
  );
}

export function IconRows({ items }: { items: unknown }) {
  return (
    <div className="grid gap-4">
      {asList<{ icon?: string; title?: string; text?: string }>(items).map((item, index) => (
        <div key={`${item.title}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
          <DynamicIcon name={item.icon || 'map-pin'} size={20} />
          <div>
            <h3 className="font-semibold text-[var(--style-text-primary)]">{item.title || ''}</h3>
            {item.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function baseHeader(data: Record<string, unknown>, fallbackHeadline: string, fallbackBadge: string): HeaderData {
  return {
    headline: (data.headline as string) || fallbackHeadline,
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || fallbackBadge,
  };
}

export { asButton, asList };

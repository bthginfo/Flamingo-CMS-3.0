import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type ButtonValue } from './types';

export function baseHeader(data: Record<string, unknown>, headline: string, badgeText: string) {
  return {
    headline: (data.headline as string) || headline,
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || badgeText,
  };
}

export function SectionHeader({ headline, subline, badgeText }: { headline: string; subline: string; badgeText: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-gray-600">{badgeText}</p>}
      <h2 className="mt-3 text-3xl font-[700] text-gray-900 sm:text-3xl md:text-5xl">{headline}</h2>
      {subline && <div className="mt-4 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
    </div>
  );
}

export function CtaButton({ cta }: { cta: ButtonValue }) {
  if (!cta.label) return null;
  return <a href={cta.href || '#'} className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-5 py-3 font-semibold text-white">{cta.label}<ArrowRight size={16} /></a>;
}

export function ImageCard({ image, title, text, meta, cta }: { image?: string; title?: string; text?: string; meta?: string; cta?: ButtonValue }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      {image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={image} alt={title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
      <div className="p-5">
        {meta && <p className="text-xs font-bold uppercase tracking-widest text-gray-600">{meta}</p>}
        <h3 className="mt-2 text-xl font-bold text-gray-900">{title || ''}</h3>
        {text && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">{text}</p>}
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
          <DynamicIcon name={item.icon || 'sparkles'} size={20} />
          <div>
            <h3 className="font-semibold text-gray-900">{item.title || ''}</h3>
            {item.text && <div className="mt-1 text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export { asButton, asList };

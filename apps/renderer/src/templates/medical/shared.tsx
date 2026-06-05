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
  return <div className="mb-10 max-w-3xl">{badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text, var(--style-badge-text,var(--token-muted, var(--style-text-muted,#4b5563))))]">{badgeText}</p>}<h2 className="mt-3 text-3xl font-[700] text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] sm:text-3xl md:text-5xl">{headline}</h2>{subline && <div className="mt-4 text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563)))] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}</div>;
}

export function CtaButton({ cta }: { cta: ButtonValue }) {
  if (!cta.label) return null;
  return <a href={cta.href || '#'} className="inline-flex items-center gap-2 rounded-lg bg-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-text-primary,#111827)))] px-5 py-3 font-semibold text-[var(--token-btn-text, var(--brand-btn-text,#fff))]">{cta.label}<ArrowRight size={16} /></a>;
}

export function ImageCard({ image, title, text, meta, cta }: { image?: string; title?: string; text?: string; meta?: string; cta?: ButtonValue }) {
  return <article className="group overflow-hidden rounded-xl border border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,.1)))] bg-[var(--token-card-bg, var(--style-card-bg,#fff))] shadow-sm">{image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={image} alt={title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}<div className="p-5">{meta && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text, var(--style-badge-text,var(--token-muted, var(--style-text-muted,#4b5563))))]">{meta}</p>}<h3 className="mt-2 text-xl font-bold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{title || ''}</h3>{text && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563)))] rt-content" dangerouslySetInnerHTML={{ __html: text }} />}{cta?.label && <div className="mt-5"><CtaButton cta={cta} /></div>}</div></article>;
}

export function IconRows({ items }: { items: unknown }) {
  return (
    <div className="grid gap-4">
      {asList<{ icon?: string; title?: string; text?: string }>(items).map((item, index) => (
        <div key={`${item.title}-${index}`} className="flex items-start gap-4 border-t border-[var(--token-card-border,var(--style-border-color,rgba(0,0,0,.1)))] pt-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--token-icon,var(--style-icon-color,var(--brand-primary,#1f7a74)))_12%,transparent)] text-[var(--token-icon,var(--style-icon-color,var(--style-accent-color,var(--brand-primary,#1f7a74))))]">
            <DynamicIcon name={item.icon || 'stethoscope'} size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--token-heading,var(--style-heading-color,var(--style-text-primary,#111827)))]">{item.title || ''}</h3>
            {item.text && <div className="mt-1 text-sm leading-6 text-[var(--token-body,var(--style-body-color,var(--style-text-secondary,#4b5563)))] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export { asButton, asList };

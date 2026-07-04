import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';

// Canonical primitives shared by the industry template packs
// (medical, tourism, salon, hotel, restaurant). The per-industry
// `types.ts` / `shared.tsx` modules re-export from here.

export type SectionProps = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

export type ButtonValue = {
  label?: string;
  href?: string;
  icon?: string;
};

export function asButton(value: unknown): ButtonValue {
  return (value as ButtonValue | undefined) ?? {};
}

export function asList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export type HeaderData = { headline: string; subline: string; badgeText: string };

export function baseHeader(data: Record<string, unknown>, fallbackHeadline: string, fallbackBadge: string): HeaderData {
  return {
    headline: (data.headline as string) || fallbackHeadline,
    subline: (data.subline as string) || '',
    badgeText: (data.badgeText as string) || fallbackBadge,
  };
}

export function SectionHeader({ headline, subline, badgeText }: HeaderData) {
  return (
    <div className="mb-10 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
      <h2 className="mt-3 text-3xl font-[700] text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{headline}</h2>
      {subline && <div className="mt-4 text-[color:var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
    </div>
  );
}

export function CtaButton({ cta }: { cta: ButtonValue }) {
  if (!cta.label) return null;
  return <a data-edit-link="cta" href={cta.href || '#'} className="inline-flex items-center gap-2 rounded-lg bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{cta.label}</span><ArrowRight size={16} /></a>;
}

export function ImageCard({ image, title, text, meta, cta }: { image?: string; title?: string; text?: string; meta?: string; cta?: ButtonValue }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm">
      {image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={image} alt={title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
      <div className="p-5">
        {meta && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]">{meta}</p>}
        <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{title || ''}</h3>
        {text && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
        {cta?.label && <div className="mt-5"><CtaButton cta={cta} /></div>}
      </div>
    </article>
  );
}

type IconRowItem = { icon?: string; title?: string; text?: string };

export function IconRows({ items, iconFallback = 'sparkles', style = 'rows' }: { items: unknown; iconFallback?: string; style?: 'rows' | 'cards' }) {
  const list = asList<IconRowItem>(items);
  if (style === 'cards') {
    return (
      <div className="grid gap-4">
        {list.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex items-start gap-5 rounded-2xl border border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_76%,var(--token-section-bg,#fff))] p-5" data-edit-collection="items" data-edit-index={index}>
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--token-icon)_12%,transparent)] text-[color:var(--token-icon)]">
              <DynamicIcon editPath="icon" name={item.icon || iconFallback} size={18} />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {list.map((item, index) => (
        <div key={`${item.title}-${index}`} className="flex gap-4 border-t border-[var(--token-card-border)] pt-4" data-edit-collection="items" data-edit-index={index}>
          <DynamicIcon editPath="icon" name={item.icon || iconFallback} size={20} className="text-[color:var(--token-icon)]" />
          <div>
            <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

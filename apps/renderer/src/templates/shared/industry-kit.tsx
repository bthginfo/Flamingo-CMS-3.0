import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { ActionLink, CardSurface, MediaFrame, PremiumSectionHeader } from './section-primitives';

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
  return <PremiumSectionHeader eyebrow={badgeText} headline={headline} subline={subline} />;
}

export function CtaButton({ cta, tone = 'primary' }: { cta: ButtonValue; tone?: 'primary' | 'secondary' }) {
  return <ActionLink action={cta} tone={tone} />;
}

export function ImageCard({ image, title, text, meta, cta }: { image?: string; title?: string; text?: string; meta?: string; cta?: ButtonValue }) {
  return (
    <CardSurface as="article" interactive className="group flex h-full flex-col overflow-hidden">
      {image && (
        <MediaFrame className="aspect-[4/3]">
          <Image data-edit-image="image" src={image} alt={title || ''} fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        </MediaFrame>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {meta && <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--token-badge-text)]">{meta}</p>}
        <h3 className="mt-2 text-xl font-bold leading-snug text-[color:var(--token-card-heading)]" data-edit-path="title">{title || ''}</h3>
        {text && <div className="mt-3 flex-1 whitespace-pre-line text-sm leading-6 text-[color:var(--token-card-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
        {cta?.label && <div className="mt-5"><CtaButton cta={cta} /></div>}
      </div>
    </CardSurface>
  );
}

type IconRowItem = { icon?: string; title?: string; text?: string };

export function IconRows({ items, iconFallback = 'sparkles', style = 'rows' }: { items: unknown; iconFallback?: string; style?: 'rows' | 'cards' }) {
  const list = asList<IconRowItem>(items);
  if (style === 'cards') {
    return (
      <div className="grid gap-4">
        {list.map((item, index) => (
          <article key={`${item.title}-${index}`} className="cms-card group flex items-start gap-5 border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 sm:p-6" data-edit-collection="items" data-edit-index={index} data-card="">
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--token-card-border)] bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)] transition-transform duration-300 motion-safe:group-hover:-rotate-3 motion-safe:group-hover:scale-105">
              <DynamicIcon editPath="icon" name={item.icon || iconFallback} size={18} />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold leading-snug text-[color:var(--token-card-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-1.5 text-sm leading-6 text-[color:var(--token-card-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            </div>
          </article>
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {list.map((item, index) => (
        <div key={`${item.title}-${index}`} className="group flex gap-4 border-t border-[var(--token-card-border)] py-4 first:border-t-0 first:pt-0" data-edit-collection="items" data-edit-index={index}>
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)]">
            <DynamicIcon editPath="icon" name={item.icon || iconFallback} size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-[color:var(--token-card-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-card-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

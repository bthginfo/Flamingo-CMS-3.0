'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type TransportItem = { icon?: string; label?: string; value?: string; text?: string };
type NearbyItem = { title?: string; distanceLabel?: string; text?: string; image?: string };

export function LocationSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Lage & Anreise';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Standort';
  const addressText = (data.addressText as string) || '';
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const image = (data.image as string) || '';
  const transportItems = asList<TransportItem>(data.transportItems);
  const nearbyItems = asList<NearbyItem>(data.nearbyItems);
  const routeCta = asButton(data.routeCta);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <Header badgeText={badgeText} headline={headline} subline={subline} />
        {addressText && <p className="text-[var(--style-text-secondary)]">{addressText}</p>}
        <div className="mt-6 grid gap-3">
          {transportItems.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <DynamicIcon name={item.icon || 'map-pin'} size={20} />
              <div><h3 className="font-semibold text-[var(--style-text-primary)]">{item.label || ''} {item.value || ''}</h3>{item.text && <p className="text-sm text-[var(--style-text-secondary)]">{item.text}</p>}</div>
            </div>
          ))}
        </div>
        {routeCta.label && <a href={routeCta.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{routeCta.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        {image && <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--style-card-radius)]"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe title={headline} src={mapEmbedUrl} className="h-72 w-full rounded-[var(--style-card-radius)] border-0" loading="lazy" />}
        <div className="grid gap-4 sm:grid-cols-2">
          {nearbyItems.map((item, index) => (
            <article key={`${item.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-4">
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-[var(--style-radius-md)]"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-semibold text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.distanceLabel && <p className="text-xs text-[var(--style-text-secondary)]">{item.distanceLabel}</p>}
              {item.text && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{item.text}</p>}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({ badgeText, headline, subline }: { badgeText: string; headline: string; subline: string }) {
  return (
    <div className="mb-6 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}


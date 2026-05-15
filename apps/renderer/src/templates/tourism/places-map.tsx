'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Place = { title?: string; text?: string; category?: string; distanceLabel?: string; address?: string; image?: string; cta?: { label?: string; href?: string } };

export function PlacesMapSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Orte & Sehenswuerdigkeiten', 'Karte');
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const places = asList<Place>(data.places);
  const ctaPrimary = asButton(data.ctaPrimary);
  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <SectionHeader {...header} />
        <div className="grid gap-4">
          {places.map((place, index) => (
            <article key={`${place.title}-${index}`} className="grid gap-4 border-t border-black/10 pt-4 sm:grid-cols-[120px_1fr]">
              {place.image && <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--style-radius-md)]"><Image src={place.image} alt={place.title || ''} fill className="object-cover" sizes="160px" /></div>}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--style-text-secondary)]">{[place.category, place.distanceLabel].filter(Boolean).join(' / ')}</p>
                <h3 className="mt-1 font-bold text-[var(--style-text-primary)]">{place.title || ''}</h3>
                {place.address && <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--style-text-secondary)]"><MapPin size={13} />{place.address}</p>}
                {place.text && <p className="mt-2 text-sm leading-6 text-[var(--style-text-secondary)]">{place.text}</p>}
                {place.cta?.label && <a href={place.cta.href || '#'} className="mt-2 inline-flex text-sm font-semibold text-[var(--style-text-primary)]">{place.cta.label}</a>}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8"><CtaButton cta={ctaPrimary} /></div>
      </div>
      <div className="min-h-[420px] overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-section-bg-alt)] shadow-[var(--style-card-shadow)]">
        {mapEmbedUrl ? <iframe src={mapEmbedUrl} className="h-full min-h-[420px] w-full" loading="lazy" /> : <div className="flex h-full min-h-[420px] items-center justify-center p-8 text-center text-[var(--style-text-secondary)]">{(data.mapFallbackText as string) || 'Karte im CMS hinterlegen'}</div>}
      </div>
    </div>
  );
}

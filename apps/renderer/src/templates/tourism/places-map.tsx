'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';
import { ConsentGate } from '@/components/consent-gate';

type Place = { title?: string; text?: string; category?: string; distanceLabel?: string; address?: string; image?: string; cta?: { label?: string; href?: string } };

export function PlacesMapSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Orte & Sehenswuerdigkeiten', 'Karte');
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const places = asList<Place>(data.places);
  const ctaPrimary = asButton(data.ctaPrimary);
  const mapFallbackText = (data.mapFallbackText as string) || 'Karte im CMS hinterlegen';

  const p = { header, mapEmbedUrl, places, ctaPrimary, mapFallbackText };
  return <Classic {...p} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; mapEmbedUrl: string; places: Place[]; ctaPrimary: { label?: string; href?: string }; mapFallbackText: string };

function MapEmbed({ mapEmbedUrl, mapFallbackText, className }: { mapEmbedUrl: string; mapFallbackText: string; className: string }) {
  return (
    <div className={className}>
      {mapEmbedUrl ? (
        <ConsentGate provider="Google Maps" className="h-full min-h-[420px] w-full">
          <iframe src={mapEmbedUrl} title="Karte der Sehenswürdigkeiten" className="h-full min-h-[420px] w-full border-0" loading="lazy" />
        </ConsentGate>
      ) : <div className="flex h-full min-h-[420px] items-center justify-center p-8 text-center text-[color:var(--token-body)]">{mapFallbackText}</div>}
    </div>
  );
}

function Classic({ header, mapEmbedUrl, places, ctaPrimary, mapFallbackText }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <SectionHeader {...header} />
        <div className="grid gap-4">
          {places.map((place, index) => (
            <motion.article key={`${place.title || 'item'}-${index}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} className="grid gap-4 border-t border-[var(--token-card-border)] pt-4 sm:grid-cols-[120px_1fr]" data-edit-collection="places" data-edit-index={index}>
              {place.image && <div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image data-edit-image="image" src={place.image} alt={place.title || ''} fill className="object-cover" sizes="160px" /></div>}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--token-badge-text)]">{[place.category, place.distanceLabel].filter(Boolean).join(' / ')}</p>
                <h3 className="mt-1 font-bold text-[color:var(--token-heading)]" data-edit-path="title">{place.title || ''}</h3>
                {place.address && <p className="mt-1 inline-flex items-center gap-1 text-xs text-[color:var(--token-muted)]"><MapPin size={13} /><span data-edit-path="address">{place.address}</span></p>}
                {place.text && <div className="mt-2 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: place.text }} />}
                {place.cta?.label && <a href={place.cta.href || '#'} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--token-link)] hover:text-[color:var(--token-link-hover)]"><span data-edit-path="label">{place.cta.label}</span><ArrowRight size={14} /></a>}
              </div>
            </motion.article>
          ))}
        </div>
        {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
      </div>
      <MapEmbed mapEmbedUrl={mapEmbedUrl} mapFallbackText={mapFallbackText} className="min-h-[420px] overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" />
    </div>
  );
}


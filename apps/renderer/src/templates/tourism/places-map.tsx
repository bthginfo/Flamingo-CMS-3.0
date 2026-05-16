'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Place = { title?: string; text?: string; category?: string; distanceLabel?: string; address?: string; image?: string; cta?: { label?: string; href?: string } };

export function PlacesMapSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Orte & Sehenswuerdigkeiten', 'Karte');
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const places = asList<Place>(data.places);
  const ctaPrimary = asButton(data.ctaPrimary);
  const mapFallbackText = (data.mapFallbackText as string) || 'Karte im CMS hinterlegen';

  const p = { header, mapEmbedUrl, places, ctaPrimary, mapFallbackText };
  if (styleVariant === 'modern') return <Modern {...p} />;
  if (styleVariant === 'bold') return <Bold {...p} />;
  return <Classic {...p} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; mapEmbedUrl: string; places: Place[]; ctaPrimary: { label?: string; href?: string }; mapFallbackText: string };

function MapEmbed({ mapEmbedUrl, mapFallbackText, className }: { mapEmbedUrl: string; mapFallbackText: string; className: string }) {
  return (
    <div className={className}>
      {mapEmbedUrl ? <iframe src={mapEmbedUrl} className="h-full min-h-[420px] w-full" loading="lazy" /> : <div className="flex h-full min-h-[420px] items-center justify-center p-8 text-center text-gray-600">{mapFallbackText}</div>}
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
            <motion.article key={`${place.title}-${index}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} className="grid gap-4 border-t border-black/10 pt-4 sm:grid-cols-[120px_1fr]">
              {place.image && <div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={place.image} alt={place.title || ''} fill className="object-cover" sizes="160px" /></div>}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-700">{[place.category, place.distanceLabel].filter(Boolean).join(' / ')}</p>
                <h3 className="mt-1 font-bold text-gray-900">{place.title || ''}</h3>
                {place.address && <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-600"><MapPin size={13} />{place.address}</p>}
                {place.text && <p className="mt-2 text-sm leading-6 text-gray-600">{place.text}</p>}
                {place.cta?.label && <a href={place.cta.href || '#'} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-700">{place.cta.label}<ArrowRight size={14} /></a>}
              </div>
            </motion.article>
          ))}
        </div>
        {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
      </div>
      <MapEmbed mapEmbedUrl={mapEmbedUrl} mapFallbackText={mapFallbackText} className="min-h-[420px] overflow-hidden rounded-xl bg-gray-50 shadow-lg" />
    </div>
  );
}

function Modern({ header, mapEmbedUrl, places, ctaPrimary, mapFallbackText }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <SectionHeader {...header} />
        <div className="grid gap-4">
          {places.map((place, index) => (
            <article key={`${place.title}-${index}`} className="grid gap-4 border-t border-black/10 pt-4 sm:grid-cols-[120px_1fr]">
              {place.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={place.image} alt={place.title || ''} fill className="object-cover" sizes="160px" /></div>}
              <div>
                <p className="text-xs font-light uppercase tracking-widest text-teal-600">{[place.category, place.distanceLabel].filter(Boolean).join(' / ')}</p>
                <h3 className="mt-1 font-light text-gray-900">{place.title || ''}</h3>
                {place.address && <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-600"><MapPin size={13} />{place.address}</p>}
                {place.text && <p className="mt-2 text-sm font-light leading-6 text-gray-600">{place.text}</p>}
                {place.cta?.label && <a href={place.cta.href || '#'} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-teal-600">{place.cta.label}<ArrowRight size={14} /></a>}
              </div>
            </article>
          ))}
        </div>
        {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-teal-600 bg-teal-600 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
      </div>
      <MapEmbed mapEmbedUrl={mapEmbedUrl} mapFallbackText={mapFallbackText} className="min-h-[420px] overflow-hidden border border-black/10 bg-gray-50" />
    </div>
  );
}

function Bold({ header, mapEmbedUrl, places, ctaPrimary, mapFallbackText }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div className="mb-10 max-w-3xl">
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-3xl md:text-5xl">{header.headline}</h2>
          {header.subline && <p className="mt-4 text-gray-600">{header.subline}</p>}
        </div>
        <div className="grid gap-4">
          {places.map((place, index) => (
            <article key={`${place.title}-${index}`} className="grid gap-4 border-t-2 border-[#111827] pt-4 sm:grid-cols-[120px_1fr]">
              {place.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={place.image} alt={place.title || ''} fill className="object-cover" sizes="160px" /></div>}
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-orange-500">{[place.category, place.distanceLabel].filter(Boolean).join(' / ')}</p>
                <h3 className="mt-1 font-black uppercase text-gray-900">{place.title || ''}</h3>
                {place.address && <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-600"><MapPin size={13} />{place.address}</p>}
                {place.text && <p className="mt-2 text-sm leading-6 text-gray-600">{place.text}</p>}
                {place.cta?.label && <a href={place.cta.href || '#'} className="mt-2 inline-flex items-center gap-1 text-sm font-black uppercase text-orange-500">{place.cta.label}<ArrowRight size={14} /></a>}
              </div>
            </article>
          ))}
        </div>
        {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
      </div>
      <MapEmbed mapEmbedUrl={mapEmbedUrl} mapFallbackText={mapFallbackText} className="min-h-[420px] overflow-hidden border-2 border-[#111827] bg-gray-50 shadow-[4px_4px_0_#111827]" />
    </div>
  );
}

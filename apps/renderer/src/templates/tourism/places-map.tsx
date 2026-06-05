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
      {mapEmbedUrl ? <iframe src={mapEmbedUrl} className="h-full min-h-[420px] w-full" loading="lazy" /> : <div className="flex h-full min-h-[420px] items-center justify-center p-8 text-center text-[var(--token-body)]">{mapFallbackText}</div>}
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
            <motion.article key={`$<span data-edit-path="title">{place.title}</span>-${index}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} className="grid gap-4 border-t border-[var(--token-card-border)] pt-4 sm:grid-cols-[120px_1fr]" data-edit-collection="places" data-edit-index={index}>
              {place.image && <div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={place.image} alt={place.title || ''} fill className="object-cover" sizes="160px" /></div>}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--token-badge-text)]">{[place.category, place.distanceLabel].filter(Boolean).join(' / ')}</p>
                <h3 className="mt-1 font-bold text-[var(--token-heading)]" data-edit-path="title">{place.title || ''}</h3>
                {place.address && <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--token-muted)]"><MapPin size={13} /><span data-edit-path="address">{place.address}</span></p>}
                {place.text && <div className="mt-2 text-sm leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: place.text }} />}
                {place.cta?.label && <a href={place.cta.href || '#'} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--token-accent)]"><span data-edit-path="label">{place.cta.label}</span><ArrowRight size={14} /></a>}
              </div>
            </motion.article>
          ))}
        </div>
        {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
      </div>
      <MapEmbed mapEmbedUrl={mapEmbedUrl} mapFallbackText={mapFallbackText} className="min-h-[420px] overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" />
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
            <article key={`${place.title}-${index}`} className="grid gap-4 border-t border-[var(--token-card-border)] pt-4 sm:grid-cols-[120px_1fr]" data-edit-collection="places" data-edit-index={index}>
              {place.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={place.image} alt={place.title || ''} fill className="object-cover" sizes="160px" /></div>}
              <div>
                <p className="text-xs font-light uppercase tracking-widest text-[var(--token-badge-text)]">{[place.category, place.distanceLabel].filter(Boolean).join(' / ')}</p>
                <h3 className="mt-1 font-light text-[var(--token-heading)]" data-edit-path="title">{place.title || ''}</h3>
                {place.address && <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--token-muted)]"><MapPin size={13} /><span data-edit-path="address">{place.address}</span></p>}
                {place.text && <div className="mt-2 text-sm font-light leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: place.text }} />}
                {place.cta?.label && <a href={place.cta.href || '#'} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--token-accent)]"><span data-edit-path="label">{place.cta.label}</span><ArrowRight size={14} /></a>}
              </div>
            </article>
          ))}
        </div>
        {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
      </div>
      <MapEmbed mapEmbedUrl={mapEmbedUrl} mapFallbackText={mapFallbackText} className="min-h-[420px] overflow-hidden border border-[var(--token-card-border)] bg-[var(--token-card-bg)]" />
    </div>
  );
}

function Bold({ header, mapEmbedUrl, places, ctaPrimary, mapFallbackText }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div className="mb-10 max-w-3xl">
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        <div className="grid gap-4">
          {places.map((place, index) => (
            <article key={`$<span data-edit-path="title">{place.title}</span>-${index}`} className="grid gap-4 border-t-2 border-[var(--token-card-border)] pt-4 sm:grid-cols-[120px_1fr]" data-edit-collection="places" data-edit-index={index}>
              {place.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={place.image} alt={place.title || ''} fill className="object-cover" sizes="160px" /></div>}
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]">{[place.category, place.distanceLabel].filter(Boolean).join(' / ')}</p>
                <h3 className="mt-1 font-black uppercase text-[var(--token-heading)]" data-edit-path="title">{place.title || ''}</h3>
                {place.address && <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--token-muted)]"><MapPin size={13} /><span data-edit-path="address">{place.address}</span></p>}
                {place.text && <div className="mt-2 text-sm leading-6 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: place.text }} />}
                {place.cta?.label && <a href={place.cta.href || '#'} className="mt-2 inline-flex items-center gap-1 text-sm font-black uppercase text-[var(--token-accent)]"><span data-edit-path="label">{place.cta.label}</span><ArrowRight size={14} /></a>}
              </div>
            </article>
          ))}
        </div>
        {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
      </div>
      <MapEmbed mapEmbedUrl={mapEmbedUrl} mapFallbackText={mapFallbackText} className="min-h-[420px] overflow-hidden border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)]" />
    </div>
  );
}

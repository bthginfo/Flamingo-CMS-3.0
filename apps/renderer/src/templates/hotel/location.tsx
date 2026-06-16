'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type TransportItem = { icon?: string; label?: string; value?: string; text?: string };
type NearbyItem = { title?: string; distanceLabel?: string; text?: string; image?: string };

export function LocationSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Lage & Anreise';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Standort';
  const addressText = (data.addressText as string) || '';
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const image = (data.image as string) || '';
  const transportItems = asList<TransportItem>(data.transportItems);
  const nearbyItems = asList<NearbyItem>(data.nearbyItems);
  const routeCta = asButton(data.routeCta);

  const props = { headline, subline, badgeText, addressText, mapEmbedUrl, image, transportItems, nearbyItems, routeCta };

  if (styleVariant === 'modern') return <LocationModern {...props} />;
  if (styleVariant === 'bold') return <LocationBold {...props} />;
  return <LocationClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string; addressText: string;
  mapEmbedUrl: string; image: string; transportItems: TransportItem[];
  nearbyItems: NearbyItem[]; routeCta: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function LocationClassic({ headline, subline, badgeText, addressText, mapEmbedUrl, image, transportItems, nearbyItems, routeCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]"><Star size={12} className="text-[color:var(--token-icon)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {addressText && <p className="text-[color:var(--token-muted)]">{addressText}</p>}
        <div className="mt-6 grid gap-3">
          {transportItems.map((item, index) => (
            <motion.div key={`$<span data-edit-path="label">{item.label}</span>-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 border-t border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] pt-4" data-edit-collection="transportItems" data-edit-index={index}>
              <div className="text-[color:var(--token-icon)]"><DynamicIcon editPath="icon" name={item.icon || 'map-pin'} size={20} /></div>
              <div><h3 className="font-semibold text-[color:var(--token-heading)]"><span data-edit-path="label">{item.label || ''}</span> <span data-edit-path="value">{item.value || ''}</span></h3>{item.text && <div className="text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}</div>
            </motion.div>
          ))}
        </div>
        {routeCta.label && <a data-edit-link="routeCta" href={routeCta.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-lg"><span data-edit-path="label">{routeCta.label}</span><ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        {image && <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-md"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe title={headline} src={mapEmbedUrl} className="h-72 w-full rounded-xl border-0" loading="lazy" />}
        <div className="grid gap-4 sm:grid-cols-2">
          {nearbyItems.map((item, index) => (
            <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-4 shadow-md" data-edit-collection="nearbyItems" data-edit-index={index}>
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.distanceLabel && <p className="text-xs text-[color:var(--token-muted)]">{item.distanceLabel}</p>}
              {item.text && <div className="mt-2 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- MODERN --- */
function LocationModern({ headline, subline, badgeText, addressText, mapEmbedUrl, image, transportItems, nearbyItems, routeCta }: Props) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <div className="mb-8 max-w-3xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {addressText && <p className="font-light text-[color:var(--token-muted)]">{addressText}</p>}
        <div className="mt-8 grid gap-4">
          {transportItems.map((item, index) => (
            <div key={`$<span data-edit-path="label">{item.label}</span>-${index}`} className="flex gap-4 border-t border-black/10 pt-4" data-edit-collection="transportItems" data-edit-index={index}>
              <DynamicIcon editPath="icon" name={item.icon || 'map-pin'} size={18} className="text-[color:var(--token-muted)]" />
              <div><h3 className="font-light text-[color:var(--token-heading)]"><span data-edit-path="label">{item.label || ''}</span> <span data-edit-path="value">{item.value || ''}</span></h3>{item.text && <div className="text-sm font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}</div>
            </div>
          ))}
        </div>
        {routeCta.label && <a data-edit-link="routeCta" href={routeCta.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-[color:var(--token-heading)] underline underline-offset-4"><span data-edit-path="label">{routeCta.label}</span><ArrowRight size={14} /></a>}
      </div>
      <div className="space-y-5">
        {image && <div className="relative aspect-[16/10] overflow-hidden"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe title={headline} src={mapEmbedUrl} className="h-72 w-full border border-black/10" loading="lazy" />}
        <div className="grid gap-px border border-black/10 sm:grid-cols-2">
          {nearbyItems.map((item, index) => (
            <article key={`${item.title}-${index}`} className="border border-black/10 bg-[var(--token-card-bg)] p-5" data-edit-collection="nearbyItems" data-edit-index={index}>
              {item.image && <div className="relative mb-4 aspect-[16/10] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-light text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.distanceLabel && <p className="text-xs font-light text-[color:var(--token-muted)]">{item.distanceLabel}</p>}
              {item.text && <div className="mt-2 text-sm font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- BOLD --- */
function LocationBold({ headline, subline, badgeText, addressText, mapEmbedUrl, image, transportItems, nearbyItems, routeCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <p className="inline-block bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon)]" data-edit-path="badgeText">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {addressText && <p className="font-bold text-[color:var(--token-muted)]">{addressText}</p>}
        <div className="mt-6 grid gap-3">
          {transportItems.map((item, index) => (
            <div key={`$<span data-edit-path="label">{item.label}</span>-${index}`} className="flex gap-4 border-t-2 border-[var(--token-card-border)] pt-4" data-edit-collection="transportItems" data-edit-index={index}>
              <div className="text-[color:var(--token-icon)]"><DynamicIcon editPath="icon" name={item.icon || 'map-pin'} size={20} /></div>
              <div><h3 className="font-black text-[color:var(--token-heading)]"><span data-edit-path="label">{item.label || ''}</span> <span data-edit-path="value">{item.value || ''}</span></h3>{item.text && <div className="text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}</div>
            </div>
          ))}
        </div>
        {routeCta.label && <a data-edit-link="routeCta" href={routeCta.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[var(--token-card-border)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_var(--token-icon)]"><span data-edit-path="label">{routeCta.label}</span><ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        {image && <div className="relative aspect-[16/10] overflow-hidden border-2 border-[var(--token-card-border)] shadow-[4px_4px_0_var(--token-card-border)]"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe title={headline} src={mapEmbedUrl} className="h-72 w-full border-2 border-[var(--token-card-border)]" loading="lazy" />}
        <div className="grid gap-4 sm:grid-cols-2">
          {nearbyItems.map((item, index) => (
            <article key={`${item.title}-${index}`} className="border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-4 shadow-[4px_4px_0_var(--token-card-border)]" data-edit-collection="nearbyItems" data-edit-index={index}>
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.distanceLabel && <p className="text-xs font-bold text-[color:var(--token-muted)]">{item.distanceLabel}</p>}
              {item.text && <div className="mt-2 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

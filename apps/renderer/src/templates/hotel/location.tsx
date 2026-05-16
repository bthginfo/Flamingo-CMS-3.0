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
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600"><Star size={12} className="text-brand-primary" />{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
          {subline && <p className="mt-4 text-gray-600">{subline}</p>}
        </div>
        {addressText && <p className="text-gray-600">{addressText}</p>}
        <div className="mt-6 grid gap-3">
          {transportItems.map((item, index) => (
            <motion.div key={`${item.label}-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 border-t border-[var(--brand-primary)]/20 pt-4">
              <div className="text-brand-primary"><DynamicIcon name={item.icon || 'map-pin'} size={20} /></div>
              <div><h3 className="font-semibold text-gray-900">{item.label || ''} {item.value || ''}</h3>{item.text && <p className="text-sm text-gray-600">{item.text}</p>}</div>
            </motion.div>
          ))}
        </div>
        {routeCta.label && <a href={routeCta.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 font-semibold text-white shadow-lg">{routeCta.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        {image && <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-md"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe title={headline} src={mapEmbedUrl} className="h-72 w-full rounded-xl border-0" loading="lazy" />}
        <div className="grid gap-4 sm:grid-cols-2">
          {nearbyItems.map((item, index) => (
            <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-4 shadow-md">
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-semibold text-gray-900">{item.title || ''}</h3>
              {item.distanceLabel && <p className="text-xs text-gray-600">{item.distanceLabel}</p>}
              {item.text && <p className="mt-2 text-sm text-gray-600">{item.text}</p>}
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
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-5xl text-gray-900">{headline}</h2>
          {subline && <p className="mt-4 font-light text-gray-600">{subline}</p>}
        </div>
        {addressText && <p className="font-light text-gray-600">{addressText}</p>}
        <div className="mt-8 grid gap-4">
          {transportItems.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <DynamicIcon name={item.icon || 'map-pin'} size={18} className="text-gray-600" />
              <div><h3 className="font-light text-gray-900">{item.label || ''} {item.value || ''}</h3>{item.text && <p className="text-sm font-light text-gray-600">{item.text}</p>}</div>
            </div>
          ))}
        </div>
        {routeCta.label && <a href={routeCta.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-gray-900 underline underline-offset-4">{routeCta.label}<ArrowRight size={14} /></a>}
      </div>
      <div className="space-y-5">
        {image && <div className="relative aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe title={headline} src={mapEmbedUrl} className="h-72 w-full border border-black/10" loading="lazy" />}
        <div className="grid gap-px border border-black/10 sm:grid-cols-2">
          {nearbyItems.map((item, index) => (
            <article key={`${item.title}-${index}`} className="border border-black/10 bg-white p-5">
              {item.image && <div className="relative mb-4 aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-light text-gray-900">{item.title || ''}</h3>
              {item.distanceLabel && <p className="text-xs font-light text-gray-600">{item.distanceLabel}</p>}
              {item.text && <p className="mt-2 text-sm font-light text-gray-600">{item.text}</p>}
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
          {badgeText && <p className="inline-block bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase text-gray-900">{headline}</h2>
          {subline && <p className="mt-4 text-gray-600">{subline}</p>}
        </div>
        {addressText && <p className="font-bold text-gray-600">{addressText}</p>}
        <div className="mt-6 grid gap-3">
          {transportItems.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex gap-4 border-t-2 border-[#111827] pt-4">
              <div className="text-brand-primary"><DynamicIcon name={item.icon || 'map-pin'} size={20} /></div>
              <div><h3 className="font-black text-gray-900">{item.label || ''} {item.value || ''}</h3>{item.text && <p className="text-sm text-gray-600">{item.text}</p>}</div>
            </div>
          ))}
        </div>
        {routeCta.label && <a href={routeCta.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--brand-primary)]">{routeCta.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        {image && <div className="relative aspect-[16/10] overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0_#111827]"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe title={headline} src={mapEmbedUrl} className="h-72 w-full border-2 border-[#111827]" loading="lazy" />}
        <div className="grid gap-4 sm:grid-cols-2">
          {nearbyItems.map((item, index) => (
            <article key={`${item.title}-${index}`} className="border-2 border-[#111827] bg-white p-4 shadow-[4px_4px_0_#111827]">
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-black uppercase text-gray-900">{item.title || ''}</h3>
              {item.distanceLabel && <p className="text-xs font-bold text-gray-600">{item.distanceLabel}</p>}
              {item.text && <p className="mt-2 text-sm text-gray-600">{item.text}</p>}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';
import { ConsentGate } from '@/components/consent-gate';
import { safeMapEmbedUrl } from '@/lib/safe-embed-url';

type TransportItem = { icon?: string; label?: string; value?: string; text?: string };
type NearbyItem = { title?: string; distanceLabel?: string; text?: string; image?: string };

export function LocationSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Lage & Anreise';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Standort';
  const addressText = (data.addressText as string) || (data.address as string) || '';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const mapEmbedUrl = safeMapEmbedUrl(data.mapEmbedUrl);
  const image = (data.image as string) || '';
  const transportItems = asList<TransportItem>(data.transportItems);
  const nearbyItems = asList<NearbyItem>(data.nearbyItems);
  const routeCta = asButton(data.routeCta);

  const props = { headline, subline, badgeText, addressText, phone, email, mapEmbedUrl, image, transportItems, nearbyItems, routeCta };

  return <LocationClassic {...props} />;
}

type Props = {
  phone?: string; email?: string;
  headline: string; subline: string; badgeText: string; addressText: string;
  mapEmbedUrl: string; image: string; transportItems: TransportItem[];
  nearbyItems: NearbyItem[]; routeCta: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function LocationClassic({ headline, subline, badgeText, addressText, phone, email, mapEmbedUrl, image, transportItems, nearbyItems, routeCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]"><Star size={12} className="text-[color:var(--token-rating-star)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {addressText && <p className="text-[color:var(--token-muted)]">{addressText}</p>}
        {(phone || email) && <p className="mt-1 text-sm text-[color:var(--token-muted)]">{phone && <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:underline">{phone}</a>}{phone && email && ' · '}{email && <a href={`mailto:${email}`} className="hover:underline">{email}</a>}</p>}
        <div className="mt-6 grid gap-3">
          {transportItems.map((item, index) => (
            <motion.div key={`${item.label || 'item'}-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 border-t border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] pt-4" data-edit-collection="transportItems" data-edit-index={index}>
              <div className="text-[color:var(--token-icon)]"><DynamicIcon editPath="icon" name={item.icon || 'map-pin'} size={20} /></div>
              <div><h3 className="font-semibold text-[color:var(--token-heading)]"><span data-edit-path="label">{item.label || ''}</span> <span data-edit-path="value">{item.value || ''}</span></h3>{item.text && <div className="text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}</div>
            </motion.div>
          ))}
        </div>
        {routeCta.label && <a data-edit-link="routeCta" href={routeCta.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-lg"><span data-edit-path="label">{routeCta.label}</span><ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        {image && <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-md"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && (
          <ConsentGate provider="Google Maps" className="h-72 w-full overflow-hidden rounded-xl">
            <iframe title={headline} src={mapEmbedUrl} className="h-full w-full border-0" loading="lazy" />
          </ConsentGate>
        )}
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


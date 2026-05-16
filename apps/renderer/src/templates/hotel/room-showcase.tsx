'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, BedDouble, Maximize2, Users, Star } from 'lucide-react';
import { asList, type SectionProps } from './types';

type Room = { name?: string; description?: string; image?: string; galleryImages?: string[]; priceLabel?: string; sizeLabel?: string; occupancyLabel?: string; bedLabel?: string; features?: string[]; detailCta?: { label?: string; href?: string }; bookingCta?: { label?: string; href?: string }; highlighted?: boolean };

export function RoomShowcaseSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Zimmer & Suiten';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Aufenthalt';
  const rooms = asList<Room>(data.rooms);
  const footerText = (data.footerText as string) || '';

  const props = { headline, subline, badgeText, rooms, footerText };

  if (styleVariant === 'modern') return <RoomModern {...props} />;
  if (styleVariant === 'bold') return <RoomBold {...props} />;
  return <RoomClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string;
  rooms: Room[]; footerText: string;
};

/* --- CLASSIC --- */
function RoomClassic({ headline, subline, badgeText, rooms, footerText }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600"><Star size={12} className="text-brand-primary" />{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
        {subline && <p className="mt-4 text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <motion.article key={`${room.name}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`overflow-hidden rounded-xl border border-[var(--brand-primary)]/20 bg-white shadow-md ${room.highlighted ? 'ring-2 ring-[var(--brand-primary)]' : ''}`}>
            {room.image && <div className="relative aspect-[4/3]"><Image src={room.image} alt={room.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-gray-900">{room.name || ''}</h3>
                {room.priceLabel && <p className="text-sm font-semibold text-gray-900">{room.priceLabel}</p>}
              </div>
              {room.description && <p className="mt-3 text-sm leading-6 text-gray-600">{room.description}</p>}
              <div className="mt-4 grid gap-2 text-xs text-gray-600">
                {room.sizeLabel && <span className="inline-flex items-center gap-2"><Maximize2 size={13} />{room.sizeLabel}</span>}
                {room.occupancyLabel && <span className="inline-flex items-center gap-2"><Users size={13} />{room.occupancyLabel}</span>}
                {room.bedLabel && <span className="inline-flex items-center gap-2"><BedDouble size={13} />{room.bedLabel}</span>}
              </div>
              {asList<string>(room.features).length > 0 && <p className="mt-4 text-xs text-gray-600">{asList<string>(room.features).join(' / ')}</p>}
              {asList<string>(room.galleryImages).length > 0 && <p className="mt-2 text-xs text-gray-600">{asList<string>(room.galleryImages).length} Bilder</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                {room.detailCta?.label && <a href={room.detailCta.href || '#'} className="inline-flex items-center gap-1 font-semibold text-brand-accent">{room.detailCta.label}<ArrowRight size={15} /></a>}
                {room.bookingCta?.label && <a href={room.bookingCta.href || '#'} className="font-semibold text-gray-600">{room.bookingCta.label}</a>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      {footerText && <p className="mt-6 text-sm text-gray-600">{footerText}</p>}
    </div>
  );
}

/* --- MODERN --- */
function RoomModern({ headline, subline, badgeText, rooms, footerText }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 font-light text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-px border border-black/10 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <article key={`${room.name}-${index}`} className={`overflow-hidden border border-black/10 bg-white ${room.highlighted ? 'bg-black/[0.02]' : ''}`}>
            {room.image && <div className="relative aspect-[4/3]"><Image src={room.image} alt={room.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-light text-gray-900">{room.name || ''}</h3>
                {room.priceLabel && <p className="text-sm font-light text-gray-600">{room.priceLabel}</p>}
              </div>
              {room.description && <p className="mt-3 text-sm font-light leading-7 text-gray-600">{room.description}</p>}
              <div className="mt-4 grid gap-2 text-xs font-light text-gray-600">
                {room.sizeLabel && <span className="inline-flex items-center gap-2"><Maximize2 size={13} />{room.sizeLabel}</span>}
                {room.occupancyLabel && <span className="inline-flex items-center gap-2"><Users size={13} />{room.occupancyLabel}</span>}
                {room.bedLabel && <span className="inline-flex items-center gap-2"><BedDouble size={13} />{room.bedLabel}</span>}
              </div>
              {asList<string>(room.features).length > 0 && <p className="mt-4 text-xs font-light text-gray-600">{asList<string>(room.features).join(' / ')}</p>}
              {asList<string>(room.galleryImages).length > 0 && <p className="mt-2 text-xs font-light text-gray-600">{asList<string>(room.galleryImages).length} Bilder</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                {room.detailCta?.label && <a href={room.detailCta.href || '#'} className="inline-flex items-center gap-1 font-light text-gray-900 underline underline-offset-4">{room.detailCta.label}<ArrowRight size={14} /></a>}
                {room.bookingCta?.label && <a href={room.bookingCta.href || '#'} className="font-light text-gray-600 underline underline-offset-4">{room.bookingCta.label}</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {footerText && <p className="mt-8 text-sm font-light text-gray-600">{footerText}</p>}
    </div>
  );
}

/* --- BOLD --- */
function RoomBold({ headline, subline, badgeText, rooms, footerText }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <article key={`${room.name}-${index}`} className={`overflow-hidden border-2 border-[#111827] bg-white shadow-[4px_4px_0_#111827] ${room.highlighted ? 'ring-2 ring-[var(--brand-primary)]' : ''}`}>
            {room.image && <div className="relative aspect-[4/3]"><Image src={room.image} alt={room.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-black uppercase text-gray-900">{room.name || ''}</h3>
                {room.priceLabel && <p className="text-sm font-black text-gray-900">{room.priceLabel}</p>}
              </div>
              {room.description && <p className="mt-3 text-sm leading-6 text-gray-600">{room.description}</p>}
              <div className="mt-4 grid gap-2 text-xs font-bold text-gray-600">
                {room.sizeLabel && <span className="inline-flex items-center gap-2"><Maximize2 size={13} />{room.sizeLabel}</span>}
                {room.occupancyLabel && <span className="inline-flex items-center gap-2"><Users size={13} />{room.occupancyLabel}</span>}
                {room.bedLabel && <span className="inline-flex items-center gap-2"><BedDouble size={13} />{room.bedLabel}</span>}
              </div>
              {asList<string>(room.features).length > 0 && <p className="mt-4 text-xs text-gray-600">{asList<string>(room.features).join(' / ')}</p>}
              {asList<string>(room.galleryImages).length > 0 && <p className="mt-2 text-xs text-gray-600">{asList<string>(room.galleryImages).length} Bilder</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                {room.detailCta?.label && <a href={room.detailCta.href || '#'} className="inline-flex items-center gap-1 font-black uppercase text-brand-accent">{room.detailCta.label}<ArrowRight size={15} /></a>}
                {room.bookingCta?.label && <a href={room.bookingCta.href || '#'} className="font-bold uppercase text-gray-600">{room.bookingCta.label}</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {footerText && <p className="mt-6 text-sm font-bold text-gray-600">{footerText}</p>}
    </div>
  );
}

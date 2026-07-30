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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]"><Star size={12} className="text-[color:var(--token-rating-star)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <motion.article key={`${room.name || 'item'}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md ${room.highlighted ? 'ring-2 ring-[var(--token-icon)]' : ''}`} data-card data-edit-collection="rooms" data-edit-index={index}>
            {room.image && <div className="relative aspect-[4/3]"><Image data-edit-image="image" src={room.image} alt={room.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="name">{room.name || ''}</h3>
                {room.priceLabel && <p className="text-sm font-semibold text-[color:var(--token-price)]" data-edit-path="priceLabel">{room.priceLabel}</p>}
              </div>
              {room.description && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: room.description }} />}
              <div className="mt-4 grid gap-2 text-xs text-[color:var(--token-muted)]">
                {room.sizeLabel && <span className="inline-flex items-center gap-2"><Maximize2 size={13} />{room.sizeLabel}</span>}
                {room.occupancyLabel && <span className="inline-flex items-center gap-2"><Users size={13} />{room.occupancyLabel}</span>}
                {room.bedLabel && <span className="inline-flex items-center gap-2"><BedDouble size={13} />{room.bedLabel}</span>}
              </div>
              {asList<string>(room.features).length > 0 && <p className="mt-4 text-xs text-[color:var(--token-muted)]">{asList<string>(room.features).join(' / ')}</p>}
              {asList<string>(room.galleryImages).length > 0 && <p className="mt-2 text-xs text-[color:var(--token-muted)]">{asList<string>(room.galleryImages).length} Bilder</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                {room.detailCta?.label && <a href={room.detailCta.href || '#'} className="inline-flex items-center gap-1 font-semibold text-[color:var(--token-link)] hover:text-[color:var(--token-link-hover)]"><span data-edit-path="label">{room.detailCta.label}</span><ArrowRight size={15} /></a>}
                {room.bookingCta?.label && <a href={room.bookingCta.href || '#'} className="font-semibold text-[color:var(--token-muted)]" data-edit-path="label">{room.bookingCta.label}</a>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      {footerText && <p className="mt-6 text-sm text-[color:var(--token-muted)]">{footerText}</p>}
    </div>
  );
}


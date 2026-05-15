'use client';

import Image from 'next/image';
import { ArrowRight, BedDouble, Maximize2, Users } from 'lucide-react';
import { asList, type SectionProps } from './types';

type Room = { name?: string; description?: string; image?: string; galleryImages?: string[]; priceLabel?: string; sizeLabel?: string; occupancyLabel?: string; bedLabel?: string; features?: string[]; detailCta?: { label?: string; href?: string }; bookingCta?: { label?: string; href?: string }; highlighted?: boolean };

export function RoomShowcaseSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Zimmer & Suiten';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Aufenthalt';
  const rooms = asList<Room>(data.rooms);
  const footerText = (data.footerText as string) || '';

  return (
    <div>
      <Header badgeText={badgeText} headline={headline} subline={subline} />
      <div className="grid gap-6 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <article key={`${room.name}-${index}`} className={`overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)] ${room.highlighted ? 'ring-2 ring-[var(--style-badge-bg)]' : ''}`}>
            {room.image && <div className="relative aspect-[4/3]"><Image src={room.image} alt={room.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-[var(--style-text-primary)]">{room.name || ''}</h3>
                {room.priceLabel && <p className="text-sm font-semibold text-[var(--style-text-primary)]">{room.priceLabel}</p>}
              </div>
              {room.description && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{room.description}</p>}
              <div className="mt-4 grid gap-2 text-xs text-[var(--style-text-secondary)]">
                {room.sizeLabel && <span className="inline-flex items-center gap-2"><Maximize2 size={13} />{room.sizeLabel}</span>}
                {room.occupancyLabel && <span className="inline-flex items-center gap-2"><Users size={13} />{room.occupancyLabel}</span>}
                {room.bedLabel && <span className="inline-flex items-center gap-2"><BedDouble size={13} />{room.bedLabel}</span>}
              </div>
              {asList<string>(room.features).length > 0 && <p className="mt-4 text-xs text-[var(--style-text-secondary)]">{asList<string>(room.features).join(' / ')}</p>}
              {asList<string>(room.galleryImages).length > 0 && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{asList<string>(room.galleryImages).length} Bilder</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                {room.detailCta?.label && <a href={room.detailCta.href || '#'} className="inline-flex items-center gap-1 font-semibold text-[var(--style-text-primary)]">{room.detailCta.label}<ArrowRight size={15} /></a>}
                {room.bookingCta?.label && <a href={room.bookingCta.href || '#'} className="font-semibold text-[var(--style-text-secondary)]">{room.bookingCta.label}</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {footerText && <p className="mt-6 text-sm text-[var(--style-text-secondary)]">{footerText}</p>}
    </div>
  );
}

function Header({ badgeText, headline, subline }: { badgeText: string; headline: string; subline: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}


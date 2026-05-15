'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function HotelGallerySection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Galerie';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Einblicke';
  const images = asList<GalleryImage>(data.images);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div>
      <Header badgeText={badgeText} headline={headline} subline={subline} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="group overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)]">
            {image.src && <div className="relative aspect-[4/3]"><Image src={image.src} alt={image.alt || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <figcaption className="p-4">
              {image.category && <p className="text-xs uppercase tracking-widest text-[var(--style-text-secondary)]">{image.category}</p>}
              {image.caption && <p className="mt-1 text-sm text-[var(--style-text-primary)]">{image.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a>}
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


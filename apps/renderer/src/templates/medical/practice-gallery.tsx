'use client';

import { baseHeader, ImageCard, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type GalleryImage = { src?: string; alt?: string; caption?: string; category?: string };

export function PracticeGallerySection({ data }: SectionProps) {
  const header = baseHeader(data, 'Praxisbilder', 'Einblicke');
  const images = asList<GalleryImage>(data.images);
  return <div><SectionHeader {...header} /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((image, index) => <ImageCard key={`${image.src}-${index}`} image={image.src} title={image.caption || image.alt} meta={image.category} />)}</div></div>;
}

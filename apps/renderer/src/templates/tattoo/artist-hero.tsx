'use client';

import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ArtistHeroSection({ data }: Props) {
  const name = (data.name as string) || 'Artist';
  const image = (data.image as string) || '';
  const bio = (data.bio as string) || '';
  const styles = (data.styles as string[]) || [];
  const instagram = (data.instagram as string) || '';
  const experience = (data.experience as string) || '';

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          {image && (
            <div className="relative w-64 h-80 rounded-lg overflow-hidden shrink-0">
              <Image data-edit-image="image" src={image} alt={name} fill className="object-cover" sizes="256px" />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-[color:var(--token-on-dark-heading)] uppercase" data-edit-path="name">{name}</h1>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {styles.map(s => (
                <span key={s} className="text-xs uppercase tracking-wider bg-[color-mix(in_srgb,var(--token-card-bg)_10%,transparent)] text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
            {experience && <p className="mt-4 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_40%,transparent)] text-sm">{experience}</p>}
            {bio && <p className="mt-4 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] leading-relaxed" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: bio }} />}
            {instagram && (
              <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] hover:text-[color:var(--token-on-dark-heading)] transition-colors">
                @{instagram}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

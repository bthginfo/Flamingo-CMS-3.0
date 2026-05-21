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
    <section className="py-20 px-6 bg-neutral-950">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          {image && (
            <div className="relative w-64 h-80 rounded-lg overflow-hidden shrink-0">
              <Image src={image} alt={name} fill className="object-cover" sizes="256px" />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-white uppercase">{name}</h1>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {styles.map(s => (
                <span key={s} className="text-xs uppercase tracking-wider bg-white/10 text-white/70 px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
            {experience && <p className="mt-4 text-white/40 text-sm">{experience}</p>}
            {bio && <p className="mt-4 text-white/60 leading-relaxed" dangerouslySetInnerHTML={{ __html: bio }} />}
            {instagram && (
              <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm text-white/50 hover:text-white transition-colors">
                @{instagram}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

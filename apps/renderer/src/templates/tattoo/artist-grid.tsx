'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Artist = {
  name: string;
  image: string;
  styles: string[];
  bio?: string;
  instagram?: string;
  href?: string;
};

export function ArtistGridSection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Künstler';
  const subline = (data.subline as string) || '';
  const artists = (data.artists as Artist[]) || [];

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-5xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:var(--token-on-dark-heading)/50] max-w-xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group" data-edit-collection="artists" data-edit-index={i}>
              <a href={artist.href || '#'} className="block">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                  {artist.image && <Image src={artist.image} alt={artist.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {artist.instagram && (
                    <div className="absolute top-3 right-3 bg-[var(--token-section-bg-alt)/50] backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] text-[color:var(--token-on-dark-heading)/70]">
                      @{artist.instagram}
                    </div>
                  )}
                </div>
                <h3 className="text-[color:var(--token-on-dark-heading)] font-bold text-lg group-hover:text-[color:var(--token-eyebrow)] transition-colors" data-edit-path="name">{artist.name}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {artist.styles.map(s => (
                    <span key={s} className="text-[10px] uppercase tracking-wider bg-[var(--token-card-bg)/10] text-[color:var(--token-on-dark-heading)/60] px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                {artist.bio && <p className="text-[color:var(--token-on-dark-heading)/40] text-sm mt-2 line-clamp-2">{plain(artist.bio)}</p>}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

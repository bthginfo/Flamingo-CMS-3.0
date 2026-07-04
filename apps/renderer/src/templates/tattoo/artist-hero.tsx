'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Instagram } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ArtistHeroSection({ data }: Props) {
  const name = (data.name as string) || 'Artist';
  const image = (data.image as string) || '';
  const bio = (data.bio as string) || '';
  const styles = (data.styles as string[]) || [];
  const instagram = (data.instagram as string) || '';
  const experience = (data.experience as string) || '';

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-14 items-center md:items-start">
          {image && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative shrink-0">
              <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image data-edit-image="image" src={image} alt={name} fill className="object-cover" sizes="288px" />
              </div>
              <div aria-hidden className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-2xl border-2 border-[var(--token-badge-border)]" />
            </motion.div>
          )}
          <div className="flex-1 text-center md:text-left">
            <motion.h1 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[color:var(--token-heading)]" data-edit-path="name">{name}</motion.h1>
            {styles.length > 0 && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 mt-5 justify-center md:justify-start">
                {styles.map(s => (
                  <span key={s} className="text-xs font-bold uppercase tracking-wider border border-[var(--token-badge-border)] bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)] px-3.5 py-1.5 rounded-full">{s}</span>
                ))}
              </motion.div>
            )}
            {experience && (
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--token-muted)]">
                <Award size={15} className="text-[color:var(--token-icon)]" />
                <span data-edit-path="experience">{experience}</span>
              </p>
            )}
            {bio && <div className="mt-4 max-w-2xl leading-relaxed text-[color:var(--token-body)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: bio }} />}
            {instagram && (
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
                <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 mt-7 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 text-sm font-bold text-[color:var(--token-btn-text)] shadow-lg transition hover:-translate-y-0.5 hover:brightness-110">
                  <Instagram size={16} />
                  @{instagram}
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

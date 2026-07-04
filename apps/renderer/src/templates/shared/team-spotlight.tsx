'use client';

import { motion } from 'framer-motion';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Member = {
  name: string;
  role?: string;
  image?: string;
  quote?: string;
  focus?: string[];
  instagram?: string;
  linkedin?: string;
  email?: string;
};
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TeamSpotlightSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || 'Team';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const members = (data.members as Member[]) || [];
  if (!members.length) return null;

  return (
    <div>
      <div className="mb-12 max-w-3xl">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, i) => (
          <motion.article
            key={`${m.name}-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--token-card-bg)] shadow-md"
            data-edit-collection="members" data-edit-index={i}
          >
            {m.image ? (
              <img data-edit-image="image" src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--token-badge-bg)] text-6xl font-black text-[color:var(--token-badge-text)]">{m.name.charAt(0)}</div>
            )}
            {/* Gradient scrim keeps the name readable on any photo */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="text-lg font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="name">{m.name}</h3>
              {m.role && <p className="text-sm text-[color:var(--token-on-dark-muted)]" data-edit-path="role">{m.role}</p>}

              {/* Reveal on hover: quote or focus chips + social links */}
              <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-44 group-hover:opacity-100">
                {m.quote && <p className="text-sm italic leading-5 text-[color:var(--token-on-dark-body)]"><span className="text-[color:var(--token-quote)]">&ldquo;</span><span data-edit-path="quote">{plain(m.quote)}</span><span className="text-[color:var(--token-quote)]">&rdquo;</span></p>}
                {(m.focus?.length ?? 0) > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.focus!.map((f, fi) => <span key={fi} className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--token-on-dark-heading)] backdrop-blur-sm">{f}</span>)}
                  </div>
                )}
                {(m.instagram || m.linkedin || m.email) && (
                  <div className="mt-3 flex gap-2">
                    {m.instagram && <a href={m.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} auf Instagram`} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[color:var(--token-on-dark-heading)] backdrop-blur-sm transition hover:bg-white/30"><Instagram size={14} /></a>}
                    {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} auf LinkedIn`} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[color:var(--token-on-dark-heading)] backdrop-blur-sm transition hover:bg-white/30"><Linkedin size={14} /></a>}
                    {m.email && <a href={`mailto:${m.email}`} aria-label={`E-Mail an ${m.name}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[color:var(--token-on-dark-heading)] backdrop-blur-sm transition hover:bg-white/30"><Mail size={14} /></a>}
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

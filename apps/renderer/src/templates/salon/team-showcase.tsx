'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { asList, type SectionProps } from './types';

type Member = { name?: string; role?: string; bio?: string; image?: string; specialties?: string[]; bookingCta?: { label?: string; href?: string } };

export function TeamShowcaseSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Team';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Menschen';
  const members = asList<Member>(data.members);

  const props = { headline, subline, badgeText, members };

  return <TeamClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; members: Member[] };

function TeamClassic({ headline, subline, badgeText, members }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {members.map((m, i) => (
          <motion.article key={`${m.name || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md" data-edit-collection="members" data-edit-index={i}>
            {m.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={m.image} alt={m.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {m.role && <span className="inline-block rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold uppercase text-[color:var(--token-eyebrow)]" data-edit-path="role">{m.role}</span>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="name">{m.name || ''}</h3>
              {m.bio && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: m.bio }} />}
              {asList<string>(m.specialties).length > 0 && <p className="mt-2 text-sm text-[color:var(--token-muted)]">{asList<string>(m.specialties).join(' / ')}</p>}
              {m.bookingCta?.label && <a href={m.bookingCta.href || '#'} className="mt-5 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-2 text-sm font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{m.bookingCta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}


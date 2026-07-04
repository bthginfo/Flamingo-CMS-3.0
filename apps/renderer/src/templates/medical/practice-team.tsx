'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Member = { name?: string; role?: string; bio?: string; image?: string };

export function PracticeTeamSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Praxisteam', 'Assistenz');
  const members = asList<Member>(data.members);

  return <Classic header={header} members={members} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; members: Member[] };

function Classic({ header, members }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {members.map((item, index) => (
          <article key={`${item.name}-${index}`} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-edit-collection="members" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.role && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-success)]" data-edit-path="role">{item.role}</p>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</h3>
              {item.bio && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: item.bio }} />}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function Modern({ header, members }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {members.map((item, index) => (
          <article key={`${item.name}-${index}`} className="group overflow-hidden border border-black/10 bg-[var(--token-card-bg)]" data-edit-collection="members" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.role && <p className="text-xs font-light uppercase tracking-widest text-[var(--token-accent)]" data-edit-path="role">{item.role}</p>}
              <h3 className="mt-2 text-xl font-light text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</h3>
              {item.bio && <div className="mt-3 whitespace-pre-line text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: item.bio }} />}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, members }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {members.map((item, index) => (
          <article key={`${item.name || 'item'}-${index}`} className="group overflow-hidden border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)]" data-edit-collection="members" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.role && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-success)]" data-edit-path="role">{item.role}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</h3>
              {item.bio && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: item.bio }} />}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

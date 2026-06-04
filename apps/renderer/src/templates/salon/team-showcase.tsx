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

  if (styleVariant === 'modern') return <TeamModern {...props} />;
  if (styleVariant === 'bold') return <TeamBold {...props} />;
  return <TeamClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; members: Member[] };

function TeamClassic({ headline, subline, badgeText, members }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {members.map((m, i) => (
          <motion.article key={`${m.name}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group overflow-hidden rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] shadow-md">
            {m.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={m.image} alt={m.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {m.role && <span className="inline-block rounded-full bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] px-3 py-1 text-xs font-bold uppercase text-[var(--token-eyebrow, var(--brand-accent))]">{m.role}</span>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading,#18181b)]">{m.name || ''}</h3>
              {m.bio && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: m.bio }} />}
              {asList<string>(m.specialties).length > 0 && <p className="mt-2 text-sm text-[color:var(--token-muted,#52525b)]">{asList<string>(m.specialties).join(' / ')}</p>}
              {m.bookingCta?.label && <a href={m.bookingCta.href || '#'} className="mt-5 inline-flex rounded-full bg-[#111827] px-5 py-2 text-sm font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-md">{m.bookingCta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function TeamModern({ headline, subline, badgeText, members }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {members.map((m, i) => (
          <article key={`${m.name}-${i}`} className="group">
            {m.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={m.image} alt={m.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="mt-4">
              {m.role && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{m.role}</p>}
              <h3 className="mt-2 text-xl font-light text-[color:var(--token-heading,#18181b)]">{m.name || ''}</h3>
              {m.bio && <div className="mt-3 text-sm font-light leading-6 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: m.bio }} />}
              {asList<string>(m.specialties).length > 0 && <p className="mt-2 text-sm font-light text-[color:var(--token-muted,#52525b)]">{asList<string>(m.specialties).join(' / ')}</p>}
              {m.bookingCta?.label && <a href={m.bookingCta.href || '#'} className="mt-4 inline-flex border-b border-[var(--token-card-border,var(--brand-accent,#f39c12))] pb-1 text-sm font-light text-[color:var(--token-heading,#18181b)]">{m.bookingCta.label}</a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TeamBold({ headline, subline, badgeText, members }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {members.map((m, i) => (
          <article key={`${m.name}-${i}`} className="group overflow-hidden border-2 border-[#111827] bg-[#111] shadow-[4px_4px_0_var(--token-eyebrow, var(--brand-accent))]">
            {m.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={m.image} alt={m.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              {m.role && <span className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-3 py-1 text-xs font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)]">{m.role}</span>}
              <h3 className="mt-2 text-xl font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)]">{m.name || ''}</h3>
              {m.bio && <div className="mt-3 text-sm leading-6 text-[color:var(--token-on-dark-heading,#ffffff)/70] rt-content" dangerouslySetInnerHTML={{ __html: m.bio }} />}
              {asList<string>(m.specialties).length > 0 && <p className="mt-2 text-sm text-[color:var(--token-on-dark-heading,#ffffff)/60]">{asList<string>(m.specialties).join(' / ')}</p>}
              {m.bookingCta?.label && <a href={m.bookingCta.href || '#'} className="mt-5 inline-flex bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-5 py-2 text-sm font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{m.bookingCta.label}</a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

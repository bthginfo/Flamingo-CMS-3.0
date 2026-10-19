'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { plain } from '@/lib/strip-html';
import { safeContentUrl } from '@/lib/safe-content-url';

type Member = {
  name: string;
  role?: string;
  image?: string;
  quote?: string;
  focus?: string[];
  instagram?: string;
  linkedin?: string;
  email?: string;
  href?: string;
  imageAlt?: string;
  imagePosition?: string;
};
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TeamSpotlightSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || 'Team';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const members = (data.members as Member[]) || [];
  if (!members.length) return null;

  // The directory keeps qualifications visible on a solid reading surface.
  // It uses ordinary links and no hover-only biography or animation prerequisite.
  if (data.layout === 'directory') {
    const Heading = data.titleAs === 'h1' ? 'h1' : 'h2';
    const MemberHeading = data.titleAs === 'h1' ? 'h2' : 'h3';
    return <div>
      <header className="mb-9 grid gap-4 border-t border-[var(--token-divider)] pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,.7fr)] lg:gap-16">
        {headline && <Heading className="font-display max-w-[21ch] text-[clamp(2.3rem,4.1vw,3.8rem)] font-medium leading-[1.08] tracking-[-.025em] text-[color:var(--token-heading)] [text-wrap:balance]" data-edit-path="headline">{headline}</Heading>}
        {subline && <p className="max-w-[55ch] self-end text-base leading-7 text-[color:var(--token-body)]" data-edit-path="subline">{plain(subline)}</p>}
      </header>
      <div className={`grid gap-x-7 gap-y-10 ${members.length === 1 ? '' : members.length === 2 ? 'sm:grid-cols-2' : members.length > 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {members.map((member, index) => {
          const href = safeContentUrl(member.href || '');
          return <article key={`${member.name}-${index}`} data-edit-collection="members" data-edit-index={index} className={`border-b border-[var(--token-divider)] pb-6 ${members.length === 1 ? 'grid items-center gap-x-12 md:grid-cols-[minmax(220px,.55fr)_minmax(0,1fr)]' : ''}`}>
            {member.image && <figure className={`m-0 mb-5 aspect-[5/4] overflow-hidden bg-[var(--token-section-bg-alt)] ${members.length === 1 ? 'md:mb-0' : ''}`}><img data-edit-image="image" src={member.image} alt={member.imageAlt || member.name} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: member.imagePosition || 'center 25%' }} /></figure>}
            <div>
            <MemberHeading className="font-display text-[1.7rem] font-medium leading-tight text-[color:var(--token-heading)]">{href ? <a href={href} className="group flex items-start justify-between gap-3 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)]" data-edit-link="href"><span data-edit-path="name">{member.name}</span><ArrowUpRight aria-hidden="true" size={18} className="mt-1.5 shrink-0 text-[color:var(--token-icon)]" /></a> : <span data-edit-path="name">{member.name}</span>}</MemberHeading>
            {member.role && <p className="mt-2 text-sm leading-6 text-[color:var(--token-body)]" data-edit-path="role">{member.role}</p>}
            {!!member.focus?.length && <p className="mt-3 text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="focus">{member.focus.join(' · ')}</p>}
            {member.quote && <p className="mt-5 max-w-[55ch] text-base leading-7 text-[color:var(--token-body)]" data-edit-path="quote">{plain(member.quote)}</p>}
            </div>
          </article>;
        })}
      </div>
    </div>;
  }

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
            data-card
          >
            {m.image ? (
              <img data-edit-image="image" src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--token-badge-bg)] text-6xl font-black text-[color:var(--token-badge-text)]">{m.name.charAt(0)}</div>
            )}
            {/* Gradient scrim keeps the name readable on any photo */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(0,0,0,.45),transparent_80%),linear-gradient(to_top,var(--token-image-overlay),transparent)]" />

            <div data-color-context="dark" className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="text-lg font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="name">{m.name}</h3>
              {m.role && <p className="text-sm text-[color:var(--token-on-dark-muted)]" data-edit-path="role">{m.role}</p>}

              {/* Reveal on hover: quote or focus chips + social links */}
              <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-44 group-hover:opacity-100">
                {m.quote && <p className="text-sm italic leading-5 text-[color:var(--token-on-dark-body)]"><span className="text-[color:var(--token-quote)]">&ldquo;</span><span data-edit-path="quote">{plain(m.quote)}</span><span className="text-[color:var(--token-quote)]">&rdquo;</span></p>}
                {(m.focus?.length ?? 0) > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.focus!.map((f, fi) => <span key={fi} className="rounded-full border border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--token-btn-secondary-text)] backdrop-blur-sm">{f}</span>)}
                  </div>
                )}
                {(m.instagram || m.linkedin || m.email) && (
                  <div className="mt-3 flex gap-2">
                    {m.instagram && <a href={m.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} auf Instagram`} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)] backdrop-blur-sm transition hover:brightness-110"><Instagram size={14} /></a>}
                    {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} auf LinkedIn`} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)] backdrop-blur-sm transition hover:brightness-110"><Linkedin size={14} /></a>}
                    {m.email && <a href={`mailto:${m.email}`} aria-label={`E-Mail an ${m.name}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)] backdrop-blur-sm transition hover:brightness-110"><Mail size={14} /></a>}
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

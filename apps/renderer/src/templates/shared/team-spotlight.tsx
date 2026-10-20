'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { plain } from '@/lib/strip-html';
import { safeContentUrl } from '@/lib/safe-content-url';
import { ResilientNextImage } from '@/components/ui/resilient-image';
import { PerspectiveLink } from './perspective-link';
import { action, copy, imageUrl, sourceRows, stringRows } from './perspective-utils';

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
  contactName?: string;
  phone?: string;
};
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TeamSpotlightSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || 'Team';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const members = (data.members as Member[]) || [];
  if (!members.length) return null;

  if (data.layout === 'contactSheet') {
    const Heading = data.titleAs === 'h1' ? 'h1' : 'h2';
    const MemberHeading = data.titleAs === 'h1' ? 'h2' : 'h3';
    const rows = sourceRows<Member>(data.members);
    const preview = rows.length <= 3;
    if (rows.length === 1 && data.titleAs !== 'h1') {
      const { item: member, sourceIndex } = rows[0];
      const image = imageUrl(member.image);
      const href = safeContentUrl(copy(member.href));
      const phone = safeContentUrl(member.phone ? `tel:${copy(member.phone).replace(/[^+\d]/g, '')}` : '');
      const email = safeContentUrl(member.email ? `mailto:${copy(member.email)}` : '');
      const NameHeading = headline ? 'h3' : 'h2';
      return <div className="bg-[var(--token-section-bg)] py-14 md:py-20" data-team-layout="contactSheet" data-team-composition="single"><div className="mx-auto grid max-w-[1224px] items-center gap-x-16 gap-y-7 px-6 sm:px-10 md:grid-cols-[minmax(0,.72fr)_minmax(0,1.3fr)] lg:gap-x-24 lg:px-16">
        {image && <figure data-edit-collection="members" data-edit-index={sourceIndex} className="relative m-0 aspect-[6/5] w-[220px] max-w-full overflow-hidden rounded-[12px] bg-[var(--token-section-bg-alt)] md:w-full"><ResilientNextImage src={image} alt={copy(member.imageAlt) || member.name} fill sizes="(min-width:768px) 360px, 220px" className="object-cover" style={{ objectPosition: copy(member.imagePosition) || 'center 28%' }} data-edit-image="image" /></figure>}
        <div>
          {headline && <h2 data-edit-path="headline" className="font-display max-w-[21ch] text-[clamp(2.3rem,3.8vw,4rem)] font-semibold leading-[1.1] tracking-[-.03em] text-[color:var(--token-heading)]">{headline}</h2>}
          {subline && <p data-edit-path="subline" className="mt-5 max-w-[54ch] text-[1.075rem] leading-[1.8] text-[color:var(--token-body)]">{plain(subline)}</p>}
          <article data-edit-collection="members" data-edit-index={sourceIndex} className={headline || subline ? 'mt-6' : ''}>
            <NameHeading className="font-display text-[1.75rem] font-semibold leading-[1.2] tracking-[-.02em] text-[color:var(--token-heading)]">{href ? <a href={href} className="inline-flex min-h-11 items-center gap-4 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-link)]"><span data-edit-path="name">{member.name}</span><span data-edit-link="href"><ArrowUpRight aria-hidden="true" size={21} className="text-[color:var(--token-link)]" /></span></a> : <span data-edit-path="name">{member.name}</span>}</NameHeading>
            {member.role && <p data-edit-path="role" className="mt-2 max-w-[52ch] text-base leading-[1.75] text-[color:var(--token-body)]">{member.role}</p>}
            {stringRows(member.focus).length > 0 && <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm leading-6 text-[color:var(--token-muted)]">{stringRows(member.focus).map(({ value, sourceIndex: focusIndex }) => <li key={focusIndex} data-edit-path={`focus.${focusIndex}`}>{value}</li>)}</ul>}
            {(member.contactName || phone || email) && <address className="mt-5 space-y-1 border-t border-[var(--token-divider)] pt-4 text-sm not-italic leading-6 text-[color:var(--token-body)]">{member.contactName && <p data-edit-path="contactName">{member.contactName}</p>}{phone && <a href={phone} data-edit-link="phone" data-edit-path="phone" className="block w-fit py-1 text-[color:var(--token-link)] underline-offset-4 hover:underline">{member.phone}</a>}{email && <a href={email} data-edit-link="email" data-edit-path="email" className="block w-fit break-all py-1 text-[color:var(--token-link)] underline-offset-4 hover:underline">{member.email}</a>}</address>}
          </article>
          <PerspectiveLink cta={action(data.cta)} className="mt-5" />
        </div>
      </div></div>;
    }
    return <div className="bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]" data-team-layout="contactSheet"><div className={`mx-auto max-w-[1512px] px-6 sm:px-10 lg:px-16 ${data.titleAs === 'h1' ? 'py-10 md:py-16' : 'py-16 md:py-24'}`}>
      <header className="mb-10 grid items-end gap-6 lg:mb-14 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
        {headline && <Heading data-edit-path="headline" className={`font-display max-w-[18ch] whitespace-pre-line font-semibold leading-[1.04] tracking-[-.035em] text-[color:var(--token-heading)] [text-wrap:balance] ${data.titleAs === 'h1' ? 'text-[clamp(3.3rem,7.8vw,8.25rem)]' : 'text-[clamp(2.8rem,5.8vw,6.2rem)]'}`}>{headline}</Heading>}
        {subline && <p data-edit-path="subline" className="max-w-[55ch] text-[1.1rem] leading-[1.8] text-[color:var(--token-body)]">{plain(subline)}</p>}
      </header>
      <div className={`grid gap-x-7 gap-y-12 md:gap-y-16 ${preview ? (rows.length === 1 ? '' : rows.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3') : 'md:grid-cols-2 md:gap-x-12 lg:gap-x-16'}`}>
        {rows.map(({ item: member, sourceIndex }, visibleIndex) => {
          const href = safeContentUrl(copy(member.href));
          const image = imageUrl(member.image);
          const finalWide = !preview && rows.length % 2 === 1 && visibleIndex === rows.length - 1;
          const phone = safeContentUrl(member.phone ? `tel:${copy(member.phone).replace(/[^+\d]/g, '')}` : '');
          const email = safeContentUrl(member.email ? `mailto:${copy(member.email)}` : '');
          const focus = stringRows(member.focus);
          return <article key={`${member.name}-${sourceIndex}`} data-edit-collection="members" data-edit-index={sourceIndex} className={`min-w-0 border-b border-[var(--token-divider)] pb-7 ${finalWide ? 'md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-12 lg:gap-16' : ''}`}>
            {image && <figure className={`relative m-0 mb-6 overflow-hidden rounded-[12px] bg-[var(--token-section-bg-alt)] ${preview ? 'aspect-[6/5]' : 'aspect-[7/5]'} ${finalWide ? 'md:mb-0' : ''}`}><ResilientNextImage src={image} alt={copy(member.imageAlt) || member.name} fill sizes={preview && rows.length === 3 ? '(min-width:768px) 33vw, 100vw' : '(min-width:768px) 48vw, 100vw'} className="object-cover" style={{ objectPosition: copy(member.imagePosition) || 'center 28%' }} data-edit-image="image" priority={data.titleAs === 'h1' && visibleIndex < 2} /></figure>}
            <div>
              <MemberHeading className={`font-display font-semibold leading-[1.15] tracking-[-.025em] text-[color:var(--token-heading)] ${preview ? 'text-[clamp(1.65rem,2.3vw,2.65rem)]' : 'text-[clamp(1.8rem,3vw,3rem)]'}`}>{href ? <a href={href} className="group flex min-h-11 items-start justify-between gap-4 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-link)]"><span data-edit-path="name">{member.name}</span><span data-edit-link="href"><ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.5} className="mt-1 shrink-0 text-[color:var(--token-link)]" /></span></a> : <span data-edit-path="name">{member.name}</span>}</MemberHeading>
              {member.role && <p data-edit-path="role" className="mt-3 max-w-[49ch] text-base leading-[1.75] text-[color:var(--token-body)]">{member.role}</p>}
              {focus.length > 0 && <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm leading-6 text-[color:var(--token-muted)]">{focus.map(({ value, sourceIndex: focusIndex }) => <li key={focusIndex} data-edit-path={`focus.${focusIndex}`}>{value}</li>)}</ul>}
              {(member.contactName || member.phone || member.email) && <address className="mt-6 space-y-1 border-t border-[var(--token-divider)] pt-4 text-sm not-italic leading-6 text-[color:var(--token-body)]">
                {member.contactName && <p data-edit-path="contactName" className="font-medium text-[color:var(--token-heading)]">{member.contactName}</p>}
                {phone && <a href={phone} data-edit-link="phone" className="block w-fit min-h-8 py-1 text-[color:var(--token-link)] underline-offset-4 hover:text-[color:var(--token-link-hover)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"><span data-edit-path="phone">{member.phone}</span></a>}
                {email && <a href={email} data-edit-link="email" className="block w-fit min-h-8 break-all py-1 text-[color:var(--token-link)] underline-offset-4 hover:text-[color:var(--token-link-hover)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"><span data-edit-path="email">{member.email}</span></a>}
              </address>}
            </div>
          </article>;
        })}
      </div>
      <PerspectiveLink cta={action(data.cta)} className="mt-8 md:mt-10" />
    </div></div>;
  }

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

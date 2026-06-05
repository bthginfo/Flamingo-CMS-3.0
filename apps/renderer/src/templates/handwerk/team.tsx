'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type TeamMember = { name: string; role: string; image?: string; bio?: string };
type ValueItem = { icon?: string; title: string; text: string; image?: string; mediaType?: 'icon' | 'image' };

export function TeamSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const storyHeadline = (data.storyHeadline as string) || '';
  const storyText = (data.storyText as string) || '';
  const storyImage = (data.storyImage as string) || '';
  const valuesHeadline = (data.valuesHeadline as string) || 'Unsere Werte';
  const membersHeadline = (data.membersHeadline as string) || 'Unser Team';
  const members = (data.members as TeamMember[]) || [];
  const values = (data.values as ValueItem[]) || [];
  const stats = (data.stats as { value: string; label: string }[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const common = { headline, subline, badgeText, storyHeadline, storyText, storyImage, valuesHeadline, membersHeadline, members, values, stats, ref, inView };

  if (styleVariant === 'modern') return <TeamModern {...common} />;
  if (styleVariant === 'bold') return <TeamBold {...common} />;
  return <TeamClassic {...common} />;
}

type TProps = {
  headline: string; subline: string; badgeText: string;
  storyHeadline: string; storyText: string; storyImage: string;
  valuesHeadline: string; membersHeadline: string;
  members: TeamMember[]; values: ValueItem[]; stats: { value: string; label: string }[];
  ref: React.RefObject<HTMLDivElement | null>; inView: boolean;
};

/* ─── CLASSIC ─── */
function TeamClassic({ headline, subline, badgeText, storyHeadline, storyText, storyImage, valuesHeadline, membersHeadline, members, values, stats, ref, inView }: TProps) {
  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-20">
        {badgeText && <div className="section-badge"><span>{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      {(storyHeadline || storyText) && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col lg:flex-row gap-12 lg:gap-8 lg:gap-16 items-center mb-12 md:mb-24">
          {storyImage && (
            <div className="w-full lg:w-1/2"><div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl"><Image src={storyImage} alt={storyHeadline || ''} fill className="object-cover" sizes="50vw" /></div></div>
          )}
          <div className={storyImage ? 'w-full lg:w-1/2' : 'w-full max-w-3xl mx-auto'}>
            {storyHeadline && <h3 className="font-display mb-4 text-2xl font-bold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] lg:text-3xl">{storyHeadline}</h3>}
            {storyText && <div className="rt-content whitespace-pre-line text-lg leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#6b7280)))]" dangerouslySetInnerHTML={{ __html: storyText }} />}
          </div>
        </motion.div>
      )}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 md:mb-24">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08)))] bg-[var(--token-card-bg, var(--style-card-bg,rgba(0,0,0,0.03)))] p-6 text-center" data-edit-collection="stats" data-edit-index={i}>
              <div className="font-display mb-1 text-3xl font-bold text-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))] lg:text-4xl">{s.value}</div>
              <div className="text-sm text-[var(--style-text-secondary,var(--token-muted, var(--style-text-muted,#6b7280)))]">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {values.length > 0 && (
        <div className="mb-12 md:mb-24">
          <h3 className="font-display mb-12 text-center text-2xl font-bold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{valuesHeadline}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="group rounded-2xl border border-[var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08)))] bg-[var(--token-card-bg, var(--style-card-bg,#ffffff))] p-8 shadow-sm transition-all hover:shadow-lg" data-edit-collection="values" data-edit-index={i}>
                {v.icon && <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]/10 transition-transform group-hover:scale-110"><DynamicIcon name={v.icon} size={28} className="text-[var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--token-icon, var(--brand-primary)))))]" /></div>}
                <h4 className="mb-2 text-lg font-semibold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]" data-edit-path="title">{v.title}</h4>
                <div className="rt-content text-sm leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#6b7280)))]" dangerouslySetInnerHTML={{ __html: v.text }} />
              </div>
            ))}
          </div>
        </div>
      )}
      {members.length > 0 && (
        <div>
          <h3 className="font-display mb-12 text-center text-2xl font-bold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{membersHeadline}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((m, i) => (
              <div key={i} className="text-center group" data-edit-collection="members" data-edit-index={i}>
                <div className="relative w-48 h-48 mx-auto mb-5 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="200px" /> : <div className="flex h-full w-full items-center justify-center bg-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]/5"><DynamicIcon name="users" size={48} className="text-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]/30" /></div>}
                </div>
                <h4 className="text-lg font-semibold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]" data-edit-path="name">{m.name}</h4>
                <p className="mb-2 text-sm font-medium text-[var(--style-accent-color,var(--token-icon, var(--brand-primary)))]" data-edit-path="role">{m.role}</p>
                {m.bio && <div className="rt-content mx-auto max-w-xs text-sm text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#6b7280)))]" dangerouslySetInnerHTML={{ __html: m.bio }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MODERN: Large photos, overlaid text, clean lines ─── */
function TeamModern({ headline, subline, badgeText, storyHeadline, storyText, storyImage, membersHeadline, members, values, valuesHeadline, stats, ref, inView }: TProps) {
  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12 md:mb-20">
        {badgeText && <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-wide text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af)))]"><span className="h-px w-8 bg-[var(--token-card-border, var(--style-border-color,#d1d5db))]" />{badgeText}</div>}
        {headline && <h2 className="text-4xl font-light tracking-tight text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] md:text-5xl lg:text-3xl" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="rt-content mt-4 max-w-2xl text-lg text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#9ca3af)))]" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      {(storyHeadline || storyText) && (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center mb-12 md:mb-24">
          {storyImage && <div className="w-full lg:w-1/2"><div className="relative aspect-[3/2] rounded-lg overflow-hidden"><Image src={storyImage} alt="" fill className="object-cover" sizes="50vw" /></div></div>}
          <div className={storyImage ? 'w-full lg:w-1/2' : 'max-w-2xl'}>
            {storyHeadline && <h3 className="mb-4 text-2xl font-light text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{storyHeadline}</h3>}
            {storyText && <div className="rt-content whitespace-pre-line leading-loose text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#9ca3af)))]" dangerouslySetInnerHTML={{ __html: storyText }} />}
          </div>
        </div>
      )}
      {stats.length > 0 && (
        <div className="flex flex-wrap gap-8 md:gap-12 mb-24 justify-center">
          {stats.map((s, i) => <div key={i} className="text-center" data-edit-collection="stats" data-edit-index={i}><div className="text-4xl font-light text-[var(--style-accent-color,var(--token-heading, var(--style-heading-color,#111827)))]">{s.value}</div><div className="mt-1 text-xs uppercase tracking-wider text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af)))]">{s.label}</div></div>)}
        </div>
      )}
      {members.length > 0 && (
        <div>
          <h3 className="mb-10 text-xl font-light text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{membersHeadline}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {members.map((m, i) => (
              <div key={i} className="group" data-edit-collection="members" data-edit-index={i}>
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                  {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0" sizes="300px" /> : <div className="h-full w-full bg-[var(--token-card-bg, var(--style-card-bg,#f3f4f6))]" />}
                </div>
                <h4 className="font-medium text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]" data-edit-path="name">{m.name}</h4>
                <p className="text-sm text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af)))]" data-edit-path="role">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── BOLD: Angular, accent stripe, thick borders ─── */
function TeamBold({ headline, subline, badgeText, storyHeadline, storyText, storyImage, membersHeadline, members, values, valuesHeadline, stats, ref, inView }: TProps) {
  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12">
        {badgeText && <span className="mb-4 inline-block bg-[var(--token-badge-bg, var(--style-badge-bg,var(--style-accent-color,var(--token-eyebrow, var(--brand-accent)))))] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text, var(--style-badge-text,var(--token-section-bg-alt, var(--brand-dark))))]">{badgeText}</span>}
        {headline && <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))] lg:text-4xl" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="rt-content mt-3 font-medium text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#6b7280)))]" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      {(storyHeadline || storyText) && (
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-10 md:mb-16">
          {storyImage && <div className="w-full lg:w-1/2"><div className="relative aspect-[4/3] overflow-hidden border-3 border-[var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827)))] shadow-[6px_6px_0_var(--style-text-primary,#0d2137)]"><Image src={storyImage} alt="" fill className="object-cover" sizes="50vw" /></div></div>}
          <div className={storyImage ? 'w-full lg:w-1/2' : 'max-w-2xl'}>
            {storyHeadline && <h3 className="mb-3 text-xl font-bold uppercase text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{storyHeadline}</h3>}
            {storyText && <div className="rt-content whitespace-pre-line leading-relaxed text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563)))]" dangerouslySetInnerHTML={{ __html: storyText }} />}
          </div>
        </div>
      )}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 md:mb-16">
          {stats.map((s, i) => (
            <div key={i} className="bg-[var(--token-card-bg, var(--style-card-bg,var(--token-section-bg-alt, var(--brand-dark))))] p-5 text-center text-[var(--style-text-primary,#ffffff)]" data-edit-collection="stats" data-edit-index={i}>
              <div className="text-2xl font-black text-[var(--style-accent-color,var(--token-eyebrow, var(--brand-accent)))]">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--token-muted, var(--style-text-muted,rgba(255,255,255,0.60)))]">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {members.length > 0 && (
        <div>
          <h3 className="mb-8 text-xl font-bold uppercase text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]">{membersHeadline}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m, i) => (
              <div key={i} className="flex items-start gap-4 border-3 border-[var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827)))] bg-[var(--token-card-bg, var(--style-card-bg,transparent))] p-4 shadow-[3px_3px_0_var(--style-accent-color,#f39c12)]" data-edit-collection="members" data-edit-index={i}>
                <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                  {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover" sizes="80px" /> : <div className="h-full w-full bg-[var(--token-muted, var(--style-text-muted,#e5e7eb))]" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827)))]" data-edit-path="name">{m.name}</h4>
                  <p className="text-xs font-bold uppercase text-[var(--style-accent-color,var(--token-eyebrow, var(--brand-accent)))]" data-edit-path="role">{m.role}</p>
                  {m.bio && <div className="rt-content mt-1 text-xs text-[var(--token-body, var(--style-body-color,var(--style-text-secondary,#6b7280)))]" dangerouslySetInnerHTML={{ __html: m.bio }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ResilientNextImage as Image } from '@/components/ui/resilient-image';
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
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      {(storyHeadline || storyText) && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col lg:flex-row gap-10 md:gap-12 lg:gap-16 items-center mb-12 md:mb-24">
          {storyImage && (
            <div className="w-full lg:w-1/2"><div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl"><Image data-edit-image="storyImage" src={storyImage} alt={storyHeadline || ''} fill className="object-cover" sizes="50vw" /></div></div>
          )}
          <div className={storyImage ? 'w-full lg:w-1/2' : 'w-full max-w-3xl mx-auto'}>
            {storyHeadline && <h3 className="font-display mb-4 text-2xl font-bold text-[color:var(--token-heading)] lg:text-3xl">{storyHeadline}</h3>}
            {storyText && <div className="rt-content whitespace-pre-line text-lg leading-relaxed text-[color:var(--token-body)]" data-edit-rich="storyText" dangerouslySetInnerHTML={{ __html: storyText }} />}
          </div>
        </motion.div>
      )}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 md:mb-24">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 text-center" data-card data-edit-collection="stats" data-edit-index={i}>
              <div className="font-display mb-1 text-3xl font-bold text-[color:var(--token-stat-value)] lg:text-4xl" data-edit-path="value">{s.value}</div>
              <div className="text-sm text-[color:var(--token-body)]" data-edit-path="label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {values.length > 0 && (
        <div className="mb-12 md:mb-24">
          <h3 className="font-display mb-12 text-center text-2xl font-bold text-[color:var(--token-heading)]">{valuesHeadline}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="group rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-8 shadow-sm transition-all hover:shadow-lg" data-card data-edit-collection="values" data-edit-index={i}>
                {v.icon && <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--token-accent)_10%,transparent)] transition-transform group-hover:scale-110"><DynamicIcon editPath="icon" name={v.icon} size={28} className="text-[color:var(--token-icon)]" /></div>}
                <h4 className="mb-2 text-lg font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{v.title}</h4>
                <div className="rt-content text-sm leading-relaxed text-[color:var(--token-body)]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: v.text }} />
              </div>
            ))}
          </div>
        </div>
      )}
      {members.length > 0 && (
        <div>
          <h3 className="font-display mb-12 text-center text-2xl font-bold text-[color:var(--token-heading)]">{membersHeadline}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((m, i) => (
              <div key={i} className="text-center group" data-edit-collection="members" data-edit-index={i}>
                <div className="relative w-48 h-48 mx-auto mb-5 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  {m.image ? <Image data-edit-image="image" src={m.image} alt={m.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="200px" /> : <div className="flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--token-accent)_5%,transparent)]"><DynamicIcon name="users" size={48} className="text-[color-mix(in_srgb,var(--token-accent)_30%,transparent)]" /></div>}
                </div>
                <h4 className="text-lg font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{m.name}</h4>
                <p className="mb-2 text-sm font-medium text-[color:var(--token-card-muted)]" data-edit-path="role">{m.role}</p>
                {m.bio && <div className="rt-content mx-auto max-w-xs text-sm text-[color:var(--token-body)]" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: m.bio }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


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
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      {(storyHeadline || storyText) && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col lg:flex-row gap-12 lg:gap-8 lg:gap-16 items-center mb-12 md:mb-24">
          {storyImage && (
            <div className="w-full lg:w-1/2"><div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl"><Image src={storyImage} alt={storyHeadline || ''} fill className="object-cover" sizes="50vw" /></div></div>
          )}
          <div className={storyImage ? 'w-full lg:w-1/2' : 'w-full max-w-3xl mx-auto'}>
            {storyHeadline && <h3 className="font-display font-bold text-2xl lg:text-3xl mb-4 text-gray-900">{storyHeadline}</h3>}
            {storyText && <div className="text-gray-500 leading-relaxed text-lg whitespace-pre-line rt-content" dangerouslySetInnerHTML={{ __html: storyText }} />}
          </div>
        </motion.div>
      )}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 md:mb-24">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-primary/[0.03] to-brand-secondary/[0.03] border border-gray-100">
              <div className="font-display font-bold text-3xl lg:text-4xl text-brand-primary mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {values.length > 0 && (
        <div className="mb-12 md:mb-24">
          <h3 className="font-display font-bold text-2xl text-center mb-12">{valuesHeadline}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                {v.icon && <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"><DynamicIcon name={v.icon} size={28} className="text-brand-primary" /></div>}
                <h4 className="font-semibold text-lg mb-2">{v.title}</h4>
                <div className="text-gray-500 text-sm leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />
              </div>
            ))}
          </div>
        </div>
      )}
      {members.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-2xl text-center mb-12">{membersHeadline}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((m, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-5 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="200px" /> : <div className="w-full h-full bg-brand-primary/5 flex items-center justify-center"><DynamicIcon name="users" size={48} className="text-brand-primary/30" /></div>}
                </div>
                <h4 className="font-semibold text-lg">{m.name}</h4>
                <p className="text-sm text-brand-primary font-medium mb-2">{m.role}</p>
                {m.bio && <div className="text-gray-500 text-sm max-w-xs mx-auto rt-content" dangerouslySetInnerHTML={{ __html: m.bio }} />}
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
        {badgeText && <div className="flex items-center gap-3 text-sm text-gray-400 mb-4 tracking-wide uppercase"><span className="w-8 h-px bg-gray-300" />{badgeText}</div>}
        {headline && <h2 className="text-4xl lg:text-3xl md:text-5xl font-light text-gray-900 tracking-tight">{headline}</h2>}
        {subline && <div className="text-lg text-gray-400 mt-4 max-w-2xl rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      {(storyHeadline || storyText) && (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center mb-12 md:mb-24">
          {storyImage && <div className="w-full lg:w-1/2"><div className="relative aspect-[3/2] rounded-lg overflow-hidden"><Image src={storyImage} alt="" fill className="object-cover" sizes="50vw" /></div></div>}
          <div className={storyImage ? 'w-full lg:w-1/2' : 'max-w-2xl'}>
            {storyHeadline && <h3 className="text-2xl font-light text-gray-900 mb-4">{storyHeadline}</h3>}
            {storyText && <div className="text-gray-400 leading-loose whitespace-pre-line rt-content" dangerouslySetInnerHTML={{ __html: storyText }} />}
          </div>
        </div>
      )}
      {stats.length > 0 && (
        <div className="flex flex-wrap gap-8 md:gap-12 mb-24 justify-center">
          {stats.map((s, i) => <div key={i} className="text-center"><div className="text-4xl font-light text-gray-900">{s.value}</div><div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{s.label}</div></div>)}
        </div>
      )}
      {members.length > 0 && (
        <div>
          <h3 className="text-xl font-light text-gray-900 mb-10">{membersHeadline}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {members.map((m, i) => (
              <div key={i} className="group">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                  {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" sizes="300px" /> : <div className="w-full h-full bg-gray-100" />}
                </div>
                <h4 className="font-medium text-gray-900">{m.name}</h4>
                <p className="text-sm text-gray-400">{m.role}</p>
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
        {badgeText && <span className="inline-block bg-brand-accent text-brand-dark font-bold text-xs uppercase tracking-widest px-3 py-1.5 mb-4">{badgeText}</span>}
        {headline && <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight">{headline}</h2>}
        {subline && <div className="text-gray-500 mt-3 font-medium rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      {(storyHeadline || storyText) && (
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-10 md:mb-16">
          {storyImage && <div className="w-full lg:w-1/2"><div className="relative aspect-[4/3] overflow-hidden border-3 border-gray-900 shadow-[6px_6px_0_#0d2137]"><Image src={storyImage} alt="" fill className="object-cover" sizes="50vw" /></div></div>}
          <div className={storyImage ? 'w-full lg:w-1/2' : 'max-w-2xl'}>
            {storyHeadline && <h3 className="text-xl font-bold uppercase mb-3">{storyHeadline}</h3>}
            {storyText && <div className="text-gray-600 leading-relaxed whitespace-pre-line rt-content" dangerouslySetInnerHTML={{ __html: storyText }} />}
          </div>
        </div>
      )}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 md:mb-16">
          {stats.map((s, i) => (
            <div key={i} className="bg-brand-dark text-white p-5 text-center">
              <div className="text-2xl font-black text-brand-accent">{s.value}</div>
              <div className="text-xs uppercase tracking-wider mt-1 text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {members.length > 0 && (
        <div>
          <h3 className="font-bold text-xl uppercase mb-8">{membersHeadline}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m, i) => (
              <div key={i} className="flex gap-4 items-start p-4 border-3 border-gray-900 shadow-[3px_3px_0_#f39c12]">
                <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                  {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover" sizes="80px" /> : <div className="w-full h-full bg-gray-200" />}
                </div>
                <div>
                  <h4 className="font-bold uppercase text-sm">{m.name}</h4>
                  <p className="text-xs text-brand-accent font-bold uppercase">{m.role}</p>
                  {m.bio && <div className="text-gray-500 text-xs mt-1 rt-content" dangerouslySetInnerHTML={{ __html: m.bio }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

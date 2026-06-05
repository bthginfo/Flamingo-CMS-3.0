'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type TeamMember = { name: string; role?: string; specialization?: string; image?: string; phone?: string; email?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ConsultingTeamSection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Anwälte';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const members = (data.members as TeamMember[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12 md:mb-16">
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className="group text-center"
           data-edit-collection="members" data-edit-index={i}>
            {member.image && (
              <div className="w-48 h-48 mx-auto mb-5 rounded-full overflow-hidden border-4 border-[color:var(--token-card-border)] shadow-md group-hover:border-[var(--token-card-border)/30] transition-colors">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{member.name}</h3>
            {member.role && <p className="text-[color:var(--token-icon)] font-medium text-sm mt-1" data-edit-path="role">{member.role}</p>}
            {member.specialization && <p className="text-[color:var(--token-muted)] text-sm mt-1">{member.specialization}</p>}
            <div className="flex items-center justify-center gap-4 mt-4">
              {member.phone && (
                <a href={`tel:$<span data-edit-path="phone">{member.phone}</span>`} className="text-[color:var(--token-body)] hover:text-[color:var(--token-icon)] transition-colors">
                  <DynamicIcon name="phone" size={16} />
                </a>
              )}
              {member.email && (
                <a href={`mailto:$<span data-edit-path="email">{member.email}</span>`} className="text-[color:var(--token-body)] hover:text-[color:var(--token-icon)] transition-colors">
                  <DynamicIcon name="mail" size={16} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

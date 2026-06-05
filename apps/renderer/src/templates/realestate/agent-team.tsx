'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Agent = {
  name: string;
  role: string;
  image: string;
  specialization: string;
  phone?: string;
  email?: string;
  soldCount?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function AgentTeamSection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Makler';
  const subline = (data.subline as string) || '';
  const agents = (data.agents as Agent[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-lg text-[color:var(--token-muted,#52525b)] mt-4" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--token-card-bg,#ffffff)] rounded-xl border border-[color:var(--token-card-border,#f4f4f5)] overflow-hidden hover:shadow-lg transition-shadow"
             data-edit-collection="agents" data-edit-index={i}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={agent.image} alt={agent.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[color:var(--token-heading,#18181b)]" data-edit-path="name">{agent.name}</h3>
                <p className="text-sm text-[color:var(--token-icon,var(--brand-primary,#1a5276))] font-medium" data-edit-path="role">{agent.role}</p>
                <p className="text-sm text-[color:var(--token-muted,#71717a)] mt-1">{agent.specialization}</p>
                {agent.soldCount && (
                  <p className="text-xs text-[color:var(--token-body,#a1a1aa)] mt-2">{agent.soldCount} vermittelte Objekte</p>
                )}
                <div className="flex gap-3 mt-4 pt-4 border-t border-[color:var(--token-card-border,#f4f4f5)]">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-1.5 text-xs text-[color:var(--token-muted,#52525b)] hover:text-[color:var(--token-icon,var(--brand-primary,#1a5276))] transition-colors">
                      <Phone size={14} /><span data-edit-path="phone">{agent.phone}</span>
                    </a>
                  )}
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-1.5 text-xs text-[color:var(--token-muted,#52525b)] hover:text-[color:var(--token-icon,var(--brand-primary,#1a5276))] transition-colors">
                      <Mail size={14} />E-Mail
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

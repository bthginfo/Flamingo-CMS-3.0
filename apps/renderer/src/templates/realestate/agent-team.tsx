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
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-lg text-[color:var(--token-muted)] mt-4" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--token-card-bg)] rounded-xl border border-[color:var(--token-card-border)] overflow-hidden hover:shadow-lg transition-shadow"
             data-edit-collection="agents" data-edit-index={i} data-card>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image data-edit-image="image" src={agent.image} alt={agent.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[color:var(--token-heading)]" data-edit-path="name">{agent.name}</h3>
                <p className="text-sm text-[color:var(--token-icon)] font-medium" data-edit-path="role">{agent.role}</p>
                <p className="text-sm text-[color:var(--token-muted)] mt-1">{agent.specialization}</p>
                {agent.soldCount && (
                  <p className="text-xs text-[color:var(--token-body)] mt-2">{agent.soldCount} vermittelte Objekte</p>
                )}
                <div className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-[color:var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-section-bg-alt,#f8fafc)_58%,var(--token-card-bg,#fff))] p-2">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex min-w-0 items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-medium text-[color:var(--token-body)] hover:text-[color:var(--token-icon)] transition-colors">
                      <Phone size={14} /><span data-edit-path="phone">{agent.phone}</span>
                    </a>
                  )}
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-medium text-[color:var(--token-body)] hover:text-[color:var(--token-icon)] transition-colors">
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

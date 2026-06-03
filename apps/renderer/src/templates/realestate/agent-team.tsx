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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{headline}</h2>
          {subline && <p className="text-lg text-gray-600 mt-4">{plain(subline)}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={agent.image} alt={agent.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                <p className="text-sm text-brand-primary font-medium">{agent.role}</p>
                <p className="text-sm text-gray-500 mt-1">{agent.specialization}</p>
                {agent.soldCount && (
                  <p className="text-xs text-gray-400 mt-2">{agent.soldCount} vermittelte Objekte</p>
                )}
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-brand-primary transition-colors">
                      <Phone size={14} />{agent.phone}
                    </a>
                  )}
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-brand-primary transition-colors">
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

'use client';

import { motion } from 'framer-motion';
import { Camera, MessageCircle, CalendarCheck, Image as ImageIcon, Heart, Send } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Step = { title: string; text: string; icon?: string };

const ICONS: Record<string, React.ElementType> = {
  camera: Camera, message: MessageCircle, calendar: CalendarCheck,
  image: ImageIcon, heart: Heart, send: Send,
};

export function ShootingProcessSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'So läuft es ab';
  const headline = (data.headline as string) || 'Euer Weg zu perfekten Fotos';
  const subline = (data.subline as string) || '';
  const steps = (data.steps as Step[]) || [];

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[var(--token-divider)]" />
          <div className="space-y-10 md:space-y-16">
            {steps.map((step, i) => {
              const Icon = ICONS[(step.icon || 'camera').toLowerCase()] || Camera;
              const isLeft = i % 2 === 0;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative md:grid md:grid-cols-2 md:gap-12 items-center pl-16 md:pl-0">
                  <div className="absolute left-6 md:left-1/2 top-0 -translate-x-1/2 w-12 h-12 rounded-full bg-[var(--token-card-bg)] border-2 border-[color-mix(in_srgb,var(--token-card-border)_20%,transparent)] flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-[color:var(--token-icon)]" />
                  </div>
                  <div className={`${isLeft ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                    <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                      <span className="text-xs font-bold text-[color:var(--token-icon)] uppercase tracking-wider">Schritt {i + 1}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{step.title}</h3>
                    <div className="text-[color:var(--token-muted)] mt-1 md:mt-2 text-sm md:text-base rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: step.text }} />
                  </div>
                  {isLeft && <div className="hidden md:block" />}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

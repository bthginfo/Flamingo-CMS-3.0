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
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-gray-900 mb-16 break-words">{headline}</h2>
          <div className="space-y-0">
            {steps.map((step, i) => {
              const Icon = ICONS[(step.icon || 'camera').toLowerCase()] || Camera;
              return (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex gap-8 border-t border-gray-200 py-8">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-light text-gray-900 text-lg">{step.title}</h3>
                    <div className="text-gray-500 text-sm mt-2 rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section data-theme="dark" className="py-16 md:py-24 px-4 md:px-6 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-brand-accent text-black text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words">{headline}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step, i) => {
              const Icon = ICONS[(step.icon || 'camera').toLowerCase()] || Camera;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-brand-accent font-black text-2xl">{String(i + 1).padStart(2, '0')}</span>
                    <Icon className="w-5 h-5 text-brand-accent" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <div className="text-white/60 text-sm rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-brand-primary/[0.02]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-brand-primary/15" />
          <div className="space-y-10 md:space-y-16">
            {steps.map((step, i) => {
              const Icon = ICONS[(step.icon || 'camera').toLowerCase()] || Camera;
              const isLeft = i % 2 === 0;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative md:grid md:grid-cols-2 md:gap-12 items-center pl-16 md:pl-0">
                  <div className="absolute left-6 md:left-1/2 top-0 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 border-brand-primary/20 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className={`${isLeft ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                    <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Schritt {i + 1}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">{step.title}</h3>
                    <div className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />
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

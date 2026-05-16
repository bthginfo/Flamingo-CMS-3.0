'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingFaqSection({ data }: Props) {
  const badge = (data.badge as string) || 'FAQ';
  const headline = (data.headline as string) || 'Häufige Fragen';
  const items = (data.items as Array<{ question: string; answer: string }>) || [];

  return (
    <section className="py-24 px-6 bg-brand-primary/[0.02]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{answer}</div>}
    </motion.div>
  );
}

export function WeddingGallerySection({ data }: Props) {
  const badge = (data.badge as string) || 'Galerie';
  const headline = (data.headline as string) || 'Momente';
  const images = (data.images as Array<{ src: string; alt?: string }>) || [];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
        </div>
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative break-inside-avoid rounded-xl overflow-hidden">
              <Image src={img.src} alt={img.alt || ''} width={600} height={800} className="w-full h-auto object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

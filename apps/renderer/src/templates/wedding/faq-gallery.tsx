'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingFaqSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'FAQ';
  const headline = (data.headline as string) || 'Häufige Fragen';
  const items = (data.items as Array<{ question: string; answer: string }>) || [];
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
          <div className="space-y-0">
            {items.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={plain(item.answer)} index={i} variant="modern"  data-edit-collection="items" data-edit-index={i}/>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
          <div className="space-y-2">
            {items.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={plain(item.answer)} index={i} variant="bold"  data-edit-collection="items" data-edit-index={i}/>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={plain(item.answer)} index={i} variant="classic"  data-edit-collection="items" data-edit-index={i}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer, index, variant }: { question: string; answer: string; index: number; variant: string }) {
  const [open, setOpen] = useState(false);

  if (variant === 'modern') {
    return (
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="border-t border-[color:var(--token-card-border)]">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left">
          <span className="font-light text-[color:var(--token-heading)]" data-edit-path="question">{question}</span>
          <ChevronDown className={`w-4 h-4 text-[color:var(--token-body)] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <div className="pb-5 text-[color:var(--token-muted)] text-sm leading-relaxed" data-edit-path="answer">{plain(answer)}</div>}
      </motion.div>
    );
  }

  if (variant === 'bold') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-2 border-[color:var(--token-card-border)]">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
          <span className="font-bold text-[color:var(--token-heading)]" data-edit-path="question">{question}</span>
          <ChevronDown className={`w-5 h-5 text-[color:var(--token-eyebrow)] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <div className="px-5 pb-5 text-[color:var(--token-muted)] text-sm leading-relaxed" data-edit-path="answer">{plain(answer)}</div>}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="bg-[var(--token-card-bg)] rounded-xl border border-[color:var(--token-card-border)] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium text-[color:var(--token-heading)]" data-edit-path="question">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[color:var(--token-body)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-[color:var(--token-muted)] text-sm leading-relaxed" data-edit-path="answer">{plain(answer)}</div>}
    </motion.div>
  );
}

export function WeddingGallerySection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Galerie';
  const headline = (data.headline as string) || 'Momente';
  const images = (data.images as Array<{ src: string; alt?: string }>) || [];
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {images.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative aspect-square" data-edit-collection="images" data-edit-index={i}>
                <Image data-edit-image="src" src={img.src} alt={img.alt || ''} fill className="object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
          <div className="columns-2 md:columns-3 gap-2 space-y-2">
            {images.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative break-inside-avoid overflow-hidden" data-edit-collection="images" data-edit-index={i}>
                <Image data-edit-image="src" src={img.src} alt={img.alt || ''} width={600} height={800} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 border border-[color:var(--token-card-border)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        </div>
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative break-inside-avoid rounded-xl overflow-hidden" data-edit-collection="images" data-edit-index={i}>
              <Image data-edit-image="src" src={img.src} alt={img.alt || ''} width={600} height={800} className="w-full h-auto object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

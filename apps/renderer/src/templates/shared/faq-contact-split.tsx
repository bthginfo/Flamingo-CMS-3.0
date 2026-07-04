'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type FaqItem = { question: string; answer: string };
type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FaqContactSplitSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || 'FAQ';
  const headline = (data.headline as string) || 'Häufige Fragen';
  const subline = (data.subline as string) || '';
  const items = (data.items as FaqItem[]) || [];
  const contactTitle = (data.contactTitle as string) || 'Ihre Frage ist nicht dabei?';
  const contactText = (data.contactText as string) || 'Schreiben Sie uns — wir antworten meist innerhalb eines Werktags.';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const whatsapp = (data.whatsapp as string) || '';
  const cta = (data.cta as Cta) || {};
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        <span className="section-badge" data-edit-path="badge">{badge}</span>
        <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={`${item.question}-${i}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className={`overflow-hidden rounded-xl border transition-colors ${isOpen ? 'border-[var(--token-btn-bg)] bg-[var(--token-card-bg)] shadow-md' : 'border-[var(--token-card-border)] bg-[var(--token-card-bg)]'}`} data-edit-collection="items" data-edit-index={i}>
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                  <span className="font-semibold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="question">{item.question}</span>
                  <ChevronDown size={18} className={`shrink-0 text-[color:var(--token-icon)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))] rt-content" data-edit-rich="answer" dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.aside initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-xl lg:sticky lg:top-28">
          <h3 className="text-lg font-bold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="contactTitle">{contactTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="contactText">{plain(contactText)}</p>
          <div className="mt-5 space-y-2.5 text-sm">
            {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-3 rounded-lg border border-[var(--token-card-border)] p-3 text-[color:var(--token-card-heading,var(--token-heading))] transition hover:bg-[var(--token-badge-bg)]"><Phone size={16} className="text-[color:var(--token-icon)]" /><span data-edit-path="phone">{phone}</span></a>}
            {email && <a href={`mailto:${email}`} className="flex items-center gap-3 rounded-lg border border-[var(--token-card-border)] p-3 text-[color:var(--token-card-heading,var(--token-heading))] transition hover:bg-[var(--token-badge-bg)]"><Mail size={16} className="text-[color:var(--token-icon)]" /><span data-edit-path="email">{email}</span></a>}
            {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-[var(--token-card-border)] p-3 text-[color:var(--token-card-heading,var(--token-heading))] transition hover:bg-[var(--token-badge-bg)]"><MessageCircle size={16} className="text-[color:var(--token-icon)]" />WhatsApp</a>}
          </div>
          {cta.label && (
            <a data-edit-link="cta" href={cta.href || '#kontakt'} className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-bold text-[color:var(--token-btn-text)] transition hover:brightness-110">
              <span data-edit-path="label">{cta.label}</span>
              <ArrowRight size={16} />
            </a>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Card = { title: string; text?: string; icon?: string; image?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function SpotlightCardsSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const cards = (data.cards as Card[]) || [];
  if (!cards.length) return null;

  return (
    <div className="relative">
      <div className="mb-12 max-w-3xl">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => {
          const body = (
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`);
                event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
              }}
              className="spotlight-card group relative min-h-[220px] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-sm transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-2xl"
            >
              <div className="spotlight-card-hover-layer pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(720px circle at var(--x,50%) var(--y,30%), color-mix(in_srgb,var(--token-accent)_12%,transparent), transparent 42%)' }} />
              {card.image && <img data-edit-image="image" src={card.image} alt="" className="spotlight-card-image-layer absolute inset-0 h-full w-full object-cover opacity-12 transition duration-500 group-hover:opacity-20" />}
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                {card.icon && <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--token-icon)_12%,var(--token-card-bg,#fff))] text-[color:var(--token-icon)]"><DynamicIcon editPath="icon" name={card.icon} size={24} /></span>}
                <div>
                <h3 className="text-xl font-bold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{card.title}</h3>
                {card.text && <p className="mt-3 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(card.text)}</p>}
                </div>
              </div>
            </motion.article>
          );
          return card.href ? <a key={i} href={card.href}>{body}</a> : <div key={i}>{body}</div>;
        })}
      </div>
    </div>
  );
}

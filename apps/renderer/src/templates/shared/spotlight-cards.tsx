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
              className="group relative min-h-[260px] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(720px circle at var(--x,50%) var(--y,30%), rgb(var(--token-accent-rgb,0 0 0) / 0.12), transparent 42%)' }} />
              {card.image && <img data-edit-image="image" src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-12 transition duration-500 group-hover:opacity-20" />}
              <div className="relative z-10 flex h-full flex-col justify-end">
                {card.icon && <DynamicIcon name={card.icon} size={34} className="mb-6 text-[var(--token-icon)]" />}
                <h3 className="text-xl font-bold text-[var(--token-heading)]" data-edit-path="title">{card.title}</h3>
                {card.text && <p className="mt-3 text-sm leading-6 text-[var(--token-body)]" data-edit-path="text">{plain(card.text)}</p>}
              </div>
            </motion.article>
          );
          return card.href ? <a key={i} href={card.href} data-edit-path="body">{body}</a> : <div key={i} data-edit-path="body">{body}</div>;
        })}
      </div>
    </div>
  );
}

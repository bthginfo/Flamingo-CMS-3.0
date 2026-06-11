'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Card = { title: string; text?: string; icon?: string; image?: string; href?: string; imageOverlayColor?: string; imageOverlayOpacity?: number };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function toOverlayColor(color: string | undefined, opacityValue: unknown): string | null {
  const opacity = typeof opacityValue === 'number' ? opacityValue : Number(opacityValue ?? 0);
  if (!Number.isFinite(opacity) || opacity <= 0) return null;
  const normalizedOpacity = Math.max(0, Math.min(1, opacity));
  const value = (color || '#000000').trim();

  const rgba = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/i);
  if (rgba) {
    const r = Math.max(0, Math.min(255, Number(rgba[1]) || 0));
    const g = Math.max(0, Math.min(255, Number(rgba[2]) || 0));
    const b = Math.max(0, Math.min(255, Number(rgba[3]) || 0));
    const a = Math.max(0, Math.min(1, Number(rgba[4] ?? 1)));
    return `rgba(${r}, ${g}, ${b}, ${(a * normalizedOpacity).toFixed(3)})`;
  }

  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const full = hex[1].length === 3
      ? hex[1].split('').map((char) => `${char}${char}`).join('')
      : hex[1];
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${normalizedOpacity.toFixed(3)})`;
  }

  return `rgba(0, 0, 0, ${normalizedOpacity.toFixed(3)})`;
}

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
          const overlayColor = toOverlayColor(card.imageOverlayColor, card.imageOverlayOpacity);
          const body = (
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              data-edit-collection="cards"
              data-edit-index={i}
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`);
                event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
              }}
              className="group relative min-h-[220px] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(720px circle at var(--x,50%) var(--y,30%), rgb(var(--token-accent-rgb,0 0 0) / 0.12), transparent 42%)' }} />
              {card.image && (
                <img
                  data-edit-image="image"
                  src={card.image}
                  alt=""
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-15 transition-opacity duration-500 group-hover:opacity-25 [backface-visibility:hidden] [transform:translateZ(0)]"
                />
              )}
              {card.image && overlayColor && <div className="pointer-events-none absolute inset-0" style={{ backgroundColor: overlayColor }} />}
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

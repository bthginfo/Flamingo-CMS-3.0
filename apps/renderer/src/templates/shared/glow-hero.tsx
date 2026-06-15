'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';

type Cta = { label?: string; href?: string };
type Fact = { value?: string; label?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function GlowHeroSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const eyebrow = (data.eyebrow as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const image = (data.image as string) || (data.bgImage as string) || '';
  const imagePosition = (data.imagePosition as string) || (data.bgPosition as string) || 'center';
  const glowColor = (data.glowColor as string) || 'rgba(242,65,113,0.45)';
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const facts = ((data.facts as Fact[]) || []).filter(item => item.value || item.label);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    function onMove(event: MouseEvent) {
      const rect = node!.getBoundingClientRect();
      setPos({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
    }
    node.addEventListener('mousemove', onMove);
    return () => node.removeEventListener('mousemove', onMove);
  }, []);

  if (!headline) return null;

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-[var(--token-section-bg)] text-[color:var(--token-body)]">
      {image && <img data-edit-image="image" src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" style={{ objectPosition: imagePosition }} />}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <div
        className="pointer-events-none absolute inset-0 transition duration-150"
        style={{ background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${glowColor}, transparent 30%)` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 py-16 md:py-24">
        <div className="max-w-5xl">
          {eyebrow && <div className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--token-eyebrow)]" data-edit-path="eyebrow">{eyebrow}</div>}
          <h1 className="text-5xl font-black leading-none text-[color:var(--token-heading)] md:text-7xl lg:text-8xl" data-edit-path="headline">{headline}</h1>
          {subline && <p className="mt-7 max-w-2xl text-lg leading-8 text-[color:var(--token-subheading)] md:text-xl" data-edit-path="subline">{plain(subline)}</p>}
          <div className="mt-9 flex flex-wrap gap-3">
            {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 text-sm font-bold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span><ArrowRight size={16} /></a>}
            {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-card-border)] bg-[var(--token-btn-bg)] px-6 py-3 text-sm font-bold text-[color:var(--token-body)] backdrop-blur" data-edit-path="label">{secondaryCta.label}</a>}
          </div>
        </div>
        {facts.length > 0 && (
          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {facts.map((fact, index) => (
              <div key={index} className="rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 backdrop-blur" data-edit-collection="facts" data-edit-index={index}>
                {fact.value && <div className="text-3xl font-black text-[color:var(--token-stat-value)]" data-edit-path="value">{fact.value}</div>}
                {fact.label && <div className="mt-1 text-sm text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="label">{fact.label}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

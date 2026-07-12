'use client';

import { WordReveal } from '@/components/ui/fx';

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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (isTouchDevice) {
      if (prefersReducedMotion) return;
      let frame = 0;
      const start = performance.now();
      const animate = (time: number) => {
        const elapsed = (time - start) / 1000;
        setPos({
          x: 50 + Math.sin(elapsed * 0.18) * 22,
          y: 48 + Math.cos(elapsed * 0.14) * 18,
        });
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }

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
        style={{ background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, var(--token-glow-color), transparent 30%)` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 py-16 md:py-24">
        <div className="max-w-5xl">
          {eyebrow && <div className="section-badge mb-5 backdrop-blur" data-color-role="badge" data-edit-path="eyebrow">{eyebrow}</div>}
          <h1 className="break-words text-[clamp(2.75rem,11vw,5rem)] font-black leading-[0.98] tracking-[-0.035em] text-[color:var(--token-heading)] [overflow-wrap:anywhere] md:text-7xl lg:text-8xl" data-edit-path="headline"><WordReveal text={headline} /></h1>
          {subline && <p className="mt-7 max-w-2xl text-lg leading-8 text-[color:var(--token-subheading)] md:text-xl" data-edit-path="subline">{plain(subline)}</p>}
          <div className="mt-9 flex w-full flex-wrap gap-3 sm:w-auto">
            {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-6 py-3 text-center text-sm font-bold text-[color:var(--token-btn-text)] sm:w-auto"><span data-edit-path="label">{primaryCta.label}</span><ArrowRight size={16} /></a>}
            {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--token-button-radius)] border border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-6 py-3 text-center text-sm font-bold text-[color:var(--token-btn-secondary-text)] backdrop-blur sm:w-auto" data-edit-path="label">{secondaryCta.label}</a>}
          </div>
        </div>
        {facts.length > 0 && (
          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {facts.map((fact, index) => (
              <div key={index} data-color-context="dark" className="rounded-2xl border border-[color:var(--token-badge-border)] bg-[var(--token-image-overlay)] p-5 backdrop-blur" data-edit-collection="facts" data-edit-index={index}>
                {fact.value && <div className="text-3xl font-black text-[color:var(--token-on-dark-heading)]" data-edit-path="value">{fact.value}</div>}
                {fact.label && <div className="mt-1 text-sm text-[color:var(--token-on-dark-body)]" data-edit-path="label">{fact.label}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

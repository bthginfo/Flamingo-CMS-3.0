'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ShopThankYouSection({ data }: Props) {
  const headline = (data.headline as string) || 'Vielen Dank für deine Bestellung!';
  const subline = (data.subline as string) || 'Du erhältst in Kürze eine Bestätigung per E-Mail.';
  const continueLabel = (data.continueShoppingLabel as string) || (data.ctaLabel as string) || 'Zurück zum Shop';
  const continueShoppingPath = (data.continueShoppingPath as string) || '/shop';
  const orderNumberLabel = (data.orderNumberLabel as string) || 'Bestellnummer';
  // The checkout redirects here with ?order=<number> — show it when present.
  const orderNumber = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('order') || '' : '';

  return (
    <section className="py-16 md:py-24 text-center">
      <CheckCircle2 size={64} className="mx-auto mb-6 text-[color:var(--token-check)]" />
      <h1 className="text-3xl font-bold mb-3" data-edit-path="headline">{headline}</h1>
      <p className="text-[color:var(--token-muted)] text-lg mb-4 max-w-md mx-auto" data-edit-path="subline">{plain(subline)}</p>
      {orderNumber && (
        <p className="mb-8 inline-block rounded-full border border-[var(--token-card-border)] bg-[var(--token-card-bg)] px-5 py-2 text-sm text-[color:var(--token-card-body,var(--token-body))]">
          {orderNumberLabel}: <span className="font-semibold text-[color:var(--token-card-heading,var(--token-heading))]">{orderNumber}</span>
        </p>
      )}
      {!orderNumber && <span className="block mb-4" />}
      <Link href={continueShoppingPath} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--token-section-bg,theme(colors.zinc.900))] text-[color:var(--token-on-dark-heading,#fff)] font-medium rounded-xl hover:bg-[var(--token-section-bg,theme(colors.zinc.800))] transition">
        {continueLabel} <ArrowRight size={16} />
      </Link>
    </section>
  );
}

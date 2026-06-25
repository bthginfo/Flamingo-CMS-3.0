'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ShopThankYouSection({ data }: Props) {
  const headline = (data.headline as string) || 'Vielen Dank für deine Bestellung!';
  const subline = (data.subline as string) || 'Du erhältst in Kürze eine Bestätigung per E-Mail.';
  const continueLabel = (data.continueShoppingLabel as string) || 'Zurück zum Shop';

  return (
    <section className="py-16 md:py-24 text-center">
      <CheckCircle2 size={64} className="mx-auto mb-6 text-[color:var(--token-success,#22c55e)]" />
      <h1 className="text-3xl font-bold mb-3" data-edit-path="headline">{headline}</h1>
      <p className="text-[color:var(--token-muted)] text-lg mb-8 max-w-md mx-auto" data-edit-path="subline">{plain(subline)}</p>
      <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--token-section-bg,theme(colors.zinc.900))] text-[color:var(--token-on-dark-heading,#fff)] font-medium rounded-xl hover:bg-zinc-800 transition">
        {continueLabel} <ArrowRight size={16} />
      </Link>
    </section>
  );
}

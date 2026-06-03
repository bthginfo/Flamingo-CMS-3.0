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
      <CheckCircle2 size={64} className="mx-auto mb-6 text-green-500" />
      <h1 className="text-3xl font-bold mb-3">{headline}</h1>
      <p className="text-zinc-500 text-lg mb-8 max-w-md mx-auto">{plain(subline)}</p>
      <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition">
        {continueLabel} <ArrowRight size={16} />
      </Link>
    </section>
  );
}

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ShopBackLink() {
  return (
    <Link href="/admin/shop" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition mb-4">
      <ArrowLeft size={14} />
      <span>Zurück zur Shop-Übersicht</span>
    </Link>
  );
}

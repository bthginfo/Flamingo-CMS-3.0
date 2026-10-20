import { ArrowUpRight } from 'lucide-react';
import { safeContentUrl } from '@/lib/safe-content-url';
import type { PerspectiveAction } from './perspective-utils';

export function PerspectiveLink({ cta, editKey = 'cta', className = '' }: { cta: PerspectiveAction; editKey?: string; className?: string }) {
  const href = safeContentUrl(cta.href || '');
  if (!href || !cta.label) return null;
  return <a href={href} data-edit-link={editKey} className={`group inline-flex min-h-11 items-center gap-3 py-2 text-[1rem] font-semibold text-[color:var(--token-link)] underline-offset-[.24em] hover:text-[color:var(--token-link-hover)] hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${className}`}>
    <span data-edit-path="label">{cta.label}</span>
    <ArrowUpRight aria-hidden="true" size={19} className="shrink-0 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
  </a>;
}

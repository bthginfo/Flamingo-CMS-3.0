import { resolveIcon } from '@/components/ui/icon-map';
import type { PerspectiveAction } from './perspective-utils';

export function PerspectiveActionIcon({ cta, side, defaultIcon = 'ArrowUpRight', className = '' }: { cta: PerspectiveAction; side: 'prefix' | 'suffix'; defaultIcon?: string; className?: string }) {
  const name = side === 'prefix' ? cta.iconPrefix : cta.iconSuffix === undefined ? defaultIcon : cta.iconSuffix;
  const Icon = resolveIcon(name || '');
  return Icon ? <Icon aria-hidden="true" size={19} strokeWidth={1.7} className={`shrink-0 ${className}`} /> : null;
}

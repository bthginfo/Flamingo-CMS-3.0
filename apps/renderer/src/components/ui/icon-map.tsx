import { icons, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Convert kebab-case or lowercase to PascalCase for lucide-react lookup */
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export function DynamicIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  // Try exact PascalCase match first, then convert from kebab/lowercase
  const Icon: LucideIcon | undefined =
    (icons as Record<string, LucideIcon>)[name] ||
    (icons as Record<string, LucideIcon>)[toPascalCase(name)];
  if (!Icon) return <span className={className}>{name}</span>;
  return <Icon size={size} className={className} />;
}

/**
 * MediaDisplay: renders either an icon or an image based on CMS data.
 * Usage: { mediaType: 'icon', icon: 'flame' } or { mediaType: 'image', image: 'https://...' }
 * Falls back to icon if mediaType is not set.
 */
export type MediaItem = {
  mediaType?: 'icon' | 'image';
  icon?: string;
  image?: string;
  imageAlt?: string;
};

export function MediaDisplay({
  item,
  iconSize = 24,
  iconClassName,
  imageClassName,
  containerClassName,
}: {
  item: MediaItem;
  iconSize?: number;
  iconClassName?: string;
  imageClassName?: string;
  containerClassName?: string;
}) {
  if (item.mediaType === 'image' && item.image) {
    return (
      <div className={cn('relative overflow-hidden', containerClassName)}>
        <Image
          src={item.image}
          alt={item.imageAlt || ''}
          fill
          className={cn('object-cover', imageClassName)}
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
    );
  }

  if (item.icon) {
    return <DynamicIcon name={item.icon} size={iconSize} className={iconClassName} />;
  }

  return null;
}

import { icons, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Legacy icon names that were renamed in newer lucide-react versions */
const LEGACY_ALIASES: Record<string, string> = {
  BarChart: 'ChartBar', BarChart2: 'ChartBar', BarChart3: 'ChartColumn', BarChart4: 'ChartColumnStacked',
  LineChart: 'ChartLine', PieChart: 'ChartPie', Activity: 'ChartSpline',
  Globe2: 'Globe', Map2: 'Map', Bell2: 'Bell', Lock2: 'Lock', Unlock2: 'Unlock',
  Edit: 'Pencil', Edit2: 'PencilLine', Edit3: 'Pen',
  Trash: 'Trash2', File: 'FileText', Folder: 'FolderOpen',
  AlertCircle: 'CircleAlert', AlertTriangle: 'TriangleAlert', AlertOctagon: 'OctagonAlert',
  CheckCircle: 'CircleCheck', CheckCircle2: 'CircleCheckBig', XCircle: 'CircleX',
  HelpCircle: 'CircleHelp', InfoIcon: 'Info', Info2: 'Info',
  ArrowUpRight: 'ArrowUpRight', ExternalLink: 'ExternalLink',
  Loader: 'LoaderCircle', Loader2: 'LoaderCircle',
  Send: 'SendHorizonal', Zap: 'Zap', ZapOff: 'ZapOff',
  Palmtree: 'TreePalm', Flower: 'Flower2',
  Clipboard: 'ClipboardList', ClipboardCheck: 'ClipboardCheck',
};

/** Convert kebab-case or lowercase to PascalCase for lucide-react lookup */
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function resolveIcon(name: string): LucideIcon | null {
  if (!name) return null;
  const iconMap = icons as Record<string, LucideIcon>;
  // 1. Direct match (PascalCase, e.g. "Coffee", "GlassWater")
  if (iconMap[name]) return iconMap[name];
  // 2. Try PascalCase conversion (e.g. "glass-water" → "GlassWater")
  const pascal = toPascalCase(name);
  if (iconMap[pascal]) return iconMap[pascal];
  // 3. Try reversed word order (e.g. "check-circle" → "CircleCheck" for newer lucide versions)
  const parts = name.split(/[-_\s]+/);
  if (parts.length === 2) {
    const reversed = parts[1].charAt(0).toUpperCase() + parts[1].slice(1) + parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    if (iconMap[reversed]) return iconMap[reversed];
  }
  // 4. Legacy alias lookup
  const alias = LEGACY_ALIASES[name] || LEGACY_ALIASES[pascal];
  if (alias && iconMap[alias]) return iconMap[alias];
  return null;
}

/**
 * Resolves any icon name (PascalCase, kebab-case, legacy alias) to the
 * canonical lucide-react PascalCase name. Returns the input unchanged if
 * the icon cannot be resolved. Useful for normalizing user-entered or
 * legacy-data icon names before saving them back to the CMS.
 */
export function canonicalIconName(name: string): string {
  if (!name) return '';
  const iconMap = icons as Record<string, LucideIcon>;
  if (iconMap[name]) return name;
  const pascal = toPascalCase(name);
  if (iconMap[pascal]) return pascal;
  const parts = name.split(/[-_\s]+/);
  if (parts.length === 2) {
    const reversed = parts[1].charAt(0).toUpperCase() + parts[1].slice(1) + parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    if (iconMap[reversed]) return reversed;
  }
  const alias = LEGACY_ALIASES[name] || LEGACY_ALIASES[pascal];
  if (alias && iconMap[alias]) return alias;
  return name;
}

export { resolveIcon };

/**
 * DynamicIcon — looks up a lucide icon by name and renders it.
 * If `editPath` is provided, a `data-edit-icon="<path>"` attribute is set
 * on the SVG so the live-preview overlay can attach a pencil icon and
 * open the icon picker. The path is relative to the section's data root
 * (the overlay walks parent `data-edit-collection` markers to prepend
 * `collection.index.` segments).
 */
export function DynamicIcon({
  name,
  size = 24,
  className,
  editPath,
}: {
  name: string;
  size?: number;
  className?: string;
  editPath?: string;
}) {
  const Icon = resolveIcon(name);
  const editAttr = editPath ? ({ 'data-edit-icon': editPath } as Record<string, string>) : null;
  if (!Icon) return <span className={className} {...(editAttr ?? {})}>{name || ''}</span>;
  return <Icon size={size} className={className} {...(editAttr ?? {})} />;
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
    return <DynamicIcon name={item.icon} size={iconSize} className={iconClassName} editPath="icon" />;
  }

  return null;
}

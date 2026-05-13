import {
  Trophy, Zap, Wallet, Leaf, Flame, ShowerHead, Wrench, Settings,
  Siren, BarChart3, ClipboardList, Ruler, HardHat, CheckCircle2, Handshake,
  Phone, Mail, MapPin, Clock, HelpCircle, Shield, Star, ArrowRight,
  Users, Building2, Award, Heart, Target, Lightbulb, TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  zap: Zap,
  wallet: Wallet,
  leaf: Leaf,
  flame: Flame,
  shower: ShowerHead,
  wrench: Wrench,
  settings: Settings,
  siren: Siren,
  'bar-chart': BarChart3,
  clipboard: ClipboardList,
  ruler: Ruler,
  'hard-hat': HardHat,
  'check-circle': CheckCircle2,
  handshake: Handshake,
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  clock: Clock,
  'help-circle': HelpCircle,
  shield: Shield,
  star: Star,
  'arrow-right': ArrowRight,
  users: Users,
  building: Building2,
  award: Award,
  heart: Heart,
  target: Target,
  lightbulb: Lightbulb,
  'trending-up': TrendingUp,
};

export function DynamicIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[name];
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

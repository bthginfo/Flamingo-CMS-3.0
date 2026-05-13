import {
  Trophy, Zap, Wallet, Leaf, Flame, ShowerHead, Wrench, Settings,
  Siren, BarChart3, ClipboardList, Ruler, HardHat, CheckCircle2, Handshake,
  Phone, Mail, MapPin, Clock, HelpCircle, Shield, Star, ArrowRight,
  type LucideIcon,
} from 'lucide-react';

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
};

export function DynamicIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span className={className}>{name}</span>;
  return <Icon size={size} className={className} />;
}

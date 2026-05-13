'use client';

import {
  Flame, ShowerHead, Wrench, Cog, AlertTriangle, BarChart3,
  Trophy, Zap, Coins, Leaf, ClipboardList, Ruler, HardHat,
  CheckCircle, Handshake, Shield, Phone, Star, Clock,
  Heart, Home, Users, Building2, Thermometer, Droplets,
  Settings, Award, MapPin, Mail, Calendar, FileText,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps string icon keys (from CMS data) to Lucide icon components.
 * Falls back to rendering the original string if no match (supports emoji fallback).
 */
const ICON_MAP: Record<string, LucideIcon> = {
  // Services
  flame: Flame, fire: Flame, heizung: Flame,
  shower: ShowerHead, bad: ShowerHead, bathroom: ShowerHead,
  wrench: Wrench, sanitaer: Wrench, plumbing: Wrench,
  cog: Cog, settings: Settings, wartung: Cog, maintenance: Cog,
  alert: AlertTriangle, notdienst: AlertTriangle, emergency: AlertTriangle,
  chart: BarChart3, energie: BarChart3, energy: BarChart3,

  // USP / Trust
  trophy: Trophy, meister: Trophy, award: Award,
  zap: Zap, blitz: Zap, fast: Zap,
  coins: Coins, geld: Coins, preis: Coins, money: Coins,
  leaf: Leaf, green: Leaf, eco: Leaf, umwelt: Leaf,
  shield: Shield, sicher: Shield, safe: Shield,
  star: Star, bewertung: Star, rating: Star,
  heart: Heart, favorit: Heart,

  // Process
  clipboard: ClipboardList, beratung: ClipboardList, consultation: ClipboardList,
  ruler: Ruler, planung: Ruler, planning: Ruler,
  hardhat: HardHat, bau: HardHat, worker: HardHat, umsetzung: HardHat,
  check: CheckCircle, qualitaet: CheckCircle, quality: CheckCircle,
  handshake: Handshake, service: Handshake, support: Handshake,

  // General
  phone: Phone, telefon: Phone,
  clock: Clock, zeit: Clock, time: Clock,
  home: Home, haus: Home, house: Home,
  users: Users, team: Users, people: Users,
  building: Building2, firma: Building2,
  thermometer: Thermometer, temperatur: Thermometer,
  droplets: Droplets, wasser: Droplets, water: Droplets,
  mappin: MapPin, standort: MapPin, location: MapPin,
  mail: Mail, email: Mail,
  calendar: Calendar, termin: Calendar,
  file: FileText, dokument: FileText,
};

export function SectionIcon({
  icon,
  size = 24,
  className,
}: {
  icon: string;
  size?: number;
  className?: string;
}) {
  const key = icon.toLowerCase().trim();
  const LucideComp = ICON_MAP[key];

  if (LucideComp) {
    return <LucideComp size={size} className={className} />;
  }

  // Fallback: render as text (emoji or unknown string)
  return <span className={className} style={{ fontSize: size * 0.8 }}>{icon}</span>;
}

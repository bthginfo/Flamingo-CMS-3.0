'use client';

import {
  Flame, ShowerHead, Wrench, Cog, AlertTriangle, BarChart3,
  Trophy, Zap, Coins, Leaf, ClipboardList, Ruler, HardHat,
  CheckCircle, Handshake, Shield, Phone, Star, Clock,
  Heart, Home, Users, Building2, Thermometer, Droplets,
  Settings, Award, MapPin, Mail, Calendar, FileText,
  ShieldCheck, Banknote, Bath, Wifi, Waves, UtensilsCrossed,
  Bus, BatteryCharging, Castle, Sun, Wine, Stethoscope,
  Syringe, Brain, Plane, FlaskConical, BookOpen, Monitor,
  PhoneCall, Activity, Dumbbell, MessageCircle, ClipboardCheck,
  Hammer, Scissors, Sparkles, GraduationCap, Eye, Camera,
  Mountain, Bike, Compass, Tent, Download, Landmark,
  Palette, Gift, CreditCard, Armchair, Coffee,
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
  mappin: MapPin, standort: MapPin, location: MapPin, 'map-pin': MapPin,
  mail: Mail, email: Mail,
  calendar: Calendar, termin: Calendar,
  file: FileText, dokument: FileText,

  // Extended — Hotel
  wifi: Wifi,
  spa: Waves, wellness: Waves,
  restaurant: UtensilsCrossed, utensils: UtensilsCrossed,
  shuttle: Bus, bus: Bus,
  charging: BatteryCharging,
  castle: Castle,
  armchair: Armchair, lounge: Armchair,
  coffee: Coffee,
  'credit-card': CreditCard,

  // Extended — Restaurant
  sun: Sun,
  wine: Wine,

  // Extended — Medical
  stethoscope: Stethoscope,
  syringe: Syringe,
  brain: Brain,
  plane: Plane,
  flask: FlaskConical,
  'book-open': BookOpen,
  monitor: Monitor,
  'phone-callback': PhoneCall, 'phone-call': PhoneCall,
  activity: Activity,
  dumbbell: Dumbbell, fitness: Dumbbell,
  'graduation-cap': GraduationCap,
  eye: Eye,

  // Extended — Salon
  scissors: Scissors,
  sparkles: Sparkles,
  message: MessageCircle,
  palette: Palette,
  gift: Gift,

  // Extended — Tourism
  mountain: Mountain,
  bike: Bike,
  compass: Compass,
  tent: Tent,
  download: Download,
  landmark: Landmark,
  camera: Camera,

  // Extended — Handwerk
  'shield-check': ShieldCheck,
  banknote: Banknote,
  bath: Bath,
  'alert-triangle': AlertTriangle,
  'message-circle': MessageCircle,
  'clipboard-check': ClipboardCheck,
  hammer: Hammer,
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

  // 1. Try manual map (supports legacy lowercase/German keys)
  let LucideComp = ICON_MAP[key];

  // 2. Try dynamic lookup by PascalCase name (stored by IconPickerField)
  if (!LucideComp) {
    try {
      const allIcons = require('lucide-react') as Record<string, unknown>;
      const comp = allIcons[icon.trim()];
      if (typeof comp === 'function') LucideComp = comp as LucideIcon;
    } catch { /* ignore */ }
  }

  if (LucideComp) {
    return <LucideComp size={size} className={className} />;
  }

  // Fallback: render as text (emoji or unknown string)
  return <span className={className} style={{ fontSize: size * 0.8 }}>{icon}</span>;
}

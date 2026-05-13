'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Phone } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function HeroSection({ data }: Props) {
  const headline = (data.headline as string) || 'Willkommen';
  const subline = (data.subline as string) || '';
  const primaryCta = data.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string } | undefined;

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0VjZoLTJWMGgtNHY2aC0ydjhoLTJ2LThoLTJWMGgtNHY2aC0ydjhoNFYyaDRWNmgydi04aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/90 mb-8"
          >
            <Shield size={16} className="text-brand-accent" />
            <span>Zertifizierter Meisterbetrieb seit 1987</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white mb-6 tracking-tight"
          >
            {headline}
          </motion.h1>

          {subline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl"
            >
              {subline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {primaryCta?.label && (
              <a href={primaryCta.href} className="btn-primary text-base group">
                {primaryCta.label}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            )}
            {secondaryCta?.label && (
              <a href={secondaryCta.href} className="btn-secondary text-base group">
                <Phone size={18} />
                {secondaryCta.label}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Phone, Star, CheckCircle } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function HeroSection({ data }: Props) {
  const headline = (data.headline as string) || 'Willkommen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const trustItems = (data.trustItems as string[]) || [];
  const bgImage = (data.bgImage as string) || '';
  const primaryCta = data.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string } | undefined;
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {/* Background layers */}
      {bgImage ? (
        <>
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-brand-dark/50" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0VjZoLTJWMGgtNHY2aC0ydjhoLTJ2LThoLTJWMGgtNHY2aC0ydjhoNFYyaDRWNmgydi04aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        </>
      )}

      {/* Spotlight effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(46, 134, 193, 0.15)" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-accent/8 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-brand-secondary/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px]" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <motion.div style={{ opacity, y }} className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 lg:py-0">
        <div className="max-w-4xl">
          {/* Badge */}
          {badgeText && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-md border border-white/[0.12] rounded-full px-5 py-2.5 text-sm text-white/90 mb-8"
            >
              <Shield size={15} className="text-brand-accent" />
              <span className="font-medium">{badgeText}</span>
              <div className="flex -space-x-0.5 ml-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-brand-accent text-brand-accent" />)}
              </div>
            </motion.div>
          )}

          {/* Headline with text generate effect */}
          <TextGenerateEffect
            words={headline}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white !leading-[1.02]"
            duration={0.6}
          />

          {subline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="text-lg sm:text-xl text-white/60 leading-relaxed mb-12 max-w-2xl mt-8"
            >
              {subline}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            {primaryCta?.label && (
              <a
                href={primaryCta.href}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-brand-accent px-8 py-4 font-semibold text-gray-900 transition-all duration-300 hover:shadow-glow-accent hover:-translate-y-0.5 text-base"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  {primaryCta.label}
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%]" />
              </a>
            )}
            {secondaryCta?.label && (
              <a href={secondaryCta.href} className="btn-secondary group !rounded-full">
                <Phone size={18} />
                {secondaryCta.label}
              </a>
            )}
          </motion.div>

          {/* Trust indicators */}
          {trustItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/40"
            >
              {trustItems.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent/70" />
                  {item}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

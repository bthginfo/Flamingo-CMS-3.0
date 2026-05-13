type Props = { data: Record<string, unknown>; variant?: string | null };

export function HeroSection({ data, variant }: Props) {
  const headline = (data.headline as string) || 'Willkommen';
  const subline = (data.subline as string) || '';
  const primaryCta = data.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string } | undefined;

  return (
    <div className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">{headline}</h1>
        {subline && <p className="text-lg md:text-xl opacity-90 mb-8">{subline}</p>}
        <div className="flex gap-4">
          {primaryCta?.label && (
            <a href={primaryCta.href} className="bg-brand-accent text-gray-900 font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
              {primaryCta.label}
            </a>
          )}
          {secondaryCta?.label && (
            <a href={secondaryCta.href} className="border-2 border-white px-6 py-3 rounded-lg hover:bg-white/10 transition">
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Style definitions for each industry + style combination.
 * Each style overrides CSS custom properties that Tailwind reads via var().
 * The "classic" style per industry uses the default values from tailwind.config.
 */

export type StyleConfig = {
  label: string;
  description: string;
  cssVars: Record<string, string>;
};

export type IndustryStyles = {
  label: string;
  styles: Record<string, StyleConfig>;
};

export const INDUSTRY_STYLES: Record<string, IndustryStyles> = {
  tradesman: {
    label: 'Handwerk',
    styles: {
      classic: {
        label: 'Klassisch',
        description: 'Vertrauenswürdig, professionell, bewährt',
        cssVars: {
          '--style-radius-sm': '0.5rem',
          '--style-radius-md': '1rem',
          '--style-radius-lg': '1.5rem',
          '--style-radius-full': '9999px',
          '--style-card-radius': '1rem',
          '--style-button-radius': '9999px',
          '--style-heading-weight': '700',
          '--style-heading-transform': 'none',
          '--style-heading-tracking': '-0.02em',
          '--style-section-spacing': '5rem',
          '--style-card-shadow': '0 4px 20px rgba(0,0,0,0.06)',
          '--style-card-border': '1px solid rgba(0,0,0,0.06)',
          '--style-card-bg': 'rgba(255,255,255,1)',
          '--style-accent-glow': '0 0 30px rgba(243, 156, 18, 0.2)',
          '--style-hero-overlay': 'linear-gradient(135deg, rgba(13,33,55,0.9) 0%, rgba(13,33,55,0.7) 50%, rgba(13,33,55,0.5) 100%)',
        },
      },
      modern: {
        label: 'Modern',
        description: 'Minimalistisch, clean, großzügig',
        cssVars: {
          '--style-radius-sm': '0.25rem',
          '--style-radius-md': '0.5rem',
          '--style-radius-lg': '0.75rem',
          '--style-radius-full': '0.5rem',
          '--style-card-radius': '0.5rem',
          '--style-button-radius': '0.375rem',
          '--style-heading-weight': '600',
          '--style-heading-transform': 'none',
          '--style-heading-tracking': '-0.03em',
          '--style-section-spacing': '6rem',
          '--style-card-shadow': 'none',
          '--style-card-border': '1px solid rgba(0,0,0,0.08)',
          '--style-card-bg': 'rgba(248,250,252,1)',
          '--style-accent-glow': 'none',
          '--style-hero-overlay': 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)',
        },
      },
      bold: {
        label: 'Bold',
        description: 'Kräftig, dynamisch, auffällig',
        cssVars: {
          '--style-radius-sm': '0',
          '--style-radius-md': '0',
          '--style-radius-lg': '0',
          '--style-radius-full': '0',
          '--style-card-radius': '0',
          '--style-button-radius': '0',
          '--style-heading-weight': '800',
          '--style-heading-transform': 'uppercase',
          '--style-heading-tracking': '0.05em',
          '--style-section-spacing': '4rem',
          '--style-card-shadow': '8px 8px 0 rgba(0,0,0,0.1)',
          '--style-card-border': '2px solid rgba(0,0,0,0.12)',
          '--style-card-bg': 'rgba(255,255,255,1)',
          '--style-accent-glow': '6px 6px 0 rgba(243,156,18,0.3)',
          '--style-hero-overlay': 'linear-gradient(to right, rgba(13,33,55,0.95) 0%, rgba(13,33,55,0.7) 60%, transparent 100%)',
        },
      },
    },
  },
};

export function getStyleConfig(industry: string, style: string): StyleConfig | null {
  return INDUSTRY_STYLES[industry]?.styles[style] ?? INDUSTRY_STYLES[industry]?.styles['classic'] ?? null;
}

export function getStyleCssVars(industry: string, style: string): Record<string, string> {
  return getStyleConfig(industry, style)?.cssVars ?? {};
}

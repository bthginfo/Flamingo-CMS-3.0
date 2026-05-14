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
          '--style-section-bg': '#ffffff',
          '--style-section-bg-alt': '#f8fafc',
          '--style-text-primary': '#0f172a',
          '--style-text-secondary': '#64748b',
          '--style-badge-bg': 'rgba(26, 82, 118, 0.05)',
          '--style-badge-border': 'rgba(26, 82, 118, 0.1)',
          '--style-divider': '1px solid rgba(0,0,0,0.06)',
          '--style-heading-font': 'var(--font-outfit)',
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
          '--style-card-radius': '0.75rem',
          '--style-button-radius': '0.5rem',
          '--style-heading-weight': '500',
          '--style-heading-transform': 'none',
          '--style-heading-tracking': '-0.04em',
          '--style-section-spacing': '7rem',
          '--style-card-shadow': 'none',
          '--style-card-border': '1px solid rgba(0,0,0,0.06)',
          '--style-card-bg': '#ffffff',
          '--style-accent-glow': 'none',
          '--style-hero-overlay': 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)',
          '--style-section-bg': '#ffffff',
          '--style-section-bg-alt': '#fafafa',
          '--style-text-primary': '#18181b',
          '--style-text-secondary': '#71717a',
          '--style-badge-bg': 'transparent',
          '--style-badge-border': 'rgba(0,0,0,0.12)',
          '--style-divider': '1px solid rgba(0,0,0,0.04)',
          '--style-heading-font': 'var(--font-inter)',
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
          '--style-heading-weight': '900',
          '--style-heading-transform': 'uppercase',
          '--style-heading-tracking': '0.05em',
          '--style-section-spacing': '4rem',
          '--style-card-shadow': '8px 8px 0 rgba(0,0,0,0.15)',
          '--style-card-border': '3px solid #0d2137',
          '--style-card-bg': '#ffffff',
          '--style-accent-glow': '6px 6px 0 rgba(243,156,18,0.4)',
          '--style-hero-overlay': 'linear-gradient(to right, rgba(13,33,55,0.97) 0%, rgba(13,33,55,0.8) 50%, transparent 100%)',
          '--style-section-bg': '#ffffff',
          '--style-section-bg-alt': '#f1f5f9',
          '--style-text-primary': '#0d2137',
          '--style-text-secondary': '#475569',
          '--style-badge-bg': '#f39c12',
          '--style-badge-border': '#f39c12',
          '--style-badge-text': '#0d2137',
          '--style-divider': '3px solid #0d2137',
          '--style-heading-font': 'var(--font-outfit)',
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

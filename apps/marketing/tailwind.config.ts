import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand-color, #0f172a)',
          fg: 'var(--brand-fg, #ffffff)',
        },
        accent: {
          DEFAULT: 'var(--accent-color, #F24171)',
          fg: 'var(--accent-fg, #ffffff)',
          2: 'var(--accent-color-2, #FFB347)',
        },
        ink: 'var(--text-color, #14111a)',
        surface: 'var(--surface-color, #fce7ef)',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', '"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        jakarta: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        fraunces: ['Newsreader', '"Instrument Serif"', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2.5s infinite',
        'float': 'float 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

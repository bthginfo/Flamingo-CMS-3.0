import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: { DEFAULT: '#0f0f14', fg: '#ffffff', muted: '#71717a', active: '#F24171', border: '#27272a' },
        admin: { bg: '#fafafa', card: '#ffffff', border: '#e4e4e7', muted: '#71717a', accent: '#F24171' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

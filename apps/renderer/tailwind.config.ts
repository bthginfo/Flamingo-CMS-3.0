/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary, #1a5276)',
          secondary: 'var(--brand-secondary, #2e86c1)',
          accent: 'var(--brand-accent, #f39c12)',
          dark: 'var(--brand-dark, #0d2137)',
        },
        surface: 'var(--surface, #f8fafc)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 20px rgba(26, 82, 118, 0.15)',
        'glow-lg': '0 0 40px rgba(26, 82, 118, 0.2)',
        'glow-accent': '0 0 30px rgba(243, 156, 18, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-primary) 50%, var(--brand-secondary) 100%)',
      },
      animation: {
        spotlight: 'spotlight 2s ease 0.75s 1 forwards',
        scroll: 'scroll var(--animation-duration) var(--animation-direction) linear infinite',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

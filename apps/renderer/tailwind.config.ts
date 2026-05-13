/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary, #2563eb)',
          secondary: 'var(--brand-secondary, #1e40af)',
          accent: 'var(--brand-accent, #f59e0b)',
        },
      },
    },
  },
  plugins: [],
};

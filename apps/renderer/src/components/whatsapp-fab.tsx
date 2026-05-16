'use client';

import { motion } from 'framer-motion';

type Props = {
  phone: string;
  color?: string; // 'whatsapp' | 'primary' | hex color
};

function formatWhatsAppUrl(phone: string): string {
  // Strip everything except digits and leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Remove leading + and any leading 0 for German numbers
  const number = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned.startsWith('0') ? '49' + cleaned.slice(1) : cleaned;
  return `https://wa.me/${number}`;
}

export function WhatsAppFab({ phone, color }: Props) {
  if (!phone) return null;

  const url = formatWhatsAppUrl(phone);

  // Determine background color
  let bgColor = '#25D366'; // WhatsApp green default
  if (color === 'primary') {
    bgColor = 'var(--brand-primary, #25D366)';
  } else if (color && color !== 'whatsapp') {
    bgColor = color; // custom hex
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp kontaktieren"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </motion.a>
  );
}

import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'Müller & Söhne Meisterbetrieb',
  description: 'Ihr Experte für Heizung, Sanitär & Bäder seit 1987 – Powered by Flamingo CMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}

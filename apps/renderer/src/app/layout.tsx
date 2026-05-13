import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Müller & Söhne Meisterbetrieb',
  description: 'Ihr Experte für Heizung, Sanitär & Bäder seit 1987 – Powered by Flamingo CMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>{children}</body>
    </html>
  );
}

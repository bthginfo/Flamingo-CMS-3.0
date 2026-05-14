import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { ConsentWrapper } from '@/components/consent-wrapper';
import '../globals.css';

// Disable Next.js fetch() data cache - ensures fresh DB reads after publish
export const fetchCache = 'force-no-store';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: { default: 'Flamingo CMS', template: '%s' },
  description: 'Powered by Flamingo CMS',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <ConsentWrapper>{children}</ConsentWrapper>
      </body>
    </html>
  );
}

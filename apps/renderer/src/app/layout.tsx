import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { ConsentWrapper } from '@/components/consent-wrapper';
import { CartProvider } from '@/components/shop/cart-context';
import { CartDrawer } from '@/components/shop/cart-drawer';
import '../globals.css';

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
      {/* No manual <head>: Next.js App Router manages it via `metadata`. View
          Transitions are opted-in purely via globals.css `@view-transition`
          rule, which is sufficient and avoids a hydration mismatch caused
          by a static <head> child colliding with Next's runtime injection. */}
      <body className="font-sans bg-white text-gray-900 antialiased">
        <CartProvider>
          <ConsentWrapper>{children}</ConsentWrapper>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Handwerk Website',
  description: 'Powered by Flamingo CMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}

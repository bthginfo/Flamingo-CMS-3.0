import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'Flamingo CMS',
  description: 'Admin-Bereich',
  robots: 'noindex,nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
        {/* Remove Vercel toolbar/feedback widget if injected */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function hideVercelToolbar() {
            var observer = new MutationObserver(function(mutations) {
              var el = document.querySelector('vercel-live-feedback, [data-vercel-toolbar], #__vercel_live_token');
              if (el) { el.remove(); observer.disconnect(); }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(function() { observer.disconnect(); }, 10000);
          })();
        `}} />
      </body>
    </html>
  );
}

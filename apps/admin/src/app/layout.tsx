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
        {/* Hide Vercel toolbar/feedback widget via CSS + DOM removal */}
        <style dangerouslySetInnerHTML={{ __html: `
          vercel-live-feedback, [data-vercel-toolbar], #__vercel_live_token,
          vercel-toolbar, vercel-widget, [id^="vercel-"], [class*="vercel-live"],
          .vercel-live-feedback-wrapper, [data-nextjs-dialog-overlay] { 
            display: none !important; visibility: hidden !important; 
            width: 0 !important; height: 0 !important; overflow: hidden !important;
          }
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          new MutationObserver(function(m,o){
            document.querySelectorAll('vercel-live-feedback,vercel-toolbar,[data-vercel-toolbar],[id^="vercel-"],[class*="vercel-live"]').forEach(function(e){e.remove()});
          }).observe(document.documentElement,{childList:true,subtree:true});
        `}} />
      </body>
    </html>
  );
}

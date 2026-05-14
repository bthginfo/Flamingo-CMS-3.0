import type { Metadata } from 'next';
import '@/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'FlamingoMedia · Websites für lokale Marken',
    template: '%s · FlamingoMedia',
  },
  description:
    'FlamingoMedia gestaltet und betreut Websites für inhabergeführte Betriebe in der DACH-Region – Restaurants, Salons, Handwerk, Praxen & mehr. Editorial-Design mit einem Hauch von Pop. Inhalte selbst pflegen, ohne Agentur.',
  keywords: [
    'Website erstellen lassen',
    'Webdesign für Restaurants',
    'Webdesign für Salons',
    'Website Handwerksbetrieb',
    'lokale Website DACH',
    'Editorial Webdesign',
    'CMS für kleine Unternehmen',
    'Website selbst pflegen',
    'SEO Webseite',
    'FlamingoMedia',
    'Flamingo CMS',
    'Website für Arztpraxis',
    'Website für Beratung',
    'Webdesign Innsbruck',
    'Webdesign Österreich',
    'Webdesign Deutschland',
  ],
  metadataBase: new URL('https://www.flamingomedia.online'),
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'FlamingoMedia · Websites für lokale Marken',
    description:
      'Editorial-Design mit Pop für Restaurants, Salons, Handwerk, Praxen, Beratung, Studios und viele mehr. Inhalte, die Sie selbst pflegen – ohne Agentur.',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'FlamingoMedia – Websites für lokale Marken',
      },
    ],
    locale: 'de_AT',
    siteName: 'FlamingoMedia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlamingoMedia · Websites für lokale Marken',
    description:
      'Editorial-Design mit Pop für Restaurants, Salons, Handwerk, Praxen, Beratung, Studios und viele mehr.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: { canonical: '/' },
  other: {
    'theme-color': '#F24171',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'FlamingoMedia',
                url: 'https://www.flamingomedia.online',
                logo: 'https://www.flamingomedia.online/brand/flamingo-full-beside.png',
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+49-1515-5338029',
                  contactType: 'customer service',
                  availableLanguage: ['German', 'English'],
                },
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Innsbruck',
                  addressCountry: 'AT',
                },
                sameAs: [],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'FlamingoMedia',
                url: 'https://www.flamingomedia.online',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Service',
                serviceType: 'Webdesign & Website-Betreuung',
                provider: {
                  '@type': 'Organization',
                  name: 'FlamingoMedia',
                },
                areaServed: {
                  '@type': 'GeoCircle',
                  geoMidpoint: {
                    '@type': 'GeoCoordinates',
                    latitude: 47.26,
                    longitude: 11.39,
                  },
                  geoRadius: '500',
                },
                description:
                  'Wir gestalten und betreuen Websites für inhabergeführte Betriebe: Restaurants, Salons, Handwerk, Praxen, Beratung und mehr. Editorial-Design mit einem Hauch von Pop.',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'Was kostet eine Website bei FlamingoMedia?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Unsere Websites starten ab einem einmaligen Setup-Preis. Dazu kommt eine monatliche Betreuungspauschale, die Hosting, Pflege und Support umfasst. Kontaktieren Sie uns für ein individuelles Angebot.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Kann ich meine Website selbst bearbeiten?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Ja! Mit unserem Flamingo CMS können Sie Texte, Bilder und Inhalte selbst pflegen – ganz ohne technische Vorkenntnisse. Änderungen werden per Klick veröffentlicht.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Für welche Branchen eignet sich FlamingoMedia?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Wir spezialisieren uns auf inhabergeführte Betriebe: Restaurants, Salons, Handwerksbetriebe, Arztpraxen, Beratungen, Hotels und ähnliche lokale Unternehmen in der DACH-Region.',
                    },
                  },
                ],
              },
            ]),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

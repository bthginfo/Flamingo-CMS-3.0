import type { Metadata } from 'next';
import '@/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'FlamingoMedia · Websites für lokale Marken',
    template: '%s · FlamingoMedia',
  },
  description:
    'FlamingoMedia erstellt schnelle, moderne Websites für lokale Betriebe in Innsbruck, München, Ingolstadt und der DACH-Region. Starkes Design, eigenes CMS, SEO-Grundlage und Inhalte, die Du selbst pflegen kannst.',
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
    'Website erstellen Innsbruck',
    'Webdesign München',
    'Website erstellen München',
    'Webdesign Ingolstadt',
    'Website erstellen Ingolstadt',
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
      'Websites für lokale Betriebe in Innsbruck, München, Ingolstadt und der DACH-Region. Schnell, stark gestaltet und mit CMS, damit Inhalte selbst gepflegt werden können.',
    type: 'website',

    locale: 'de_AT',
    siteName: 'FlamingoMedia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlamingoMedia · Websites für lokale Marken',
    description:
      'Moderne Websites für lokale Betriebe: Design, CMS, SEO-Grundlage, Hosting und Pflege aus einer Hand.',

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
                areaServed: [
                  { '@type': 'City', name: 'Innsbruck' },
                  { '@type': 'City', name: 'München' },
                  { '@type': 'City', name: 'Ingolstadt' },
                  { '@type': 'Country', name: 'Österreich' },
                  { '@type': 'Country', name: 'Deutschland' },
                ],
                description:
                  'Wir erstellen und betreuen Websites für inhabergeführte Betriebe: Restaurants, Salons, Handwerk, Praxen, Beratung und mehr. Mit starkem Design, sauberer technischer Basis, CMS und regionaler SEO-Grundlage.',
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
                      text: 'Unsere Websites starten ab einem einmaligen Setup-Preis. Dazu kommt auf Wunsch eine monatliche Betreuungspauschale für Hosting, Pflege und Support. Die Pakete sind transparent kalkuliert und können erweitert werden.',
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
                      text: 'Wir spezialisieren uns auf inhabergeführte Betriebe: Restaurants, Salons, Handwerk, Arztpraxen, Beratung, Hotels, Einzelhandel und ähnliche lokale Unternehmen in Innsbruck, München, Ingolstadt und der DACH-Region.',
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

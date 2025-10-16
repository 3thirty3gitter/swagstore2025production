import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
// SiteLogo intentionally not rendered in the global header so pages can place it when needed

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://swagstore.ca'),
  title: {
    default: 'SwagStore - Custom Team Stores for Canadian Organizations',
    template: '%s | SwagStore Canada'
  },
  description: 'Professional custom team stores for Canadian hockey teams, dance studios, bands & organizations. Free setup, SwagBucks rewards, custom subdomains. Get your store in 24 hours!',
  keywords: [
    'custom team stores canada',
    'hockey team merchandise',
    'canadian team apparel',
    'dance studio merchandise',
    'band merchandise canada',
    'team store creation',
    'swagbucks rewards',
    'canadian team gear',
    'custom team jerseys',
    'team merchandise platform',
    'sports team stores',
    'organization merchandise',
    'canadian small business',
    'team fundraising',
    'branded merchandise canada'
  ],
  authors: [{ name: '3thirty3' }],
  creator: '3thirty3',
  publisher: 'SwagStore',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://swagstore.ca',
    title: 'SwagStore - Custom Team Stores for Canadian Organizations',
    description: 'Professional custom team stores for Canadian hockey teams, dance studios, bands & organizations. Free setup, SwagBucks rewards, custom subdomains.',
    siteName: 'SwagStore',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SwagStore - Custom Team Stores for Canadian Organizations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SwagStore - Custom Team Stores for Canadian Organizations',
    description: 'Professional custom team stores for Canadian teams. Free setup, SwagBucks rewards, custom subdomains.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://swagstore.ca',
  },
  other: {
    'geo.region': 'CA',
    'geo.country': 'Canada',
    'geo.placename': 'Canada',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SwagStore',
    url: 'https://swagstore.ca',
    logo: 'https://swagstore.ca/logo.png',
    description: 'Custom team stores for Canadian organizations',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CA'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'CA'
    },
    sameAs: []
  };

  return (
    <html lang="en-CA">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
  <FirebaseClientProvider>
          <header className="w-full border-b bg-white relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-0 flex items-center" style={{ minHeight: 0 }}>
              {/* Header content (nav, account links) can be placed here. Logo is rendered on pages that need it (for example, below the orange tape on the home page). */}
            </div>
          </header>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

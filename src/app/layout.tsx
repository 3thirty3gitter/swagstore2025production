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
    default: 'Custom Team Stores & Apparel | Free Setup | SwagStore Canada',
    template: '%s | SwagStore Canada'
  },
  description: 'Free custom team stores for schools, sports teams, clubs & organizations across Canada. We build your store, you earn rewards. Custom apparel, merchandise & branded gear in 24 hours.',
  keywords: [
    // Primary Keywords - Team Stores
    'custom team stores canada',
    'team merchandise store',
    'online team store platform',
    'custom team apparel store',
    'team store builder',
    
    // Sports Teams
    'hockey team merchandise',
    'hockey team apparel',
    'sports team stores',
    'sports team merchandise',
    'youth sports apparel',
    'minor hockey merchandise',
    'baseball team gear',
    'soccer team apparel',
    'basketball team merchandise',
    'football team gear',
    
    // Schools & Education
    'school spirit wear',
    'school merchandise store',
    'school apparel canada',
    'student group merchandise',
    'school team apparel',
    'university merchandise',
    'college apparel store',
    
    // Dance & Arts
    'dance studio merchandise',
    'dance team apparel',
    'dance studio apparel',
    'performing arts merchandise',
    'band merchandise canada',
    'music group apparel',
    'choir merchandise',
    
    // Clubs & Organizations
    'club merchandise',
    'organization apparel',
    'group merchandise canada',
    'non-profit merchandise',
    'community group apparel',
    'team fundraising merchandise',
    
    // Product Types
    'custom team jerseys',
    'custom hoodies canada',
    'custom t-shirts canada',
    'team jackets',
    'custom hats canada',
    'branded merchandise',
    'promotional apparel',
    'team uniforms',
    
    // Service Features
    'free team store setup',
    'team store rewards program',
    'swagbucks rewards',
    'custom subdomain store',
    'online fundraising store',
    'team store management',
    
    // Location-based
    'canadian team apparel',
    'canadian team gear',
    'canadian custom merchandise',
    'canada team stores',
    'team merchandise canada',
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
    title: 'Custom Team Stores & Apparel for Canadian Teams | Free Setup',
    description: 'Free custom team stores for schools, sports teams, clubs & organizations. We build your store, you earn rewards on every purchase. Launch in 24 hours.',
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
    title: 'Custom Team Stores & Apparel for Canadian Teams | Free Setup',
    description: 'Free custom team stores for schools, sports teams, clubs & organizations. We build your store, you earn rewards. Launch in 24 hours.',
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
    alternateName: 'SwagStore Canada',
    url: 'https://swagstore.ca',
    logo: 'https://swagstore.ca/logo.png',
    description: 'Free custom team stores for schools, sports teams, clubs & organizations across Canada. We build your store, you earn rewards on every purchase.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CA'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'CA'
    },
    sameAs: [],
    service: {
      '@type': 'Service',
      name: 'Custom Team Store Creation',
      description: 'Free professional team store setup with custom subdomain, merchandise management, and rewards program',
      provider: {
        '@type': 'Organization',
        name: 'SwagStore'
      },
      areaServed: {
        '@type': 'Country',
        name: 'Canada'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Team Merchandise Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom Team Stores for Sports Teams',
              description: 'Hockey, soccer, baseball, basketball, football team merchandise stores'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'School Spirit Wear Stores',
              description: 'Custom apparel stores for schools, colleges, and universities'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Dance Studio Merchandise',
              description: 'Custom dance team and studio apparel stores'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Club & Organization Stores',
              description: 'Custom merchandise for clubs, groups, and non-profits'
            }
          }
        ]
      }
    }
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

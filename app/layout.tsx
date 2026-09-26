import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { SITE_URL, SITE_NAME, SITE_EMAIL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from '@/lib/site'
import { getSiteSettings } from '@/sanity/lib/queries'
import './globals.css'

const shareDescription =
  'Bespoke retreat production for wellness coaches, facilitators and transformational leaders — from the Pyramids to the Red Sea.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Nefertiti | Luxury Wellness Retreats in Egypt',
    template: '%s | Nefertiti Retreats',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'wellness retreats Egypt',
    'luxury retreats Egypt',
    'yoga retreat Egypt',
    'retreat producer',
    'host a retreat in Egypt',
    'retreat planning Egypt',
    'Red Sea retreat',
    'Luxor retreat',
    'Siwa retreat',
    'Pyramids yoga',
  ],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Nefertiti | Luxury Wellness Retreats in Egypt',
    description: shareDescription,
    url: '/',
    images: [DEFAULT_OG_IMAGE],
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nefertiti | Luxury Wellness Retreats in Egypt',
    description: shareDescription,
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f4f0e8',
  userScalable: true,
}

// Only real profile links (e.g. https://instagram.com/nefertiti), not bare placeholders
function profileLinks(links: string[][]) {
  return links
    .map(([, url]) => url)
    .filter((url) => {
      try {
        return new URL(url).pathname.replace(/\/$/, '').length > 1
      } catch {
        return false
      }
    })
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings()
  const sameAs = profileLinks(settings.socialLinks)

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/nefertiti-logo-dark.png`,
    image: `${SITE_URL}/og-image.png`,
    email: settings.contactEmail || SITE_EMAIL,
    telephone: settings.whatsappNumber ? `+${settings.whatsappNumber}` : undefined,
    description: DEFAULT_DESCRIPTION,
    areaServed: { '@type': 'Country', name: 'Egypt' },
    founder: { '@type': 'Person', name: 'Azza' },
    ...(sameAs.length ? { sameAs } : {}),
  }

  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Google Translate — English + Italian only */}
        <div id="google_translate_element" aria-hidden="true" />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,it',
                autoDisplay: false,
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

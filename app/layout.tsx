import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nefertiti | Luxury Retreat Producer',
  description: 'Immersive retreats, wellness journeys and beautifully produced experiences across Egypt and beyond.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Nefertiti | Luxury Retreat Producer',
    description: 'Bespoke retreat production for wellness coaches, facilitators and transformational leaders — from the Pyramids to the Red Sea.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Nefertiti Luxury Retreat Producer' }],
    type: 'website',
    siteName: 'Nefertiti Retreats',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nefertiti | Luxury Retreat Producer',
    description: 'Bespoke retreat production for wellness coaches, facilitators and transformational leaders — from the Pyramids to the Red Sea.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f4f0e8',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
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

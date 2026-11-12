import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SITE_URL, SITE_NAME, SITE_EMAIL, DEFAULT_OG_IMAGE } from '@/lib/site'
import { languageAlternates } from '@/lib/seo'
import { getSiteSettings, getRetreats, getPageTexts, getPartners, getCollaborations } from '@/sanity/lib/queries'
import { menuDefaults } from '@/lib/data'
import { splitRetreats } from '@/lib/retreat-utils'
import RetreatBar from '@/components/RetreatBar'
import { lang } from 'next/root-params'
import { notFound } from 'next/navigation'
import { LocaleProvider } from '@/components/LocaleProvider'
import { isLocale, localePath, locales, type Locale } from '@/lib/i18n'
import { getUi } from '@/lib/ui'
import CookieNotice from '@/components/CookieNotice'
import ComfortPanel from '@/components/ComfortPanel'
import ScrollMemory from '@/components/ScrollMemory'
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider'
import '../globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const current: unknown = await lang()
  const locale: Locale = isLocale(current) ? current : 'en'
  const m = getUi(locale).meta
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: m.siteTitle,
      template: '%s | Nefertiti Retreats',
    },
    description: m.siteDescription,
    applicationName: SITE_NAME,
    keywords: m.keywords,
    alternates: { canonical: localePath(locale, '/'), languages: languageAlternates('/') },
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
      title: m.siteTitle,
      description: m.shareDescription,
      url: localePath(locale, '/'),
      images: [DEFAULT_OG_IMAGE],
      type: 'website',
      siteName: SITE_NAME,
      locale: m.ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: m.siteTitle,
      description: m.shareDescription,
      images: ['/og-image.jpg'],
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f4f0e8',
  initialScale: 1,
  width: 'device-width',
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

export function generateStaticParams() {
  return locales.map((l) => ({ lang: l }))
}


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const current: unknown = await lang()
  if (!isLocale(current)) notFound()
  const locale: Locale = current
  const [settings, retreats, pageTexts, partners, collaborations] = await Promise.all([getSiteSettings(), getRetreats(), getPageTexts(), getPartners(), getCollaborations()])
  // A section with nothing published in the Studio disappears from the menu and the home page
  const hiddenPaths = [
    ...(partners.length === 0 ? ['/partners'] : []),
    ...(retreats.length === 0 ? ['/retreats'] : []),
    ...(collaborations.length === 0 ? ['/collaborations'] : []),
  ]
  const menuItems = (settings.menuItems && settings.menuItems.length ? settings.menuItems : menuDefaults).filter(([, href]) => !hiddenPaths.includes(href))
  const sameAs = profileLinks(settings.socialLinks)

  const MONTHS = getUi(locale).months
  const next = settings.showRetreatBar
    ? splitRetreats(retreats).upcoming.find((r) => r.status !== 'soldout')
    : undefined
  const barRetreat = next
    ? {
        id: next.id,
        title: next.title,
        place: next.destination?.title || getUi(locale).meta.egypt,
        month: next.startDate
          ? `${MONTHS[Number(next.startDate.slice(5, 7)) - 1]} ${next.startDate.slice(0, 4)}`
          : '',
      }
    : null

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/nefertiti-lockup.png`,
    image: `${SITE_URL}/og-image.jpg`,
    email: settings.contactEmail || SITE_EMAIL,
    telephone: settings.whatsappNumber ? `+${settings.whatsappNumber}` : undefined,
    description: getUi(locale).meta.siteDescription,
    areaServed: { '@type': 'Country', name: 'Egypt' },
    founder: { '@type': 'Person', name: 'Azza' },
    ...(sameAs.length ? { sameAs } : {}),
  }

  return (
    <html lang={locale} className="bg-background" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=JSON.parse(localStorage.getItem('nef-comfort')||'{}'),d=document.documentElement;['text','contrast','motion','links','tone'].forEach(function(k){if(p[k])d.dataset['c'+k.charAt(0).toUpperCase()+k.slice(1)]=p[k]})}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        <RetreatBar retreat={barRetreat} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <LocaleProvider locale={locale}>
        <SiteSettingsProvider value={{ contactEmail: settings.contactEmail, socialLinks: settings.socialLinks, whatsappLink: settings.whatsappLink, texts: pageTexts, menuItems, hiddenPaths }}>
          {children}
        </SiteSettingsProvider>
        </LocaleProvider>
        <CookieNotice />
        <ComfortPanel />
        <ScrollMemory />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

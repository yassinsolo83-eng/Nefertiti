import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { DEFAULT_DESCRIPTION } from '@/lib/site'
import {
  getFeaturedDestinations,
  getMoreDestinations,
  getPartners,
  getSiteContent,
  getSiteSettings,
} from '@/sanity/lib/queries'
import HomePage from '@/components/HomePage'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.default,
    title: 'Nefertiti | Luxury Wellness Retreats in Egypt',
    description: DEFAULT_DESCRIPTION,
    path: '/',
    absoluteTitle: true,
  })
}

export default async function Page() {
  const [featuredDestinations, moreDestinations, partners, t, settings] = await Promise.all([
    getFeaturedDestinations(),
    getMoreDestinations(),
    getPartners(),
    getSiteContent(),
    getSiteSettings(),
  ])

  return (
    <HomePage
      featuredDestinations={featuredDestinations}
      moreDestinations={moreDestinations}
      partners={partners}
      t={t}
      combinations={settings.combinations}
      whatsappLink={settings.whatsappLink}
    />
  )
}

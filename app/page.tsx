import {
  getFeaturedDestinations,
  getMoreDestinations,
  getPartners,
  getSiteContent,
  getSiteSettings,
} from '@/sanity/lib/queries'
import HomePage from '@/components/HomePage'

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

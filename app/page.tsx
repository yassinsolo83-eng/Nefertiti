import {
  getFeaturedDestinations,
  getMoreDestinations,
  getPartners,
  getSiteContent,
} from '@/sanity/lib/queries'
import HomePage from '@/components/HomePage'

export default async function Page() {
  const [featuredDestinations, moreDestinations, partners, t] = await Promise.all([
    getFeaturedDestinations(),
    getMoreDestinations(),
    getPartners(),
    getSiteContent(),
  ])

  return (
    <HomePage
      featuredDestinations={featuredDestinations}
      moreDestinations={moreDestinations}
      partners={partners}
      t={t}
    />
  )
}

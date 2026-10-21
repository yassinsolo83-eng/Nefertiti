import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ArrowUpRight } from 'lucide-react'
import { getFeaturedDestinations, getMoreDestinations, getSiteContent, getSiteSettings } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import DestinationsOverview from '@/components/DestinationsOverview'
import { Ornament } from '@/components/Motif'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.default,
    title: 'Destinations — Where We Take Your Retreat in Egypt',
    description:
      'Cairo, the Red Sea, Luxor, Siwa, the desert and more: explore every destination where Nefertiti produces wellness retreats in Egypt.',
    path: '/destinations',
  })
}

export default async function DestinationsPage() {
  const [featured, more, t] = await Promise.all([getFeaturedDestinations(), getMoreDestinations(), getSiteContent()])

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="dest-index-hero">
        <p className="eyebrow">◆ DESTINATIONS</p>
        <Ornament name="sun" center />
        <h1 className="dest-index-title">Where we take your retreat</h1>
        <p className="dest-index-sub">
          From the pyramids to the Red Sea, the oases to the White Desert: pick a place on the map and see what it makes possible.
        </p>
      </section>

      <section className="section inner-section">
        <DestinationsOverview featured={featured} more={more} moreLabel={t.destMoreLabel} />
        <a href="/contact" className="button button-gold inner-cta">
          Create a retreat in Egypt <ArrowUpRight size={16} />
        </a>
      </section>

      <SiteFooter />
    </main>
  )
}

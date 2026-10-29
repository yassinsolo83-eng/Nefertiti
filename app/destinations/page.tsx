import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ArrowUpRight } from 'lucide-react'
import { getFeaturedDestinations, getMoreDestinations, getPageTexts, getSiteContent, getSiteSettings } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import DestinationsOverview from '@/components/DestinationsOverview'
import { Ornament } from '@/components/Motif'
import BackButton from '@/components/BackButton'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.destinations,
    fallbackSeo: settings.seo.default,
    title: 'Destinations — Where We Take Your Retreat in Egypt',
    description:
      'Cairo, the Red Sea, Luxor, Siwa, the desert and more: explore every destination where Nefertiti produces wellness retreats in Egypt.',
    path: '/destinations',
  })
}

export default async function DestinationsPage() {
  const [featured, more, t, texts] = await Promise.all([getFeaturedDestinations(), getMoreDestinations(), getSiteContent(), getPageTexts()])

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="dest-index-hero">
        <div className="dest-index-back"><BackButton /></div>
        <p className="eyebrow">{texts.destPageEyebrow}</p>
        <Ornament name="sun" center />
        <h1 className="dest-index-title">{texts.destPageTitle}</h1>
        <p className="dest-index-sub">{texts.destPageSub}</p>
      </section>

      <section className="section inner-section">
        <DestinationsOverview featured={featured} more={more} moreLabel={t.destMoreLabel} />
        <Link href="/pre-call" className="button button-gold inner-cta">
          {texts.destPageButton} <ArrowUpRight size={16} />
        </Link>
      </section>

      <SiteFooter />
    </main>
  )
}

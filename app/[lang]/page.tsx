import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getUi } from '@/lib/ui'
import {
  currentLocale,
  getFeaturedDestinations,
  getMoreDestinations,
  getPartners,
  getCollaborations,
  getSiteContent,
  getSiteSettings,
  getRetreats,
  getHomeStats,
  getTestimonials,
  getSteps,
  getPageTexts,
} from '@/sanity/lib/queries'
import { splitRetreats } from '@/lib/retreat-utils'
import HomePage from '@/components/HomePage'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([getSiteSettings(), currentLocale()])
  const m = getUi(locale).meta
  return buildMetadata({
    seo: settings.seo.default,
    title: m.siteTitle,
    description: m.siteDescription,
    path: '/',
    absoluteTitle: true,
  })
}

export default async function Page() {
  const [featuredDestinations, moreDestinations, partners, collaborations, t, settings, retreats, testimonials, steps, pageTexts] = await Promise.all([
    getFeaturedDestinations(),
    getMoreDestinations(),
    getPartners(),
    getCollaborations(),
    getSiteContent(),
    getSiteSettings(),
    getRetreats(),
    getTestimonials(),
    getSteps(),
    getPageTexts(),
  ])
  const destinationCount = new Set([...featuredDestinations, ...moreDestinations].map((d) => d.id)).size
  const stats = await getHomeStats(destinationCount)
  const upcomingRetreats = splitRetreats(retreats).upcoming.slice(0, 3)

  return (
    <HomePage
      featuredDestinations={featuredDestinations}
      moreDestinations={moreDestinations}
      partners={partners}
      collaborations={collaborations}
      t={t}
      combinations={settings.combinations}
      upcomingRetreats={upcomingRetreats}
      stats={stats}
      testimonials={testimonials}
      steps={steps}
      pageTexts={pageTexts}
    />
  )
}

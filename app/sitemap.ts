import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import {
  getFeaturedDestinations,
  getMoreDestinations,
  getDestinationBySlug,
  getPartners,
  getRetreats,
} from '@/sanity/lib/queries'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/retreats`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/experiences`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/partners`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const [featured, more, partners, retreats] = await Promise.all([
    getFeaturedDestinations(),
    getMoreDestinations(),
    getPartners(),
    getRetreats(),
  ])

  // Only list destinations that actually resolve to a page (avoid 404s in the sitemap)
  const slugs = Array.from(new Set([...featured, ...more].map((d) => d.id)))
  // and skip anything marked "Hide from Google" in Sanity
  const resolved = await Promise.all(
    slugs.map(async (slug) => {
      const result = await getDestinationBySlug(slug)
      return result && !result.dest.seo?.noIndex ? slug : null
    }),
  )

  const destinationRoutes: MetadataRoute.Sitemap = resolved
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      url: `${SITE_URL}/destinations/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

  const partnerRoutes: MetadataRoute.Sitemap = partners
    .filter((p) => !p.seo?.noIndex)
    .map((p) => ({
    url: `${SITE_URL}/partners/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  // Retreats marked "Hide from Google" stay out of the sitemap
  const retreatRoutes: MetadataRoute.Sitemap = retreats
    .filter((r) => !r.seo?.noIndex)
    .map((r) => ({
      url: `${SITE_URL}/retreats/${r.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  return [...staticRoutes, ...retreatRoutes, ...destinationRoutes, ...partnerRoutes]
}

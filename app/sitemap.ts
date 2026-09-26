import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import {
  getFeaturedDestinations,
  getMoreDestinations,
  getDestinationBySlug,
  getPartners,
} from '@/sanity/lib/queries'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/experiences`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/partners`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
  ]

  const [featured, more, partners] = await Promise.all([
    getFeaturedDestinations(),
    getMoreDestinations(),
    getPartners(),
  ])

  // Only list destinations that actually resolve to a page (avoid 404s in the sitemap)
  const slugs = Array.from(new Set([...featured, ...more].map((d) => d.id)))
  const resolved = await Promise.all(slugs.map(async (slug) => ((await getDestinationBySlug(slug)) ? slug : null)))

  const destinationRoutes: MetadataRoute.Sitemap = resolved
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      url: `${SITE_URL}/destinations/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

  const partnerRoutes: MetadataRoute.Sitemap = partners.map((p) => ({
    url: `${SITE_URL}/partners/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...destinationRoutes, ...partnerRoutes]
}

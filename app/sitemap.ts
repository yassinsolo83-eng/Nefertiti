import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { localePath } from '@/lib/i18n'
import {
  getFeaturedDestinations,
  getMoreDestinations,
  getDestinationBySlug,
  getPartners,
  getRetreats,
  getCollaborations,
} from '@/sanity/lib/queries'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/destinations`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/retreats`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/experiences`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/partners`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/collaborations`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/pre-call`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
  ]

  const [featured, more, partners, retreats, collaborations] = await Promise.all([
    getFeaturedDestinations(),
    getMoreDestinations(),
    getPartners(),
    getRetreats(),
    getCollaborations(),
  ])

  // A section with nothing published is hidden from the site, so it stays out of the sitemap too
  const hidden = [
    ...(partners.length === 0 ? ['/partners'] : []),
    ...(retreats.length === 0 ? ['/retreats'] : []),
    ...(collaborations.length === 0 ? ['/collaborations'] : []),
  ]
  const visibleStatic = staticRoutes.filter((r) => !hidden.includes(r.url.slice(SITE_URL.length)))

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

  const collaborationRoutes: MetadataRoute.Sitemap = collaborations.map((c) => ({
    url: `${SITE_URL}/collaborations/${c.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.4,
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

  // Every page exists in English and Italian; each entry points at its twin
  const both = (entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap =>
    entries.flatMap((e) => {
      const path = e.url.slice(SITE_URL.length) || '/'
      const languages = { en: `${SITE_URL}${path === '/' ? '/' : path}`, it: `${SITE_URL}${localePath('it', path)}` }
      return [
        { ...e, url: languages.en, alternates: { languages } },
        { ...e, url: languages.it, alternates: { languages } },
      ]
    })

  return both([...visibleStatic, ...retreatRoutes, ...destinationRoutes, ...partnerRoutes, ...collaborationRoutes])
}

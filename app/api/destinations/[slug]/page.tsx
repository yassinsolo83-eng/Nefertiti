import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDestinationBySlug, getSiteSettings } from '@/sanity/lib/queries'
import DestinationDetailPage from '@/components/DestinationDetailPage'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/seo'

type Params = { params: Promise<{ slug: string }> }

function absolute(url: string) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${SITE_URL}${url}`
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const [result, settings] = await Promise.all([getDestinationBySlug(slug), getSiteSettings()])
  if (!result) return { title: 'Destination not found', robots: { index: false } }

  const { dest, detail } = result
  return buildMetadata({
    seo: dest.seo,
    fallbackSeo: settings.seo.default,
    title: `Wellness Retreats in ${dest.title}`,
    description: dest.desc || detail.overview || '',
    path: `/destinations/${slug}`,
    image: dest.image,
    imageAlt: dest.title,
  })
}

export default async function Page({ params }: Params) {
  const { slug } = await params
  const [result, settings] = await Promise.all([
    getDestinationBySlug(slug),
    getSiteSettings(),
  ])

  // Real 404 status instead of a "not found" page with 200 (soft 404)
  if (!result) return notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: result.dest.title,
    description: result.detail.overview || result.dest.desc,
    url: `${SITE_URL}/destinations/${slug}`,
    image: absolute(result.dest.image),
    containedInPlace: { '@type': 'Country', name: 'Egypt' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DestinationDetailPage dest={result.dest} detail={result.detail} whatsappLink={settings.whatsappLink} />
    </>
  )
}

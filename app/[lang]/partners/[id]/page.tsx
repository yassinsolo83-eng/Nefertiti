import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { currentLocale, getPartners, getSiteSettings } from '@/sanity/lib/queries'
import { getUi } from '@/lib/ui'
import { cropUrl } from '@/sanity/lib/image'
import PartnerDetailPage from '@/components/PartnerDetailPage'
import { buildMetadata } from '@/lib/seo'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const [partners, settings, locale] = await Promise.all([getPartners(), getSiteSettings(), currentLocale()])
  const m = getUi(locale).meta.partners
  const partner = partners.find((p) => p.id === id)
  if (!partner) return { title: m.notFound, robots: { index: false } }

  return buildMetadata({
    seo: partner.seo,
    fallbackSeo: settings.seo.default,
    title: partner.category ? `${partner.name} — ${partner.category}` : partner.name,
    description: partner.tagline || partner.bio || m.fallback(partner.name),
    path: `/partners/${id}`,
    image: cropUrl(partner.image, 1200, 630),
    imageAlt: partner.name,
    type: 'profile',
  })
}

export default async function Page({ params }: Params) {
  const { id } = await params
  const partners = await getPartners()
  const partner = partners.find((p) => p.id === id)
  if (!partner) return notFound()

  return <PartnerDetailPage partner={partner} />
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPartners, getSiteSettings } from '@/sanity/lib/queries'
import PartnerDetailPage from '@/components/PartnerDetailPage'
import { buildMetadata } from '@/lib/seo'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const [partners, settings] = await Promise.all([getPartners(), getSiteSettings()])
  const partner = partners.find((p) => p.id === id)
  if (!partner) return { title: 'Partner not found', robots: { index: false } }

  return buildMetadata({
    seo: partner.seo,
    fallbackSeo: settings.seo.default,
    title: partner.category ? `${partner.name} — ${partner.category}` : partner.name,
    description: partner.tagline || partner.bio || `${partner.name}, retreat practitioner with Nefertiti Retreats in Egypt.`,
    path: `/partners/${id}`,
    image: partner.image,
    imageAlt: partner.name,
    type: 'profile',
  })
}

export default async function Page({ params }: Params) {
  const { id } = await params
  const [partners, settings] = await Promise.all([
    getPartners(),
    getSiteSettings(),
  ])
  const partner = partners.find((p) => p.id === id)
  if (!partner) return notFound()

  return <PartnerDetailPage partner={partner} whatsappLink={settings.whatsappLink} />
}

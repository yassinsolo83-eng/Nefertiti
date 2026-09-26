import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPartners, getSiteSettings } from '@/sanity/lib/queries'
import PartnerDetailPage from '@/components/PartnerDetailPage'
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/site'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const partners = await getPartners()
  const partner = partners.find((p) => p.id === id)
  if (!partner) return { title: 'Partner not found', robots: { index: false } }

  const title = partner.category ? `${partner.name} — ${partner.category}` : partner.name
  const description = (partner.tagline || partner.bio || `${partner.name}, retreat practitioner with Nefertiti Retreats in Egypt.`).slice(0, 160)
  const image = partner.image ? (partner.image.startsWith('http') ? partner.image : `${SITE_URL}${partner.image}`) : undefined

  return {
    title,
    description,
    alternates: { canonical: `/partners/${id}` },
    openGraph: {
      title: `${title} | Nefertiti Retreats`,
      description,
      url: `/partners/${id}`,
      type: 'profile',
      images: image ? [{ url: image, alt: partner.name }] : [DEFAULT_OG_IMAGE],
    },
  }
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

import { getPartners, getSiteSettings } from '@/sanity/lib/queries'
import PartnerDetailPage from '@/components/PartnerDetailPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [partners, settings] = await Promise.all([
    getPartners(),
    getSiteSettings(),
  ])
  const partner = partners.find((p) => p.id === id) || null

  return <PartnerDetailPage partner={partner} whatsappLink={settings.whatsappLink} />
}

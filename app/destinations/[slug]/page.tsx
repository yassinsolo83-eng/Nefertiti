import { getDestinationBySlug, getSiteSettings } from '@/sanity/lib/queries'
import DestinationDetailPage from '@/components/DestinationDetailPage'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [result, settings] = await Promise.all([
    getDestinationBySlug(slug),
    getSiteSettings(),
  ])

  return (
    <DestinationDetailPage
      dest={result?.dest || null}
      detail={result?.detail || null}
      whatsappLink={settings.whatsappLink}
    />
  )
}

import { getDestinationBySlug } from '@/sanity/lib/queries'
import DestinationDetailPage from '@/components/DestinationDetailPage'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await getDestinationBySlug(slug)

  return (
    <DestinationDetailPage
      dest={result?.dest || null}
      detail={result?.detail || null}
    />
  )
}

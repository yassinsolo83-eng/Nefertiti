import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getServiceTiers, getSiteSettings } from '@/sanity/lib/queries'
import ServicesPage from '@/components/ServicesPage'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.services,
    fallbackSeo: settings.seo.default,
    title: 'Retreat Production Services',
    description: 'Full-service retreat production in Egypt for coaches and facilitators: venues, logistics, experiences, transport and on-the-ground hosting.',
    path: '/services',
  })
}

export default async function Page() {
  const serviceTiers = await getServiceTiers()
  return <ServicesPage serviceTiers={serviceTiers} />
}

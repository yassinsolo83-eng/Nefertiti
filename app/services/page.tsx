import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/site'
import { getServiceTiers } from '@/sanity/lib/queries'
import ServicesPage from '@/components/ServicesPage'

export const metadata: Metadata = {
  title: 'Retreat Production Services',
  description: 'Full-service retreat production in Egypt for coaches and facilitators: venues, logistics, experiences, transport and on-the-ground hosting.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Retreat Production Services | Nefertiti Retreats',
    description: 'Full-service retreat production in Egypt for coaches and facilitators: venues, logistics, experiences, transport and on-the-ground hosting.',
    url: '/services',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default async function Page() {
  const serviceTiers = await getServiceTiers()
  return <ServicesPage serviceTiers={serviceTiers} />
}

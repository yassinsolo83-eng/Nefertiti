import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/site'
import { getExperiences } from '@/sanity/lib/queries'
import ExperiencesPage from '@/components/ExperiencesPage'

export const metadata: Metadata = {
  title: 'Signature Retreat Experiences in Egypt',
  description: 'Sound healing, floating yoga, felucca sails, hammam rituals, pottery and sunrise at the Pyramids — curated experiences for wellness retreats in Egypt.',
  alternates: { canonical: '/experiences' },
  openGraph: {
    title: 'Signature Retreat Experiences in Egypt | Nefertiti Retreats',
    description: 'Sound healing, floating yoga, felucca sails, hammam rituals, pottery and sunrise at the Pyramids — curated experiences for wellness retreats in Egypt.',
    url: '/experiences',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default async function Page() {
  const experiences = await getExperiences()
  return <ExperiencesPage experiences={experiences} />
}

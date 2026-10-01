import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getExperiences, getPageImages, getSiteSettings } from '@/sanity/lib/queries'
import ExperiencesPage from '@/components/ExperiencesPage'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.experiences,
    fallbackSeo: settings.seo.default,
    title: 'Signature Retreat Experiences in Egypt',
    description: 'Sound healing, floating yoga, felucca sails, hammam rituals, pottery and sunrise at the Pyramids — curated experiences for wellness retreats in Egypt.',
    path: '/experiences',
  })
}

export default async function Page() {
  const [experiences, pageImages] = await Promise.all([getExperiences(), getPageImages()])
  return <ExperiencesPage experiences={experiences} heroImage={pageImages.experiencesHero} />
}

import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getUi } from '@/lib/ui'

import { currentLocale, getExperiences, getPageImages, getPageTexts, getSiteSettings } from '@/sanity/lib/queries'
import ExperiencesPage from '@/components/ExperiencesPage'

export async function generateMetadata(): Promise<Metadata> {
  const m = getUi(await currentLocale()).meta.experiences
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.experiences,
    fallbackSeo: settings.seo.default,
    title: m.title,
    description: m.description,
    path: '/experiences',
  })
}

export default async function Page() {
  const [experiences, pageImages, texts] = await Promise.all([getExperiences(), getPageImages(), getPageTexts()])
  return <ExperiencesPage experiences={experiences} heroImage={pageImages.experiencesHero} texts={texts} />
}

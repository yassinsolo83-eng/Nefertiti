import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getUi } from '@/lib/ui'

import { currentLocale, getPageImages, getPageTexts, getSteps, getSiteSettings } from '@/sanity/lib/queries'
import HowItWorksPage from '@/components/HowItWorksPage'

export async function generateMetadata(): Promise<Metadata> {
  const m = getUi(await currentLocale()).meta.howItWorks
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.howItWorks,
    fallbackSeo: settings.seo.default,
    title: m.title,
    description: m.description,
    path: '/how-it-works',
  })
}

export default async function Page() {
  const [steps, pageImages, texts] = await Promise.all([getSteps(), getPageImages(), getPageTexts()])
  return <HowItWorksPage steps={steps} heroImage={pageImages.howItWorksHero} texts={texts} />
}

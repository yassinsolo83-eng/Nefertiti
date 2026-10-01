import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getPageImages, getSteps, getSiteSettings } from '@/sanity/lib/queries'
import HowItWorksPage from '@/components/HowItWorksPage'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.howItWorks,
    fallbackSeo: settings.seo.default,
    title: 'How It Works — Planning Your Retreat in Egypt',
    description: 'From discovery call to the final day: how Nefertiti plans and produces your bespoke wellness retreat in Egypt, step by step.',
    path: '/how-it-works',
  })
}

export default async function Page() {
  const [steps, pageImages] = await Promise.all([getSteps(), getPageImages()])
  return <HowItWorksPage steps={steps} heroImage={pageImages.howItWorksHero} />
}

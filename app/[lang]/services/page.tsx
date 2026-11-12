import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getUi } from '@/lib/ui'

import { currentLocale, getPageImages, getPageTexts, getServiceTiers, getSiteSettings } from '@/sanity/lib/queries'
import ServicesPage from '@/components/ServicesPage'

export async function generateMetadata(): Promise<Metadata> {
  const m = getUi(await currentLocale()).meta.services
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.services,
    fallbackSeo: settings.seo.default,
    title: m.title,
    description: m.description,
    path: '/services',
  })
}

export default async function Page() {
  const [serviceTiers, pageImages, texts] = await Promise.all([getServiceTiers(), getPageImages(), getPageTexts()])
  return <ServicesPage serviceTiers={serviceTiers} heroImage={pageImages.servicesHero} texts={texts} />
}

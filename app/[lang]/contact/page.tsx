import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getUi } from '@/lib/ui'

import { currentLocale, getFaqs, getFeaturedDestinations, getMoreDestinations, getPageImages, getSiteSettings } from '@/sanity/lib/queries'
import ContactPage from '@/components/ContactPage'

export async function generateMetadata(): Promise<Metadata> {
  const m = getUi(await currentLocale()).meta.contact
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.contact,
    fallbackSeo: settings.seo.default,
    title: m.title,
    description: m.description,
    path: '/contact',
  })
}

export default async function Page() {
  const [faqs, settings, pageImages, featured, more] = await Promise.all([
    getFaqs(),
    getSiteSettings(),
    getPageImages(),
    getFeaturedDestinations(),
    getMoreDestinations(),
  ])

  return (
    <ContactPage
      faqs={faqs}
      whatsappLink={settings.whatsappLink}
      socialLinks={settings.socialLinks}
      appointmentServices={settings.appointmentServices}
      pageImages={pageImages}
      destinations={[...featured, ...more]}
      featuredIds={featured.map((d) => d.id)}
    />
  )
}

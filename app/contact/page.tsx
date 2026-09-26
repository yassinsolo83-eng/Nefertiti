import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getFaqs, getSiteSettings } from '@/sanity/lib/queries'
import ContactPage from '@/components/ContactPage'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.contact,
    fallbackSeo: settings.seo.default,
    title: 'Contact — Plan Your Retreat in Egypt',
    description: 'Tell us about your retreat idea. Book a discovery call or message us on WhatsApp to start planning your wellness retreat in Egypt.',
    path: '/contact',
  })
}

export default async function Page() {
  const [faqs, settings] = await Promise.all([
    getFaqs(),
    getSiteSettings(),
  ])

  return (
    <ContactPage
      faqs={faqs}
      whatsappLink={settings.whatsappLink}
      socialLinks={settings.socialLinks}
      appointmentServices={settings.appointmentServices}
    />
  )
}

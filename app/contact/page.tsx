import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/site'
import { getFaqs, getSiteSettings } from '@/sanity/lib/queries'
import ContactPage from '@/components/ContactPage'

export const metadata: Metadata = {
  title: 'Contact — Plan Your Retreat in Egypt',
  description: 'Tell us about your retreat idea. Book a discovery call or message us on WhatsApp to start planning your wellness retreat in Egypt.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Plan Your Retreat in Egypt | Nefertiti Retreats',
    description: 'Tell us about your retreat idea. Book a discovery call or message us on WhatsApp to start planning your wellness retreat in Egypt.',
    url: '/contact',
    images: [DEFAULT_OG_IMAGE],
  },
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

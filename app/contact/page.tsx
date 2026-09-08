import { getFaqs, getSiteSettings } from '@/sanity/lib/queries'
import ContactPage from '@/components/ContactPage'

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

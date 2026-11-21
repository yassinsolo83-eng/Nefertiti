import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getUi } from '@/lib/ui'
import { currentLocale, getSiteSettings } from '@/sanity/lib/queries'
import CardPage from '@/components/CardPage'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([getSiteSettings(), currentLocale()])
  const m = getUi(locale).meta.card
  return buildMetadata({
    fallbackSeo: settings.seo.default,
    title: m.title,
    description: m.description,
    path: '/card',
    seo: { noIndex: true }, // a page to share, not one to rank in Google
  })
}

export default async function Page() {
  const [settings, locale] = await Promise.all([getSiteSettings(), currentLocale()])
  return <CardPage locale={locale} email={settings.contactEmail} whatsappLink={settings.whatsappLink} />
}

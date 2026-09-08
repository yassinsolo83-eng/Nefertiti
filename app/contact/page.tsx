import { getFaqs } from '@/sanity/lib/queries'
import ContactPage from '@/components/ContactPage'

export default async function Page() {
  const faqs = await getFaqs()
  return <ContactPage faqs={faqs} />
}

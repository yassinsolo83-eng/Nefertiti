import { getServiceTiers } from '@/sanity/lib/queries'
import ServicesPage from '@/components/ServicesPage'

export default async function Page() {
  const serviceTiers = await getServiceTiers()
  return <ServicesPage serviceTiers={serviceTiers} />
}

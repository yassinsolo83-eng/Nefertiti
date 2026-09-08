import { getSteps } from '@/sanity/lib/queries'
import HowItWorksPage from '@/components/HowItWorksPage'

export default async function Page() {
  const steps = await getSteps()
  return <HowItWorksPage steps={steps} />
}

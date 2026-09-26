import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/site'
import { getSteps } from '@/sanity/lib/queries'
import HowItWorksPage from '@/components/HowItWorksPage'

export const metadata: Metadata = {
  title: 'How It Works — Planning Your Retreat in Egypt',
  description: 'From discovery call to the final day: how Nefertiti plans and produces your bespoke wellness retreat in Egypt, step by step.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How It Works — Planning Your Retreat in Egypt | Nefertiti Retreats',
    description: 'From discovery call to the final day: how Nefertiti plans and produces your bespoke wellness retreat in Egypt, step by step.',
    url: '/how-it-works',
    images: [DEFAULT_OG_IMAGE],
  },
}

export default async function Page() {
  const steps = await getSteps()
  return <HowItWorksPage steps={steps} />
}

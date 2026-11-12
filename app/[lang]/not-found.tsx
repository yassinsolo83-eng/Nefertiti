import type { Metadata } from 'next'
import NotFoundContent from '@/components/NotFoundContent'
import { currentLocale } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default async function NotFound() {
  return <NotFoundContent locale={await currentLocale()} />
}

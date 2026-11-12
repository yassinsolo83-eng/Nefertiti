'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from '@/components/LocLink'
import { useLocalePath, useUi } from '@/components/LocaleProvider'

/**
 * Back link for inner pages — returns to the previous page in history
 * (router.back). Falls back to the home page if there is no history entry
 * (e.g. the visitor landed directly on this page).
 */
export default function BackButton() {
  const router = useRouter()
  const toPath = useLocalePath()
  const t = useUi().common

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault()
    // If the visitor arrived from within the site, go back; otherwise home.
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(toPath('/'))
    }
  }

  return (
    <Link href="/" className="back-btn" onClick={goBack} aria-label={t.goBack}>
      <ArrowLeft size={16} />
      <span>{t.back}</span>
    </Link>
  )
}

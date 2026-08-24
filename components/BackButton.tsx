'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Back link for inner pages — returns to the previous page in history
 * (router.back). Falls back to the home page if there is no history entry
 * (e.g. the visitor landed directly on this page).
 */
export default function BackButton() {
  const router = useRouter()

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault()
    // If the visitor arrived from within the site, go back; otherwise home.
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <a href="/" className="back-btn" onClick={goBack} aria-label="Go back">
      <ArrowLeft size={16} />
      <span>Back</span>
    </a>
  )
}

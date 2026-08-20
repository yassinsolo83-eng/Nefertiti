'use client'

import { ArrowLeft } from 'lucide-react'

/**
 * Back link for inner pages — returns to the home page.
 * Uses a normal navigation to "/" so the home route loads fresh.
 */
export default function BackButton() {
  return (
    <a href="/" className="back-btn" aria-label="Back to home">
      <ArrowLeft size={16} />
      <span>Back</span>
    </a>
  )
}

'use client'

import { ArrowLeft } from 'lucide-react'

/**
 * Back link for inner pages — returns to the home page and lands on the
 * revealed hero (past the Ankh intro) via the `?home=1` flag, instead of
 * replaying the intro from the top.
 */
export default function BackButton() {
  return (
    <a href="/?home=1" className="back-btn" aria-label="Back to home">
      <ArrowLeft size={16} />
      <span>Back</span>
    </a>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const KEY = 'nef-cookie-notice'

/**
 * Small information notice about cookies.
 * The site sets no advertising or tracking cookies (Vercel Analytics is cookieless; the only
 * cookie is the optional Google Translate language cookie), so there is nothing to accept or
 * reject: the visitor is informed once and the choice is remembered on their device.
 * If tracking tools (e.g. Google Analytics, Meta Pixel) are ever added, replace this with a
 * real accept / reject consent banner.
 */
export default function CookieNotice() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true)
    } catch {
      setOpen(true)
    }
  }, [])

  const close = () => {
    setOpen(false)
    try { localStorage.setItem(KEY, '1') } catch {}
  }

  if (!open) return null

  return (
    <div className="cookie-notice" role="region" aria-label="Cookie notice">
      <p>
        We use only the cookies the site needs to work. No advertising or tracking cookies.{' '}
        <Link href="/privacy#cookies">Learn more</Link>
      </p>
      <button type="button" className="cookie-notice-btn" onClick={close}>Got it</button>
    </div>
  )
}

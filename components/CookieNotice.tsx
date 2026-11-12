'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/LocLink'
import { useUi } from '@/components/LocaleProvider'

const KEY = 'nef-cookie-notice'

/**
 * Small information notice about cookies.
 * The site sets no advertising or tracking cookies (Vercel Analytics is cookieless; no other
 * cookies are set), so there is nothing to accept or
 * reject: the visitor is informed once and the choice is remembered on their device.
 * If tracking tools (e.g. Google Analytics, Meta Pixel) are ever added, replace this with a
 * real accept / reject consent banner.
 */
export default function CookieNotice() {
  const t = useUi().cookie
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
    <div className="cookie-notice" role="region" aria-label={t.label}>
      <p>
        {t.text}{' '}
        <Link href="/privacy#cookies">{t.more}</Link>
      </p>
      <button type="button" className="cookie-notice-btn" onClick={close}>{t.ok}</button>
    </div>
  )
}

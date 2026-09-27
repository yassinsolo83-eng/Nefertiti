'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, X } from 'lucide-react'

type Props = {
  retreat: { id: string; title: string; place: string; month: string } | null
}

// Thin announcement bar above the navigation, pointing to the next upcoming retreat.
// Hidden on the Studio and on the retreats pages; visitors can close it for the session.
export default function RetreatBar({ retreat }: Props) {
  const pathname = usePathname() || ''
  const [closed, setClosed] = useState(false)
  const storageKey = retreat ? `retreat-bar-closed:${retreat.id}` : ''

  useEffect(() => {
    if (!storageKey) return
    try {
      if (sessionStorage.getItem(storageKey)) setClosed(true)
    } catch {}
  }, [storageKey])

  if (!retreat || closed) return null
  if (pathname.startsWith('/studio') || pathname.startsWith('/retreats')) return null

  const close = () => {
    setClosed(true)
    try { sessionStorage.setItem(storageKey, '1') } catch {}
  }

  return (
    <div className="retreat-bar" role="region" aria-label="Upcoming retreat">
      <Link href={`/retreats/${retreat.id}`} className="retreat-bar-link">
        <span className="retreat-bar-label">Next retreat</span>
        <span className="retreat-bar-sep" aria-hidden="true">◆</span>
        <span className="retreat-bar-title">{retreat.title}</span>
        <span className="retreat-bar-when">
          {[retreat.place, retreat.month].filter(Boolean).join(' · ')}
        </span>
        <span className="retreat-bar-cta">View <ArrowRight size={13} /></span>
      </Link>
      <button className="retreat-bar-close" onClick={close} aria-label="Close announcement">
        <X size={14} />
      </button>
    </div>
  )
}

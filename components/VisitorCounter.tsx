'use client'

import { useEffect, useState } from 'react'
import s from './HeroExtras.module.css'

// One request per full page load. Sharing the promise also stops React's dev-mode
// double mount from counting the same visit twice.
let request: Promise<number | null> | null = null

function registerVisit() {
  if (!request) {
    request = fetch('/api/visit', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d && d.enabled && typeof d.count === 'number' ? (d.count as number) : null))
      .catch(() => null)
  }
  return request
}

const fmt = (n: number) => n.toLocaleString('en-US')

export default function VisitorCounter({ visible }: { visible: boolean }) {
  const [total, setTotal] = useState<number | null>(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let alive = true
    registerVisit().then((n) => {
      if (alive && n !== null) setTotal(n)
    })
    return () => {
      alive = false
    }
  }, [])

  // Count up once the hero is revealed
  useEffect(() => {
    if (total === null || !visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(total)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 1900
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setShown(Math.round(total * (1 - Math.pow(2, -10 * p))))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setShown(total)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [total, visible])

  // Counter is switched off, or the request failed: show nothing
  if (total === null) return null

  return (
    <div className={`${s.counter} ${visible ? s.in : ''}`}>
      <span className={s.dot} aria-hidden="true" />
      <span className={s.body}>
        <span className={s.num} aria-hidden="true">
          <span className={s.ghost}>{fmt(total)}</span>
          <span>{fmt(shown)}</span>
        </span>
        <span className={s.label}>Visitors</span>
      </span>
      <span className={s.sr}>{fmt(total)} visitors</span>
    </div>
  )
}

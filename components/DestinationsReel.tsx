'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Destination } from '@/lib/data'
import s from '@/components/DestinationsReel.module.css'

// Full-screen destination videos that play one after another, like the home hero.
// Each destination has a portrait file (-m) and a landscape file (-d) next to the original,
// e.g. /siwa.mp4 -> /siwa-m.mp4 and /siwa-d.mp4. If a variant is missing the original is used.
const CLIP_SECONDS = 8
const FADE_MS = 1200
const PORTRAIT_QUERY = '(max-width: 860px), (orientation: portrait)'

const variant = (src: string, mode: 'mobile' | 'desktop') => src.replace(/\.mp4$/i, mode === 'mobile' ? '-m.mp4' : '-d.mp4')

export default function DestinationsReel({ destinations }: { destinations: Destination[] }) {
  const items = destinations.filter((d) => d.video)
  const n = items.length
  const [mode, setMode] = useState<'mobile' | 'desktop' | null>(null)
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [failed, setFailed] = useState<Record<number, boolean>>({})
  const sectionRef = useRef<HTMLElement>(null)
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const timer = useRef<number | undefined>(undefined)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mq = window.matchMedia(PORTRAIT_QUERY)
    const update = () => setMode(mq.matches ? 'mobile' : 'desktop')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Only play while the section is on screen
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && e.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.6] })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const go = useCallback((to: number) => {
    if (n === 0) return
    setActive(((to % n) + n) % n)
  }, [n])

  // Play the active clip (from the start), pause the rest, and move on after CLIP_SECONDS
  useEffect(() => {
    window.clearTimeout(timer.current)
    refs.current.forEach((v, i) => { if (v && i !== active) window.setTimeout(() => v.pause(), FADE_MS + 100) })
    if (!visible || n === 0) { refs.current[active]?.pause(); return }
    const v = refs.current[active]
    if (v && !reduced.current) {
      v.currentTime = 0
      v.play().catch(() => {})
      timer.current = window.setTimeout(() => go(active + 1), CLIP_SECONDS * 1000 - FADE_MS)
    }
    return () => window.clearTimeout(timer.current)
  }, [active, visible, mode, n, go])

  if (n === 0 || !mode) return <section ref={sectionRef} className={s.reel} aria-label="Destinations" />

  const cur = items[active]
  const srcFor = (d: Destination, i: number) => {
    // load only the current and the next clip
    if (i !== active && i !== (active + 1) % n) return undefined
    return failed[i] ? d.video : variant(d.video as string, mode)
  }

  return (
    <section ref={sectionRef} className={s.reel} aria-label="Our destinations">
      <div className={s.videos}>
        {items.map((d, i) => (
          <video
            key={`${mode}-${d.id}`}
            ref={(el) => { refs.current[i] = el }}
            className={`${s.video} ${i === active ? s.on : ''}`}
            src={srcFor(d, i)}
            poster={d.image}
            muted
            playsInline
            loop
            preload="auto"
            aria-hidden="true"
            onError={() => setFailed((f) => (f[i] ? f : { ...f, [i]: true }))}
          />
        ))}
      </div>
      <div className={s.shade} aria-hidden="true" />

      <p className={s.eyebrow}>Explore our destinations</p>

      <div className={s.body}>
        <div className={s.caption} key={cur.id}>
          <p className={s.count}>{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
          <h3 className={s.title}>
            <Link href={`/destinations/${cur.id}`}>{cur.title}</Link>
          </h3>
          {cur.feeling && <p className={s.feeling}>{cur.feeling}</p>}
        </div>

        <div className={s.dashes} role="tablist" aria-label="Destinations">
          {items.map((d, i) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={d.title}
              className={s.dash}
              onClick={() => go(i)}
            >
              <span className={s.dashFill} data-on={i === active ? 'true' : 'false'} data-done={i < active ? 'true' : 'false'} />
            </button>
          ))}
        </div>

        <Link href="/destinations" className={s.all}>
          See all destinations <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

// Two clips play one after the other with a soft cross-fade, then loop.
// Phones and tablets in portrait get portrait files; wider screens get landscape files.
const SOURCES = {
  mobile: ['/hero-m-beach.mp4', '/hero-m-2.mp4'],
  desktop: ['/hero-d-1.mp4', '/hero-d-yoga.mp4'],
} as const

const FADE_MS = 1200
const PORTRAIT_QUERY = '(max-width: 860px), (orientation: portrait)'

export default function HeroVideo({ label }: { label: string }) {
  const [mode, setMode] = useState<'mobile' | 'desktop' | null>(null)
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const switching = useRef(false)
  const reduced = useRef(false)
  const wrap = useRef<HTMLDivElement>(null)
  const onScreen = useRef(true)

  // Pick the file set after mount (avoids a server/client mismatch)
  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mq = window.matchMedia(PORTRAIT_QUERY)
    const update = () => setMode(mq.matches ? 'mobile' : 'desktop')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Start the first clip whenever the file set changes
  useEffect(() => {
    if (!mode) return
    switching.current = false
    setActive(0)
    const first = refs.current[0]
    if (first && !reduced.current) first.play().catch(() => {})
  }, [mode])

  // Stop decoding video while the hero is off screen
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      onScreen.current = e.isIntersecting
      refs.current.forEach((v, i) => {
        if (!v) return
        if (!e.isIntersecting) v.pause()
        else if (i === active && !reduced.current) v.play().catch(() => {})
      })
    }, { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [mode, active])

  const goNext = (from: number) => {
    if (switching.current || reduced.current || !onScreen.current) return
    switching.current = true
    const to = from === 0 ? 1 : 0
    const next = refs.current[to]
    const prev = refs.current[from]
    if (next) {
      next.currentTime = 0
      next.play().catch(() => {})
    }
    setActive(to)
    window.setTimeout(() => {
      if (prev) { prev.pause(); prev.currentTime = 0 }
      switching.current = false
    }, FADE_MS + 100)
  }

  // Begin the fade shortly before the clip ends
  const onTime = (i: number) => {
    const v = refs.current[i]
    if (!v || i !== active || !v.duration) return
    if (v.duration - v.currentTime < FADE_MS / 1000) goNext(i)
  }

  if (!mode) return null
  const files = SOURCES[mode]

  return (
    <div ref={wrap} className="hero-videos" role="img" aria-label={label}>
      {files.map((src, i) => (
        <video
          key={`${mode}-${src}`}
          ref={(el) => { refs.current[i] = el }}
          className={`hero-video ${active === i ? 'on' : ''}`}
          src={src}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onTimeUpdate={() => onTime(i)}
          onEnded={() => goNext(i)}
        />
      ))}
    </div>
  )
}

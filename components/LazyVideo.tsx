'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster: string
  label: string
}

/**
 * Loads and plays a background video only when it scrolls near the viewport.
 * Until then only the poster image is shown, so several cards on one page
 * don't all download and decode at once (big performance win on mobile).
 */
export default function LazyVideo({ src, poster, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true)
            // start loading + playing once in view
            if (el.preload !== 'auto') el.preload = 'auto'
            el.play().catch(() => {})
          } else {
            // pause off-screen to save CPU/battery
            el.pause()
          }
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  )
}

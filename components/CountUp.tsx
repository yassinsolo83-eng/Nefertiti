'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts a stat up from 0 the first time it scrolls into view.
 * "20+" → 0…20 then "+", "100%" → 0…100 then "%", "13" → 0…13.
 * Values with no digits (e.g. "∞") simply fade/scale in.
 * Server render and no-JS show the final value, so nothing is lost for SEO.
 */
export default function CountUp({ value, className, duration = 1800 }: { value: string; className?: string; duration?: number }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const prefix = match?.[1] ?? ''
  const target = match ? parseInt(match[2], 10) : 0
  const suffix = match?.[3] ?? ''

  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState<number | null>(null) // null = show final value
  const [popped, setPopped] = useState<boolean | null>(null) // null = not armed yet

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    if (match) setN(0)
    else setPopped(false)
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        if (!match) {
          setPopped(true)
          return
        }
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
          setN(Math.round(target * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  const text = match && n !== null ? `${prefix}${n}${suffix}` : value
  const style = !match
    ? { display: 'inline-block', transition: 'transform 1s cubic-bezier(.2,.8,.2,1), opacity 1s ease', transform: popped === false ? 'scale(.4) rotate(-90deg)' : 'scale(1)', opacity: popped === false ? 0 : 1 }
    : { fontVariantNumeric: 'tabular-nums' as const }

  return (
    <span ref={ref} className={`${className ?? ''} notranslate`} translate="no" style={style}>
      {text}
    </span>
  )
}

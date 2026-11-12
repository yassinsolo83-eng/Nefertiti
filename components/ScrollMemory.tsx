'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const KEY = 'nef-scroll:'

/**
 * Remembers where the visitor was on each page and puts them back there when they
 * return with Back (the Back button or the browser's own back gesture).
 */
export default function ScrollMemory() {
  const pathname = usePathname()
  const popped = useRef(false)

  // Remember the scroll position of every page (stored for this tab only)
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    let timer = 0
    const onScroll = () => {
      const path = window.location.pathname
      const y = Math.round(window.scrollY)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        try { sessionStorage.setItem(KEY + path, String(y)) } catch {}
      }, 80)
    }
    const onPop = () => { popped.current = true }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('popstate', onPop)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  // Coming back with Back: return to the saved spot once the page is tall enough
  useEffect(() => {
    if (!popped.current) return
    popped.current = false
    let y = 0
    try { y = Number(sessionStorage.getItem(KEY + pathname)) || 0 } catch {}
    if (y <= 0) return
    let raf = 0
    let stopped = false
    const started = performance.now()
    const stop = () => { stopped = true; cancelAnimationFrame(raf) }
    const tick = () => {
      if (stopped) return
      const el = document.documentElement
      if (el.scrollHeight >= y + window.innerHeight - 2 && Math.abs(window.scrollY - y) > 2) {
        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
      }
      // keep holding the spot while images and videos settle, then let go
      if (performance.now() - started < 1800) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('wheel', stop, { passive: true, once: true })
    window.addEventListener('touchstart', stop, { passive: true, once: true })
    window.addEventListener('keydown', stop, { once: true })
    raf = requestAnimationFrame(tick)
    return () => {
      stop()
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [pathname])

  return null
}

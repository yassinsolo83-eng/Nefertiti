'use client'

import { useEffect } from 'react'

const DURATION = 1500
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * One scroll gesture (wheel, swipe, arrow/page/space key) at the top of the home page
 * opens the Ankh intro on its own — same result as pressing "Scroll to open".
 * Scrolling is held while it plays, and works normally once the intro is open.
 */
export function useAutoOpenIntro() {
  useEffect(() => {
    let animating = false
    let touchY: number | null = null
    let raf = 0

    const geometry = () => {
      const track = document.getElementById('kh-track')
      const stage = track?.querySelector('.kh-stage') as HTMLElement | null
      if (!track || !stage) return null
      const range = track.offsetHeight - stage.offsetHeight
      if (range <= 0) return null
      return { top: track.offsetTop, range }
    }

    // true while the intro is still closed (or only partly open)
    const canOpen = () => {
      const g = geometry()
      if (!g) return false
      const p = (window.scrollY - g.top) / g.range
      return p < 0.3
    }

    const open = () => {
      const g = geometry()
      if (!g || animating) return
      const from = window.scrollY
      const to = g.top + g.range * 0.8
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top: to, behavior: 'auto' })
        return
      }
      animating = true
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION)
        window.scrollTo({ top: from + (to - from) * ease(t), behavior: 'auto' })
        if (t < 1) raf = requestAnimationFrame(step)
        else animating = false
      }
      raf = requestAnimationFrame(step)
    }

    const onWheel = (e: WheelEvent) => {
      if (animating) { e.preventDefault(); return }
      if (e.deltaY > 0 && canOpen()) { e.preventDefault(); open() }
    }
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      if (animating) { if (e.cancelable) e.preventDefault(); return }
      if (touchY === null) return
      const dy = touchY - e.touches[0].clientY // finger moving up = scrolling down
      if (dy > 8 && canOpen()) {
        if (e.cancelable) e.preventDefault()
        touchY = null
        open()
      }
    }
    const onTouchEnd = () => { touchY = null }
    const onKey = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) return
      const el = document.activeElement as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (animating) { e.preventDefault(); return }
      if (canOpen()) { e.preventDefault(); open() }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
}

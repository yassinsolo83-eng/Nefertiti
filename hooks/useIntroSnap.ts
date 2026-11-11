'use client'

import { useEffect } from 'react'

const OPEN_AT = 0.75 // the Ankh is fully open at 75% of the intro track (see useKeyhole)
const OPEN_TARGET = 0.8 // where we land: just inside the hold, hero fully revealed
const COMMIT = 0.1 // past this much of the way, the intro finishes opening on its own
const SETTLE_MS = 120 // scrolling counts as stopped after this long without a scroll event
const GLIDE_MS = 800

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * The intro follows the finger while scrolling. When scrolling stops part-way,
 * it glides to fully open (or back to closed if barely moved), so the page never
 * rests half-open with Ankh pieces over the video.
 */
export function useIntroSnap() {
  useEffect(() => {
    let timer = 0
    let raf = 0
    let touching = false
    let gliding = false
    let anchorP: number | null = null // intro progress when the current gesture began

    const geometry = () => {
      const track = document.getElementById('kh-track')
      const stage = track?.querySelector('.kh-stage') as HTMLElement | null
      if (!track || !stage) return null
      const range = track.offsetHeight - stage.offsetHeight
      if (range <= 0) return null
      return { top: track.offsetTop, range }
    }

    const cancelGlide = () => { cancelAnimationFrame(raf); gliding = false }

    const glideTo = (to: number) => {
      const from = window.scrollY
      if (Math.abs(to - from) < 2) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top: to, behavior: 'auto' })
        return
      }
      gliding = true
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / GLIDE_MS)
        window.scrollTo({ top: from + (to - from) * ease(t), behavior: 'auto' })
        if (t < 1) raf = requestAnimationFrame(step)
        else gliding = false
      }
      raf = requestAnimationFrame(step)
    }

    const settle = () => {
      if (touching || gliding) return
      const g = geometry()
      if (!g) return
      const p = (window.scrollY - g.top) / g.range
      if (p <= 0.005 || p >= OPEN_AT) return // closed already, or open
      const openPos = g.top + g.range * OPEN_TARGET
      const movedBack = anchorP !== null && p < anchorP - 0.01
      if (movedBack) {
        // scrolling up from the open hero closes the intro; only a tiny nudge returns to open
        glideTo(p <= OPEN_AT - 0.05 ? g.top : openPos)
      } else {
        glideTo(p >= COMMIT ? openPos : g.top)
      }
    }

    const progress = () => {
      const g = geometry()
      return g ? { g, p: (window.scrollY - g.top) / g.range } : null
    }

    const onScroll = () => {
      if (gliding) return
      const cur = progress()
      if (cur) {
        if (anchorP === null) anchorP = cur.p
        // A gesture that began on the closed intro stops on the revealed hero; it never flies past it
        if (anchorP < OPEN_AT && cur.p > OPEN_TARGET) {
          window.scrollTo({ top: cur.g.top + cur.g.range * OPEN_TARGET, behavior: 'auto' })
        }
      }
      window.clearTimeout(timer)
      timer = window.setTimeout(() => { settle(); anchorP = null }, SETTLE_MS)
    }
    const onTouchStart = () => {
      touching = true; cancelGlide(); window.clearTimeout(timer)
      const cur = progress(); anchorP = cur ? cur.p : null
    }
    const onTouchEnd = () => { touching = false; window.clearTimeout(timer); timer = window.setTimeout(() => { settle(); anchorP = null }, SETTLE_MS) }
    const onUserInput = () => { if (gliding) cancelGlide() }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    window.addEventListener('wheel', onUserInput, { passive: true })
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('wheel', onUserInput)
    }
  }, [])
}

'use client'

import { useEffect } from 'react'

type Setters = {
  setIntroDone: (v: boolean) => void
  setScrolled: (v: boolean) => void
}

/**
 * Drives the scroll-based Ankh intro:
 *  - the Ankh grows as the user scrolls through the #kh-track
 *  - it finishes opening at 75% of the track, holding the hero for the last 25%
 *  - also toggles the transparent/solid nav and the .reveal animations
 */
export function useKeyhole({ setIntroDone, setScrolled }: Setters) {
  useEffect(() => {
    const hole = document.getElementById('kh-hole')
    const ring = document.getElementById('kh-ring')
    const darkRect = document.getElementById('kh-dark')
    const hint = document.getElementById('kh-hint')
    const frost = document.getElementById('kh-frost')

    const isMobile = window.innerWidth <= 860
    const MIN = isMobile ? 5.5 : 3.6 // larger visible Ankh
    const MAX = 42 // large enough to fully clear the viewport at end of track
    const CY = isMobile ? 500 : 500 // centred on both
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    // Where the scroll position says we are (0..1 through the intro track)
    const scrollProgress = () => {
      const track = document.getElementById('kh-track')
      if (!track) return null
      const rect = track.getBoundingClientRect()
      const stage = track.querySelector('.kh-stage') as HTMLElement | null
      const range = track.offsetHeight - (stage ? stage.offsetHeight : window.innerHeight)
      return range > 0 ? clamp(-rect.top / range, 0, 1) : 0
    }

    // What is drawn: it eases toward the scroll position, so opening and closing
    // are always slow and soft, however fast the finger moves.
    let shown = 0
    let target = 0
    let raf = 0
    let last = 0
    const TAU = 0.42 // seconds: larger = softer

    const draw = (p: number) => {
      if (!hole || !ring) return

      // keyhole finishes opening at 75% of the track; the last 25% holds the
      // hero fully revealed (a beat of pause) before the site scrolls on.
      const OPEN_AT = 0.75
      const op = clamp(p / OPEN_AT, 0, 1)

      const s = MIN + (MAX - MIN) * smooth(op)
      const tf = `translate(500 ${CY}) scale(${s}) translate(-50 -50)`
      hole.setAttribute('transform', tf)
      ring.setAttribute('transform', tf)

      // clean finish: fade the frost out as the keyhole completes
      // The Ankh is tall and narrow, so its corners stay dark while it grows.
      // Dissolve the veil gradually (from 45% to 85% of the open) so no purple
      // leftovers are visible when the hero is fully revealed.
      const darkOp = op > 0.45 ? smooth(clamp(1 - (op - 0.45) / 0.4, 0, 1)) : 1
      if (darkRect) darkRect.setAttribute('fill-opacity', String(0.94 * darkOp))

      // frosted glass: heavy blur at the start, easing to none as we open
      if (frost) {
        const blur = Math.round((1 - op) * 18 / 2) * 2 // 18px → 0px, in 2px steps (cheaper to render)
        frost.style.setProperty('--kh-blur', `${blur.toFixed(1)}px`)
        frost.style.setProperty('--kh-frost-op', String(darkOp))
      }

      const uiOp = clamp(1 - op / 0.45, 0, 1)
      ring.setAttribute('opacity', String(uiOp))
      if (hint) hint.style.opacity = String(uiOp)

      // nav colours: plum while the light veil is on, gold once the video shows
      const veil = op < 0.5 ? 'on' : 'off'
      if (document.body.dataset.khVeil !== veil) document.body.dataset.khVeil = veil

      setIntroDone(op >= 1)
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      shown += (target - shown) * (1 - Math.exp(-dt / TAU))
      if (Math.abs(target - shown) < 0.0006) shown = target
      draw(shown)
      raf = shown === target ? 0 : requestAnimationFrame(tick)
    }
    const updateKeyhole = (instant = false) => {
      const p = scrollProgress()
      if (p === null) return
      if (!instant && p === target && shown === target) return // nothing to redraw
      target = p
      if (instant) { shown = p; draw(p); return }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) }
    }

    const onScroll = () => {
      // nav stays transparent while the hero/intro track is on screen;
      // it only turns solid once we've scrolled past the hero
      const track = document.getElementById('kh-track')
      const heroBottom = track ? track.offsetHeight - 80 : 24
      setScrolled(window.scrollY > heroBottom)
      updateKeyhole()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => updateKeyhole(true)
    window.addEventListener('resize', onResize)
    updateKeyhole(true)

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      delete document.body.dataset.khVeil
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    }
  }, [setIntroDone, setScrolled])
}

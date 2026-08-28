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
    const MIN = isMobile ? 3.8 : 3.2 // larger visible Ankh on mobile
    const MAX = 42 // large enough to fully clear the viewport at end of track
    const CY = isMobile ? 440 : 500 // raise the Ankh above the hero text on mobile
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    const updateKeyhole = () => {
      const track = document.getElementById('kh-track')
      if (!track || !hole || !ring) return
      const rect = track.getBoundingClientRect()
      const range = track.offsetHeight - window.innerHeight
      const p = clamp(-rect.top / range, 0, 1)

      // keyhole finishes opening at 75% of the track; the last 25% holds the
      // hero fully revealed (a beat of pause) before the site scrolls on.
      const OPEN_AT = 0.75
      const op = clamp(p / OPEN_AT, 0, 1)

      const s = MIN + (MAX - MIN) * smooth(op)
      const tf = `translate(500 ${CY}) scale(${s}) translate(-50 -50)`
      hole.setAttribute('transform', tf)
      ring.setAttribute('transform', tf)

      // clean finish: fade the frost out as the keyhole completes
      const darkOp = op > 0.92 ? clamp(1 - (op - 0.92) / 0.08, 0, 1) : 1
      // fade the beige veil from 0.82 toward 0 across the open
      if (darkRect) darkRect.setAttribute('fill-opacity', String(0.9 * darkOp * (1 - op * 0.5)))

      // frosted glass: heavy blur at the start, easing to none as we open
      if (frost) {
        const blur = (1 - op) * 28 // 28px → 0px
        frost.style.setProperty('--kh-blur', `${blur.toFixed(1)}px`)
        frost.style.setProperty('--kh-frost-op', String(darkOp))
      }

      const uiOp = clamp(1 - op / 0.45, 0, 1)
      ring.setAttribute('opacity', String(uiOp))
      if (hint) hint.style.opacity = String(uiOp)

      // ── Track the nav pill and punch a matching hole in the dark overlay ──
      // The SVG uses viewBox 0 0 1000 1000 with slice scaling, so we convert
      // the pill's viewport coordinates to SVG coordinates each frame.
      const pillHole = document.getElementById('kh-pill-hole')
      const pillRing = document.getElementById('kh-pill-ring')
      const pillEl = document.querySelector('.nav-pill') as HTMLElement | null
      if (pillHole && pillRing && pillEl) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const scale = Math.max(vw / 1000, vh / 1000)
        const offX = (vw - 1000 * scale) / 2
        const offY = (vh - 1000 * scale) / 2
        const pb = pillEl.getBoundingClientRect()
        const sx = (pb.left - offX) / scale
        const sy = (pb.top - offY) / scale
        const sw = pb.width / scale
        const sh = pb.height / scale
        const sr = (60 / scale).toFixed(1) // border-radius 60px → SVG units
        const attrs = { x: sx.toFixed(1), y: sy.toFixed(1), width: sw.toFixed(1), height: sh.toFixed(1), rx: sr }
        for (const [k, v] of Object.entries(attrs)) {
          pillHole.setAttribute(k, v)
          pillRing.setAttribute(k, v)
        }
        // Fade the pill ring with the Ankh ring
        pillRing.setAttribute('opacity', String(uiOp))
      }

      setIntroDone(op >= 1)
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
    window.addEventListener('resize', updateKeyhole)
    updateKeyhole()

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateKeyhole)
      observer.disconnect()
    }
  }, [setIntroDone, setScrolled])
}

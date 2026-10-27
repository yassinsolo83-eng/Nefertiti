'use client'

import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Postage-stamp photo. The photo is cut with true half-circle perforations and
 * wrapped by a paper rim plus a thin ink line. Both follow the perforations
 * concentrically, because they are drawn as SVG strokes of the same path.
 */

type Size = 'md' | 'lg'

// hole = radius of the finished perforation, tile = distance between holes
const SPECS: Record<Size, { hole: number; tile: number; rim: number; line: number }> = {
  md: { hole: 4, tile: 20, rim: 2.5, line: 1.25 },
  lg: { hole: 5.5, tile: 28, rim: 3.5, line: 1.5 },
}

function perforatedPath(w: number, h: number, r: number, tile: number) {
  // Holes sit on the tile boundaries, so every corner gets a quarter-circle hole
  // like a real stamp, and the holes in between are half circles.
  const nx = Math.max(1, Math.round(w / tile))
  const ny = Math.max(1, Math.round(h / tile))
  const sx = w / nx
  const sy = h / ny
  const arc = (x: number, y: number) => `A${r} ${r} 0 0 0 ${x} ${y}`
  let d = `M0 ${r}${arc(r, 0)}`
  for (let i = 1; i < nx; i++) d += `L${i * sx - r} 0${arc(i * sx + r, 0)}`
  d += `L${w - r} 0${arc(w, r)}`
  for (let j = 1; j < ny; j++) d += `L${w} ${j * sy - r}${arc(w, j * sy + r)}`
  d += `L${w} ${h - r}${arc(w - r, h)}`
  for (let i = nx - 1; i >= 1; i--) d += `L${i * sx + r} ${h}${arc(i * sx - r, h)}`
  d += `L${r} ${h}${arc(0, h - r)}`
  for (let j = ny - 1; j >= 1; j--) d += `L0 ${j * sy + r}${arc(0, j * sy - r)}`
  return d + 'Z'
}

type Props = { src: string; alt: string; size?: Size }

export default function StampImage({ src, alt, size = 'md' }: Props) {
  const ref = useRef<HTMLImageElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)
  const spec = SPECS[size]

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        setBox((b) => (b && Math.abs(b.w - r.width) < 0.5 && Math.abs(b.h - r.height) < 0.5 ? b : { w: r.width, h: r.height }))
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener('load', measure)
    return () => {
      ro.disconnect()
      el.removeEventListener('load', measure)
    }
  }, [src])

  // The photo is cut a little deeper than the finished hole, so that the paper
  // rim and the ink line fit inside the hole's radius.
  const cut = spec.hole + spec.rim + spec.line
  const d = box ? perforatedPath(box.w, box.h, cut, spec.tile) : ''

  return (
    <span className="stamp-frame">
      {box && (
        <svg className="stamp-ring" width={box.w} height={box.h} aria-hidden="true">
          <path d={d} fill="none" strokeLinejoin="round" style={{ stroke: 'var(--stamp-line)' }}
            strokeWidth={2 * (spec.rim + spec.line)} />
          <path d={d} fill="none" strokeLinejoin="round" style={{ stroke: 'var(--stamp-paper)' }}
            strokeWidth={2 * spec.rim} />
        </svg>
      )}
      <img
        ref={ref}
        src={src}
        alt={alt}
        style={box ? { clipPath: `path('${d}')`, WebkitClipPath: `path('${d}')` } : undefined}
      />
    </span>
  )
}

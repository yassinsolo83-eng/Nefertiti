'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import s from './RetreatGallery.module.css'

// Sanity serves resized images through URL parameters
const sized = (url: string, width: number, quality: number) =>
  url.includes('cdn.sanity.io') ? `${url}?w=${width}&auto=format&q=${quality}` : url

type Props = { images: string[]; title: string }

export default function RetreatGallery({ images, title }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const touchX = useRef<number | null>(null)

  const total = images.length
  const go = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + total) % total)),
    [total],
  )

  // Keyboard controls and page scroll lock while the viewer is open
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, go])

  if (total === 0) return null

  return (
    <>
      <div className={s.gallery}>
        {images.map((url, i) => (
          <button
            key={url + i}
            type="button"
            className={s.item}
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1} of ${total}`}
          >
            <img
              src={sized(url, 900, 75)}
              alt={`${title}, photo ${i + 1}`}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className={s.viewer}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photos`}
          onClick={() => setOpen(null)}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          }}
        >
          <button type="button" className={s.close} onClick={() => setOpen(null)} aria-label="Close">
            <X size={22} />
          </button>
          {total > 1 && (
            <button
              type="button"
              className={`${s.nav} ${s.prev}`}
              onClick={(e) => { e.stopPropagation(); go(-1) }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
          )}
          <img
            className={s.full}
            src={sized(images[open], 1800, 80)}
            alt={`${title}, photo ${open + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {total > 1 && (
            <button
              type="button"
              className={`${s.nav} ${s.next}`}
              onClick={(e) => { e.stopPropagation(); go(1) }}
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          )}
          <span className={s.count}>{open + 1} / {total}</span>
        </div>
      )}
    </>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import s from './RetreatGallery.module.css'
import Img from '@/components/Img'
import { useUi } from '@/components/LocaleProvider'

// Sanity serves resized images through URL parameters. The query layer already
// appends some, so start from the bare URL to avoid a doubled "?".
const sized = (url: string, width: number, quality: number) =>
  url.includes('cdn.sanity.io')
    ? `${url.split('?')[0]}?w=${width}&fit=max&auto=format&q=${quality}`
    : url

type Props = { images: string[]; title: string }

export default function RetreatGallery({ images, title }: Props) {
  const ui = useUi()
  const t = ui.retreats
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
            aria-label={t.photoOf(i + 1, total)}
          >
            <Img
              src={sized(url, 900, 75)}
              alt={t.photoAlt(title, i + 1)}
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
          aria-label={t.photosOf(title)}
          onClick={() => setOpen(null)}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          }}
        >
          <button type="button" className={s.close} onClick={() => setOpen(null)} aria-label={ui.common.close}>
            <X size={22} />
          </button>
          {total > 1 && (
            <button
              type="button"
              className={`${s.nav} ${s.prev}`}
              onClick={(e) => { e.stopPropagation(); go(-1) }}
              aria-label={t.prevPhoto}
            >
              <ChevronLeft size={26} />
            </button>
          )}
          <Img
            className={s.full}
            src={sized(images[open], 1800, 80)}
            alt={t.photoAlt(title, open + 1)}
            onClick={(e) => e.stopPropagation()}
          />
          {total > 1 && (
            <button
              type="button"
              className={`${s.nav} ${s.next}`}
              onClick={(e) => { e.stopPropagation(); go(1) }}
              aria-label={t.nextPhoto}
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

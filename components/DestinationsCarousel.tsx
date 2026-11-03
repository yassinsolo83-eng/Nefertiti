'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import LazyVideo from '@/components/LazyVideo'
import Img from '@/components/Img'
import type { Destination } from '@/lib/data'
import s from '@/app/home.module.css'

// Destination videos in a 3D carousel: the middle video is flat, its neighbours are tilted.
// A gold sun wheel turns behind the videos, so it only shows around them.
export default function DestinationsCarousel({ destinations }: { destinations: Destination[] }) {
  const n = destinations.length
  const [active, setActive] = useState(0)
  const touchX = useRef<number | null>(null)

  if (n === 0) return null

  const go = (to: number) => setActive(((to % n) + n) % n)

  // -1, 0, 1 for the three visible cards; anything else is hidden
  const posOf = (i: number) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d === 0 || d === 1 || d === -1 ? String(d) : 'hidden'
  }

  return (
    <div className={s.carousel}>
      <div className={s.carBg} aria-hidden="true" />
      <div className={s.carStage}>
        <span className={s.carWheel} aria-hidden="true" />

        <div
          className={s.carTrack}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1))
          }}
        >
          {destinations.map((dest, i) => {
            const pos = posOf(i)
            const media = dest.video ? (
              <LazyVideo src={dest.video} poster={dest.image} aria-label={dest.title} />
            ) : (
              <Img src={dest.image} alt={dest.title} />
            )

            // The middle card opens the destination page; a side card turns the carousel to it
            return pos === '0' ? (
              <Link key={dest.id} href={`/destinations/${dest.id}`} className={s.carCard} data-pos={pos}>
                {media}
                <div className={s.carCardBody}>
                  <p className={s.destCardFeeling}>{dest.feeling}</p>
                  <h3>{dest.title}</h3>
                  <span className={s.destCardExplore}>Explore <ArrowUpRight size={13} /></span>
                </div>
              </Link>
            ) : (
              <button
                key={dest.id}
                type="button"
                className={s.carCard}
                data-pos={pos}
                onClick={() => go(i)}
                aria-label={dest.title}
                tabIndex={pos === 'hidden' ? -1 : 0}
              >
                {media}
              </button>
            )
          })}
        </div>

        <button type="button" className={`${s.carArrow} ${s.carPrev}`} onClick={() => go(active - 1)} aria-label="Previous destination">
          <ChevronLeft size={22} />
        </button>
        <button type="button" className={`${s.carArrow} ${s.carNext}`} onClick={() => go(active + 1)} aria-label="Next destination">
          <ChevronRight size={22} />
        </button>
      </div>

      <div className={s.carDots}>
        {destinations.map((dest, i) => (
          <button
            key={dest.id}
            type="button"
            className={i === active ? s.carDotOn : s.carDot}
            onClick={() => go(i)}
            aria-label={`Show ${dest.title}`}
          />
        ))}
      </div>
    </div>
  )
}

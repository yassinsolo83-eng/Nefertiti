'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import Img from '@/components/Img'
import type { Destination } from '@/lib/data'
import s from '@/app/home.module.css'

// Destination videos in a 3D carousel: the middle video is flat, its neighbours are tilted.
// A gold sun wheel turns behind the videos, so it only shows around them.
// Videos only play when the visitor presses play.
export default function DestinationsCarousel({ destinations }: { destinations: Destination[] }) {
  const n = destinations.length
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const touchX = useRef<number | null>(null)
  const videos = useRef<(HTMLVideoElement | null)[]>([])

  // Moving to another destination stops every video
  useEffect(() => {
    videos.current.forEach((v) => v?.pause())
    setPlaying(false)
  }, [active])

  if (n === 0) return null

  const go = (to: number) => setActive(((to % n) + n) % n)

  // -1, 0, 1 for the three visible cards; anything else is hidden
  const posOf = (i: number) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d === 0 || d === 1 || d === -1 ? String(d) : 'hidden'
  }

  const togglePlay = () => {
    const v = videos.current[active]
    if (!v) return
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      v.pause()
      setPlaying(false)
    }
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
            const isMid = pos === '0'
            const media = dest.video ? (
              <video
                ref={(el) => { videos.current[i] = el }}
                src={dest.video}
                poster={dest.image}
                preload="none"
                loop
                playsInline
                aria-label={dest.title}
                onClick={isMid ? togglePlay : undefined}
              />
            ) : (
              <Img src={dest.image} alt={dest.title} />
            )

            return (
              <div
                key={dest.id}
                className={s.carCard}
                data-pos={pos}
                data-playing={isMid && playing ? 'true' : 'false'}
                onClick={!isMid && pos !== 'hidden' ? () => go(i) : undefined}
                role={!isMid && pos !== 'hidden' ? 'button' : undefined}
                aria-label={!isMid && pos !== 'hidden' ? dest.title : undefined}
              >
                {media}

                {isMid && dest.video && (
                  <button
                    type="button"
                    className={s.carPlay}
                    onClick={togglePlay}
                    aria-label={playing ? `Pause ${dest.title}` : `Play ${dest.title}`}
                  >
                    {playing ? <Pause size={26} /> : <Play size={26} />}
                  </button>
                )}

                {isMid && (
                  <div className={s.carCardBody}>
                    <p className={s.destCardFeeling}>{dest.feeling}</p>
                    <h3>{dest.title}</h3>
                    <Link href={`/destinations/${dest.id}`} className={s.destCardExplore}>
                      Explore <ArrowUpRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
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

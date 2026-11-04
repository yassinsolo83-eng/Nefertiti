'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Hand, Pause, Play } from 'lucide-react'
import Img from '@/components/Img'
import type { Destination } from '@/lib/data'
import s from '@/app/home.module.css'

// Destination videos in a 3D carousel: the middle video is flat, its neighbours are tilted.
// A sun wheel turns behind the videos, so it only shows around them.
// Videos only play when the visitor presses play.
export default function DestinationsCarousel({ destinations }: { destinations: Destination[] }) {
  const n = destinations.length
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hint, setHint] = useState(true)
  const startX = useRef<number | null>(null)
  const dragged = useRef(false)
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

      <div className={s.carHead}>
        <h3>Explore Our Destinations</h3>
        <p>Press play to see each place in motion</p>
      </div>

      <div className={s.carStage}>
        <span className={s.carWheel} aria-hidden="true" />

        <div
          className={s.carTrack}
          onPointerDown={(e) => { startX.current = e.clientX; dragged.current = false }}
          onPointerUp={(e) => {
            if (startX.current === null) return
            const dx = e.clientX - startX.current
            startX.current = null
            if (Math.abs(dx) > 40) {
              dragged.current = true
              setHint(false)
              go(active + (dx < 0 ? 1 : -1))
            }
          }}
          onPointerCancel={() => { startX.current = null }}
          // A drag must not also count as a click on the play button or a side card
          onClickCapture={(e) => {
            if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false }
          }}
        >
          {destinations.map((dest, i) => {
            const pos = posOf(i)
            const isMid = pos === '0'
            const isSide = !isMid && pos !== 'hidden'
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
                onClick={isSide ? () => go(i) : undefined}
                role={isSide ? 'button' : undefined}
                aria-label={isSide ? dest.title : undefined}
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

        {hint && !playing && (
          <div className={s.carHint} aria-hidden="true">
            <Hand size={18} />
            <span className={s.carHintTouch}>Swipe</span>
            <span className={s.carHintMouse}>Drag</span>
          </div>
        )}
      </div>

      <div className={s.carControls}>
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
        <p className={s.carCount}>{active + 1} / {n}</p>
      </div>

      <div className={s.carAllWrap}>
        <Link href="/destinations" className={s.carAll}>
          See all destinations <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  )
}

'use client'

import LazyVideo from '@/components/LazyVideo'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Destination } from '@/lib/data'
import EgyptMap from '@/components/EgyptMap'
import DestinationModal from '@/components/DestinationModal'
import s from '@/app/home.module.css'
import Img from '@/components/Img'

type Props = {
  featured: Destination[]
  more: Destination[]
  moreLabel: string
}

// /destinations: the interactive map first, then every destination as a card.
export default function DestinationsOverview({ featured, more, moreLabel }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const all = useMemo(() => [...featured, ...more], [featured, more])
  const featuredIds = useMemo(() => featured.map((d) => d.id), [featured])
  const active = more.find((d) => d.id === activeId) ?? null

  // /destinations?open=siwa (from a map pin on another page) opens that destination's card
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('open')
    if (id && more.some((d) => d.id === id)) setActiveId(id)
  }, [more])

  return (
    <>
      <div className="egm-wrap">
        <EgyptMap destinations={all} featuredIds={featuredIds} onOpen={setActiveId} />
        <p className="egm-hint">Tap a pin to see what each destination is about. Larger gold pins have their own page.</p>
      </div>

      <div className={s.destGrid}>
        {featured.map((dest, i) => (
          <Link key={dest.id} href={`/destinations/${dest.id}`} className={`${s.destCard} reveal is-in delay-${Math.min(i + 1, 4)}`}>
            {dest.video ? (
              <LazyVideo src={dest.video} poster={dest.image} aria-label={dest.title} />
            ) : (
              <Img src={dest.image} alt={dest.title} />
            )}
            <div className={s.destCardBody}>
              <p className={s.destCardFeeling}>{dest.feeling}</p>
              <h3>{dest.title}</h3>
              <p className={s.destCardTagline}>{dest.tagline}</p>
              <span className={s.destCardExplore}>Explore <ArrowUpRight size={13} /></span>
            </div>
          </Link>
        ))}
      </div>

      <DestinationModal destination={active} onClose={() => setActiveId(null)} featuredIds={featuredIds} />

      {more.length > 0 && (
        <div className={s.destMoreSection}>
          <p className={s.destMoreLabel}>{moreLabel}</p>
          <div className={s.destMoreGrid}>
            {more.map((dest, i) => (
              <article
                key={dest.id}
                className={`${s.destMoreCard} reveal is-in delay-${(i % 3) + 1}`}
                onClick={() => setActiveId(dest.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveId(dest.id)}
              >
                <Img src={dest.image} alt={dest.title} />
                <div className={s.destMoreBody}>
                  <h3>{dest.title}</h3>
                  <span className={s.destMoreLink}>View details <ArrowUpRight size={13} /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { ArrowUpRight, Compass } from 'lucide-react'
import Link from '@/components/LocLink'
import type { Destination } from '@/lib/data'
import s from './DestinationModal.module.css'
import Img from '@/components/Img'
import { useUi } from '@/components/LocaleProvider'

type Props = {
  destination: Destination | null
  onClose: () => void
  featuredIds?: string[]
}

export default function DestinationModal({ destination, onClose, featuredIds = [] }: Props) {
  const ui = useUi()
  const t = ui.destinations
  if (!destination) return null

  // Only featured destinations (with detail pages) get the Explore button
  const hasDetailPage = featuredIds.includes(destination.id)

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <button className={s.close} onClick={onClose} aria-label={ui.common.close}>✕</button>
        <div className={s.media}>
          <Img src={destination.image} alt={destination.title} />
        </div>
        <div className={s.content}>
          <p className={s.feeling}>{destination.feeling}</p>
          <h2 className={s.title}>{destination.title}</h2>
          <p className={s.tagline}>{destination.tagline}</p>
          <p className={s.desc}>{destination.desc}</p>

          <p className={s.subLabel}>{t.possible}</p>
          <div className={s.tags}>
            {destination.experiences.map((exp) => (
              <span key={exp} className={s.tag}>{exp}</span>
            ))}
          </div>

          <p className={s.subLabel}>{t.idealFor}</p>
          <div className={s.tags}>
            {destination.idealFor.map((tag) => (
              <span key={tag} className={`${s.tag} ${s.tagIdeal}`}>{tag}</span>
            ))}
          </div>

          <div className={s.actions}>
            {hasDetailPage && (
              <Link
                href={`/destinations/${destination.id}`}
                className={`button button-explore ${s.cta}`}
                onClick={onClose}
              >
                <Compass size={15} /> {t.exploreDest(destination.title)}
              </Link>
            )}
            <Link href="/pre-call" className={`button button-gold ${s.cta}`} onClick={onClose}>
              {t.createHere} <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

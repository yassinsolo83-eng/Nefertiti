'use client'

import { ArrowUpRight, Compass } from 'lucide-react'
import Link from 'next/link'
import { featuredDestinations, destinationDetails } from '@/lib/data'
import type { Destination } from '@/lib/data'
import s from './DestinationModal.module.css'

type Props = {
  destination: Destination | null
  onClose: () => void
}

export default function DestinationModal({ destination, onClose }: Props) {
  if (!destination) return null

  // Only featured destinations (with detail pages) get the Explore button
  const hasDetailPage =
    featuredDestinations.some(d => d.id === destination.id) &&
    destination.id in destinationDetails

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <button className={s.close} onClick={onClose} aria-label="Close">✕</button>
        <div className={s.media}>
          <img src={destination.image} alt={destination.title} />
        </div>
        <div className={s.content}>
          <p className={s.feeling}>{destination.feeling}</p>
          <h2 className={s.title}>{destination.title}</h2>
          <p className={s.tagline}>{destination.tagline}</p>
          <p className={s.desc}>{destination.desc}</p>

          <p className={s.subLabel}>Possible experiences</p>
          <div className={s.tags}>
            {destination.experiences.map((exp) => (
              <span key={exp} className={s.tag}>{exp}</span>
            ))}
          </div>

          <p className={s.subLabel}>Ideal for</p>
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
                <Compass size={15} /> Explore {destination.title}
              </Link>
            )}
            <a href="/contact" className={`button button-gold ${s.cta}`} onClick={onClose}>
              Create a retreat here <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

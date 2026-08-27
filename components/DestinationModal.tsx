'use client'

import { ArrowUpRight, Compass } from 'lucide-react'
import Link from 'next/link'
import { featuredDestinations, destinationDetails } from '@/lib/data'
import type { Destination } from '@/lib/data'

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
    <div className="dest-modal-overlay" onClick={onClose}>
      <div className="dest-modal" onClick={(e) => e.stopPropagation()}>
        <button className="dest-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="dest-modal-media">
          <img src={destination.image} alt={destination.title} />
        </div>
        <div className="dest-modal-content">
          <p className="dest-modal-feeling">{destination.feeling}</p>
          <h2 className="dest-modal-title">{destination.title}</h2>
          <p className="dest-modal-tagline">{destination.tagline}</p>
          <p className="dest-modal-desc">{destination.desc}</p>

          <p className="dest-sub-label">Possible experiences</p>
          <div className="dest-tags">
            {destination.experiences.map((exp) => (
              <span key={exp} className="dest-tag">{exp}</span>
            ))}
          </div>

          <p className="dest-sub-label">Ideal for</p>
          <div className="dest-tags">
            {destination.idealFor.map((tag) => (
              <span key={tag} className="dest-tag dest-tag-ideal">{tag}</span>
            ))}
          </div>

          <div className="dest-modal-actions">
            {hasDetailPage && (
              <Link
                href={`/destinations/${destination.id}`}
                className="button button-explore dest-modal-cta"
                onClick={onClose}
              >
                <Compass size={15} /> Explore {destination.title}
              </Link>
            )}
            <a href="/contact" className="button button-gold dest-modal-cta" onClick={onClose}>
              Create a retreat here <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

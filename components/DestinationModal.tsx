'use client'

import { ArrowUpRight } from 'lucide-react'
import type { Destination } from '@/lib/data'

type Props = {
  destination: Destination | null
  onClose: () => void
}

export default function DestinationModal({ destination, onClose }: Props) {
  if (!destination) return null

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

          <a href="#contact" className="button button-gold dest-modal-cta" onClick={onClose}>
            Create a retreat here <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}

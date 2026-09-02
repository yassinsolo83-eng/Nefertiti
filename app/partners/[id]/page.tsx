'use client'

import { use } from 'react'
import { ArrowUpRight, MapPin, Globe, Check } from 'lucide-react'
import Link from 'next/link'
import { partners, whatsappLink } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const partner = partners.find((p) => p.id === id)

  if (!partner) {
    return (
      <main className="inner-page">
        <SiteNav solid />
        <section className="page-hero page-hero-single">
          <div className="page-hero-text">
            <BackButton />
            <h1 className="page-title">Partner not found</h1>
            <Link href="/partners" className="button button-gold inner-cta">
              All Partners <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero page-hero-split">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">{partner.category}</p>
          <h1 className="page-title">{partner.name}</h1>
          <p className="page-lead">{partner.tagline}</p>
          <div className="partner-meta">
            {partner.location && (
              <span className="partner-meta-item"><MapPin size={14} /> {partner.location}</span>
            )}
            {partner.website && (
              <a className="partner-meta-item" href={partner.website} target="_blank" rel="noopener noreferrer">
                <Globe size={14} /> Website
              </a>
            )}
            {partner.instagram && (
              <a className="partner-meta-item" href={`https://instagram.com/${partner.instagram}`} target="_blank" rel="noopener noreferrer">
                <Globe size={14} /> @{partner.instagram}
              </a>
            )}
          </div>
        </div>
        <div className="page-hero-image reveal is-in">
          <img src={partner.image} alt={partner.name} />
        </div>
      </section>

      <section className="section inner-section partner-detail">
        <div className="partner-detail-grid">
          <div className="partner-bio">
            <p className="eyebrow">ABOUT</p>
            <p className="partner-bio-text">{partner.bio}</p>
          </div>

          <div className="partner-services">
            <p className="eyebrow">WHAT THEY OFFER</p>
            <ul className="partner-service-list">
              {partner.services.map((s) => (
                <li key={s}><Check size={15} /> {s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="partner-cta-row">
          <a href="/contact" className="button button-gold">
            Work with {partner.name} <ArrowUpRight size={16} />
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-ghost">
            Ask about this partner
          </a>
        </div>

        <Link href="/partners" className="partner-back-link">← All partners</Link>
      </section>

      <SiteFooter />
    </main>
  )
}

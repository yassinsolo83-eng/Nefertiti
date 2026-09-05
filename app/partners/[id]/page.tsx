'use client'

import { use } from 'react'
import { ArrowUpRight, MapPin, Globe, Check } from 'lucide-react'
import Link from 'next/link'
import { partners, whatsappLink } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from '../partners.module.css'

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
          <div className={s.partnerMeta}>
            {partner.location && (
              <span className={s.partnerMetaItem}><MapPin size={14} /> {partner.location}</span>
            )}
            {partner.website && (
              <a className={s.partnerMetaItem} href={partner.website} target="_blank" rel="noopener noreferrer">
                <Globe size={14} /> Website
              </a>
            )}
            {partner.instagram && (
              <a className={s.partnerMetaItem} href={`https://instagram.com/${partner.instagram}`} target="_blank" rel="noopener noreferrer">
                <Globe size={14} /> @{partner.instagram}
              </a>
            )}
          </div>
        </div>
        <div className="page-hero-image reveal is-in">
          <img src={partner.image} alt={partner.name} />
        </div>
      </section>

      <section className="section inner-section">
        <div className={s.partnerDetailGrid}>
          <div>
            <p className="eyebrow">ABOUT</p>
            <p className={s.partnerBioText}>{partner.bio}</p>
          </div>

          <div>
            <p className="eyebrow">WHAT THEY OFFER</p>
            <ul className={s.partnerServiceList}>
              {partner.services.map((svc) => (
                <li key={svc}><Check size={15} /> {svc}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={s.partnerCtaRow}>
          <a href="/contact" className="button button-gold">
            Work with {partner.name} <ArrowUpRight size={16} />
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-ghost-dark">
            Ask about this partner
          </a>
        </div>

        <Link href="/partners" className={s.partnerBackLink}>← All partners</Link>
      </section>

      <SiteFooter />
    </main>
  )
}

'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { partners } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'

export default function PartnersPage() {
  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero page-hero-single">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">06 / PARTNERS</p>
          <h1 className="page-title">Our Partners</h1>
          <p className="page-lead">
            The trusted people and places we work with across Egypt — carefully chosen
            to bring every retreat to life. Tap a partner to learn more.
          </p>
        </div>
      </section>

      <section className="section inner-section">
        <div className="partner-grid">
          {partners.map((p) => (
            <Link href={`/partners/${p.id}`} className="partner-card reveal is-in" key={p.id}>
              <div className="partner-card-media">
                <img src={p.image} alt={p.name} />
                <span className="partner-card-cat">{p.category}</span>
              </div>
              <div className="partner-card-body">
                <h3>{p.name}</h3>
                <p>{p.tagline}</p>
                <span className="partner-card-link">View partner <ArrowUpRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>

        <a href="/contact" className="button button-gold inner-cta">
          Become a Partner <ArrowUpRight size={16} />
        </a>
      </section>

      <SiteFooter />
    </main>
  )
}

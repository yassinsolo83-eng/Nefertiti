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
          <p className="eyebrow">◆ OUR PARTNERS</p>
          <h1 className="page-title team-title">Meet the People Behind Your Retreat</h1>
          <p className="page-lead">
            The trusted collaborators we work with across Egypt — carefully chosen to
            bring every retreat to life. Tap a partner to learn more.
          </p>
        </div>
      </section>

      <section className="section inner-section">
        <div className="team-grid">
          {partners.map((p) => (
            <div className="team-card reveal is-in" key={p.id}>
              <Link href={`/partners/${p.id}`} className="team-card-media">
                <img src={p.image} alt={p.name} />
              </Link>
              <Link href={`/partners/${p.id}`} className="team-card-name">{p.name}</Link>
              <p className="team-card-role">{p.category}</p>
              <div className="team-card-socials">
                <a href={p.instagram ? `https://instagram.com/${p.instagram}` : '#'} target={p.instagram ? '_blank' : undefined} rel="noopener noreferrer">IN</a>
                <a href={p.x ? `https://x.com/${p.x}` : '#'} target={p.x ? '_blank' : undefined} rel="noopener noreferrer">X</a>
                <a href={p.tiktok ? `https://tiktok.com/@${p.tiktok}` : '#'} target={p.tiktok ? '_blank' : undefined} rel="noopener noreferrer">TT</a>
              </div>
            </div>
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

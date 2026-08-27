'use client'

import { use, useState, useEffect } from 'react'
import { ArrowUpRight, MessageCircle, MapPin, Calendar, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import {
  featuredDestinations,
  destinationDetails,
  whatsappLink,
} from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

export default function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [scrolled, setScrolled] = useState(false)

  const dest = featuredDestinations.find(d => d.id === slug)
  const detail = destinationDetails[slug]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reveal-on-scroll observer
  useEffect(() => {
    const els = document.querySelectorAll('.dp-reveal')
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) } }),
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [dest])
  
  if (!dest || !detail) {
    return (
      <main style={{ padding: '20vh 5vw', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36 }}>Destination not found</h1>
        <Link href="/#destinations" style={{ color: 'var(--primary)', marginTop: 20, display: 'inline-block' }}>← Back to destinations</Link>
      </main>
    )
  }

  // Remaining experiences not already in highlights
  const highlightTitles = new Set(detail.highlights.map(h => h.title))
  const moreExperiences = dest.experiences.filter(e => !highlightTitles.has(e))

  return (
    <main className="dp-page">
      <SiteNav scrolled={scrolled} />

      {/* ── HERO ── */}
      <section className="dp-hero">
        {dest.video ? (
          <video
            className="dp-hero-media"
            src={dest.video}
            poster={typeof dest.image === 'string' ? dest.image : undefined}
            autoPlay muted loop playsInline preload="auto"
          />
        ) : (
          <img className="dp-hero-media" src={dest.image} alt={dest.title} />
        )}
        <div className="dp-hero-shade" />
        <div className="dp-hero-content dp-reveal">
          <Link href="/#destinations" className="dp-back">
            <ChevronLeft size={16} /> All Destinations
          </Link>
          <p className="dp-hero-feeling">{dest.feeling}</p>
          <h1>{dest.title}</h1>
          <p className="dp-hero-tagline">{dest.tagline}</p>
          <div className="dp-hero-meta">
            <span><Calendar size={14} /> Best time: {detail.bestTime}</span>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="dp-overview dp-reveal">
        <p className="dp-overview-text">{detail.overview}</p>
      </section>

      {/* ── EXPERIENCE ACCORDION STRIP — flex grow on hover ── */}
      <section className="dp-strip-section">
        <div className="dp-section-head dp-reveal">
          <p className="dp-label">SIGNATURE EXPERIENCES</p>
          <h2>Moments that define {dest.title}</h2>
        </div>
        <div className="dp-strip dp-reveal">
          {detail.highlights.map((h, i) => (
            <div key={h.title} className="dp-strip-item">
              <img src={h.image} alt={h.title} />
              <div className="dp-strip-shade" />
              <div className="dp-strip-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="dp-strip-info">
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACTIVITIES GRID — hover scale cards ── */}
      {moreExperiences.length > 0 && (
        <section className="dp-grid-section">
          <div className="dp-section-head dp-reveal">
            <p className="dp-label">WHAT ELSE AWAITS</p>
            <h2>More to explore</h2>
          </div>
          <div className="dp-activity-grid dp-reveal">
            {moreExperiences.map((exp) => (
              <div key={exp} className="dp-activity-card">
                <div className="dp-activity-inner">
                  <MapPin size={18} className="dp-activity-icon" />
                  <h3>{exp}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── IDEAL FOR ── */}
      <section className="dp-ideal dp-reveal">
        <p className="dp-label">IDEAL FOR</p>
        <div className="dp-ideal-tags">
          {dest.idealFor.map(tag => (
            <span key={tag} className="dp-ideal-tag">{tag}</span>
          ))}
        </div>
      </section>

      {/* ── PARALLAX CTA — fixed background reveal ── */}
      <section
        className="dp-parallax"
        style={{ backgroundImage: `url(${detail.parallaxImage})` }}
      >
        <div className="dp-parallax-overlay">
          <div className="dp-parallax-content dp-reveal">
            <h2>Create your retreat in {dest.title}</h2>
            <p>Tell us your vision and we&apos;ll show you what {dest.title} can become for your community.</p>
            <div className="dp-parallax-actions">
              <Link href="/contact" className="button button-gold">
                Create Your Retreat <ArrowUpRight size={16} />
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-ghost-light">
                <MessageCircle size={15} /> Book a Discovery Call
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

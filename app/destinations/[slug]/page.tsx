'use client'

import { use, useState, useEffect } from 'react'
import { ArrowUpRight, MessageCircle, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import {
  featuredDestinations,
  destinationDetails,
  whatsappLink,
} from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from './destination-detail.module.css'

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
    const els = document.querySelectorAll(`.${s.dpReveal}`)
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
      <section className={s.dpHero}>
        {dest.video ? (
          <video
            className={s.dpHeroMedia}
            src={dest.video}
            poster="/hero-shirodhara.webp"
            autoPlay muted loop playsInline preload="auto"
          />
        ) : (
          <img className={s.dpHeroMedia} src={dest.image} alt={dest.title} />
        )}
        <div className={s.dpHeroShade} />
        <div className={`${s.dpHeroContent} ${s.dpReveal}`}>
          <BackButton />
          <p className={s.dpHeroFeeling}>{dest.feeling}</p>
          <h1>{dest.title}</h1>
          <p className={s.dpHeroTagline}>{dest.tagline}</p>
          <div className={s.dpHeroMeta}>
            <span><Calendar size={14} /> Best time: {detail.bestTime}</span>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className={`${s.dpOverview} ${s.dpReveal}`}>
        <p className={s.dpOverviewText}>{detail.overview}</p>
      </section>

      {/* ── EXPERIENCE ACCORDION STRIP ── */}
      <section className={s.dpStripSection}>
        <div className={`${s.dpSectionHead} ${s.dpReveal}`}>
          <p className={s.dpLabel}>SIGNATURE EXPERIENCES</p>
          <h2>Moments that define {dest.title}</h2>
        </div>
        <div className={`${s.dpStrip} ${s.dpReveal}`}>
          {detail.highlights.map((h, i) => (
            <div key={h.title} className={s.dpStripItem}>
              <img src={h.image} alt={h.title} />
              <div className={s.dpStripShade} />
              <div className={s.dpStripNum}>{String(i + 1).padStart(2, '0')}</div>
              <div className={s.dpStripInfo}>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACTIVITIES GRID ── */}
      {moreExperiences.length > 0 && (
        <section className={s.dpGridSection}>
          <div className={`${s.dpSectionHead} ${s.dpReveal}`}>
            <p className={s.dpLabel}>WHAT ELSE AWAITS</p>
            <h2>More to explore</h2>
          </div>
          <div className={`${s.dpActivityGrid} ${s.dpReveal}`}>
            {moreExperiences.map((exp) => (
              <div key={exp} className={s.dpActivityCard}>
                <div className={s.dpActivityInner}>
                  <MapPin size={18} className={s.dpActivityIcon} />
                  <h3>{exp}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── IDEAL FOR ── */}
      <section className={`${s.dpIdeal} ${s.dpReveal}`}>
        <p className={s.dpLabel}>IDEAL FOR</p>
        <div className={s.dpIdealTags}>
          {dest.idealFor.map(tag => (
            <span key={tag} className={s.dpIdealTag}>{tag}</span>
          ))}
        </div>
      </section>

      {/* ── PARALLAX CTA ── */}
      <section
        className={s.dpParallax}
        style={{ backgroundImage: `url(${detail.parallaxImage})` }}
      >
        <div className={`${s.dpParallaxPanel} ${s.dpReveal}`}>
          <h2>Create your retreat in {dest.title}</h2>
          <p>Tell us your vision and we&apos;ll show you what {dest.title} can become for your community.</p>
          <div className={s.dpParallaxActions}>
            <Link href="/contact" className="button button-gold">
              Create Your Retreat <ArrowUpRight size={16} />
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-ghost-light">
              <MessageCircle size={15} /> Book a Discovery Call
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

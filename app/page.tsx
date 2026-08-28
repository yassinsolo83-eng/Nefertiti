'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import {
  images, copy, featuredDestinations, moreDestinations,
  combinations,
  whatsappLink,
} from '@/lib/data'
import DestinationModal from '@/components/DestinationModal'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { useKeyhole } from '@/hooks/useKeyhole'

export default function Page() {
  const [scrolled, setScrolled] = useState(false)
  const [activeDestId, setActiveDestId] = useState<string | null>(null)
  const [introDone, setIntroDone] = useState(false)
  const t = copy.en

  // scroll-driven Ankh intro + nav state + reveal animations
  useKeyhole({ setIntroDone, setScrolled })

  // When arriving from an inner page's Back button (/?home=1), skip the intro
  // and land directly on the revealed hero instead of replaying the Ankh.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('home') !== '1') return
    const jump = () => {
      const track = document.getElementById('kh-track')
      const target = track ? track.offsetHeight - window.innerHeight : 0
      window.scrollTo({ top: Math.max(target, 0), behavior: 'auto' })
      // clean the URL so a refresh doesn't keep skipping the intro
      window.history.replaceState(null, '', '/')
    }
    // run after layout is ready
    requestAnimationFrame(() => requestAnimationFrame(jump))
  }, [])

  // Smooth-scroll for in-page anchors coming from SiteNav (hrefs like "/#vision")
  const navTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace(/^\/?#/, '#')
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Scroll to the revealed hero (end of the intro track) — not back into the intro.
  const scrollToHero = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    const track = document.getElementById('kh-track')
    const target = track ? track.offsetHeight - window.innerHeight : 0
    window.scrollTo({ top: Math.max(target, 0), behavior: 'smooth' })
  }

  const activeDest = moreDestinations.find(d => d.id === activeDestId) ?? null

  return (
    <>
    <main>
      {/* NAV */}
      <SiteNav
        scrolled={scrolled}
        compact={!scrolled}
        heroVideoSrc="/hero-video.mp4"
        heroPosterSrc={images.heroMain}
        onAnchor={navTo}
        onBrand={scrollToHero}
      />

      {/* HERO + KEYHOLE INTRO — scroll-driven reveal */}
      <div id="kh-track" className="kh-track">
        <div className="kh-stage">
          <section id="top" className="hero">
            <video
              className="hero-image"
              src="/hero-video.mp4"
              poster={images.heroMain}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Shirodhara oil ritual — Ayurvedic retreat"
            />
            <div className="hero-shade" />
            <div className={`hero-content ${introDone ? 'kh-text-in' : 'kh-text-out'}`}>
              <h1>{t.hero}</h1>
              <div className="hero-buttons">
                <a className="button button-gold" href="/contact">{t.explore}<ArrowUpRight size={16} /></a>
                <a className="button button-ghost" href={whatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} />{t.inquire}</a>
              </div>
            </div>
          </section>

          {/* Frosted-glass layer — blurs the whole hero video. An Ankh-shaped
              hole is punched through it (inverted mask) so the Ankh window
              shows the video sharp while everything around stays blurred.
              Blur eases off as the intro opens (driven by useKeyhole). */}
          <div id="kh-frost" className={`kh-frost ${introDone ? 'kh-open' : ''}`} />

          {/* Keyhole overlay — the gold Ankh outline + hint */}
          <div className={`kh-overlay ${introDone ? 'kh-open' : ''}`}>
            <svg className="kh-svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" aria-hidden="true">
              <defs>
                {/* mask used by the CSS frost layer: white = blurred, black = clear window.
                    Two holes are punched: the Ankh (centre) and the nav pill (top). */}
                <mask id="kh-mask">
                  <rect width="1000" height="1000" fill="white" />
                  <path id="kh-hole" fill="black" fillRule="evenodd"
                    transform="translate(500 500) scale(3.2) translate(-50 -50)"
                    d="M50 2 C40 2 31 12 31 27 C31 37 36 44 44 47 L44 49 L30 49 Q33 53.5 30 58 L44 58 L44 93 L56 93 L56 58 L70 58 Q67 53.5 70 49 L56 49 L56 47 C64 44 69 37 69 27 C69 12 60 2 50 2 Z M50 14 C54 14 58 20 58 27 C58 34 54 40 50 40 C46 40 42 34 42 27 C42 20 46 14 50 14 Z" />
                </mask>
              </defs>
              <rect id="kh-dark" width="1000" height="1000" fill="#2E1840" fillOpacity="0.9" mask="url(#kh-mask)" />
              <path id="kh-ring" fill="none" stroke="#F1D288" strokeWidth="1.2" fillRule="evenodd"
                transform="translate(500 500) scale(3.2) translate(-50 -50)"
                d="M50 2 C40 2 31 12 31 27 C31 37 36 44 44 47 L44 49 L30 49 Q33 53.5 30 58 L44 58 L44 93 L56 93 L56 58 L70 58 Q67 53.5 70 49 L56 49 L56 47 C64 44 69 37 69 27 C69 12 60 2 50 2 Z M50 14 C54 14 58 20 58 27 C58 34 54 40 50 40 C46 40 42 34 42 27 C42 20 46 14 50 14 Z" />

              {/* nav pill hole removed — handled by the HTML pill (see .nav-pill-*) */}
            </svg>
            <div id="kh-hint" className="kh-hint">Scroll to enter <span>↓</span></div>
          </div>
        </div>
      </div>

      {/* VISION */}
      {/* VISION / INTRO — Sarasvvati style */}
      <section id="vision" className="section vision">
        <div className="section-label reveal" style={{ marginBottom: 32 }}>01 / WHY EGYPT</div>
        <h2 className="vision-statement reveal">
          You already know how you want your guests to feel.<br />
          <em>We know how to make it happen in Egypt.</em>
        </h2>
        <div className="vision-grid">
          <div className="vision-copy reveal">
            <p className="eyebrow" style={{ marginBottom: 16 }}>THE NEFERTITI WAY</p>
            <p>{t.visionText}</p>
            <a href="#about" className="text-link">{t.philosophy} <ArrowUpRight size={16} /></a>
            <div className="vision-stats reveal">
              <div className="vision-stat">
                <span className="vision-stat-num">20+</span>
                <span className="vision-stat-label">Years of event production</span>
              </div>
              <div className="vision-stat">
                <span className="vision-stat-num">5</span>
                <span className="vision-stat-label">Destinations across Egypt</span>
              </div>
              <div className="vision-stat">
                <span className="vision-stat-num">100%</span>
                <span className="vision-stat-label">Bespoke — no two retreats alike</span>
              </div>
              <div className="vision-stat">
                <span className="vision-stat-num">∞</span>
                <span className="vision-stat-label">Possibilities for your retreat</span>
              </div>
            </div>
          </div>
          <div className="vision-right">
            <div className="vision-image reveal">
              <video
                src="/why-egypt-video.mp4"
                poster={images.vision}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Egypt desert at golden hour"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="section destinations">
        {/* Section heading */}
        <div className="section-heading reveal">
          <div className="section-label">02 / {t.destinationLabel}</div>
          <div>
            <h2>{t.destinations}</h2>
            <p>{t.destinationText}</p>
          </div>
        </div>

        {/* Featured destinations — click goes to full page */}
        <div className="dest-grid">
          {featuredDestinations.map((dest, i) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.id}`}
              className={`dest-card reveal delay-${Math.min(i + 1, 4)}`}
            >
              {dest.video ? (
                <video
                  src={dest.video}
                  poster={dest.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={dest.title}
                />
              ) : (
                <img src={dest.image} alt={dest.title} />
              )}
              <div className="dest-card-body">
                <p className="dest-card-feeling">{dest.feeling}</p>
                <h3>{dest.title}</h3>
                <p className="dest-card-tagline">{dest.tagline}</p>
                <span className="dest-card-explore">Explore <ArrowUpRight size={13} /></span>
              </div>
            </Link>
          ))}
        </div>

        {/* Detail modal overlay (for secondary destinations only) */}
        <DestinationModal destination={activeDest} onClose={() => setActiveDestId(null)} />

        {/* More destinations — secondary 7 */}
        <div className="dest-more-section">
          <p className="dest-more-label reveal">{t.destMoreLabel}</p>
          <div className="dest-more-grid">
            {moreDestinations.map((dest, i) => (
              <article
                key={dest.id}
                className={`dest-more-card reveal delay-${(i % 3) + 1}`}
                onClick={() => setActiveDestId(dest.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveDestId(dest.id)}
              >
                <img src={dest.image} alt={dest.title} />
                <div className="dest-more-body">
                  <h3>{dest.title}</h3>
                  <span className="dest-more-link">View details <ArrowUpRight size={13} /></span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Multi-destination combinations */}
        <div className="dest-combos reveal">
          <div className="dest-combos-header">
            <h2>{t.destCombosTitle}</h2>
            <p className="dest-combos-sub">{t.destCombosSubtitle}</p>
            <p className="dest-combos-body">{t.destCombosText}</p>
          </div>
          <div className="dest-combo-list">
            {combinations.map(combo => (
              <span key={combo} className="dest-combo-pill">{combo}</span>
            ))}
          </div>
          <div className="dest-combo-actions">
            <a href="/contact" className="button button-gold">{t.destCTA1} <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>

      {/* EXPLORE MORE — pathways into the deeper pages */}
      <section id="explore" className="section explore">
        <div className="explore-head reveal">
          <div className="section-label">EXPLORE FURTHER</div>
          <h2>There&apos;s more to discover.</h2>
        </div>
        <div className="explore-grid">
          {[
            ['01', 'Experiences', 'Curated moments woven around your retreat&apos;s theme.', '/experiences'],
            ['02', 'Services', 'From light-touch support to full retreat production.', '/services'],
            ['03', 'How It Works', 'A clear, guided path from first idea to arrival.', '/how-it-works'],
            ['04', 'About', 'The story and the people behind Nefertiti.', '/about'],
          ].map(([num, title, desc, href]) => (
            <a key={href} href={href} className="explore-card reveal">
              <span className="explore-num">{num}</span>
              <div className="explore-card-body">
                <h3>{title}</h3>
                <p dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
              <ArrowUpRight className="explore-arrow" size={20} />
            </a>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-band">
        <div className="cta-band-inner reveal">
          <h2>{t.cta.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h2>
          <p>{t.ctaText}</p>
          <a className="button button-dark" href="/contact">{t.contact}<ArrowUpRight size={16} /></a>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />

      {/* Back to top — lotus-inspired */}
      <button
        className={`to-top ${scrolled ? 'is-shown' : ''}`}
        onClick={() => scrollToHero()}
        aria-label="Back to top"
      >
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          {/* lotus petals */}
          <path className="to-top-lotus" d="M20 9 C22 15 22 20 20 25 C18 20 18 15 20 9 Z" />
          <path className="to-top-lotus" d="M20 25 C16 21 13 17 12 12 C17 14 20 18 20 25 Z" />
          <path className="to-top-lotus" d="M20 25 C24 21 27 17 28 12 C23 14 20 18 20 25 Z" />
          <path className="to-top-lotus" d="M20 26 C15 25 10 24 6 21 C11 20 17 21 20 26 Z" />
          <path className="to-top-lotus" d="M20 26 C25 25 30 24 34 21 C29 20 23 21 20 26 Z" />
          {/* subtle up arrow */}
          <path className="to-top-arrow" d="M20 32 L20 22 M16 25 L20 21 L24 25" />
        </svg>
      </button>
    </main>
    </>
  )
}

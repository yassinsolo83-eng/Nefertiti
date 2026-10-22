'use client'

import LazyVideo from '@/components/LazyVideo'
import { useState, useEffect } from 'react'
import { ArrowUpRight, MessageCircle, Plane } from 'lucide-react'
import Link from 'next/link'
import {
  images,
} from '@/lib/data'
import type { Destination, HomeStat, Partner, Retreat, Testimonial } from '@/lib/data'
import { cropUrl } from '@/sanity/lib/image'
import RetreatCard from '@/components/RetreatCard'
import VisitorCounter from '@/components/VisitorCounter'
import ex from '@/components/HeroExtras.module.css'
import rs from '@/app/retreats/retreats.module.css'
import EgyptMap from '@/components/EgyptMap'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { Ornament } from '@/components/Motif'
import { useKeyhole } from '@/hooks/useKeyhole'
import s from '@/app/home.module.css'

type Props = {
  featuredDestinations: Destination[]
  moreDestinations: Destination[]
  partners: Partner[]
  t: (typeof import('@/lib/data').copy)['en']
  combinations: string[]
  whatsappLink: string
  upcomingRetreats: Retreat[]
  stats: HomeStat[]
  testimonials: Testimonial[]
  steps: { title: string; description: string }[]
}

export default function HomePage({ featuredDestinations, moreDestinations, partners, t, combinations, whatsappLink, upcomingRetreats, stats, testimonials, steps }: Props) {
  // Three moments of the full process: first call, the concept, and the hand-over
  const homeSteps = steps.length >= 3 ? [steps[0], steps[2], steps[steps.length - 1]] : steps
  const [scrolled, setScrolled] = useState(false)
  const [introDone, setIntroDone] = useState(false)
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

  return (
    <>
    <main>
      {/* NAV — transparent (video window) during intro, solid ivory after scroll */}
      <SiteNav
        scrolled={scrolled}
        showVideo={!scrolled}
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
              poster="/hero-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Woman meditating by the sea at sunset"
            />
            <div className="hero-shade" />
            <div className={`hero-content ${introDone ? 'kh-text-in' : 'kh-text-out'}`}>
              <h1>{t.hero}</h1>
              <p className={ex.route}><Plane size={15} strokeWidth={1.6} aria-hidden="true" /> From Airport to Airport</p>
              <div className="hero-buttons">
                <a className="button button-gold" href="/contact">{t.explore}<ArrowUpRight size={16} /></a>
                <a className="button button-ghost" href={whatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} />{t.inquire}</a>
              </div>
            </div>
            <VisitorCounter visible={introDone} />
          </section>

          {/* Frosted-glass layer — blurs the whole hero video */}
          <div id="kh-frost" className={`kh-frost ${introDone ? 'kh-open' : ''}`} />

          {/* Keyhole overlay — the gold Ankh outline + hint */}
          <div className={`kh-overlay ${introDone ? 'kh-open' : ''}`}>
            <svg className="kh-svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" aria-hidden="true">
              <defs>
                <mask id="kh-mask">
                  <rect width="1000" height="1000" fill="white" />
                  <path id="kh-hole" fill="black" fillRule="evenodd"
                    transform="translate(500 500) scale(3.2) translate(-50 -50)"
                    d="M62.84 8.90 C67.13 15.29 66.21 23.26 63.01 29.90 C60.81 34.29 57.98 38.14 54.63 41.73 C53.88 42.56 53.88 42.56 53.76 42.89 C61.04 43.08 68.91 41.20 75.96 39.48 C77.22 39.19 77.22 39.19 77.45 39.41 C77.46 40.23 77.47 41.06 77.47 41.87 C77.47 42.12 77.47 42.37 77.47 42.62 C77.47 43.15 77.47 43.68 77.47 44.21 C77.47 45.01 77.47 45.82 77.47 46.63 C77.47 47.14 77.47 47.65 77.47 48.16 C77.47 48.40 77.47 48.65 77.47 48.90 C77.47 50.61 77.47 50.61 77.25 50.82 C76.29 50.71 75.35 50.49 74.40 50.27 C67.56 48.74 60.41 47.67 53.37 47.73 C53.44 49.08 53.55 50.41 53.67 51.76 C53.69 51.98 53.71 52.19 53.73 52.43 C53.80 53.12 53.86 53.83 53.92 54.53 C53.94 54.77 53.97 55.02 53.99 55.26 C54.29 58.58 54.61 61.90 54.95 65.22 C55.03 65.99 55.10 66.76 55.18 67.54 C55.90 75.00 56.70 82.46 57.71 89.89 C57.98 91.82 57.98 91.82 57.92 92.78 C57.48 93.00 56.80 92.89 56.32 92.89 C56.18 92.89 56.18 92.89 55.41 92.89 C55.09 92.89 54.76 92.90 54.42 92.90 C54.25 92.90 54.25 92.90 53.41 92.90 C52.71 92.90 52.00 92.90 51.29 92.90 C50.20 92.90 49.12 92.91 48.03 92.91 C47.34 92.91 46.66 92.91 45.98 92.92 C45.65 92.92 45.32 92.92 44.98 92.92 C44.68 92.92 44.38 92.92 44.07 92.92 C43.80 92.92 43.54 92.92 43.26 92.92 C42.64 92.87 42.64 92.87 42.26 92.49 C42.26 91.65 42.32 90.88 42.44 90.05 C42.48 89.76 42.52 89.47 42.56 89.17 C42.59 88.87 42.63 88.57 42.67 88.26 C42.71 87.97 42.75 87.67 42.80 87.37 C42.90 86.53 43.02 85.69 43.13 84.85 C43.31 83.47 43.47 82.09 43.61 80.69 C43.74 79.47 43.87 78.24 44.01 77.00 C44.40 73.39 44.77 69.79 45.07 66.17 C45.22 64.32 45.40 62.47 45.57 60.61 C45.70 59.38 45.79 58.14 45.88 56.89 C45.94 56.04 46.01 55.18 46.08 54.33 C46.09 54.18 46.09 54.18 46.15 53.38 C46.21 52.73 46.26 52.09 46.32 51.44 C46.35 51.13 46.37 50.81 46.39 50.49 C46.41 50.21 46.44 49.93 46.46 49.64 C46.50 49.00 46.51 48.37 46.51 47.73 C38.91 47.59 31.16 48.92 23.79 50.70 C22.74 50.93 22.74 50.93 22.53 50.72 C22.53 49.90 22.53 49.07 22.53 48.25 C22.53 48.00 22.53 47.75 22.53 47.49 C22.53 46.95 22.53 46.42 22.53 45.89 C22.53 45.08 22.53 44.26 22.53 43.44 C22.53 42.92 22.53 42.41 22.53 41.90 C22.53 41.65 22.53 41.40 22.53 41.15 C22.53 39.42 22.53 39.42 22.63 39.32 C23.62 39.41 24.51 39.62 25.46 39.85 C32.06 41.39 39.23 42.97 46.03 42.89 C45.72 42.27 45.37 41.93 44.87 41.44 C38.13 33.74 31.81 23.22 35.32 12.64 C37.52 7.25 41.78 3.63 47.57 2.68 C53.68 2.00 59.09 3.99 62.84 8.90Z M41.48 12.54 C37.74 19.12 40.52 26.61 44.02 32.69 C47.58 38.71 47.58 38.71 49.80 40.48 C55.62 36.99 60.22 25.71 60.46 19.23 C60.32 15.06 58.64 11.40 55.00 9.22 C50.11 6.89 44.65 8.10 41.48 12.54Z" />
                  <rect id="kh-pill-hole" fill="black" x="0" y="0" width="0" height="0" rx="0" />
                </mask>
              </defs>
              <rect id="kh-dark" width="1000" height="1000" fill="#2E1840" fillOpacity="0.9" mask="url(#kh-mask)" />
              <path id="kh-ring" fill="none" stroke="#F1D288" strokeWidth="1.2" fillRule="evenodd"
                transform="translate(500 500) scale(3.2) translate(-50 -50)"
                d="M62.84 8.90 C67.13 15.29 66.21 23.26 63.01 29.90 C60.81 34.29 57.98 38.14 54.63 41.73 C53.88 42.56 53.88 42.56 53.76 42.89 C61.04 43.08 68.91 41.20 75.96 39.48 C77.22 39.19 77.22 39.19 77.45 39.41 C77.46 40.23 77.47 41.06 77.47 41.87 C77.47 42.12 77.47 42.37 77.47 42.62 C77.47 43.15 77.47 43.68 77.47 44.21 C77.47 45.01 77.47 45.82 77.47 46.63 C77.47 47.14 77.47 47.65 77.47 48.16 C77.47 48.40 77.47 48.65 77.47 48.90 C77.47 50.61 77.47 50.61 77.25 50.82 C76.29 50.71 75.35 50.49 74.40 50.27 C67.56 48.74 60.41 47.67 53.37 47.73 C53.44 49.08 53.55 50.41 53.67 51.76 C53.69 51.98 53.71 52.19 53.73 52.43 C53.80 53.12 53.86 53.83 53.92 54.53 C53.94 54.77 53.97 55.02 53.99 55.26 C54.29 58.58 54.61 61.90 54.95 65.22 C55.03 65.99 55.10 66.76 55.18 67.54 C55.90 75.00 56.70 82.46 57.71 89.89 C57.98 91.82 57.98 91.82 57.92 92.78 C57.48 93.00 56.80 92.89 56.32 92.89 C56.18 92.89 56.18 92.89 55.41 92.89 C55.09 92.89 54.76 92.90 54.42 92.90 C54.25 92.90 54.25 92.90 53.41 92.90 C52.71 92.90 52.00 92.90 51.29 92.90 C50.20 92.90 49.12 92.91 48.03 92.91 C47.34 92.91 46.66 92.91 45.98 92.92 C45.65 92.92 45.32 92.92 44.98 92.92 C44.68 92.92 44.38 92.92 44.07 92.92 C43.80 92.92 43.54 92.92 43.26 92.92 C42.64 92.87 42.64 92.87 42.26 92.49 C42.26 91.65 42.32 90.88 42.44 90.05 C42.48 89.76 42.52 89.47 42.56 89.17 C42.59 88.87 42.63 88.57 42.67 88.26 C42.71 87.97 42.75 87.67 42.80 87.37 C42.90 86.53 43.02 85.69 43.13 84.85 C43.31 83.47 43.47 82.09 43.61 80.69 C43.74 79.47 43.87 78.24 44.01 77.00 C44.40 73.39 44.77 69.79 45.07 66.17 C45.22 64.32 45.40 62.47 45.57 60.61 C45.70 59.38 45.79 58.14 45.88 56.89 C45.94 56.04 46.01 55.18 46.08 54.33 C46.09 54.18 46.09 54.18 46.15 53.38 C46.21 52.73 46.26 52.09 46.32 51.44 C46.35 51.13 46.37 50.81 46.39 50.49 C46.41 50.21 46.44 49.93 46.46 49.64 C46.50 49.00 46.51 48.37 46.51 47.73 C38.91 47.59 31.16 48.92 23.79 50.70 C22.74 50.93 22.74 50.93 22.53 50.72 C22.53 49.90 22.53 49.07 22.53 48.25 C22.53 48.00 22.53 47.75 22.53 47.49 C22.53 46.95 22.53 46.42 22.53 45.89 C22.53 45.08 22.53 44.26 22.53 43.44 C22.53 42.92 22.53 42.41 22.53 41.90 C22.53 41.65 22.53 41.40 22.53 41.15 C22.53 39.42 22.53 39.42 22.63 39.32 C23.62 39.41 24.51 39.62 25.46 39.85 C32.06 41.39 39.23 42.97 46.03 42.89 C45.72 42.27 45.37 41.93 44.87 41.44 C38.13 33.74 31.81 23.22 35.32 12.64 C37.52 7.25 41.78 3.63 47.57 2.68 C53.68 2.00 59.09 3.99 62.84 8.90Z M41.48 12.54 C37.74 19.12 40.52 26.61 44.02 32.69 C47.58 38.71 47.58 38.71 49.80 40.48 C55.62 36.99 60.22 25.71 60.46 19.23 C60.32 15.06 58.64 11.40 55.00 9.22 C50.11 6.89 44.65 8.10 41.48 12.54Z" />
              <rect id="kh-pill-ring" fill="none" stroke="#F1D288" strokeWidth="1.2" x="0" y="0" width="0" height="0" rx="0" />
            </svg>
            <div id="kh-hint" className="kh-hint">Scroll to enter <span>↓</span></div>
          </div>
        </div>
      </div>

      {/* VISION / WHY EGYPT */}
      <section id="vision" className={`section ${s.vision}`}>
        <div className="section-label reveal" style={{ marginBottom: 0 }}>01 / WHY EGYPT</div>
        <Ornament name="ankh" />
        <h2 className={`${s.visionStatement} reveal`}>
          You already know how you want your guests to feel.<br />
          <em>We know how to make it happen in Egypt.</em>
        </h2>
        <div className={s.visionGrid}>
          <div className={`${s.visionCopy} reveal`}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>THE NEFERTITI WAY</p>
            <p>{t.visionText}</p>
            <a href="/about" className="text-link">{t.philosophy} <ArrowUpRight size={16} /></a>
            <div className={`${s.visionStats} reveal`}>
              {stats.map((st, i) => (
                <div className={s.visionStat} key={`${i}-${st.label}`}>
                  <span className={s.visionStatNum}>{st.value}</span>
                  <span className={s.visionStatLabel}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={s.visionRight}>
            <div className={`${s.visionImage} reveal`}>
              <LazyVideo
                src="/why-egypt-video.mp4"
                poster={images.vision}
                aria-label="Egypt desert at golden hour"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className={`section ${s.destinations}`}>
        {/* Section heading */}
        <div className="section-heading reveal">
          <div className="section-label">02 / {t.destinationLabel}</div>
<Ornament name="sun" />
          <div>
            <h2>{t.destinations}</h2>
            <p>{t.destinationText}</p>
          </div>
        </div>

        {/* Featured destinations — click goes to full page */}
        <div className={s.destGrid}>
          {featuredDestinations.map((dest, i) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.id}`}
              className={`${s.destCard} reveal delay-${Math.min(i + 1, 4)}`}
            >
              {dest.video ? (
                <LazyVideo
                  src={dest.video}
                  poster={dest.image}
                  aria-label={dest.title}
                />
              ) : (
                <img src={dest.image} alt={dest.title} />
              )}
              <div className={s.destCardBody}>
                <p className={s.destCardFeeling}>{dest.feeling}</p>
                <h3>{dest.title}</h3>
                <p className={s.destCardTagline}>{dest.tagline}</p>
                <span className={s.destCardExplore}>Explore <ArrowUpRight size={13} /></span>
              </div>
            </Link>
          ))}
        </div>

        {/* Where we work: map teaser, the full map lives on /destinations */}
        <div className={`${s.destMapTeaser} reveal`}>
          <p className={s.destMoreLabel}>Where we work</p>
          <EgyptMap
            destinations={[...featuredDestinations, ...moreDestinations]}
            featuredIds={featuredDestinations.map((d) => d.id)}
          />
          <div className={s.destMapAction}>
            <Link href="/destinations" className="button button-gold">See all destinations <ArrowUpRight size={14} /></Link>
          </div>
        </div>

        {/* Multi-destination combinations */}
        <div className={`${s.destCombos} reveal`}>
          <div className={s.destCombosHeader}>
            <h2>{t.destCombosTitle}</h2>
            <p className={s.destCombosSub}>{t.destCombosSubtitle}</p>
            <p className={s.destCombosBody}>{t.destCombosText}</p>
          </div>
          <div className={s.destComboList}>
            {combinations.map(combo => (
              <span key={combo} className={s.destComboPill}>{combo}</span>
            ))}
          </div>
          <div className={s.destComboActions}>
            <a href="/contact" className="button button-dark">{t.destCTA1} <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — three steps, the full flow lives on its own page */}
      {homeSteps.length > 0 && (
        <section className={`section ${s.howHome}`}>
          <div className={`${s.howHomeHead} reveal`}>
            <div className="section-label">HOW IT WORKS</div>
            <Ornament name="cartouche" />
            <h2>From first idea to arrival.</h2>
          </div>
          <ol className={s.howHomeList}>
            {homeSteps.map((st, i) => (
              <li key={st.title} className={`${s.howHomeItem} reveal delay-${i + 1}`}>
                <span className={s.howHomeNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{st.title}</h3>
                <p>{st.description}</p>
              </li>
            ))}
          </ol>
          <div className={s.howHomeAction}>
            <Link href="/how-it-works" className="text-link">See the full process <ArrowUpRight size={16} /></Link>
            <Link href="/pre-call" className="button button-dark">Start with a discovery call <ArrowUpRight size={14} /></Link>
          </div>
        </section>
      )}

      {/* UPCOMING RETREATS — pulled from Sanity, next 3 by date */}
      <section id="retreats" className={`section ${rs.homeRetreats}`}>
        <div className={`${rs.homeHead} reveal`}>
          <div className="section-heading">
            <div className="section-label">03 / OUR RETREATS</div>
<Ornament name="cartouche-ankh" />
            <div>
              <h2>JOIN A NEFERTITI RETREAT.</h2>
              <p>Small groups, thoughtful programmes and unforgettable places — hosted by us, across Egypt.</p>
            </div>
          </div>
          <Link href="/retreats" className={`button button-ghost-dark ${rs.homeAllDesktop}`}>
            See All Retreats <ArrowUpRight size={14} />
          </Link>
        </div>

        {upcomingRetreats.length > 0 ? (
          <div className={rs.homeGrid}>
            {upcomingRetreats.map((r) => <RetreatCard key={r.id} r={r} />)}
          </div>
        ) : (
          <p className={rs.homeEmpty}>New dates are being planned — get in touch and we will let you know first.</p>
        )}

        <Link href="/retreats" className={`button button-ghost-dark ${rs.homeAllMobile}`}>
          See All Retreats <ArrowUpRight size={14} />
        </Link>
      </section>

      {/* EXPLORE MORE — pathways into the deeper pages */}
      <section id="explore" className={`section ${s.explore}`}>
        <div className={`${s.exploreHead} reveal`}>
          <div className="section-label">EXPLORE FURTHER</div>
<Ornament name="lotus" />
          <h2>There&apos;s more to discover.</h2>
        </div>
        <div className={s.exploreGrid}>
          {[
            ['01', 'Experiences', 'Curated moments woven around your retreat&apos;s theme.', '/experiences'],
            ['02', 'Services', 'From light-touch support to full retreat production.', '/services'],
            ['03', 'How It Works', 'A clear, guided path from first idea to arrival.', '/how-it-works'],
            ['04', 'About', 'The story and the people behind Nefertiti.', '/about'],
          ].map(([num, title, desc, href]) => (
            <a key={href} href={href} className={`${s.exploreCard} reveal`}>
              <span className={s.exploreNum}>{num}</span>
              <div className={s.exploreCardBody}>
                <h3>{title}</h3>
                <p dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
              <ArrowUpRight className={s.exploreArrow} size={20} />
            </a>
          ))}
        </div>
      </section>

      {/* PARTNERS PREVIEW */}
      <section id="partners" className={`section ${s.partnersPreview}`}>
        <div className="section-heading reveal">
          <div className="section-label">05 / OUR TEAM</div>
<Ornament name="cartouche" />
          <div>
            <h2>Our Team</h2>
            <p>The trusted collaborators we work with across Egypt to bring every retreat to life.</p>
          </div>
        </div>
        <div className="team-grid">
          {partners.map((p) => (
            <div className="team-card reveal" key={p.id}>
              <a href={`/partners/${p.id}`} className="team-card-media">
                <img src={cropUrl(p.image, 480, 640)} alt={p.name} />
              </a>
              <a href={`/partners/${p.id}`} className="team-card-name">{p.name}</a>
              <p className="team-card-role">{p.category}</p>
              {(p.instagram || p.x || p.tiktok) && (
                <div className="team-card-socials">
                  {p.instagram && <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on Instagram`}>IN</a>}
                  {p.x && <a href={`https://x.com/${p.x}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on X`}>X</a>}
                  {p.tiktok && <a href={`https://tiktok.com/@${p.tiktok}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on TikTok`}>TT</a>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS — shown only when real ones are published in the Studio */}
      {testimonials.length > 0 && (
        <section id="testimonials" className={`section ${s.testimonials}`}>
          <div className="section-heading reveal">
            <div className="section-label">IN THEIR WORDS</div>
<Ornament name="ankh" />
            <h2>What retreat leaders say</h2>
          </div>
          <div className={`${s.testimonialGrid} ${testimonials.length > 3 ? s.testimonialScroll : ''}`}>
            {testimonials.map((tm) => (
              <figure className={`${s.testimonialCard} reveal`} key={tm.id}>
                <span className={s.testimonialMark} aria-hidden="true">&ldquo;</span>
                <blockquote>{tm.quote}</blockquote>
                <figcaption className={s.testimonialWho}>
                  {tm.image && <img src={tm.image} alt="" loading="lazy" />}
                  <span>
                    <strong>{tm.name}</strong>
                    {tm.role && <em>{tm.role}</em>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className={s.ctaBand}>
        <div className={`${s.ctaBandInner} reveal`}>
          <p className={s.ctaTagline}>Return to your inner balance</p>
          <h2>{t.cta.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h2>
          <p>{t.ctaText}</p>
          <a className="button button-gold" href="/contact">{t.contact}<ArrowUpRight size={16} /></a>
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

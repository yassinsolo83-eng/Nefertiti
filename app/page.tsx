'use client'

import { useState } from 'react'
import { ArrowUpRight, Menu, X, Camera, Mail, MapPin } from 'lucide-react'
import {
  images, copy, featuredDestinations, moreDestinations,
  combinations, experiences, serviceTiers, steps,
  type Destination,
} from '@/lib/data'
import DestinationModal from '@/components/DestinationModal'
import { useKeyhole } from '@/hooks/useKeyhole'
import { setGoogleLang } from '@/hooks/useGoogleTranslate'

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDestId, setActiveDestId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', country: '', website: '',
    practice: '', guests: '', dates: '', destination: '', budget: '',
    hosted: '', vision: '',
  })
  const [formSent, setFormSent] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const t = copy.en

  // scroll-driven Ankh intro + nav state + reveal animations
  useKeyhole({ setIntroDone, setScrolled })


  const closeMenu = () => setMenuOpen(false)

  const navTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    closeMenu()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    setFormSent(true)
  }

  const allDestinations = [...featuredDestinations, ...moreDestinations]
  const activeDest = allDestinations.find(d => d.id === activeDestId) ?? null

  return (
    <>
    <main>
      {/* NAV */}
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'menu-open' : ''} ${introDone ? '' : 'nav-hidden'}`}>
        <a href="#top" className="brand" onClick={closeMenu}>
          <img src={images.logoDark} alt="Nefertiti Luxury Retreat Producer" />
        </a>
        <nav className={`site-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          {[['About', '#about'], ['Why Egypt', '#vision'], ['Destinations', '#destinations'], ['Experiences', '#experiences'], ['Services', '#services'], ['How It Works', '#process'], ['Contact', '#contact']].map(([item, href]) => (
            <a key={item} href={href} onClick={(e) => navTo(e, href)}>{item}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <div className="lang-switch">
            <button className="lang" onClick={() => setGoogleLang('en')} aria-label="English">EN</button>
            <span className="lang-sep">/</span>
            <button className="lang" onClick={() => setGoogleLang('it')} aria-label="Italiano">IT</button>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

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
            <div className="hero-content reveal">
              <h1>{t.hero}</h1>
              <div className="hero-buttons">
                <a className="button button-gold" href="#contact">{t.explore}<ArrowUpRight size={16} /></a>
                <a className="button button-ghost" href="#contact">{t.inquire}</a>
              </div>
            </div>
          </section>

          {/* Keyhole overlay — fades to none once the intro completes */}
          <div className={`kh-overlay ${introDone ? 'kh-open' : ''}`}>
            <svg className="kh-svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" aria-hidden="true">
              <defs>
                <mask id="kh-mask">
                  <rect width="1000" height="1000" fill="white" />
                  <path id="kh-hole" fill="black" fillRule="evenodd"
                    transform="translate(500 500) scale(3.2) translate(-50 -50)"
                    d="M50 2 C40 2 31 12 31 27 C31 37 36 44 44 47 L44 49 L30 49 Q33 53.5 30 58 L44 58 L44 93 L56 93 L56 58 L70 58 Q67 53.5 70 49 L56 49 L56 47 C64 44 69 37 69 27 C69 12 60 2 50 2 Z M50 14 C54 14 58 20 58 27 C58 34 54 40 50 40 C46 40 42 34 42 27 C42 20 46 14 50 14 Z" />
                </mask>
              </defs>
              <rect id="kh-dark" width="1000" height="1000" fill="#2E1840" mask="url(#kh-mask)" />
              <path id="kh-ring" fill="none" stroke="#F1D288" strokeWidth="1.2" fillRule="evenodd"
                transform="translate(500 500) scale(3.2) translate(-50 -50)"
                d="M50 2 C40 2 31 12 31 27 C31 37 36 44 44 47 L44 49 L30 49 Q33 53.5 30 58 L44 58 L44 93 L56 93 L56 58 L70 58 Q67 53.5 70 49 L56 49 L56 47 C64 44 69 37 69 27 C69 12 60 2 50 2 Z M50 14 C54 14 58 20 58 27 C58 34 54 40 50 40 C46 40 42 34 42 27 C42 20 46 14 50 14 Z" />
            </svg>
            <div id="kh-ui" className="kh-ui">
              <img src={images.logo} alt="Nefertiti" className="kh-logo" />
            </div>
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
                aria-label="Tea ceremony — a moment of stillness"
              />
            </div>
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

        {/* Featured destinations — fixed grid, cards never disappear */}
        <div className="dest-grid">
          {featuredDestinations.map((dest, i) => (
            <article
              key={dest.id}
              className={`dest-card reveal delay-${Math.min(i + 1, 4)}`}
              onClick={() => setActiveDestId(dest.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveDestId(dest.id)}
            >
              <img src={dest.image} alt={dest.title} />
              <div className="dest-card-body">
                <p className="dest-card-feeling">{dest.feeling}</p>
                <h3>{dest.title}</h3>
                <p className="dest-card-tagline">{dest.tagline}</p>
              </div>
              <span className="dest-card-toggle" aria-hidden="true">+</span>
            </article>
          ))}
        </div>

        {/* Detail modal overlay (shared by featured + more destinations) */}
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
            <a href="#contact" className="button button-gold">{t.destCTA1} <ArrowUpRight size={14} /></a>
            <a href="#contact" className="button button-ghost">{t.destCTA2}</a>
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section id="experiences" className="section experiences">
        <div className="section-heading reveal">
          <div className="section-label">03 / EXPERIENCES</div>
          <div>
            <h2>{t.experiences}</h2>
            <p>{t.experienceText}</p>
          </div>
        </div>
        <div className="experience-list">
          {experiences.map((item, i) => (
            <article className="experience-row reveal" key={item.title}>
              <span className="experience-number">0{i + 1}</span>
              <div className="experience-text">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <img src={item.image} alt={item.title} />
            </article>
          ))}
        </div>
        <a href="#contact" className="text-link" style={{ marginTop: 48 }}>DESIGN MY EXPERIENCE <ArrowUpRight size={16} /></a>
      </section>

      {/* SERVICES */}
      <section id="services" className="bespoke">
        <div className="bespoke-image">
          <img src={images.hero} alt="Guests practicing yoga outdoors" />
        </div>
        <div className="bespoke-copy reveal">
          <p className="eyebrow">{t.bespokeLabel}</p>
          <h2>{t.bespoke.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
          <p>{t.bespokeText}</p>
          <div className="service-tiers">
            {serviceTiers.map((tier) => (
              <div className="service-tier" key={tier.num}>
                <div className="tier-header">
                  <span className="tier-num">{tier.num}</span>
                  <span className="tier-title">{tier.title}</span>
                </div>
                <p className="tier-desc">{tier.desc}</p>
                <ul className="tier-list">
                  {tier.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <a href="#contact" className="button button-light">DISCUSS YOUR RETREAT<ArrowUpRight size={16} /></a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="section process">
        <div className="section-heading reveal">
          <div className="section-label">04 / HOW IT WORKS</div>
          <h2>{t.process}</h2>
        </div>
        <div className="process-grid">
          {steps.map(([step, text], i) => (
            <div className="process-step reveal" key={step}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{step}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <a href="#contact" className="text-link">START WITH A DISCOVERY CALL <ArrowUpRight size={16} /></a>
      </section>

      {/* FOUNDER */}
      <section id="about" className="section founder">
        <div className="founder-image reveal">
          <img src={images.founder} alt="Founder at a waterfront event" />
        </div>
        <div className="founder-copy reveal">
          <div className="section-label">05 / {t.founder}</div>
          <p className="eyebrow">{t.founder}</p>
          <h2>{t.founderText}</h2>
          <p className="founder-name">
            {t.founderName}<br />
            <span>{t.founderRole}</span>
          </p>
          <a href="#contact" className="text-link">LET&apos;S TALK ABOUT YOUR IDEA <ArrowUpRight size={16} /></a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-band">
        <div className="cta-band-inner reveal">
          <h2>{t.cta.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h2>
          <p>{t.ctaText}</p>
          <a className="button button-dark" href="#contact">{t.contact}<ArrowUpRight size={16} /></a>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="contact-section">
        <img src={images.resort} alt="Retreat venue" className="contact-bg" />
        <div className="contact-overlay" />
        <div className="contact-inner reveal">
          <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 14 }}>NEFERTITI LUXURY RETREAT PRODUCER</p>
          <h2 className="contact-headline">Your retreat could start<br />with one conversation.</h2>
          <p className="contact-sub">You don&apos;t need to have everything figured out. Tell us what you teach, who you serve and what you&apos;d love them to experience.</p>

          {formSent ? (
            <div className="form-success">
              <h3>Thank you.</h3>
              <p>We&apos;ve received your enquiry and will be in touch within 48 hours.</p>
            </div>
          ) : (
            <div className="contact-form">
              <p className="form-label">{t.formTitle}</p>

              <div className="form-row">
                <div className="form-field full">
                  <label>Your Name</label>
                  <input name="name" value={formData.name} onChange={handleField} placeholder="Your full name" />
                </div>
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleField} placeholder="your@email.com" />
                </div>
                <div className="form-field">
                  <label>WhatsApp Number</label>
                  <input name="whatsapp" value={formData.whatsapp} onChange={handleField} placeholder="+1 234 567 890" />
                </div>
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>Country</label>
                  <input name="country" value={formData.country} onChange={handleField} placeholder="Your country" />
                </div>
                <div className="form-field">
                  <label>Website or Instagram</label>
                  <input name="website" value={formData.website} onChange={handleField} placeholder="@handle or website.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field full">
                  <label>Type of Wellness Practice</label>
                  <select name="practice" value={formData.practice} onChange={handleField}>
                    <option value="">Select your practice</option>
                    <option>Yoga</option>
                    <option>Meditation</option>
                    <option>Breathwork</option>
                    <option>Sound Healing</option>
                    <option>Women&apos;s Coaching</option>
                    <option>Life Coaching</option>
                    <option>Fitness</option>
                    <option>Nutrition</option>
                    <option>Psychology / Therapy</option>
                    <option>Leadership Coaching</option>
                    <option>Corporate Wellness</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>Estimated Number of Guests</label>
                  <input name="guests" value={formData.guests} onChange={handleField} placeholder="e.g. 10–15" />
                </div>
                <div className="form-field">
                  <label>Preferred Dates</label>
                  <input name="dates" value={formData.dates} onChange={handleField} placeholder="e.g. March 2026" />
                </div>
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>Preferred Destination</label>
                  <select name="destination" value={formData.destination} onChange={handleField}>
                    <option value="">Select destination</option>
                    <option>Cairo & Giza</option>
                    <option>The Red Sea</option>
                    <option>Luxor & Aswan</option>
                    <option>Siwa Oasis</option>
                    <option>The Desert</option>
                    <option>Cairo Countryside & Farms</option>
                    <option>Fayoum</option>
                    <option>Dahab & South Sinai</option>
                    <option>Marsa Alam</option>
                    <option>Sharm El Sheikh</option>
                    <option>Soma Bay</option>
                    <option>North Coast</option>
                    <option>Multi-destination journey</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Approximate Budget per Guest</label>
                  <input name="budget" value={formData.budget} onChange={handleField} placeholder="e.g. €1,500–2,500" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field full">
                  <label>Have You Hosted a Retreat Before?</label>
                  <select name="hosted" value={formData.hosted} onChange={handleField}>
                    <option value="">Select an option</option>
                    <option>Yes, several times</option>
                    <option>Yes, once or twice</option>
                    <option>No — it will be my first time</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field full">
                  <label>Tell Us About Your Retreat Vision</label>
                  <textarea name="vision" value={formData.vision} onChange={handleField} placeholder="Share as much or as little as you like..." rows={4} />
                </div>
              </div>

              <button className="form-submit" onClick={handleSubmit}>{t.formSubmit} <ArrowUpRight size={16} /></button>
              <p className="form-alt">{t.formAlt}</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          <img src={images.logo} alt="Nefertiti Luxury Retreat Producer" />
          <p>You lead the transformation. We create the experience.</p>
          <p>Based between Egypt &amp; Italy.</p>
        </div>
        <div className="footer-links">
          <div>
            <p className="footer-label">Navigate</p>
            <a href="#about">About</a>
            <a href="#vision">Why Egypt</a>
            <a href="#destinations">Destinations</a>
            <a href="#experiences">Experiences</a>
            <a href="#services">Services</a>
            <a href="#process">How It Works</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <p className="footer-label">Contact</p>
            <a href="mailto:hello@nefertitiretreats.com"><Mail size={14} /> hello@nefertitiretreats.com</a>
            <p><MapPin size={14} /> Cairo · Siwa · Everywhere</p>
            <a href="#top"><Camera size={14} /> Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Nefertiti Retreats</span>
          <span className="notranslate">Translations powered by Google · Traduzioni offerte da Google</span>
          <span>Made with presence</span>
        </div>
      </footer>

      {/* Back to top — lotus-inspired */}
      <button
        className={`to-top ${scrolled ? 'is-shown' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X, Camera, Mail, MapPin } from 'lucide-react'

const images = {
  logo: '/nefertiti-logo.png',
  logoDark: '/nefertiti-logo-dark.png',
  heroMain: '/hero-shirodhara.webp',
  hero: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rs%3Dw_984%2Ch_1749-rKfCp42avy5gbGj4dM9sBkVg3ml9Vy.webp',
  vision: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rs%3Dw_984%2Ch_1312-yhHGcLxbtC04mHWk2vOjX0Z3EjmrE5.webp',
  cairo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/900x600-1-50-130274e45d077f1d2dea84dec9156332-AuyATzxMn5KXFCvsvitJBwOPW3dXJ3.jpg',
  redSea: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-i4fp8DAP6wqHp9zMCVPeRhHJ2faApE.jpg',
  siwa: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sound-768x576-eGX9BM3R1R3tOWMSujIcQHKB09RAbX.jpeg',
  resort: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%286%29-w13ctS2si3HTM3vqoklR1bxXykK1Lb.jpg',
  hammam: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cleaning-woman-in-hammam_2048x2048-bm24VJd5mSMvY45Rtb7e2Kh7GWzeov.webp',
  boat: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%284%29-vlT1vQQEG6bjLjkkJO5xPC79mUbp0Z.jpg',
  founder: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OZ5A7176-scaled-1-900x600.jpg-xGKlXMGXHBn7aiD6bnPSh0vMbCCsbf.webp',
}

const copy = {
  en: {
    nav: ['About', 'Why Egypt', 'Destinations', 'Experiences', 'Services', 'How It Works', 'Contact'],
    eyebrow: 'Luxury retreat producer · Egypt & beyond',
    hero: 'HOST YOUR DREAM RETREAT IN EGYPT',
    heroText: 'Bespoke retreat production for wellness coaches, facilitators and transformational leaders who want to create something their community will never forget.',
    heroSupport: 'From the Pyramids to the Red Sea, we design, plan and produce your retreat around your vision, your practice and your people.',
    explore: 'CREATE YOUR RETREAT',
    inquire: 'BOOK A DISCOVERY CALL',
    visionTitle: 'YOU HAVE THE VISION.\nWE HAVE EGYPT.',
    visionText: 'You already know how you want your guests to feel. You know your practice. You know your community. You know the transformation you want to create. What you need is a trusted team on the ground who understands retreats, events, hospitality and Egypt. That is where we come in.',
    philosophy: 'DISCOVER OUR STORY',
    statsHeadline: 'Retreats are deeply personal.\nThat\'s why we treat every one\nas if it were our own.',
    destinations: 'ONE COUNTRY. ENDLESS POSSIBILITIES.',
    destinationLabel: 'WHERE WE CREATE',
    destinationText: 'From Cairo to Siwa, from the Red Sea to the desert — each destination carries its own energy, rhythm and possibility.',
    experiences: 'MORE THAN ACTIVITIES. MOMENTS WITH MEANING.',
    experienceText: 'We select experiences according to your retreat\'s theme and objectives.',
    bespoke: 'You take care of your people.\nWe take care of the retreat.',
    bespokeLabel: 'HOW WE WORK',
    bespokeText: 'Choose the level of support that fits your experience.',
    process: 'FROM \'WHAT IF?\' TO \'WELCOME TO EGYPT.\'',
    founder: 'THE FOUNDER',
    founderText: 'I\'ve always believed retreats are deeply personal. After experiencing retreats myself, I began to understand the difference between taking a holiday and intentionally stepping away from everyday life. Egypt has always been part of my story. And after years of working around events, experiences and international communities, one question kept coming back to me: why aren\'t more wellness leaders bringing their communities here? That\'s why I created Nefertiti.',
    founderName: 'Azza',
    founderRole: 'Founder & Retreat Producer',
    cta: 'YOUR COMMUNITY IS READY.\nWHERE WILL YOU TAKE THEM NEXT?',
    ctaText: 'Tell us what you teach, who you serve and what you dream of creating. We\'ll show you what that could look like in Egypt.',
    contact: 'LET\'S CREATE YOUR RETREAT',
    formTitle: 'START YOUR RETREAT ENQUIRY',
    formSubmit: 'LET\'S CREATE IT',
    formAlt: 'or email us directly at hello@nefertitiretreats.com',
  },
  it: {
    nav: ['Chi siamo', 'Perché l\'Egitto', 'Destinazioni', 'Esperienze', 'Servizi', 'Come funziona', 'Contatti'],
    eyebrow: 'Produzione di ritiri di lusso · Egitto & oltre',
    hero: 'CREA IL TUO RITIRO IN EGITTO',
    heroText: 'Produzione di ritiri su misura per coach del benessere, facilitatori e leader trasformazionali che vogliono creare qualcosa di indimenticabile per la loro community.',
    heroSupport: 'Dalle Piramidi al Mar Rosso, progettiamo, pianifichiamo e produciamo il tuo ritiro intorno alla tua visione, alla tua pratica e alle tue persone.',
    explore: 'CREA IL TUO RITIRO',
    inquire: 'PRENOTA UNA CALL CONOSCITIVA',
    visionTitle: 'TU HAI LA VISIONE.\nNOI ABBIAMO L\'EGITTO.',
    visionText: 'Sai già come vuoi che si sentano i tuoi ospiti. Conosci la tua pratica. Conosci la tua community. Conosci la trasformazione che vuoi creare. Ciò di cui hai bisogno è un team fidato sul posto che comprenda ritiri, eventi, ospitalità e Egitto. Ed è qui che entriamo in gioco.',
    philosophy: 'SCOPRI LA NOSTRA STORIA',
    statsHeadline: 'I ritiri sono profondamente personali.\nPer questo trattiamo ogni uno\ncome se fosse il nostro.',
    destinations: 'UN PAESE. INFINITE POSSIBILITÀ.',
    destinationLabel: 'DOVE CREIAMO',
    destinationText: 'Dal Cairo a Siwa, dal Mar Rosso al deserto — ogni destinazione porta la propria energia, ritmo e possibilità.',
    experiences: 'NON SEMPLICI ATTIVITÀ. MOMENTI CON SIGNIFICATO.',
    experienceText: 'Selezioniamo le esperienze in base al tema e agli obiettivi del tuo ritiro.',
    bespoke: 'Tu ti prendi cura delle tue persone.\nNoi ci prendiamo cura del ritiro.',
    bespokeLabel: 'COME LAVORIAMO',
    bespokeText: 'Scegli il livello di supporto che si adatta alla tua esperienza.',
    process: 'DA \'E SE?\' A \'BENVENUTI IN EGITTO.\'',
    founder: 'LA FONDATRICE',
    founderText: 'Ho sempre creduto che i ritiri siano profondamente personali. Dopo aver vissuto ritiri in prima persona, ho capito la differenza tra una vacanza e un distacco intenzionale dalla vita quotidiana. L\'Egitto è sempre stato parte della mia storia. E dopo anni di lavoro nel mondo degli eventi e delle esperienze internazionali, una domanda continuava a tornarmi: perché non più leader del benessere portano le loro community qui? Per questo ho creato Nefertiti.',
    founderName: 'Azza',
    founderRole: 'Fondatrice & Retreat Producer',
    cta: 'LA TUA COMMUNITY È PRONTA.\nDOVE LA PORTERAI?',
    ctaText: 'Raccontaci cosa insegni, chi servi e cosa sogni di creare. Ti mostreremo come potrebbe diventare realtà in Egitto.',
    contact: 'CREIAMO IL TUO RITIRO',
    formTitle: 'INIZIA LA TUA RICHIESTA',
    formSubmit: 'CREIAMOLO INSIEME',
    formAlt: 'oppure scrivici a hello@nefertitiretreats.com',
  },
}

const destinations = [
  { title: 'Cairo & Giza', meta: 'Rhythm · History · Connection', image: images.cairo },
  { title: 'Red Sea', meta: 'Salt · Light · Spaciousness', image: images.redSea },
  { title: 'Desert & Siwa', meta: 'Silence · Sound · Surrender', image: images.siwa },
  { title: 'Wellness resorts', meta: 'Sea · Ritual · Renewal', image: images.resort },
]

const experiences = [
  { title: 'Hammam rituals', text: 'Traditional Egyptian purification rituals, steam and ancient beauty practices.', image: images.hammam },
  { title: 'Sound healing', text: 'Gongs, singing bowls and breath in spaces designed for deep listening.', image: images.siwa },
  { title: 'Felucca sunsets', text: 'Private sailing on the Nile as the sky turns gold.', image: images.boat },
  { title: 'Sunrise yoga', text: 'Movement at dawn, beside the Pyramids, the sea or the desert.', image: images.hero },
  { title: 'Desert breathwork', text: 'Open sky, silence and breath in Egypt\'s most ancient landscape.', image: images.vision },
  { title: 'Egyptian beauty workshops', text: 'Natural oils, herbs and traditional skincare rituals.', image: images.resort },
]

const serviceTiers = [
  {
    num: 'I',
    title: 'RETREAT CONSULTATION',
    desc: 'For coaches who have an idea but need help turning it into a viable retreat.',
    items: ['Discovery session', 'Destination consultation', 'Concept development', 'Preliminary itinerary', 'Venue recommendations', 'Budget framework'],
  },
  {
    num: 'II',
    title: 'RETREAT DESIGN & PLANNING',
    desc: 'For coaches who want us to develop the complete retreat with them.',
    items: ['Everything in Consultation', 'Detailed itinerary', 'Accommodation sourcing', 'Hotel negotiations', 'Transportation', 'Activity sourcing', 'Wellness suppliers', 'Budget management'],
  },
  {
    num: 'III',
    title: 'FULL RETREAT PRODUCTION',
    desc: 'Our complete end-to-end service. You arrive and lead. We manage the experience.',
    items: ['Complete design', 'Hotel management', 'Airport transfers', 'Supplier management', 'On-site production', 'Photography coordination', 'Multilingual support'],
  },
]

const steps = [
  ["LET'S TALK", 'Tell us about your practice, community, preferred dates, group size and budget.'],
  ['WE UNDERSTAND YOUR VISION', 'We explore what you want your guests to feel, learn and experience.'],
  ['WE CREATE THE CONCEPT', 'We recommend destinations, accommodation and experiences that fit your retreat.'],
  ['YOU RECEIVE YOUR PROPOSAL', 'A tailored retreat concept including itinerary, logistics and budget.'],
  ['WE BUILD IT', 'Once approved, we begin bookings, negotiations and production.'],
  ['YOU BRING YOUR COMMUNITY', 'You focus on preparing your programme and your guests.'],
  ['WELCOME TO EGYPT', 'Our team receives you and manages the retreat on the ground.'],
  ['YOU LEAD. WE PRODUCE.', 'You focus on what you do best. We remain behind the scenes.'],
]

export default function Page() {
  const [lang, setLang] = useState<'en' | 'it'>('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', country: '', website: '',
    practice: '', guests: '', dates: '', destination: '', budget: '',
    hosted: '', vision: '',
  })
  const [formSent, setFormSent] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const t = copy[lang]

  useEffect(() => {
    // ── KEYHOLE INTRO — scroll-driven open/close ──
    const track = document.getElementById('kh-track')
    const hole = document.getElementById('kh-hole')
    const ring = document.getElementById('kh-ring')
    const darkRect = document.getElementById('kh-dark')
    const ui = document.getElementById('kh-ui')
    const hint = document.getElementById('kh-hint')

    const MIN = 2.0   // small visible keyhole at start
    const MAX = 42    // large enough to fully clear the viewport at end of track
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    const updateKeyhole = () => {
      if (!track || !hole || !ring || !darkRect) return
      const rect = track.getBoundingClientRect()
      const range = track.offsetHeight - window.innerHeight
      const p = clamp(-rect.top / range, 0, 1)

      // keyhole finishes opening at 75% of the track; the last 25% holds the
      // hero fully revealed (a beat of pause) before the site scrolls on.
      const OPEN_AT = 0.75
      const op = clamp(p / OPEN_AT, 0, 1)

      const s = MIN + (MAX - MIN) * smooth(op)
      const tf = `translate(500 500) scale(${s}) translate(-50 -50)`
      hole.setAttribute('transform', tf)
      ring.setAttribute('transform', tf)

      // clean finish: fade dark overlay out as the keyhole completes
      const darkOp = op > 0.92 ? clamp(1 - (op - 0.92) / 0.08, 0, 1) : 1
      darkRect.setAttribute('opacity', String(darkOp))

      const uiOp = clamp(1 - op / 0.45, 0, 1)
      if (ui) ui.style.opacity = String(uiOp)
      ring.setAttribute('opacity', String(uiOp))
      if (hint) hint.style.opacity = String(uiOp)

      // overlay is fully out once the keyhole finishes opening
      setIntroDone(op >= 1)
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      updateKeyhole()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateKeyhole)
    updateKeyhole()

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateKeyhole)
      observer.disconnect()
    }
  }, [])

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
          <button className="lang" onClick={() => setLang(lang === 'en' ? 'it' : 'en')} aria-label="Switch language">
            {lang === 'en' ? 'IT' : 'EN'}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* HERO + KEYHOLE INTRO — scroll-driven reveal */}
      <div id="kh-track" className="kh-track">
        <div className="kh-stage">
          <section id="top" className="hero">
            <img src={images.heroMain} alt="Shirodhara oil ritual — Ayurvedic retreat" className="hero-image" />
            <div className="hero-shade" />
            <div className="hero-content reveal">
              <h1>{t.hero}</h1>
              <p className="hero-copy">{t.heroText}</p>
              <p className="hero-copy">{t.heroSupport}</p>
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
                    transform="translate(500 500) scale(2) translate(-50 -50)"
                    d="M50 2 C40 2 31 12 31 27 C31 37 36 44 44 47 L44 49 L30 49 Q33 53.5 30 58 L44 58 L44 93 L56 93 L56 58 L70 58 Q67 53.5 70 49 L56 49 L56 47 C64 44 69 37 69 27 C69 12 60 2 50 2 Z M50 14 C54 14 58 20 58 27 C58 34 54 40 50 40 C46 40 42 34 42 27 C42 20 46 14 50 14 Z" />
                </mask>
              </defs>
              <rect id="kh-dark" width="1000" height="1000" fill="#2E1840" mask="url(#kh-mask)" />
              <path id="kh-ring" fill="none" stroke="#F1D288" strokeWidth="1.2" fillRule="evenodd"
                transform="translate(500 500) scale(2) translate(-50 -50)"
                d="M50 2 C40 2 31 12 31 27 C31 37 36 44 44 47 L44 49 L30 49 Q33 53.5 30 58 L44 58 L44 93 L56 93 L56 58 L70 58 Q67 53.5 70 49 L56 49 L56 47 C64 44 69 37 69 27 C69 12 60 2 50 2 Z M50 14 C54 14 58 20 58 27 C58 34 54 40 50 40 C46 40 42 34 42 27 C42 20 46 14 50 14 Z" />
            </svg>
            <div id="kh-ui" className="kh-ui">
              <img src={images.logo} alt="Nefertiti" className="kh-logo" />
              <p className="kh-tagline">You lead the transformation.<br />We create the experience.</p>
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
              <img src={images.vision} alt="Outdoor yoga by the Nile" />
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
        <div className="section-heading reveal">
          <div className="section-label">02 / {t.destinationLabel}</div>
          <div>
            <h2>{t.destinations}</h2>
            <p>{t.destinationText}</p>
          </div>
        </div>
        <div className="destination-grid">
          {destinations.map((item, i) => (
            <article className={`destination-card reveal delay-${i + 1}`} key={item.title}>
              <img src={item.image} alt={item.title} />
              <div className="card-overlay">
                <p>{item.meta}</p>
                <h3>{item.title}</h3>
                <ArrowUpRight size={18} />
              </div>
            </article>
          ))}
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
                    <option>Red Sea</option>
                    <option>Desert</option>
                    <option>Siwa</option>
                    <option>Fayoum</option>
                    <option>Multi-destination</option>
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
          <span>Made with presence</span>
        </div>
      </footer>
    </main>
    </>
  )
}

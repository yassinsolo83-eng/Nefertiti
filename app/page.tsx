'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X, Camera, Mail, MapPin } from 'lucide-react'

const images = {
  logo: '/nefertiti-logo.png',
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
    visionTitle: 'A different kind of escape',
    visionText: 'We believe the most memorable journeys are felt before they are understood. A morning by the Nile. A gong vibrating through a sun-warmed room. A table set beneath the stars. Every detail is an invitation back to yourself.',
    philosophy: 'Rooted in place. Designed around you.',
    destinations: 'ONE COUNTRY. ENDLESS POSSIBILITIES.',
    destinationLabel: 'WHERE WE CREATE',
    destinationText: 'From Cairo to Siwa, from the Red Sea to the desert — each destination carries its own energy, rhythm and possibility.',
    experiences: 'MORE THAN ACTIVITIES. MOMENTS WITH MEANING.',
    experienceText: "We select experiences according to your retreat's theme and objectives.",
    bespoke: 'You take care of your people. We take care of the retreat.',
    bespokeLabel: 'HOW WE WORK',
    bespokeText: 'Choose the level of support that fits your experience.',
    process: "FROM 'WHAT IF?' TO 'WELCOME TO EGYPT.'",
    founder: 'THE FOUNDER',
    founderText: "I've always believed retreats are deeply personal. After experiencing retreats myself, I began to understand the difference between taking a holiday and intentionally stepping away from everyday life. Egypt has always been part of my story. And after years of working around events, experiences and international communities, one question kept coming back to me: why aren't more wellness leaders bringing their communities here? That's why I created Nefertiti.",
    founderName: 'Azza',
    founderRole: 'Founder & Retreat Producer',
    cta: 'YOUR COMMUNITY IS READY.\nWHERE WILL YOU TAKE THEM NEXT?',
    ctaText: "Tell us what you teach, who you serve and what you dream of creating. We'll show you what that could look like in Egypt.",
    contact: "LET'S CREATE YOUR RETREAT",
  },
  it: {
    nav: ['About', 'Why Egypt', 'Destinations', 'Experiences', 'Services', 'How It Works', 'Contact'],
    eyebrow: 'Produttrice di ritiri di lusso · Egitto e oltre',
    heroSupport: 'Dalle Piramidi al Mar Rosso, progettiamo, pianifichiamo e produciamo il tuo ritiro intorno alla tua visione, alla tua pratica e alle tue persone.',
    hero: 'Dove il corpo ricorda come essere libero.',
    heroText: 'Nefertiti crea ritiri immersivi in cui rituali antichi, benessere contemporaneo e la bellezza elementare dell’Egitto si incontrano.',
    explore: 'Esplora il mondo',
    inquire: 'Progetta il tuo ritiro',
    visionTitle: 'Una fuga diversa',
    visionText: 'Crediamo che i viaggi più memorabili si sentano prima di essere compresi. Un mattino sul Nilo. Un gong in una stanza scaldata dal sole. Una tavola sotto le stelle. Ogni dettaglio è un invito a tornare a te.',
    philosophy: 'Radicati nel luogo. Disegnati intorno a te.',
    destinations: 'I luoghi che conosciamo a memoria',
    destinationText: 'Dal ritmo del Cairo al silenzio di Siwa, creiamo accesso ai paesaggi e agli spazi più evocativi dell’Egitto.',
    experiences: 'Rituali per una vita più piena',
    experienceText: 'Non attività da spuntare, ma momenti capaci di cambiare la forma di una giornata — e a volte, la tua.',
    bespoke: 'Il tuo ritiro, a colori pieni',
    bespokeText: 'Per gruppi privati, brand consapevoli e comunità curiose, componiamo incontri completamente personali.',
    process: 'Un modo attento di lavorare',
    founder: 'Una nota dalla fondatrice',
    founderText: 'Nefertiti è nata da una convinzione semplice: l’Egitto non è uno sfondo. È una fonte viva di ritmo, accoglienza e meraviglia. Il mio lavoro è unire le persone, i luoghi e i rituali giusti in un flusso indimenticabile.',
    founderName: 'Nefertiti El-Mahdy',
    founderRole: 'Fondatrice e produttrice creativa',
    cta: 'Facciamo spazio alla meraviglia.',
    ctaText: 'Raccontaci cosa immagini. Ti aiuteremo a portarlo in un luogo bellissimo.',
    contact: 'Inizia una conversazione',
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

export default function Page() {
  const [lang, setLang] = useState<'en' | 'it'>('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = copy[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect() }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#top" className="brand" onClick={closeMenu}><img src={images.logo} alt="Nefertiti Luxury Retreat Producer" /></a>
        <nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">
          {[['About', '#about'], ['Why Egypt', '#vision'], ['Destinations', '#destinations'], ['Experiences', '#experiences'], ['Services', '#services'], ['How It Works', '#process'], ['Contact', '#contact']].map(([item, href]) => <a key={item} href={href} onClick={closeMenu}>{item}</a>)}
        </nav>
        <div className="nav-actions"><button className="lang" onClick={() => setLang(lang === 'en' ? 'it' : 'en')} aria-label="Switch language">{lang === 'en' ? 'IT' : 'EN'}</button><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>

      <section id="top" className="hero">
        <img src={images.hero} alt="Yoga retreat by the Nile under flowing ribbons" className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-content reveal"><p className="eyebrow">{t.eyebrow}</p><h1>{t.hero}</h1><p className="hero-copy">{t.heroText}</p><p className="hero-copy">{t.heroSupport}</p><div className="hero-buttons"><a className="button button-gold" href="#destinations">{t.explore}<ArrowUpRight size={16} /></a><a className="button button-ghost" href="#contact">{t.inquire}</a></div></div>
        <p className="hero-caption">06° 03′ N · 31° 14′ E<br /><span>Made with presence</span></p>
        <a href="#vision" className="scroll-cue">Scroll to discover <span>↓</span></a>
      </section>

      <section id="vision" className="section vision"><div className="section-label reveal">01 / {t.nav[0]}</div><div className="vision-grid"><div className="vision-copy reveal"><p className="eyebrow">The Nefertiti way</p><h2>{t.visionTitle}</h2><p>{t.visionText}</p><a href="#experiences" className="text-link">{t.philosophy} <ArrowUpRight size={16} /></a></div><div className="vision-image reveal"><img src={images.vision} alt="Outdoor yoga by the Nile" /></div></div></section>

      <section id="destinations" className="section destinations"><div className="section-heading reveal"><div className="section-label">02 / {t.destinationLabel}</div><h2>{t.destinations}</h2><p>{t.destinationText}</p></div><div className="destination-grid">{destinations.map((item, i) => <article className={`destination-card reveal delay-${i + 1}`} key={item.title}><img src={item.image} alt={item.title} /><div className="card-overlay"><p>{item.meta}</p><h3>{item.title}</h3><ArrowUpRight size={18} /></div></article>)}</div></section>

      <section id="experiences" className="section experiences"><div className="section-heading reveal"><div className="section-label">03 / Experiences</div><h2>{t.experiences}</h2><p>{t.experienceText}</p></div><div className="experience-list">{experiences.map((item, i) => <article className="experience-row reveal" key={item.title}><span className="experience-number">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><img src={item.image} alt={item.title} /></article>)}</div></section>

      <section id="services" className="bespoke"><div className="bespoke-image"><img src={images.hero} alt="Guests practicing yoga outdoors" /></div><div className="bespoke-copy reveal"><p className="eyebrow">{t.bespokeLabel}</p><h2>{t.bespoke}</h2><p>{t.bespokeText}</p><div className="service-tags"><span>Tier I — RETREAT CONSULTATION<br />For coaches who have an idea but need help turning it into a viable retreat.<br />Includes: Discovery session · Destination consultation · Concept development · Preliminary itinerary · Venue recommendations · Budget framework</span><span>Tier II — RETREAT DESIGN &amp; PLANNING<br />For coaches who want us to develop the complete retreat with them.<br />Includes: Everything in Consultation + Detailed itinerary · Accommodation sourcing · Hotel negotiations · Transportation · Activity sourcing · Wellness suppliers · Budget management</span><span>Tier III — FULL RETREAT PRODUCTION<br />Our complete end-to-end service. You arrive and lead. We manage the experience.<br />Includes: Complete design · Hotel management · Airport transfers · Supplier management · On-site production · Photography coordination · Multilingual support</span></div><a href="#contact" className="button button-light">DISCUSS YOUR RETREAT<ArrowUpRight size={16} /></a></div></section>

      <section id="process" className="section process"><div className="section-heading reveal"><div className="section-label">04 / How It Works</div><h2>{t.process}</h2></div><div className="process-grid">{[
  ["LET'S TALK", 'Tell us about your practice, community, preferred dates, group size and budget.'],
  ['WE UNDERSTAND YOUR VISION', 'We explore what you want your guests to feel, learn and experience.'],
  ['WE CREATE THE CONCEPT', 'We recommend destinations, accommodation and experiences that fit your retreat.'],
  ['YOU RECEIVE YOUR PROPOSAL', 'A tailored retreat concept including itinerary, logistics and budget.'],
  ['WE BUILD IT', 'Once approved, we begin bookings, negotiations and production.'],
  ['YOU BRING YOUR COMMUNITY', 'You focus on preparing your programme and your guests.'],
  ['WELCOME TO EGYPT', 'Our team receives you and manages the retreat on the ground.'],
  ['YOU LEAD. WE PRODUCE.', 'You focus on what you do best. We remain behind the scenes.'],
].map(([step, text], i) => <div className="process-step reveal" key={step}><span>{String(i + 1).padStart(2, '0')}</span><h3>{step}</h3><p>{text}</p></div>)}</div><a href="#contact" className="text-link">START WITH A DISCOVERY CALL <ArrowUpRight size={16} /></a></section>

      <section id="about" className="section founder"><div className="founder-image reveal"><img src={images.founder} alt="DJ performing at a waterfront event" /></div><div className="founder-copy reveal"><div className="section-label">05 / {t.founder}</div><p className="eyebrow">{t.founder}</p><h2>{t.founderText}</h2><p className="founder-name">{t.founderName}<br /><span>{t.founderRole}</span></p><a href="#contact" className="text-link">LET&apos;S TALK ABOUT YOUR IDEA →</a></div></section>

      <section id="contact" className="contact"><div className="contact-inner reveal"><p className="eyebrow">Nefertiti Luxury Retreat Producer</p><h2>{t.cta.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h2><p>{t.ctaText}</p><a className="button button-gold" href="mailto:hello@nefertitiretreats.com">{t.contact}<ArrowUpRight size={16} /></a><a className="text-link" href="mailto:hello@nefertitiretreats.com">or BOOK A DISCOVERY CALL</a></div></section>

      <footer><div className="footer-brand"><img src={images.logo} alt="Nefertiti Luxury Retreat Producer" /><p>You lead the transformation. We create the experience.</p><p>Based between Egypt &amp; Italy.</p></div><div className="footer-links"><div><p className="footer-label">Navigate</p><a href="#about">About</a><a href="#vision">Why Egypt</a><a href="#destinations">Destinations</a><a href="#experiences">Experiences</a><a href="#services">Services</a><a href="#process">How It Works</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></div><div><p className="footer-label">Contact</p><a href="mailto:hello@nefertitiretreats.com"><Mail size={14} /> hello@nefertitiretreats.com</a><p><MapPin size={14} /> Cairo · Siwa · Everywhere</p><a href="#top"><Camera size={14} /> Instagram</a></div></div><div className="footer-bottom"><span>© 2026 Nefertiti Retreats</span><span>Made with presence</span></div></footer>
    </main>
  )
}

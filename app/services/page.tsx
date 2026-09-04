'use client'

import { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { serviceTiers, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './services.module.css'

export default function ServicesPage() {
  const t = copy.en
  const [activeIdx, setActiveIdx] = useState(0)

  const tierImages = ['/srv-hero.webp', '/srv-yoga.webp', '/exp-spa.webp']

  return (
    <main className="inner-page">
      <SiteNav solid />

      {/* ── HERO IMAGE ── */}
      <section className={styles.hero}>
        <div className={`${styles.backWrap} hero-back`}>
          <BackButton />
        </div>
        <img src="/srv-hero.webp" alt="Nefertiti Services" className={styles.heroImg} />
      </section>

      {/* ── SERVICES LIST ── */}
      <section className={styles.section}>
        <div className={styles.layout}>
          {/* Left: heading + description */}
          <div className={styles.intro}>
            <p className="eyebrow">◆ SERVICES</p>
            <h1 className={styles.title}>
              Bespoke retreat production,<br />tailored to your vision.
            </h1>
            <p className={styles.lead}>
              {t.bespokeText}
            </p>
            <a href="/contact" className="button button-gold">
              Discuss Your Retreat <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Right: numbered tiers + hover image */}
          <div className={styles.listWrap}>
            {/* Floating image */}
            <div className={styles.floatingImg}>
              <img
                src={tierImages[activeIdx]}
                alt={serviceTiers[activeIdx].title}
                key={activeIdx}
              />
            </div>

            {/* Service tier rows */}
            <div className={styles.list}>
              {serviceTiers.map((tier, i) => (
                <div
                  key={tier.num}
                  className={`${styles.row} ${i === activeIdx ? styles.rowActive : ''}`}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <div className={styles.rowContent}>
                    <span className={styles.rowTitle}>{tier.title}</span>
                    <span className={styles.rowNum}>{tier.num}</span>
                  </div>
                  {i === activeIdx && (
                    <div className={styles.rowDetails}>
                      <img src={tierImages[i]} alt={tier.title} className={styles.rowImg} />
                      <p className={styles.rowDesc}>{tier.desc}</p>
                      <ul className={styles.rowItems}>
                        {tier.items.map((item) => (
                          <li key={item}><Check size={14} /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

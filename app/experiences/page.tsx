'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { experiences, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './experiences.module.css'

export default function ExperiencesPage() {
  const t = copy.en
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <main className="inner-page">
      <SiteNav solid />

      {/* ── HERO IMAGE ── */}
      <section className={styles.hero}>
        <div className={styles.backWrap}>
          <BackButton />
        </div>
        <img src="/exp-hero.webp" alt="Nefertiti Experiences" className={styles.heroImg} />
      </section>

      {/* ── EXPERIENCES LIST ── */}
      <section className={styles.section}>
        <div className={styles.layout}>
          {/* Left: heading + description */}
          <div className={styles.intro}>
            <p className="eyebrow">◆ EXPERIENCES</p>
            <h1 className={styles.title}>
              Curated moments woven<br />around your retreat.
            </h1>
            <p className={styles.lead}>
              Every experience is designed to deepen connection — with Egypt,
              with your practice, and with each other.
            </p>
            <a href="/contact" className="button button-gold">
              Design My Experience <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Right: numbered list + hover image */}
          <div className={styles.listWrap}>
            {/* Floating image */}
            <div className={styles.floatingImg}>
              <img
                src={experiences[activeIdx].image}
                alt={experiences[activeIdx].title}
                key={activeIdx}
              />
            </div>

            {/* Experience rows */}
            <div className={styles.list}>
              {experiences.map((item, i) => (
                <div
                  key={item.title}
                  className={`${styles.row} ${i === activeIdx ? styles.rowActive : ''}`}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <div className={styles.rowContent}>
                    <span className={styles.rowTitle}>{item.title}</span>
                    <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  {i === activeIdx && (
                    <div className={styles.rowExpanded}>
                      <img src={item.image} alt={item.title} className={styles.rowImg} />
                      <p className={styles.rowText}>{item.text}</p>
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

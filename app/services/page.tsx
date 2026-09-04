'use client'

import { useState, useRef } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { serviceTiers, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './services.module.css'

export default function ServicesPage() {
  const t = copy.en
  const [activeIdx, setActiveIdx] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const [imgY, setImgY] = useState(0)

  const tierImages = ['/srv-hero.webp', '/srv-yoga.webp', '/exp-spa.webp']

  const handleHover = (i: number) => {
    setActiveIdx(i)
    if (listRef.current) {
      const rows = listRef.current.children
      if (rows[i]) {
        const listTop = listRef.current.getBoundingClientRect().top
        const rowTop = (rows[i] as HTMLElement).getBoundingClientRect().top
        setImgY(rowTop - listTop)
      }
    }
  }

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className={styles.hero}>
        <div className={`${styles.backWrap} hero-back`}>
          <BackButton />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className="eyebrow">◆ SERVICES</p>
            <h1 className={styles.title}>
              Bespoke retreat production,<br />tailored to your vision.
            </h1>
            <p className={styles.lead}>{t.bespokeText}</p>
            <a href="/contact" className="button button-gold">
              Discuss Your Retreat <ArrowUpRight size={14} />
            </a>
          </div>

          <div className={styles.listWrap}>
            <div
              className={styles.floatingImg}
              style={{ transform: `translateY(${imgY}px)` }}
            >
              <img
                src={tierImages[activeIdx]}
                alt={serviceTiers[activeIdx].title}
                key={activeIdx}
              />
            </div>

            <div className={styles.list} ref={listRef}>
              {serviceTiers.map((tier, i) => (
                <div
                  key={tier.num}
                  className={`${styles.row} ${i === activeIdx ? styles.rowActive : ''}`}
                  onMouseEnter={() => handleHover(i)}
                  onClick={() => handleHover(i)}
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

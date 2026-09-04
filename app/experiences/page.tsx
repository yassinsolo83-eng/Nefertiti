'use client'

import { useState, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { experiences, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './experiences.module.css'

export default function ExperiencesPage() {
  const t = copy.en
  const [activeIdx, setActiveIdx] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const [imgY, setImgY] = useState(0)

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

          <div className={styles.listWrap}>
            <div
              className={styles.floatingImg}
              style={{ transform: `translateY(${imgY}px)` }}
            >
              <img
                src={experiences[activeIdx].image}
                alt={experiences[activeIdx].title}
                key={activeIdx}
              />
            </div>

            <div className={styles.list} ref={listRef}>
              {experiences.map((item, i) => (
                <div
                  key={item.title}
                  className={`${styles.row} ${i === activeIdx ? styles.rowActive : ''}`}
                  onMouseEnter={() => handleHover(i)}
                  onClick={() => handleHover(i)}
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

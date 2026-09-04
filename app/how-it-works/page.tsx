'use client'

import { useState, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { steps, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './how-it-works.module.css'

const stepImages = [
  '/exp-sound-healing.webp',
  '/exp-meditation.webp',
  '/cta-cairo.webp',
  '/exp-beauty.webp',
  '/srv-hero.webp',
  '/exp-felucca.webp',
  '/cta-luxor.webp',
  '/srv-yoga.webp',
]

export default function HowItWorksPage() {
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
            <p className="eyebrow">◆ HOW IT WORKS</p>
            <h1 className={styles.title}>
              A clear, guided path<br />from idea to arrival.
            </h1>
            <p className={styles.lead}>
              Eight steps from your first message to standing in Egypt
              with your community.
            </p>
            <a href="/contact" className="button button-gold">
              Start with a Discovery Call <ArrowUpRight size={14} />
            </a>
          </div>

          <div className={styles.listWrap}>
            <div
              className={styles.floatingImg}
              style={{ transform: `translateY(${imgY}px)` }}
            >
              <img
                src={stepImages[activeIdx]}
                alt={steps[activeIdx][0]}
                key={activeIdx}
              />
            </div>

            <div className={styles.list} ref={listRef}>
              {steps.map(([step, text], i) => (
                <div
                  key={step}
                  className={`${styles.row} ${i === activeIdx ? styles.rowActive : ''}`}
                  onMouseEnter={() => handleHover(i)}
                  onClick={() => handleHover(i)}
                >
                  <div className={styles.rowContent}>
                    <span className={styles.rowTitle}>{step}</span>
                    <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  {i === activeIdx && (
                    <div className={styles.rowExpanded}>
                      <img src={stepImages[i]} alt={step} className={styles.rowImg} />
                      <p className={styles.rowText}>{text}</p>
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

'use client'

import { useState, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from '@/app/experiences/experiences.module.css'
import { Ornament } from '@/components/Motif'
import Link from 'next/link'
import Img from '@/components/Img'

type Props = { experiences: { title: string; text: string; image: string }[]; heroImage: string }

export default function ExperiencesPage({ experiences, heroImage }: Props) {
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
      <SiteNav overHero />

      <section className="phero" style={{ backgroundImage: `url('${heroImage}')`, backgroundPosition: 'center' }}>
        <div className="phero-shade" />
        <div className="phero-back hero-back">
          <BackButton />
        </div>
        <div className="phero-content">
          <Ornament name="lotus" />
          <h1>Experiences</h1>
          <p className="phero-sub">Curated moments woven around your retreat.</p>
          <p className="phero-lead">Every experience is designed to deepen connection — with Egypt, with your practice, and with each other.</p>
          <Link href="/pre-call" className="button button-gold">
            Design My Experience <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.layout}>
          <div className={styles.listWrap}>
            <div
              className={styles.floatingImg}
              style={{ transform: `translateY(${imgY}px)` }}
            >
              <Img
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
                      <Img src={item.image} alt={item.title} className={styles.rowImg} />
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

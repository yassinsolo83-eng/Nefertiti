'use client'

import { useState, useRef } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { copy } from '@/lib/data'
import type { ServiceTier } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from '@/app/services/services.module.css'
import { Ornament } from '@/components/Motif'
import Link from 'next/link'
import Img from '@/components/Img'

type Props = { serviceTiers: ServiceTier[]; heroImage: string }

export default function ServicesPage({ serviceTiers, heroImage }: Props) {
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
      <SiteNav overHero />

      <section className="phero" style={{ backgroundImage: `url('${heroImage}')`, backgroundPosition: 'center' }}>
        <div className="phero-shade" />
        <div className="phero-back hero-back">
          <BackButton />
        </div>
        <div className="phero-content">
          <Ornament name="sun" />
          <h1>Services</h1>
          <p className="phero-sub">Bespoke retreat production, tailored to your vision.</p>
          <p className="phero-lead">{t.bespokeText}</p>
          <Link href="/pre-call" className="button button-gold">
            Discuss Your Retreat <ArrowUpRight size={14} />
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
                src={serviceTiers[activeIdx].image}
                alt={serviceTiers[activeIdx].title}
                key={activeIdx}
              />
            </div>

            <div className={styles.list} ref={listRef}>
              {serviceTiers.map((tier, i) => (
                <div
                  key={`${tier.num}-${tier.title}`}
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
                      <Img src={tier.image} alt={tier.title} className={styles.rowImg} />
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

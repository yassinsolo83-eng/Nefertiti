'use client'

import { useState, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from '@/app/how-it-works/how-it-works.module.css'
import type { Step } from '@/sanity/lib/queries'
import { Ornament } from '@/components/Motif'
import Link from 'next/link'
import Img from '@/components/Img'
import type { PageTexts } from '@/lib/data'

type Props = { steps: Step[]; heroImage: string; texts: PageTexts }

export default function HowItWorksPage({ steps, heroImage, texts }: Props) {
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

      <section className="phero" style={{ backgroundImage: `url('${heroImage}')`, backgroundPosition: 'center 65%' }}>
        <div className="phero-shade" />
        <div className="phero-back hero-back">
          <BackButton />
        </div>
        <div className="phero-content">
          <Ornament name="cartouche" />
          <h1>{texts.howItWorksPageTitle}</h1>
          <p className="phero-sub">{texts.howItWorksPageSubtitle}</p>
          <p className="phero-lead">{texts.howItWorksPageLead}</p>
          <Link href="/pre-call" className="button button-gold">
            {texts.howItWorksPageButton} <ArrowUpRight size={14} />
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
                src={steps[activeIdx].image}
                alt={steps[activeIdx].title}
                key={activeIdx}
              />
            </div>

            <div className={styles.list} ref={listRef}>
              {steps.map(({ title: step, description: text, image }, i) => (
                <div
                  key={`${i}-${step}`}
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
                      <Img src={image} alt={step} className={styles.rowImg} />
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

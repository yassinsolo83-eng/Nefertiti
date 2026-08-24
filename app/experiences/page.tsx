'use client'

import { ArrowUpRight } from 'lucide-react'
import { experiences, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'

export default function ExperiencesPage() {
  const t = copy.en
  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero page-hero-single">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">03 / EXPERIENCES</p>
          <h1 className="page-title">Experiences</h1>
          <p className="page-lead">{t.experiences} — {t.experienceText}</p>
        </div>
      </section>

      <section className="section experiences inner-section">
        <div className="experience-list">
          {experiences.map((item, i) => (
            <article className="experience-row reveal is-in" key={item.title}>
              <span className="experience-number">0{i + 1}</span>
              <div className="experience-text">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <img src={item.image} alt={item.title} />
            </article>
          ))}
        </div>
        <a href="/contact" className="button button-gold inner-cta">DESIGN MY EXPERIENCE <ArrowUpRight size={16} /></a>
      </section>

      <SiteFooter />
    </main>
  )
}

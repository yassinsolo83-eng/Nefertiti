'use client'

import { ArrowUpRight } from 'lucide-react'
import { steps, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'

export default function HowItWorksPage() {
  const t = copy.en
  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero page-hero-single">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">05 / HOW IT WORKS</p>
          <h1 className="page-title">How It Works</h1>
          <p className="page-lead">{t.process} — a clear, guided path from first conversation to the moment your guests arrive.</p>
        </div>
      </section>

      <section className="section process inner-section">
        <div className="process-grid">
          {steps.map(([step, text], i) => (
            <div className="process-step reveal is-in" key={step}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{step}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <a href="/contact" className="button button-gold inner-cta">START WITH A DISCOVERY CALL <ArrowUpRight size={16} /></a>
      </section>

      <SiteFooter />
    </main>
  )
}
